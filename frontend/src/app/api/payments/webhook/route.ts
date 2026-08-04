import { NextRequest, NextResponse } from 'next/server';
import { credit, ACU_GRANTS } from '@/lib/acu';

/**
 * BitriPay payment webhook — activates the member on successful payment.
 *
 * Env vars:
 *   BITRIPAY_WEBHOOK_SECRET — shared secret to verify calls really come
 *                             from BitriPay (set the same value in their
 *                             dashboard webhook config)
 *   FIREBASE_PROJECT_ID / FIREBASE_API_KEY — to update the member record
 *
 * Adjust the payload field names to BitriPay's actual webhook schema
 * when merchant access is granted.
 */

export async function POST(req: NextRequest) {
  try {
    // ── Verify origin ──
    const secret = process.env.BITRIPAY_WEBHOOK_SECRET;
    if (secret) {
      const provided =
        req.headers.get('x-webhook-secret') ||
        req.headers.get('x-bitripay-signature') ||
        '';
      if (provided !== secret) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = await req.json();

    // Normalize common gateway webhook shapes
    const status = (event.status || event.payment_status || '').toLowerCase();
    const metadata = event.metadata || {};
    const memberId = metadata.memberId || event.reference?.split('-')[1];
    const months = Number(metadata.months) || 1;

    if (!['success', 'successful', 'completed', 'paid'].includes(status)) {
      // Not a success event — acknowledge and ignore
      return NextResponse.json({ received: true, ignored: status });
    }

    if (!memberId) {
      console.error('Webhook success but no memberId:', JSON.stringify(event).slice(0, 300));
      return NextResponse.json({ error: 'memberId missing' }, { status: 400 });
    }

    // ── Activate the member in Firestore ──
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const apiKey = process.env.FIREBASE_API_KEY;
    if (projectId && apiKey) {
      const paidUntil = new Date();
      paidUntil.setMonth(paidUntil.getMonth() + months);

      const url =
        `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/members/${memberId}` +
        `?key=${apiKey}&updateMask.fieldPaths=contributionStatus&updateMask.fieldPaths=status&updateMask.fieldPaths=paidUntil&updateMask.fieldPaths=lastPaymentAt`;

      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            contributionStatus: { stringValue: 'Active' },
            status: { stringValue: 'active' },
            paidUntil: { stringValue: paidUntil.toISOString() },
            lastPaymentAt: { stringValue: new Date().toISOString() },
          },
        }),
      });

      if (!res.ok) {
        console.error('Member activation failed:', (await res.text()).slice(0, 300));
        // Return 500 so the gateway retries the webhook
        return NextResponse.json({ error: 'Activation failed, retry' }, { status: 500 });
      }
    } else {
      console.warn('Payment received but Firebase not configured — memberId:', memberId);
    }

    // Credit ACUs for the paid plan — the only way to earn AI actions
    let acuCredited = 0;
    try {
      const plan = metadata.plan || (months >= 12 ? 'annual' : months >= 3 ? 'quarterly' : 'monthly');
      acuCredited = ACU_GRANTS[plan] ?? ACU_GRANTS.monthly;
      await credit(memberId, acuCredited);
    } catch (e) {
      console.error('ACU credit failed (payment still recorded):', e);
    }

    return NextResponse.json({ received: true, memberActivated: memberId, acuCredited });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
