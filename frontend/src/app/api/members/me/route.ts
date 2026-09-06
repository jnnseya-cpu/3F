import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * Read-only membership status for the member space (/mon-espace).
 * GET ?memberId=… → { configured, found, firstName, contributionStatus, status, paidUntil, plan }
 * Non-sensitive fields only. Without Firebase → { configured:false }.
 */

const ID_RE = /^[A-Za-z0-9_-]{1,200}$/;

export async function GET(req: NextRequest) {
  if (!rateLimit(`me:${clientIp(req.headers)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
  }
  const memberId = req.nextUrl.searchParams.get('memberId') || '';
  if (!ID_RE.test(memberId)) {
    return NextResponse.json({ error: 'memberId invalide' }, { status: 400 });
  }

  const db = adminDb();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!db && !(projectId && apiKey)) {
    return NextResponse.json({ configured: false });
  }

  try {
    let f: Record<string, string | undefined>;
    if (db) {
      const snap = await db.collection('members').doc(memberId).get();
      if (!snap.exists) return NextResponse.json({ configured: true, found: false }, { status: 404 });
      const d = snap.data() || {};
      f = {
        firstName: d.firstName,
        contributionStatus: d.contributionStatus,
        status: d.status,
        paidUntil: d.paidUntil,
        plan: d.lastPlan,
      };
    } else {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/members/${encodeURIComponent(memberId)}?key=${apiKey}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.status === 404) return NextResponse.json({ configured: true, found: false }, { status: 404 });
      if (!res.ok) throw new Error(`me ${res.status}`);
      const doc = await res.json();
      const fields = doc.fields || {};
      f = {
        firstName: fields.firstName?.stringValue,
        contributionStatus: fields.contributionStatus?.stringValue,
        status: fields.status?.stringValue,
        paidUntil: fields.paidUntil?.stringValue,
        plan: fields.lastPlan?.stringValue,
      };
    }
    return NextResponse.json({
      configured: true,
      found: true,
      memberId,
      firstName: f.firstName || null,
      contributionStatus: f.contributionStatus || 'Ineligible',
      status: f.status || 'pending_payment',
      paidUntil: f.paidUntil || null,
      plan: f.plan || null,
    });
  } catch (e) {
    console.error('me error:', e);
    return NextResponse.json({ configured: false, error: true }, { status: 502 });
  }
}
