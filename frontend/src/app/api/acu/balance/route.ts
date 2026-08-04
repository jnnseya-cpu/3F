import { NextRequest, NextResponse } from 'next/server';
import { getBalance, ledgerConfigured, ACU_COSTS } from '@/lib/acu';
import { rateLimit, clientIp } from '@/lib/rateLimit';

/** GET /api/acu/balance?memberId=... — current ACU balance + action costs. */
export async function GET(req: NextRequest) {
  if (!rateLimit(`acu:${clientIp(req.headers)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  const memberId = req.nextUrl.searchParams.get('memberId');
  if (!memberId) {
    return NextResponse.json({ error: 'memberId requis' }, { status: 400 });
  }
  try {
    const balance = ledgerConfigured() ? await getBalance(memberId) : 0;
    return NextResponse.json({ memberId, balance, costs: ACU_COSTS, ledger: ledgerConfigured() });
  } catch {
    return NextResponse.json({ error: 'Ledger indisponible' }, { status: 502 });
  }
}
