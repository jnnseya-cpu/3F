import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';

/**
 * Blog post view counter.
 *   GET  ?slug=…   → current count (no increment)   { slug, count, ledger }
 *   POST { slug }  → atomically +1, returns new count { slug, count, ledger }
 *
 * Storage: Firestore blog_views/{slug} { count, updatedAt } using an ATOMIC
 * increment transform (race-safe under concurrent readers — no lost updates).
 * Without Firebase configured, count is null and ledger:false so the UI shows
 * nothing rather than a fabricated number.
 */

const PROJECT = () => process.env.FIREBASE_PROJECT_ID;
const KEY = () => process.env.FIREBASE_API_KEY;
const DB = () => `projects/${PROJECT()}/databases/(default)/documents`;
const configured = () => Boolean(PROJECT() && KEY());

const SLUG_RE = /^[a-z0-9-]{1,80}$/;

async function readCount(slug: string): Promise<number> {
  const url = `https://firestore.googleapis.com/v1/${DB()}/blog_views/${encodeURIComponent(slug)}?key=${KEY()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (res.status === 404) return 0;
  if (!res.ok) throw new Error(`views read ${res.status}`);
  const doc = await res.json();
  return parseInt(doc.fields?.count?.integerValue ?? '0', 10) || 0;
}

/** Atomic upsert-and-increment via the commit API's field transform. */
async function incrementCount(slug: string): Promise<number> {
  const url = `https://firestore.googleapis.com/v1/${DB()}:commit?key=${KEY()}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [{
        update: {
          name: `${DB()}/blog_views/${slug}`,
          fields: { updatedAt: { stringValue: new Date().toISOString() } },
        },
        updateTransforms: [
          { fieldPath: 'count', increment: { integerValue: '1' } },
        ],
      }],
    }),
  });
  if (!res.ok) throw new Error(`views commit ${res.status}`);
  const data = await res.json();
  // The transform result carries the new value
  const t = data.writeResults?.[0]?.transformResults?.[0];
  const val = t?.integerValue ?? t?.integer_value;
  if (val != null) return parseInt(String(val), 10);
  // Fallback: read back
  return readCount(slug);
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') || '';
  if (!SLUG_RE.test(slug)) return NextResponse.json({ error: 'slug invalide' }, { status: 400 });
  if (!configured()) return NextResponse.json({ slug, count: null, ledger: false });
  try {
    return NextResponse.json({ slug, count: await readCount(slug), ledger: true });
  } catch {
    return NextResponse.json({ slug, count: null, ledger: false }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const ua = req.headers.get('user-agent') || '';
  // Skip obvious bots/crawlers so counts reflect real readers (light check —
  // a passive view must stay fast, so no proof-of-work here).
  if (/bot|spider|crawler|curl|wget|python-requests|headless|scrapy|facebookexternalhit/i.test(ua)) {
    return NextResponse.json({ counted: false, reason: 'bot' });
  }
  if (!rateLimit(`views:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }

  let slug = '';
  try { slug = (await req.json())?.slug || ''; } catch { /* bad body */ }
  if (!SLUG_RE.test(slug)) return NextResponse.json({ error: 'slug invalide' }, { status: 400 });
  if (!configured()) return NextResponse.json({ slug, count: null, ledger: false });

  try {
    const count = await incrementCount(slug);
    return NextResponse.json({ slug, count, ledger: true, counted: true });
  } catch (e) {
    console.error('Blog view increment failed:', e);
    return NextResponse.json({ slug, count: null, ledger: false }, { status: 502 });
  }
}
