'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, TrendingUp, Users, Receipt, Lock } from 'lucide-react';

/**
 * Public contribution ledger — renders REAL aggregates from /api/contributions/ledger.
 * Before the ledger is live it shows an honest "opens with the first
 * contributions" state. It NEVER displays fabricated numbers or member names.
 */

interface Ledger {
  configured: boolean;
  currency?: string;
  totalUsd?: number;
  contributions?: number;
  activeMembers?: number;
  recent?: Array<{ province: string; amountUsd: number; plan: string; at: string }>;
}

const PLAN_LABEL: Record<string, string> = { monthly: 'Mensuel', quarterly: 'Trimestriel', annual: 'Annuel' };

function fmtUsd(n: number, currency = 'USD') {
  try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n); }
  catch { return `$${Math.round(n)}`; }
}

export default function PublicLedger() {
  const [data, setData] = useState<Ledger | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/contributions/ledger', { cache: 'no-store' });
        const d = await r.json();
        if (!cancelled) setData(d);
      } catch {
        if (!cancelled) setData({ configured: false });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const live = data?.configured === true;

  return (
    <div className="surface-lg overflow-hidden">
      <div className="hero-gradient px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-drc-yellow" />
          </div>
          <div>
            <h3 className="text-white font-display font-extrabold text-lg leading-tight">Registre public des cotisations</h3>
            <p className="text-blue-100/80 text-xs">Chaque franc entrant, visible — sans caisse noire.</p>
          </div>
        </div>
        <span className={`hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${live ? 'bg-emerald-400/20 text-emerald-100' : 'bg-white/10 text-white/80'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-white/60'}`} />
          {live ? 'En direct' : 'Ouvre en 2027'}
        </span>
      </div>

      {loading ? (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : live ? (
        <>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Metric icon={TrendingUp} label="Total cotisé" value={fmtUsd(data!.totalUsd || 0, data!.currency)} />
            <Metric icon={Receipt} label="Cotisations" value={(data!.contributions || 0).toLocaleString('fr-FR')} />
            <Metric icon={Users} label="Membres actifs" value={(data!.activeMembers || 0).toLocaleString('fr-FR')} />
          </div>
          {data!.recent && data!.recent.length > 0 && (
            <div className="px-6 pb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Activité récente (anonymisée)</p>
              <div className="divide-y divide-gray-100 rounded-xl border border-black/5 overflow-hidden">
                {data!.recent.map((r, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-2.5 text-sm bg-white">
                    <span className="text-gray-600">{r.province}</span>
                    <span className="text-gray-400 text-xs">{PLAN_LABEL[r.plan] || r.plan}</span>
                    <span className="font-semibold text-drc-blue tabular-nums">{fmtUsd(r.amountUsd, data!.currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-drc-blue" />
          </div>
          <p className="font-bold text-gray-900 mb-1">Le registre s&apos;ouvre avec les premières cotisations</p>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Nous ne montrons aucun chiffre inventé. Dès l&apos;ouverture des cotisations (lancement
            national, 4 janvier 2027), ce registre affichera <strong>en temps réel</strong> le total
            cotisé, le nombre de cotisations et de membres actifs — vérifiables par tous.
          </p>
        </div>
      )}

      <div className="border-t border-black/5 px-6 py-3 bg-gray-50/60 flex items-center gap-2 text-xs text-gray-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        Aucune donnée personnelle exposée. Les rapports de dépenses détaillés sont publiés chaque trimestre.
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 p-4 bg-white shadow-xs">
      <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </div>
      <p className="font-display text-2xl font-extrabold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
}
