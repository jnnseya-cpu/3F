import { NextRequest, NextResponse } from 'next/server';
import { issueChallenge, isBlocked } from '@/lib/sentinel';
import { rateLimit, clientIp } from '@/lib/rateLimit';

/** Issues a proof-of-humanity challenge (solved in-browser via Web Crypto). */
export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (isBlocked(ip)) {
    return NextResponse.json({ error: 'BLOCKED' }, { status: 403 });
  }
  if (!rateLimit(`challenge:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  return NextResponse.json(issueChallenge());
}
