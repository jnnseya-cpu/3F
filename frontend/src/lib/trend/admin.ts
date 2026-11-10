/**
 * Trend Intelligence — admin guard (fail-closed).
 *
 * The trend layer runs invisibly for users; its manual HTTP endpoints and console
 * are operator-only. This requires a valid admin bearer token AND the key to be
 * configured — with no key set, access is DENIED (never user-triggerable).
 */
import { NextRequest } from 'next/server';

export function isAdmin(req: NextRequest): boolean {
  const key = process.env.SENTINEL_ADMIN_KEY;
  if (!key) return false; // fail-closed: no key => no manual access
  const auth = req.headers.get('authorization');
  return auth === `Bearer ${key}`;
}
