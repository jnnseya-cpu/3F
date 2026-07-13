/**
 * Le Congo D'Abord — Client-side encryption (end-to-end layer)
 *
 * Sensitive member data (national ID, phone, address, CV details) is encrypted
 * in the browser with AES-256-GCM before it ever leaves the device. The server
 * stores only ciphertext; decryption happens client-side with the same passphrase.
 *
 * Flow:  plaintext → PBKDF2(passphrase) → AES-256-GCM → base64 envelope → API
 */

const PBKDF2_ITERATIONS = 310_000; // OWASP 2023 recommendation for SHA-256
const SALT_BYTES = 16;
const IV_BYTES = 12; // GCM standard nonce size
const ENVELOPE_PREFIX = 'lcd-e2ee-v1'; // versioned envelope for future migration

function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API indisponible — HTTPS requis');
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const crypto = getCrypto();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach(b => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/**
 * Encrypt a plaintext string. Returns a self-contained envelope:
 * `lcd-e2ee-v1.<salt>.<iv>.<ciphertext>` (all base64).
 */
export async function encryptField(plaintext: string, passphrase: string): Promise<string> {
  const crypto = getCrypto();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv as BufferSource },
    key,
    new TextEncoder().encode(plaintext),
  );
  return [ENVELOPE_PREFIX, toBase64(salt), toBase64(iv), toBase64(new Uint8Array(ciphertext))].join('.');
}

/**
 * Decrypt an envelope produced by encryptField. Throws on wrong passphrase
 * or tampered ciphertext (GCM authentication failure).
 */
export async function decryptField(envelope: string, passphrase: string): Promise<string> {
  const parts = envelope.split('.');
  if (parts.length !== 4 || parts[0] !== ENVELOPE_PREFIX) {
    throw new Error('Format de chiffrement invalide');
  }
  const crypto = getCrypto();
  const [, saltB64, ivB64, dataB64] = parts;
  const key = await deriveKey(passphrase, fromBase64(saltB64));
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(ivB64) as BufferSource },
    key,
    fromBase64(dataB64) as BufferSource,
  );
  return new TextDecoder().decode(plaintext);
}

/** True if a stored value is an encrypted envelope. */
export function isEncrypted(value: string): boolean {
  return value.startsWith(`${ENVELOPE_PREFIX}.`);
}

/**
 * Encrypt the sensitive fields of a member object in place, leaving
 * non-sensitive fields (name, province) readable for party operations.
 */
export const SENSITIVE_MEMBER_FIELDS = [
  'nationalId',
  'phone',
  'email',
  'address',
  'dateOfBirth',
] as const;

export async function encryptMemberData<T extends Record<string, unknown>>(
  member: T,
  passphrase: string,
): Promise<T> {
  const result = { ...member };
  for (const field of SENSITIVE_MEMBER_FIELDS) {
    const value = result[field];
    if (typeof value === 'string' && value && !isEncrypted(value)) {
      (result as Record<string, unknown>)[field] = await encryptField(value, passphrase);
    }
  }
  return result;
}

export async function decryptMemberData<T extends Record<string, unknown>>(
  member: T,
  passphrase: string,
): Promise<T> {
  const result = { ...member };
  for (const field of SENSITIVE_MEMBER_FIELDS) {
    const value = result[field];
    if (typeof value === 'string' && isEncrypted(value)) {
      (result as Record<string, unknown>)[field] = await decryptField(value, passphrase);
    }
  }
  return result;
}
