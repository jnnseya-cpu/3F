'use client';

import { useState } from 'react';
import { humanFetch } from '@/lib/humanClient';
import { trackCheckout } from '@/lib/analytics';
import { getMemberId } from '@/lib/memberSession';
import { Loader2, CreditCard, ArrowRight } from 'lucide-react';

/**
 * The contribution "Cotiser" front door — calls /api/payments/checkout and
 * redirects to the gateway's payment URL. Handles the not-configured state
 * gracefully (before the payment provider is connected), so it ships now and
 * lights up when BITRIPAY_* keys exist. No fake success is ever shown.
 */

type Plan = 'monthly' | 'quarterly' | 'annual';

const PLAN_META: Record<Plan, { label: string; price: string; sub: string }> = {
  monthly: { label: 'Mensuel', price: '1 USD', sub: 'par mois' },
  quarterly: { label: 'Trimestriel', price: '3 USD', sub: 'tous les 3 mois' },
  annual: { label: 'Annuel', price: '12 USD', sub: 'par an — recommandé' },
};

export default function PayButton({ defaultPlan = 'annual', phone }: { defaultPlan?: Plan; phone?: string }) {
  const [plan, setPlan] = useState<Plan>(defaultPlan);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'info' | 'error'; text: string } | null>(null);

  const pay = async () => {
    setMsg(null);
    const memberId = getMemberId();
    if (!memberId) {
      setMsg({ type: 'error', text: "Créez d'abord votre compte (gratuit) pour cotiser." });
      return;
    }
    setLoading(true);
    trackCheckout(plan, plan === 'annual' ? 12 : plan === 'quarterly' ? 3 : 1);
    try {
      const res = await humanFetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, memberId, phone }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 503 || data.status === 'not_configured') {
        setMsg({ type: 'info', text: data.message || 'Le paiement par mobile money s’active au lancement (2027).' });
        return;
      }
      if (res.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl; // hand off to the gateway
        return;
      }
      setMsg({ type: 'error', text: data.error || 'Paiement indisponible pour le moment.' });
    } catch {
      setMsg({ type: 'error', text: 'Connexion impossible. Réessayez.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
        <CreditCard className="w-3.5 h-3.5" /> Cotiser
      </p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {(Object.keys(PLAN_META) as Plan[]).map(p => {
          const active = plan === p;
          return (
            <button
              key={p}
              onClick={() => setPlan(p)}
              className={`rounded-xl border p-3 text-center transition-all ${
                active ? 'border-drc-blue bg-blue-50 shadow-xs' : 'border-black/10 hover:border-drc-blue/40'
              }`}
            >
              <span className="block text-[11px] font-semibold text-gray-500">{PLAN_META[p].label}</span>
              <span className={`block font-display font-extrabold ${active ? 'text-drc-blue' : 'text-gray-900'}`}>{PLAN_META[p].price}</span>
              <span className="block text-[10px] text-gray-400">{PLAN_META[p].sub}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={pay}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Cotiser {PLAN_META[plan].price} <ArrowRight className="w-4 h-4" /></>}
      </button>

      {msg && (
        <p className={`mt-3 text-sm rounded-lg px-3 py-2 ${msg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
          {msg.text}
        </p>
      )}
      <p className="mt-3 text-xs text-gray-400">
        Paiement par mobile money (Airtel, Orange, M-Pesa). L’adhésion reste gratuite — vous
        cotisez quand vous voulez.
      </p>
    </div>
  );
}
