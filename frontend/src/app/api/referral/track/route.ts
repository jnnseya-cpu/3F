import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

/**
 * Referral tracking — the organic growth loop.
 * Every member gets a share code. When a new member registers with a
 * referral code, the referrer is credited. Rankings drive a leaderboard
 * (social proof + gamified word-of-mouth, the dominant acquisition
 * channel in the DRC's WhatsApp-first market).
 *
 * Storage: Firestore referrals/{code} { memberId, count, credited }.
 * Without Firebase configured, returns graceful stub data.
 */

const PROJECT = () => process.env.FIREBASE_PROJECT_ID;
const KEY = () => process.env.FIREBASE_API_KEY;

function configured() {
  return Boolean(adminDb()) || Boolean(PROJECT() && KEY());
}

async function incrementReferral(code: string): Promise<number> {
  const db = adminDb();
  if (db) {
    const ref = db.collection('referrals').doc(code);
    await ref.set({ count: FieldValue.increment(1), updatedAt: new Date().toISOString() }, { merge: true });
    const snap = await ref.get();
    return Number(snap.get('count') || 0);
  }
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT()}/databases/(default)/documents/referrals/${encodeURIComponent(code)}?key=${KEY()}`;
  const read = await fetch(url, { cache: 'no-store' });
  let count = 0;
  if (read.ok) {
    const doc = await read.json();
    count = parseInt(doc.fields?.count?.integerValue ?? '0', 10) || 0;
  }
  const next = count + 1;
  await fetch(`${url}&updateMask.fieldPaths=count&updateMask.fieldPaths=updatedAt`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: { count: { integerValue: String(next) }, updatedAt: { stringValue: new Date().toISOString() } },
    }),
  });
  return next;
}

// POST { code } — record that someone registered via this referral code
export async function POST(req: NextRequest) {
  if (!rateLimit(`referral:${clientIp(req.headers)}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  try {
    const { code } = await req.json();
    if (!code || typeof code !== 'string' || !/^[A-Z0-9]{4,12}$/.test(code)) {
      return NextResponse.json({ error: 'Code invalide' }, { status: 400 });
    }
    if (!configured()) {
      return NextResponse.json({ status: 'recorded', count: 1, ledger: false });
    }
    const count = await incrementReferral(code);
    return NextResponse.json({ status: 'recorded', count, ledger: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
