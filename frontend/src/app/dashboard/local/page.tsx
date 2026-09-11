'use client';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import PreLaunchState from '@/components/PreLaunchState';

/**
 * Local cell dashboard. Real member/activity data appears once a cell is
 * populated after launch — until then we show an honest empty state (no
 * fabricated commune, members or figures) plus the working AI assistant.
 */
export default function LocalDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link href="/dashboard" className="text-blue-200 text-sm hover:text-white">← National</Link>
            <span className="text-blue-300">/</span>
            <Link href="/dashboard/provincial" className="text-blue-200 text-sm hover:text-white">Provincial</Link>
            <span className="text-blue-300">/</span>
            <span className="text-blue-200 text-sm">Local</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <MapPin className="w-7 h-7 text-drc-yellow" /> Cellule Locale
          </h1>
          <p className="text-blue-200 text-sm mt-1">Vue Chef de Cellule</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreLaunchState
          title="Votre cellule — à activer"
          message="Dès qu'un membre s'inscrit dans votre commune, votre cellule locale apparaît ici : membres, cotisations, activités et besoins signalés. Aucun chiffre n'est inventé avant l'ouverture des inscriptions."
        />
        <AIAgentPanel
          agentName="Agent Local CDP-AI"
          agentDescription="Assistant pour l'animation et le suivi d'une cellule locale"
          placeholderText="Ex: Comment améliorer le taux de cotisation? Comment recruter dans mon quartier?"
        />
      </div>
    </div>
  );
}
