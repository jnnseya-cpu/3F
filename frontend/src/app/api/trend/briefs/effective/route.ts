import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { effectiveBrief } from '@/lib/trend/store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/trend/briefs/effective?market=CD&topic_id=... (spec §16).
 * Returns the approved, in-window brief for the scope, or 204 when none —
 * the host's agents fall back to baseline behaviour on 204.
 */
export async function GET(req: NextRequest) {
  if (!rateLimit(`trend-eff:${clientIp(req.headers)}`, 120, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  const market = req.nextUrl.searchParams.get('market') || '';
  const topic = req.nextUrl.searchParams.get('topic_id') || undefined;
  if (!/^[A-Z]{2}$/.test(market)) {
    return NextResponse.json({ error: 'market (ISO alpha-2) requis' }, { status: 422 });
  }
  const brief = effectiveBrief(market, topic);
  if (!brief) return new NextResponse(null, { status: 204 }); // no eligible match → baseline
  return NextResponse.json({ brief });
}
