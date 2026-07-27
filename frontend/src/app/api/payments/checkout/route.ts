import { NextRequest, NextResponse } from 'next/server';

/**
 * Contribution checkout — BitriPay integration.
 *
 * Env vars required (from your BitriPay merchant dashboard):
 *   BITRIPAY_API_KEY     — secret API key
 *   BITRIPAY_API_URL     — API base URL from their docs
 *                          (set this to the exact endpoint BitriPay gives you)
 *   NEXT_PUBLIC_SITE_URL — your deployed site URL (for redirect/callback)
 *
 * Flow: member chooses plan → POST here → we create a BitriPay payment
 * → return the payment/redirect URL → member pays via mobile money
 * → BitriPay calls /api/payments/webhook → member activated.
 *
 * NOTE: BitriPay's exact request schema may differ — adjust the payload
 * below to match their API documentation when you receive merchant access.
 */

const PLANS: Record<string, { amount: number; label: string; months: number }> = {
  monthly: { amount: 1, label: 'Cotisation mensuelle — Le Congo D’Abord', months: 1 },
  quarterly: { amount: 3, label: 'Cotisation trimestrielle — Le Congo D’Abord', months: 3 },
  annual: { amount: 12, label: 'Cotisation annuelle — Le Congo D’Abord', months: 12 },
};

export async function POST(req: NextRequest) {
  try {
    const { plan = 'annual', memberId, phone } = await req.json();

    const selected = PLANS[plan];
    if (!selected) {
      return NextResponse.json({ error: 'Plan invalide (monthly|quarterly|annual)' }, { status: 400 });
    }
    if (!memberId) {
      return NextResponse.json({ error: 'memberId requis' }, { status: 400 });
    }

    const apiKey = process.env.BITRIPAY_API_KEY;
    const apiUrl = process.env.BITRIPAY_API_URL;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!apiKey || !apiUrl) {
      return NextResponse.json(
        {
          status: 'not_configured',
          message: 'Paiement bientôt disponible — BitriPay en cours d’activation',
        },
        { status: 503 },
      );
    }

    // Generic payment-creation payload — align with BitriPay docs on merchant onboarding
    const paymentRequest = {
      amount: selected.amount,
      currency: 'USD',
      description: selected.label,
      reference: `LCD-${memberId}-${Date.now()}`,
      customer_phone: phone || undefined,
      success_url: `${siteUrl}/contributions?payment=success`,
      cancel_url: `${siteUrl}/contributions?payment=cancelled`,
      callback_url: `${siteUrl}/api/payments/webhook`,
      metadata: { memberId, plan, months: selected.months },
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(paymentRequest),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('BitriPay error:', err.slice(0, 300));
      return NextResponse.json({ error: 'Échec de création du paiement' }, { status: 502 });
    }

    const data = await res.json();
    // Most gateways return a checkout/redirect URL — normalize common field names
    const paymentUrl = data.payment_url || data.checkout_url || data.url || data.link;
    return NextResponse.json({ status: 'created', paymentUrl, raw: paymentUrl ? undefined : data });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
