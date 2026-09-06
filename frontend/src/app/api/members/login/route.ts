import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { humanGuard } from '@/lib/guard';
import { issueMemberToken, enforcementOn } from '@/lib/memberAuth';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * Member sign-in / account recovery by email or phone.
 *
 * Security posture (deliberate): looking up a member by email/phone alone is
 * NOT strong proof of identity. So:
 *  - We always return read-only membership status (safe to show).
 *  - We return the member SPEND token (which authorizes ACU/AI spend, i.e. real
 *    money) ONLY when token enforcement is OFF (pre-OTP / dev). When enforcement
 *    is ON (production), we withhold the spend token and flag `needsOtp` — full
 *    secure re-auth activates once the SMS/OTP provider is connected. This
 *    prevents email-only account takeover of paid ACUs.
 *
 * Degrades gracefully: without Firebase → 503 "bientôt disponible".
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s-]{6,20}$/;

interface MemberHit {
  id: string;
  firstName?: string;
  contributionStatus?: string;
  status?: string;
  paidUntil?: string;
  lastPlan?: string;
}

async function findMember(field: 'email' | 'phone', value: string): Promise<MemberHit | null> {
  const db = adminDb();
  if (db) {
    const snap = await db.collection('members').where(field, '==', value).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    const d = doc.data();
    return {
      id: doc.id,
      firstName: d.firstName,
      contributionStatus: d.contributionStatus,
      status: d.status,
      paidUntil: d.paidUntil,
      lastPlan: d.lastPlan,
    };
  }
  // REST fallback (unauthenticated client key)
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (!projectId || !apiKey) return null;
  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'members' }],
        where: { fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value: { stringValue: value } } },
        limit: 1,
      },
    }),
  });
  if (!res.ok) throw new Error(`login query ${res.status}`);
  const rows = await res.json();
  const doc = Array.isArray(rows) ? rows.find((r: Record<string, unknown>) => r.document)?.document : null;
  if (!doc) return null;
  const f = doc.fields || {};
  return {
    id: String(doc.name).split('/').pop() || '',
    firstName: f.firstName?.stringValue,
    contributionStatus: f.contributionStatus?.stringValue,
    status: f.status?.stringValue,
    paidUntil: f.paidUntil?.stringValue,
    lastPlan: f.lastPlan?.stringValue,
  };
}

function firebaseConfigured(): boolean {
  return Boolean(adminDb()) || Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY);
}

export async function POST(req: NextRequest) {
  if (!rateLimit(`login:${clientIp(req.headers)}`, 8, 60_000)) {
    return NextResponse.json({ error: 'Trop de tentatives — réessayez dans une minute' }, { status: 429 });
  }

  let body: { identifier?: string } = {};
  try { body = await req.json(); } catch { /* bad body */ }
  const guard = humanGuard(req, body);
  if (guard) return guard;

  const identifier = (body.identifier || '').trim();
  const isEmail = EMAIL_RE.test(identifier);
  const isPhone = PHONE_RE.test(identifier);
  if (!isEmail && !isPhone) {
    return NextResponse.json({ error: 'Entrez un email ou un numéro de téléphone valide' }, { status: 400 });
  }

  if (!firebaseConfigured()) {
    return NextResponse.json(
      { error: 'not_configured', message: 'La connexion sera disponible au lancement (2027).' },
      { status: 503 },
    );
  }

  try {
    const value = isEmail ? identifier.toLowerCase() : identifier.replace(/\s/g, '');
    // Try the primary field, then the other (users may enter either).
    const member =
      (await findMember(isEmail ? 'email' : 'phone', identifier)) ||
      (await findMember(isEmail ? 'email' : 'phone', value)) ||
      (isPhone ? await findMember('phone', identifier.replace(/[\s-]/g, '')) : null);

    if (!member) {
      // Do not reveal whether the identifier exists (enumeration protection).
      return NextResponse.json({ found: false, message: 'Aucun compte trouvé pour cet identifiant.' }, { status: 404 });
    }

    const enforced = enforcementOn();
    return NextResponse.json({
      found: true,
      memberId: member.id,
      firstName: member.firstName || null,
      contributionStatus: member.contributionStatus || 'Ineligible',
      status: member.status || 'pending_payment',
      paidUntil: member.paidUntil || null,
      plan: member.lastPlan || null,
      // Spend token only when enforcement is off (pre-OTP). Otherwise OTP required.
      memberToken: enforced ? null : issueMemberToken(member.id),
      needsOtp: enforced,
    });
  } catch (e) {
    console.error('Login error:', e);
    return NextResponse.json({ error: 'Service indisponible' }, { status: 502 });
  }
}
