import { NextRequest, NextResponse } from 'next/server';
import { inspect, verifyHumanToken } from '@/lib/sentinel';
import { clientIp } from '@/lib/rateLimit';

/**
 * humanGuard — the single gate every sensitive endpoint calls first.
 * Returns a NextResponse to short-circuit on rejection, or null to proceed.
 *
 * Order: Sentinel threat inspection → proof-of-humanity token.
 * Blocks bots, injection payloads, blocked IPs, and any non-human client
 * that cannot solve the JS proof-of-work.
 */
export function humanGuard(req: NextRequest, body: unknown): NextResponse | null {
  const ip = clientIp(req.headers);
  const ua = req.headers.get('user-agent');

  const verdict = inspect(ip, ua, body);
  if (!verdict.allow) {
    return NextResponse.json(
      { error: 'SECURITY_BLOCKED', reason: verdict.reason,
        message: 'Requête bloquée par Sentinel — accès réservé aux humains.' },
      { status: 403 },
    );
  }

  const human = verifyHumanToken(req.headers.get('x-human-token'));
  if (!human.ok) {
    return NextResponse.json(
      { error: 'HUMAN_VERIFICATION_REQUIRED', reason: human.reason,
        message: "Vérification humaine requise — les instructions automatisées sont bloquées." },
      { status: 403 },
    );
  }

  return null;
}
