'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSession, clearSession } from '@/lib/memberSession';
import PayButton from '@/components/PayButton';
import { UserCircle2, LogOut, Zap, BadgeCheck, Clock, XCircle, Loader2 } from 'lucide-react';

interface Me {
  configured: boolean;
  found?: boolean;
  firstName?: string | null;
  contributionStatus?: string;
  status?: string;
  paidUntil?: string | null;
  plan?: string | null;
}

const STATUS_UI: Record<string, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: 'Cotisation active', cls: 'bg-emerald-50 text-emerald-700', icon: BadgeCheck },
  pending_payment: { label: 'En attente de cotisation', cls: 'bg-yellow-50 text-yellow-700', icon: Clock },
  suspended: { label: 'Suspendu', cls: 'bg-red-50 text-red-700', icon: XCircle },
};

export default function MonEspacePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const [me, setMe] = useState<Me | null>(null);
  const [acu, setAcu] = useState<number | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.replace('/login'); return; }
    setName(s.firstName || '');
    setReady(true);

    (async () => {
      try {
        const r = await fetch(`/api/members/me?memberId=${encodeURIComponent(s.memberId)}`, { cache: 'no-store' });
        setMe(await r.json());
      } catch { setMe({ configured: false }); }
      try {
        const r = await fetch(`/api/acu/balance?memberId=${encodeURIComponent(s.memberId)}`, { cache: 'no-store' });
        const d = await r.json();
        if (d.ledger && typeof d.balance === 'number') setAcu(d.balance);
      } catch { /* no ledger */ }
    })();
  }, [router]);

  const logout = () => { clearSession(); router.push('/'); };

  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-drc-blue" /></div>;
  }

  const statusKey = me?.status || 'pending_payment';
  const su = STATUS_UI[statusKey] || STATUS_UI.pending_payment;
  const StatusIcon = su.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <UserCircle2 className="w-7 h-7 text-drc-yellow" />
            </div>
            <div>
              <p className="text-blue-100/80 text-xs uppercase tracking-widest">Mon espace</p>
              <h1 className="text-2xl font-black">{name ? `Bonjour, ${name}` : 'Bienvenue'}</h1>
            </div>
          </div>
          <button onClick={logout} className="glass text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-white/15">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Se déconnecter</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <div className="surface p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Statut de membre</p>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${su.cls}`}>
              <StatusIcon className="w-4 h-4" /> {su.label}
            </div>
            {me?.paidUntil && statusKey === 'active' && (
              <p className="text-sm text-gray-500 mt-3">
                Cotisation valable jusqu’au{' '}
                <strong>{new Date(me.paidUntil).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
              </p>
            )}
            {me && me.configured === false && (
              <p className="text-sm text-gray-500 mt-3">
                Votre statut détaillé sera disponible dès la connexion de la base de données (lancement 2027).
              </p>
            )}
          </div>

          {/* ACU balance */}
          <div className="surface p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Crédits IA (ACU)
            </p>
            {acu === null ? (
              <p className="text-sm text-gray-500">
                Aucun crédit pour l’instant. Les ACUs s’obtiennent via la cotisation
                (1 USD = 5 ACUs, 12 USD = 80 ACUs) et alimentent les 23 agents IA.
              </p>
            ) : (
              <p className="font-display text-4xl font-extrabold text-drc-blue">{acu.toLocaleString('fr-FR')} <span className="text-lg text-gray-400 font-bold">ACU</span></p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/projects" className="text-sm font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-drc-blue hover:text-white transition-colors">Agents SNTO</Link>
              <Link href="/growth" className="text-sm font-semibold text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-drc-blue hover:text-white transition-colors">Growth IA</Link>
            </div>
          </div>
        </div>

        {/* Contribute */}
        <div className="space-y-6">
          <PayButton defaultPlan="annual" />
          <div className="surface p-5 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Transparence</p>
            Chaque cotisation entre dans le <Link href="/contributions" className="text-drc-blue font-semibold hover:underline">registre public</Link>. Vos données restent privées.
          </div>
        </div>
      </div>
    </div>
  );
}
