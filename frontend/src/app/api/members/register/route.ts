import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { humanGuard } from '@/lib/guard';
import { issueMemberToken } from '@/lib/memberAuth';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * Member registration — persists to Firebase Firestore via REST API.
 * Requires env vars:
 *   FIREBASE_PROJECT_ID  — your Firebase project id
 *   FIREBASE_API_KEY     — Web API key (Project settings → General)
 * Falls back to 202 "queued" if Firebase is not configured, so the
 * frontend flow keeps working before keys are added.
 */

interface RegistrationBody {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  province?: string;
  territory?: string;
  commune?: string;
  village?: string;
  education?: string;
  profession?: string;
  languages?: string[];
  paymentMethod?: string;
}

function toFirestoreFields(obj: Record<string, unknown>) {
  const fields: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) {
      fields[k] = { arrayValue: { values: v.map(x => ({ stringValue: String(x) })) } };
    } else if (typeof v === 'number') {
      fields[k] = { integerValue: String(v) };
    } else if (typeof v === 'boolean') {
      fields[k] = { booleanValue: v };
    } else {
      fields[k] = { stringValue: String(v) };
    }
  }
  return fields;
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`register:${clientIp(req.headers)}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Trop de requêtes' }, { status: 429 });
    }
    const body = (await req.json()) as RegistrationBody;
    const guard = humanGuard(req, body);
    if (guard) return guard;

    if (!body.firstName?.trim() || !body.lastName?.trim()) {
      return NextResponse.json({ error: 'Nom et prénom requis' }, { status: 400 });
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const apiKey = process.env.FIREBASE_API_KEY;

    // Whitelist client-supplied fields — never spread the raw body, or a
    // client could inject status/paidUntil/contributionStatus and self-activate.
    const record: Record<string, unknown> = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email,
      phone: body.phone,
      province: body.province,
      territory: body.territory,
      commune: body.commune,
      village: body.village,
      education: body.education,
      profession: body.profession,
      languages: body.languages,
      paymentMethod: body.paymentMethod,
      // Server-controlled, non-overridable financial/state fields:
      status: 'pending_payment',
      contributionStatus: 'Ineligible',
      registeredAt: new Date().toISOString(),
      source: 'web',
    };

    // Preferred: Admin SDK (works under locked, server-only Firestore rules)
    const db = adminDb();
    if (db) {
      const ref = await db.collection('members').add(record);
      return NextResponse.json(
        { status: 'registered', memberId: ref.id, memberToken: issueMemberToken(ref.id) },
        { status: 201 },
      );
    }

    if (!projectId || !apiKey) {
      // Firebase not configured yet — accept and log so the UX works pre-launch
      console.warn('Registration received but FIREBASE_* env vars not set:', body.email || body.phone);
      return NextResponse.json(
        { status: 'queued', message: 'Inscription reçue — sera synchronisée' },
        { status: 202 },
      );
    }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/members?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: toFirestoreFields(record) }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Firestore write failed:', err.slice(0, 300));
      return NextResponse.json({ error: "Échec de l'enregistrement" }, { status: 502 });
    }

    const doc = await res.json();
    const memberId = doc.name?.split('/').pop();
    return NextResponse.json(
      { status: 'registered', memberId, memberToken: issueMemberToken(memberId) },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
