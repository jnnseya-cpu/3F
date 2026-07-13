"""
Le Congo D'Abord — Backend security layer

- Field-level encryption at rest (AES-256-GCM via cryptography.Fernet-compatible envelope)
- Password hashing (bcrypt via passlib)
- JWT token creation/validation (python-jose)
- Security headers + HTTPS redirect middleware for FastAPI
"""

import os
import base64
import secrets
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from passlib.context import CryptContext
from jose import jwt, JWTError
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import RedirectResponse

# ── Configuration ────────────────────────────────────────────────
# ENCRYPTION_KEY must be a 32+ char secret set in the environment.
# Never commit it. Rotate via key versioning in the envelope prefix.
_MASTER_SECRET = os.getenv("ENCRYPTION_KEY", "")
JWT_SECRET = os.getenv("JWT_SECRET", secrets.token_urlsafe(48))
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

ENVELOPE_PREFIX = "lcd-e2ee-v1"
PBKDF2_ITERATIONS = 310_000
SALT_BYTES = 16
IV_BYTES = 12

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ── Field-level encryption (compatible with frontend crypto.ts) ──
def _derive_key(secret: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=PBKDF2_ITERATIONS,
    )
    return kdf.derive(secret.encode())


def encrypt_field(plaintext: str, secret: Optional[str] = None) -> str:
    """Encrypt a string → 'lcd-e2ee-v1.<salt>.<iv>.<ciphertext>' (base64)."""
    key_secret = secret or _MASTER_SECRET
    if not key_secret:
        raise RuntimeError("ENCRYPTION_KEY environment variable is not set")
    salt = secrets.token_bytes(SALT_BYTES)
    iv = secrets.token_bytes(IV_BYTES)
    key = _derive_key(key_secret, salt)
    ciphertext = AESGCM(key).encrypt(iv, plaintext.encode(), None)
    parts = [
        ENVELOPE_PREFIX,
        base64.b64encode(salt).decode(),
        base64.b64encode(iv).decode(),
        base64.b64encode(ciphertext).decode(),
    ]
    return ".".join(parts)


def decrypt_field(envelope: str, secret: Optional[str] = None) -> str:
    """Decrypt an envelope produced by encrypt_field (or frontend crypto.ts)."""
    key_secret = secret or _MASTER_SECRET
    if not key_secret:
        raise RuntimeError("ENCRYPTION_KEY environment variable is not set")
    parts = envelope.split(".")
    if len(parts) != 4 or parts[0] != ENVELOPE_PREFIX:
        raise ValueError("Invalid encryption envelope format")
    salt = base64.b64decode(parts[1])
    iv = base64.b64decode(parts[2])
    ciphertext = base64.b64decode(parts[3])
    key = _derive_key(key_secret, salt)
    plaintext = AESGCM(key).decrypt(iv, ciphertext, None)
    return plaintext.decode()


def is_encrypted(value: str) -> bool:
    return isinstance(value, str) and value.startswith(f"{ENVELOPE_PREFIX}.")


SENSITIVE_MEMBER_FIELDS = ["national_id", "phone", "email", "address", "date_of_birth"]


def encrypt_member_fields(data: dict) -> dict:
    """Encrypt sensitive member fields before persisting."""
    result = dict(data)
    for field in SENSITIVE_MEMBER_FIELDS:
        value = result.get(field)
        if isinstance(value, str) and value and not is_encrypted(value):
            result[field] = encrypt_field(value)
    return result


def decrypt_member_fields(data: dict) -> dict:
    """Decrypt sensitive member fields for authorized reads."""
    result = dict(data)
    for field in SENSITIVE_MEMBER_FIELDS:
        value = result.get(field)
        if isinstance(value, str) and is_encrypted(value):
            try:
                result[field] = decrypt_field(value)
            except Exception:
                pass  # leave ciphertext if key rotated / mismatch
    return result


# ── Password hashing ─────────────────────────────────────────────
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# ── JWT tokens ───────────────────────────────────────────────────
def create_access_token(subject: str, extra_claims: Optional[dict] = None) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": subject, "exp": expire, "iat": datetime.now(timezone.utc)}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_access_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError:
        return None


# ── Integrity hashing (audit trail) ──────────────────────────────
def integrity_hash(payload: str) -> str:
    """SHA-256 hash for tamper-evident audit records."""
    return hashlib.sha256(payload.encode()).hexdigest()


# ── FastAPI middleware ───────────────────────────────────────────
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds hardening headers to every API response."""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Cache-Control"] = "no-store"  # API responses contain member data
        return response


class HTTPSRedirectInProdMiddleware(BaseHTTPMiddleware):
    """Redirect HTTP → HTTPS when ENFORCE_HTTPS=true (production)."""

    async def dispatch(self, request: Request, call_next):
        if os.getenv("ENFORCE_HTTPS", "false").lower() == "true":
            proto = request.headers.get("x-forwarded-proto", request.url.scheme)
            if proto == "http":
                url = request.url.replace(scheme="https")
                return RedirectResponse(url=str(url), status_code=308)
        return await call_next(request)
