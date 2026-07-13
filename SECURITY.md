# Le Congo D'Abord — Security Architecture

## Monorepo Structure

```
├── frontend/   Next.js 14 app (UI + client-side encryption)
├── backend/    FastAPI (12 party agents + 11 SNTO agents, encryption at rest)
├── shared/     Constants shared by both (incl. encryption spec)
└── database/   PostgreSQL schema
```

## End-to-End Encryption Layers

### 1. In transit — TLS everywhere
- Frontend: HSTS (2 years, preload), full security-header suite in `frontend/next.config.js`
- Backend: `HTTPSRedirectInProdMiddleware` (308 redirect when `ENFORCE_HTTPS=true`)
- CSP restricts all connections to self + Anthropic API only

### 2. Client-side — encrypt before it leaves the browser
`frontend/src/lib/crypto.ts` — Web Crypto API:
- **AES-256-GCM** authenticated encryption (tamper-evident)
- **PBKDF2-SHA256**, 310,000 iterations (OWASP 2023)
- Sensitive member fields (national ID, phone, email, address, date of birth)
  are encrypted in the browser; the server only ever stores ciphertext.

### 3. At rest — field-level encryption in the database
`backend/security.py`:
- Same AES-256-GCM envelope format (`lcd-e2ee-v1.<salt>.<iv>.<ciphertext>`)
- `encrypt_member_fields()` / `decrypt_member_fields()` on the sensitive set
- Master key from `ENCRYPTION_KEY` env var — never committed, rotatable via
  the versioned envelope prefix
- bcrypt password hashing, JWT (HS256) API tokens, SHA-256 audit-trail hashes

### 4. API hardening
- CORS locked to known origins, explicit methods/headers only
- `Cache-Control: no-store` on all API responses
- `X-Frame-Options: DENY`, `nosniff`, strict referrer policy

## Envelope format (identical on both sides)

```
lcd-e2ee-v1.<base64 salt 16B>.<base64 iv 12B>.<base64 AES-GCM ciphertext>
```

The spec constants live in `shared/constants.ts` (`ENCRYPTION`) so frontend
and backend can never drift apart.

## Required secrets (production)

| Variable | Purpose | Generate with |
|---|---|---|
| `ENCRYPTION_KEY` | Field encryption master key | `openssl rand -base64 32` |
| `JWT_SECRET` | API token signing | `openssl rand -base64 48` |
| `NEXTAUTH_SECRET` | Session encryption | `openssl rand -base64 32` |
| `ENFORCE_HTTPS` | Set `true` in production | — |

`docker-compose.yml` refuses to start the backend without `ENCRYPTION_KEY`.

## Verified

- AES-256-GCM encrypt/decrypt roundtrip ✓
- GCM tamper detection (modified ciphertext rejected) ✓
- Member field selective encryption (public fields stay readable) ✓
- Frontend production build with CSP/HSTS headers ✓
