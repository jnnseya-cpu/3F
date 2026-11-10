import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { createBrief, approveBrief, listBriefs } from '@/lib/trend/store';

export const dynamic = 'force-dynamic';

/** GET → list briefs. */
export async function GET(req: NextRequest) {
  if (!rateLimit(`trend-brief-r:${clientIp(req.headers)}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  return NextResponse.json({ briefs: listBriefs() });
}

/** POST { op:'create', topic_id, market } | { op:'approve', id } — draft-only pilot. */
export async function POST(req: NextRequest) {
  if (!rateLimit(`trend-brief-w:${clientIp(req.headers)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  let body: { op?: string; topic_id?: string; market?: string; id?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }

  if (body.op === 'create') {
    if (typeof body.topic_id !== 'string' || typeof body.market !== 'string') {
      return NextResponse.json({ error: 'topic_id et market requis' }, { status: 422 });
    }
    const r = createBrief(body.topic_id, body.market);
    if ('error' in r) return NextResponse.json(r, { status: 409 });
    return NextResponse.json({ brief: r }, { status: 201 });
  }
  if (body.op === 'approve') {
    if (typeof body.id !== 'string') return NextResponse.json({ error: 'id requis' }, { status: 422 });
    const r = approveBrief(body.id);
    if ('error' in r) return NextResponse.json(r, { status: 404 });
    return NextResponse.json({ brief: r });
  }
  return NextResponse.json({ error: "op invalide (create|approve)" }, { status: 422 });
}
