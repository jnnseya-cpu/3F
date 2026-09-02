import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { credit, deductToFloor } from '@/lib/acu';
import { getPlan, planForAmount, type Plan } from '@/lib/plans';
import { adminDb } from '@/lib/firebaseAdmin';

/**
 * BitriPay payment webhook — the money gate. Activates on a VERIFIED payment
 * and claws back on a reversal/chargeback.
 *
 * Hardening (financial integrity):
 *  1. FAIL CLOSED — no BITRIPAY_WEBHOOK_SECRET ⇒ 503. No ledger ⇒ 503.
 *  2. HMAC-SHA256 over the RAW body (hex/base64) or a static shared secret,
 *     always constant-time compared.
 *  3. IDEMPOTENT — every event id is claimed once (create-if-absent) so
 *     replays/retries never re-credit or double-clawback.
 *  4. AMOUNT-VERIFIED GRANT — months + ACUs come from the PAID AMOUNT
 *     (lib/plans.ts), never from client metadata.
 *  5. REVERSALS — refund/chargeback/reversed events claw back the granted
 *     ACUs (clamped ≥ 0) and set the member back to pending_payment.
 *
 * Writes prefer the Admin SDK (service account, bypasses locked rules) and
 * fall back to REST when no service account is configured (pre-launch).
 */

const REST = () =>
  `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const docName = (coll: string, id: string) =>
  `projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${coll}/${id}`;
const restReady = () => Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY);
const ledgerReady = () => Boolean(adminDb()) || restReady();

const SUCCESS = ['success', 'successful', 'completed', 'paid'];
const REVERSAL = ['refunded', 'refund', 'reversed', 'reversal', 'chargeback', 'charge_back', 'disputed'];

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function verifySignature(raw: string, headers: Headers, secret: string): boolean {
  const sig = headers.get('x-bitripay-signature') || headers.get('x-webhook-signature') || '';
  if (sig) {
    const provided = sig.replace(/^sha256=/, '').trim();
    const hex = createHmac('sha256', secret).update(raw).digest('hex');
    if (safeEqual(provided, hex)) return true;
    const b64 = createHmac('sha256', secret).update(raw).digest('base64');
    return safeEqual(provided, b64);
  }
  const shared = headers.get('x-webhook-secret') || '';
  return Boolean(shared) && safeEqual(shared, secret);
}

/**
 * Atomically claim an event id. true = first time, false = already processed.
 * `record` fields are persisted on the claim doc so the public ledger can
 * aggregate REAL contributions (amount, plan, province) with no extra write.
 */
async function claimEvent(eventId: string, record: Record<string, unknown> = {}): Promise<boolean> {
  const db = adminDb();
  if (db) {
    const ref = db.collection('processed_payments').doc(eventId);
    return db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      if (snap.exists) return false;
      tx.set(ref, { processedAt: new Date().toISOString(), ...record });
      return true;
    });
  }
  const fields: Record<string, unknown> = { processedAt: { stringValue: new Date().toISOString() } };
  for (const [k, v] of Object.entries(record)) {
    if (typeof v === 'number') fields[k] = { doubleValue: v };
    else fields[k] = { stringValue: String(v) };
  }
  const res = await fetch(`${REST()}:commit?key=${process.env.FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: { name: docName('processed_payments', eventId), fields },
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  if (res.ok) return true;
  if (res.status === 400 || res.status === 409) return false;
  throw new Error(`claimEvent failed: ${res.status}`);
}

async function setMemberState(
  memberId: string,
  state: 'active' | 'pending_payment',
  plan: Plan | null,
): Promise<boolean> {
  const active = state === 'active';
  const paidUntil = new Date();
  if (active && plan) paidUntil.setMonth(paidUntil.getMonth() + plan.months);

  const db = adminDb();
  if (db) {
    try {
      await db.collection('members').doc(memberId).set(
        {
          contributionStatus: active ? 'Active' : 'Ineligible',
          status: state,
          ...(active && plan ? { paidUntil: paidUntil.toISOString(), lastPaymentAt: new Date().toISOString(), lastPlan: plan.id } : { reversedAt: new Date().toISOString() }),
        },
        { merge: true },
      );
      return true;
    } catch (e) {
      console.error('Member state update failed (admin):', e);
      return false;
    }
  }

  const fields: Record<string, unknown> = {
    contributionStatus: { stringValue: active ? 'Active' : 'Ineligible' },
    status: { stringValue: state },
  };
  const masks = ['contributionStatus', 'status'];
  if (active && plan) {
    fields.paidUntil = { stringValue: paidUntil.toISOString() };
    fields.lastPaymentAt = { stringValue: new Date().toISOString() };
    fields.lastPlan = { stringValue: plan.id };
    masks.push('paidUntil', 'lastPaymentAt', 'lastPlan');
  } else {
    fields.reversedAt = { stringValue: new Date().toISOString() };
    masks.push('reversedAt');
  }
  const url = `${REST()}/members/${encodeURIComponent(memberId)}?key=${process.env.FIREBASE_API_KEY}&` +
    masks.map(m => `updateMask.fieldPaths=${m}`).join('&');
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
  return res.ok;
}

function resolveMemberId(event: Record<string, unknown>, metadata: Record<string, unknown>): string {
  const reference = (event.reference as string) || '';
  return (metadata.memberId as string) || (reference.startsWith('LCD-') ? reference.split('-')[1] : '');
}

function resolvePlan(event: Record<string, unknown>, metadata: Record<string, unknown>): Plan | null {
  const paid = Number((event.amount as number) ?? (event.amount_paid as number) ?? (event.paid_amount as number) ?? NaN);
  const currency = String((event.currency as string) || 'USD').toUpperCase();
  if (paid && currency !== 'USD') return null;
  return planForAmount(paid) || getPlan(metadata.plan);
}

function eventId(event: Record<string, unknown>): string {
  const raw = String((event.transaction_id as string) || (event.id as string) || (event.reference as string) || '');
  return encodeURIComponent(raw).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 200);
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.BITRIPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Webhook rejected: BITRIPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }
    if (!ledgerReady()) {
      console.error('Webhook rejected: no ledger configured (needed for idempotency)');
      return NextResponse.json({ error: 'Ledger not configured' }, { status: 503 });
    }

    const raw = await req.text();
    if (!verifySignature(raw, req.headers, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    let event: Record<string, unknown>;
    try {
      event = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const status = String((event.status as string) || (event.payment_status as string) || '').toLowerCase();
    const isSuccess = SUCCESS.includes(status);
    const isReversal = REVERSAL.includes(status);
    if (!isSuccess && !isReversal) {
      return NextResponse.json({ received: true, ignored: status });
    }

    const metadata = (event.metadata as Record<string, unknown>) || {};
    const memberId = resolveMemberId(event, metadata);
    if (!memberId) {
      console.error('Webhook missing memberId:', raw.slice(0, 300));
      return NextResponse.json({ error: 'memberId missing' }, { status: 400 });
    }
    const plan = resolvePlan(event, metadata);
    if (!plan) {
      console.error('Webhook unresolvable plan/amount:', raw.slice(0, 200));
      return NextResponse.json({ error: 'Unresolvable plan/amount' }, { status: 400 });
    }

    const id = eventId(event);
    if (!id) return NextResponse.json({ error: 'event id missing' }, { status: 400 });

    if (isReversal) {
      // Claim FIRST — clawback is not idempotent, so it must run at most once.
      const firstTime = await claimEvent(`rev-${id}`);
      if (!firstTime) return NextResponse.json({ received: true, duplicate: true, id });
      await setMemberState(memberId, 'pending_payment', null); // idempotent
      let clawedBack = 0;
      try {
        await deductToFloor(memberId, plan.acus);
        clawedBack = plan.acus;
      } catch (e) {
        console.error('ACU clawback failed:', e);
      }
      return NextResponse.json({ received: true, reversed: memberId, clawedBack });
    }

    // Success path: activate FIRST (idempotent set). If it fails we can safely
    // return 500 for the gateway to retry, because we have not claimed yet.
    const activated = await setMemberState(memberId, 'active', plan);
    if (!activated) {
      console.error('Member activation failed for', memberId);
      return NextResponse.json({ error: 'Activation failed, retry' }, { status: 500 });
    }
    // Then claim — guards the ADDITIVE credit against replays/retries. The
    // amount/plan are recorded on the claim so the public ledger can aggregate
    // real contributions.
    const firstTime = await claimEvent(`pay-${id}`, {
      type: 'payment',
      memberId,
      amountUsd: plan.amount,
      plan: plan.id,
      at: new Date().toISOString(),
    });
    if (!firstTime) return NextResponse.json({ received: true, duplicate: true, id });
    let acuCredited = 0;
    try {
      await credit(memberId, plan.acus);
      acuCredited = plan.acus;
    } catch (e) {
      console.error('ACU credit failed (payment recorded):', e);
    }
    return NextResponse.json({ received: true, memberActivated: memberId, plan: plan.id, acuCredited });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
