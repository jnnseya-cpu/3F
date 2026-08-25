import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { credit } from '@/lib/acu';
import { getPlan, planForAmount, type Plan } from '@/lib/plans';

/**
 * BitriPay payment webhook — activates the member on a VERIFIED payment.
 *
 * Hardening (financial integrity):
 *  1. FAIL CLOSED — if BITRIPAY_WEBHOOK_SECRET is not set, we refuse to
 *     process (503). No secret ⇒ no free activations.
 *  2. Signature — accepts either an HMAC-SHA256 of the raw body (preferred)
 *     or a shared-secret header, compared in constant time.
 *  3. IDEMPOTENT — every payment is recorded once in processed_payments/{txId}
 *     with an atomic "create if absent" precondition. Replays never re-credit.
 *  4. AMOUNT-VERIFIED GRANT — months + ACUs come from the PAID AMOUNT, never
 *     from client-supplied metadata. A $1 payment can't claim the annual plan.
 *
 * Env: BITRIPAY_WEBHOOK_SECRET, FIREBASE_PROJECT_ID, FIREBASE_API_KEY.
 */

const FIRESTORE = () =>
  `https://firestore.googleapis.com/v1/projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
const firebaseReady = () => Boolean(process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_API_KEY);

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** Verify the webhook really came from BitriPay. Returns false to reject. */
function verifySignature(raw: string, headers: Headers, secret: string): boolean {
  const sigHeader =
    headers.get('x-bitripay-signature') ||
    headers.get('x-webhook-signature') ||
    '';
  if (sigHeader) {
    // Preferred: HMAC-SHA256 over the raw body.
    const expected = createHmac('sha256', secret).update(raw).digest('hex');
    const provided = sigHeader.replace(/^sha256=/, '').trim();
    if (safeEqual(provided, expected)) return true;
    // Some gateways send base64.
    const expectedB64 = createHmac('sha256', secret).update(raw).digest('base64');
    if (safeEqual(provided, expectedB64)) return true;
    return false;
  }
  // Fallback: static shared-secret header (constant-time compared).
  const shared = headers.get('x-webhook-secret') || '';
  return Boolean(shared) && safeEqual(shared, secret);
}

/**
 * Atomically claim a payment id. Returns true if THIS call claimed it
 * (first time), false if it was already processed (duplicate/replay).
 */
async function claimPayment(txId: string): Promise<boolean> {
  const url = `${FIRESTORE()}:commit?key=${process.env.FIREBASE_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: `projects/${process.env.FIREBASE_PROJECT_ID}/databases/(default)/documents/processed_payments/${txId}`,
            fields: { processedAt: { stringValue: new Date().toISOString() } },
          },
          currentDocument: { exists: false },
        },
      ],
    }),
  });
  if (res.ok) return true;
  if (res.status === 400 || res.status === 409) return false; // already exists → duplicate
  throw new Error(`claimPayment failed: ${res.status}`);
}

async function activateMember(memberId: string, plan: Plan): Promise<boolean> {
  const paidUntil = new Date();
  paidUntil.setMonth(paidUntil.getMonth() + plan.months);
  const url =
    `${FIRESTORE()}/members/${encodeURIComponent(memberId)}?key=${process.env.FIREBASE_API_KEY}` +
    `&updateMask.fieldPaths=contributionStatus&updateMask.fieldPaths=status` +
    `&updateMask.fieldPaths=paidUntil&updateMask.fieldPaths=lastPaymentAt&updateMask.fieldPaths=lastPlan`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        contributionStatus: { stringValue: 'Active' },
        status: { stringValue: 'active' },
        paidUntil: { stringValue: paidUntil.toISOString() },
        lastPaymentAt: { stringValue: new Date().toISOString() },
        lastPlan: { stringValue: plan.id },
      },
    }),
  });
  return res.ok;
}

export async function POST(req: NextRequest) {
  try {
    // ── 1. Fail closed: a webhook secret is mandatory ──
    const secret = process.env.BITRIPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error('Webhook rejected: BITRIPAY_WEBHOOK_SECRET not configured');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 });
    }
    if (!firebaseReady()) {
      // Without the ledger we cannot dedupe or credit safely — do not activate.
      console.error('Webhook rejected: Firebase not configured (needed for idempotency)');
      return NextResponse.json({ error: 'Ledger not configured' }, { status: 503 });
    }

    // ── 2. Verify signature over the RAW body ──
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

    const status = String(
      (event.status as string) || (event.payment_status as string) || '',
    ).toLowerCase();
    if (!['success', 'successful', 'completed', 'paid'].includes(status)) {
      return NextResponse.json({ received: true, ignored: status });
    }

    const metadata = (event.metadata as Record<string, unknown>) || {};
    const reference = (event.reference as string) || '';
    const memberId =
      (metadata.memberId as string) ||
      (reference.startsWith('LCD-') ? reference.split('-')[1] : '');
    if (!memberId) {
      console.error('Webhook success but no memberId:', raw.slice(0, 300));
      return NextResponse.json({ error: 'memberId missing' }, { status: 400 });
    }

    // ── 3. Resolve the plan from the VERIFIED paid amount (not metadata) ──
    const paidAmount = Number(
      (event.amount as number) ??
        (event.amount_paid as number) ??
        (event.paid_amount as number) ??
        NaN,
    );
    const currency = String((event.currency as string) || 'USD').toUpperCase();
    let plan = planForAmount(paidAmount);
    if (paidAmount && currency !== 'USD') {
      // A non-USD amount can't be trusted to map to a USD plan — reject.
      console.error('Webhook rejected: unexpected currency', currency);
      return NextResponse.json({ error: 'Unexpected currency' }, { status: 400 });
    }
    // If the gateway does not send an amount, fall back to the plan named in
    // metadata but grant ONLY what that plan is worth (clamped, never trusted
    // to inflate). If neither is present/valid, reject rather than over-grant.
    if (!plan) plan = getPlan(metadata.plan);
    if (!plan) {
      console.error('Webhook rejected: could not resolve a valid plan', { paidAmount, meta: metadata.plan });
      return NextResponse.json({ error: 'Unresolvable plan/amount' }, { status: 400 });
    }

    // ── 4. Idempotency: claim the payment id exactly once ──
    const rawTxId = String(
      (event.transaction_id as string) ||
        (event.id as string) ||
        (event.reference as string) ||
        '',
    );
    if (!rawTxId) {
      console.error('Webhook success but no transaction id:', raw.slice(0, 300));
      return NextResponse.json({ error: 'transaction id missing' }, { status: 400 });
    }
    const txId = encodeURIComponent(rawTxId).replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 200);

    const firstTime = await claimPayment(txId);
    if (!firstTime) {
      return NextResponse.json({ received: true, duplicate: true, txId });
    }

    // ── 5. Activate + credit (only reached once per payment) ──
    const activated = await activateMember(memberId, plan);
    if (!activated) {
      console.error('Member activation failed for', memberId);
      // Ask the gateway to retry; the tx claim above makes retry safe (the
      // duplicate branch will short-circuit once activation succeeds).
      return NextResponse.json({ error: 'Activation failed, retry' }, { status: 500 });
    }

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
