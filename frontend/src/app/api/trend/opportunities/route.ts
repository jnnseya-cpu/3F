import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { isAdmin } from '@/lib/trend/admin';
import { buildOpportunities } from '@/lib/trend/store';

export const dynamic = 'force-dynamic';

/** GET /api/trend/opportunities — scored, ranked opportunities from current signals. */
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!rateLimit(`trend-opp:${clientIp(req.headers)}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  return NextResponse.json({ opportunities: buildOpportunities() });
}
