import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * Public contribution ledger — REAL aggregates, never fabricated.
 *
 * GET → {
 *   configured: boolean,          // false before the ledger is live (pre-launch)
 *   totalUsd, contributions,      // sum + count of verified payments
 *   activeMembers,                // members with an active contribution
 *   recent: [{ province, amountUsd, plan, at }]  // anonymized (no names)
 * }
 *
 * Source of truth: the payment webhook records each verified payment on its
 * idempotency doc (processed_payments, type:'payment'). We aggregate those.
 * Requires the Admin SDK (service account). Without it → configured:false so
 * the UI shows an honest "opens with the first contributions" state.
 */

export const dynamic = 'force-dynamic';

const CAP = 5000; // safety cap on docs scanned per request

export async function GET(req: NextRequest) {
  if (!rateLimit(`ledger:${clientIp(req.headers)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  const db = adminDb();
  if (!db) {
    return NextResponse.json({ configured: false });
  }

  try {
    const snap = await db
      .collection('processed_payments')
      .where('type', '==', 'payment')
      .limit(CAP)
      .get();

    let totalUsd = 0;
    const members = new Set<string>();
    const recent: Array<{ province: string; amountUsd: number; plan: string; at: string }> = [];

    snap.forEach(doc => {
      const d = doc.data();
      const amt = Number(d.amountUsd || 0);
      totalUsd += amt;
      if (d.memberId) members.add(String(d.memberId));
      recent.push({
        province: String(d.province || '—'),
        amountUsd: amt,
        plan: String(d.plan || ''),
        at: String(d.at || d.processedAt || ''),
      });
    });

    recent.sort((a, b) => (a.at < b.at ? 1 : -1));

    // Active members (independent of payment docs) via a count aggregation.
    let activeMembers = members.size;
    try {
      const agg = await db.collection('members').where('status', '==', 'active').count().get();
      activeMembers = agg.data().count;
    } catch {
      /* keep the distinct-payer count as a floor */
    }

    return NextResponse.json({
      configured: true,
      currency: 'USD',
      totalUsd: Math.round(totalUsd * 100) / 100,
      contributions: snap.size,
      activeMembers,
      recent: recent.slice(0, 12),
    });
  } catch (e) {
    console.error('Ledger aggregation failed:', e);
    return NextResponse.json({ configured: false, error: true }, { status: 502 });
  }
}
