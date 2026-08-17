import { createHmac } from 'crypto';

/**
 * One-click unsubscribe tokens — HMAC(email) so a link can't be forged.
 * Reuses the same secret strategy as the rest of the platform.
 */
const SECRET = () =>
  process.env.NEWSLETTER_SECRET || process.env.JWT_SECRET || process.env.HUMAN_GATE_SECRET || 'lcd-newsletter-dev';

export function unsubscribeToken(email: string): string {
  return createHmac('sha256', SECRET()).update(email.toLowerCase()).digest('hex').slice(0, 32);
}

export function verifyUnsubscribe(email: string, token: string): boolean {
  return !!email && !!token && token === unsubscribeToken(email);
}
