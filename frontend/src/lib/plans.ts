/**
 * Subscription plans — the SINGLE source of truth for price → benefits.
 *
 * Both the checkout (what we ask the gateway to charge) and the webhook
 * (what we grant after a verified payment) read from here. The webhook
 * derives months + ACUs from the PAID AMOUNT, never from client/metadata,
 * so a member can never claim a bigger plan than they paid for.
 */

export interface Plan {
  id: 'monthly' | 'quarterly' | 'annual';
  amount: number;   // USD, exact
  months: number;
  acus: number;
  label: string;
}

export const PLANS: Record<Plan['id'], Plan> = {
  monthly:   { id: 'monthly',   amount: 1,  months: 1,  acus: 5,  label: 'Cotisation mensuelle — Le Congo D’Abord' },
  quarterly: { id: 'quarterly', amount: 3,  months: 3,  acus: 18, label: 'Cotisation trimestrielle — Le Congo D’Abord' },
  annual:    { id: 'annual',    amount: 12, months: 12, acus: 80, label: 'Cotisation annuelle — Le Congo D’Abord' },
};

export function getPlan(id: unknown): Plan | null {
  return typeof id === 'string' && id in PLANS ? PLANS[id as Plan['id']] : null;
}

/**
 * Resolve the plan actually purchased from the verified paid amount.
 * Uses a small tolerance for gateway rounding. Returns null if the amount
 * does not match any real plan — in which case the webhook must NOT grant.
 */
export function planForAmount(amount: number): Plan | null {
  if (!Number.isFinite(amount) || amount <= 0) return null;
  for (const p of Object.values(PLANS)) {
    if (Math.abs(amount - p.amount) < 0.005) return p;
  }
  return null;
}
