import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { ingest, observationCount, type Observation } from '@/lib/trend/store';

/** Example first-party signal set — a LABELLED demonstration input (not fabricated
 *  live data). The scores it produces are genuinely computed by the deterministic engine. */
const EXAMPLE: Observation[] = [
  { source_family: 'first_party_search', topic_id: 'adhesion-gratuite', market: 'CD', locale: 'fr-CD', count: 140, baseline: 40, history: [38, 41, 44, 39, 42, 40, 43, 45], observed_at: '2026-11-10T09:00:00Z', source_quality: 85, freshness: 95, coverage: 80 },
  { source_family: 'public_rss', topic_id: 'adhesion-gratuite', market: 'CD', locale: 'fr-CD', count: 70, baseline: 30, history: [28, 31, 33, 29, 30, 32, 34, 27], observed_at: '2026-11-10T09:30:00Z', source_quality: 60, freshness: 90, coverage: 70 },
  { source_family: 'first_party_search', topic_id: 'transparence-cotisations', market: 'CD', locale: 'fr-CD', count: 22, baseline: 18, history: [17, 19, 16, 20, 18, 19, 17, 21], observed_at: '2026-11-10T09:00:00Z', source_quality: 85, freshness: 95, coverage: 75 },
];

export async function POST(req: NextRequest) {
  if (!rateLimit(`trend-obs:${clientIp(req.headers)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  let body: { observations?: unknown; seed?: boolean } = {};
  try { body = await req.json(); } catch { /* empty */ }

  if (body.seed === true) {
    const r = ingest(EXAMPLE);
    return NextResponse.json({ ...r, total: observationCount(), seeded: true });
  }
  if (!Array.isArray(body.observations)) {
    return NextResponse.json({ error: 'observations[] requis (ou {seed:true})' }, { status: 422 });
  }
  if (body.observations.length > 500) {
    return NextResponse.json({ error: 'max 500 observations' }, { status: 422 });
  }
  const r = ingest(body.observations as Observation[]);
  return NextResponse.json({ ...r, total: observationCount() });
}
