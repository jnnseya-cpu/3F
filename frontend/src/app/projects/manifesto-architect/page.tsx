'use client';

import Link from 'next/link';
import { ChevronRight, PenLine } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function ManifestoArchitectPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Architecte du Manifeste</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <PenLine className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Architecte du Manifeste IA</h1>
              <p className="text-blue-200 text-sm">Transforme la vision politique en programmes nationaux exécutables.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="manifesto-architect"
            agentName="Architecte du Manifeste IA"
            agentSubtitle="Vision → Programmes nationaux"
            agentDescription="Je transforme votre vision politique en programmes nationaux structurés avec objectifs mesurables, KPIs, budgets estimés, timelines et ministères impliqués."
            inputLabel="Décrivez une vision ou promesse électorale à structurer en programme :"
            placeholder="Ex : Réduire le chômage des jeunes de 40% en 5 ans..."
            examplePrompts={[
              'Réduire le chômage des jeunes',
              'Électrifier 100% du pays',
              'Scolariser tous les enfants',
              'Moderniser le réseau routier',
            ]}
            demoResponse={(q) => `**Programme National — ${q}**\n\n**Objectifs :**\n• Objectif principal : ${q} d'ici 2030\n• Couverture : 26 provinces\n• Bénéficiaires estimés : 4 millions de Congolais\n\n**KPIs :**\n• Taux de réalisation trimestriel\n• Nombre de bénéficiaires directs\n• ROI social (coût par bénéficiaire)\n• Indice de satisfaction citoyenne\n\n**Budget estimé :** $850M USD sur 5 ans\n\n**Timeline :**\n• Année 1 : Étude de faisabilité et financement\n• Années 2-3 : Déploiement dans 10 provinces pilotes\n• Années 4-5 : Couverture nationale complète\n\n**Ministères impliqués :**\n• Ministère de tutelle principale\n• Min. Finances (budget)\n• Min. Plan (coordination)\n• Min. Décentralisation (provinces)\n\n*L'IA propose — les organes du parti décident.*`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Ce que génère cet agent</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Programme National structuré', 'Objectifs SMART', 'KPIs mesurables', 'Budget estimé (3 scénarios)', 'Timeline 5 ans', 'Ministères impliqués', 'Risques et mitigations'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-drc-blue shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <p className="text-xs text-blue-700 font-semibold mb-1">Processus SNTO</p>
            <p className="text-xs text-blue-600">Vision → <strong>Programme</strong> → Projets → Livraison → Impact</p>
          </div>
        </div>
      </div>
    </div>
  );
}
