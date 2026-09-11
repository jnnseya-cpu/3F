'use client';

import Link from 'next/link';
import { Shield, MapPin, Users, Award } from 'lucide-react';
import PublicLedger from '@/components/PublicLedger';
import PreLaunchState from '@/components/PreLaunchState';

/**
 * National ("presidential") dashboard. National figures populate from real
 * registrations and the verified-payment ledger once Firebase is connected —
 * so this page shows the REAL public ledger (or its honest pre-launch state)
 * plus links into the structure, never fabricated national statistics.
 */
export default function FounderDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-drc-yellow" />
            <span className="text-drc-yellow text-sm font-semibold">Le Congo D&apos;Abord — Tableau de bord national</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">Tableau de bord national</h1>
          <p className="text-blue-200 text-sm mt-1">Vue d&apos;ensemble en temps réel — alimentée par les données réelles du parti.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Real data: verified-payment ledger (or honest pre-launch state) */}
        <PublicLedger />

        {/* National analytics populate at launch */}
        <PreLaunchState
          title="Statistiques nationales — au lancement"
          message="Effectifs par province, cotisants actifs, indice de préparation électorale et classements se calculeront à partir des inscriptions et des paiements réels. Aucun chiffre national n'est affiché avant d'être réel."
          cta={false}
        />

        {/* Navigate the structure (real geography) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/dashboard/provincial', icon: MapPin, title: 'Tableau provincial', desc: '26 provinces, territoires et communes' },
            { href: '/dashboard/local', icon: Users, title: 'Cellule locale', desc: 'Vue chef de cellule' },
            { href: '/candidates', icon: Award, title: 'Sélection au mérite', desc: 'La formule de scoring des candidats' },
          ].map(c => {
            const Icon = c.icon;
            return (
              <Link key={c.href} href={c.href} className="card-hover group">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-drc-blue" />
                </div>
                <p className="font-bold text-gray-900 group-hover:text-drc-blue transition-colors">{c.title}</p>
                <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
