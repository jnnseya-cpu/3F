import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Lightweight member-session token — binds ACU-spending calls to possession
 * of a server-issued secret, instead of trusting a raw memberId in the body
 * (which is a guessable Firestore id anyone could put in a request).
 *
 * Token = `${memberId}.${HMAC_SHA256(memberId, MEMBER_TOKEN_SECRET)}` (hex).
 * Issued by /api/members/register on success; verified by every AI/ACU
 * endpoint before a debit.
 *
 * Enforcement: when MEMBER_TOKEN_SECRET is set, a valid token is REQUIRED.
 * When unset (pre-launch/demo), verification is skipped so the flow still
 * works — set the secret at launch to turn the gate on. This is a stopgap
 * until Firebase Auth (dormant) provides real sessions.
 */

function secret(): string | null {
  return process.env.MEMBER_TOKEN_SECRET || null;
}

export function enforcementOn(): boolean {
  return Boolean(secret());
}

function sign(memberId: string, key: string): string {
  return createHmac('sha256', key).update(memberId).digest('hex');
}

export function issueMemberToken(memberId: string): string | null {
  const key = secret();
  if (!key) return null;
  return `${memberId}.${sign(memberId, key)}`;
}

/**
 * Verify a token matches the claimed memberId.
 *  - enforcement off  → always allowed (pre-launch)
 *  - enforcement on   → token must be present and valid for THIS memberId
 */
export function verifyMemberToken(memberId: string, token: string | null | undefined): boolean {
  const key = secret();
  if (!key) return true; // pre-launch: not enforced
  if (!memberId || !token) return false;
  const dot = token.lastIndexOf('.');
  if (dot <= 0) return false;
  const claimedId = token.slice(0, dot);
  const providedSig = token.slice(dot + 1);
  if (claimedId !== memberId) return false;
  const expected = sign(memberId, key);
  const a = Buffer.from(providedSig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
