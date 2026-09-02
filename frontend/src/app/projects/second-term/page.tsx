'use client';

import Link from 'next/link';
import { ChevronRight, Clock } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

const TERM1_EXAMPLES = [
  { sector: 'Routes', project: 'Réhabilitation axes principaux', cost: '$800M', years: '1-3' },
  { sector: 'Énergie', project: 'Programme solaire 500MW', cost: '$600M', years: '1-4' },
  { sector: 'Éducation', project: 'Rénovation 5 000 écoles', cost: '$400M', years: '2-5' },
  { sector: 'Santé', project: 'Hôpitaux régionaux (26)', cost: '$520M', years: '1-5' },
  { sector: 'Digital', project: 'Identité numérique nationale', cost: '$150M', years: '1-2' },
];

const TERM2_EXAMPLES = [
  { sector: 'Rail', project: 'Train rapide Kinshasa-Lubumbashi', cost: '$3.2Md', years: '6-10' },
  { sector: 'IA', project: 'Infrastructure IA Nationale', cost: '$800M', years: '6-8' },
  { sector: 'Industrie', project: 'Zones de traitement export', cost: '$1.5Md', years: '7-10' },
  { sector: 'Villes', project: 'Ville intelligente Kinshasa 2.0', cost: '$2Md', years: '6-10' },
  { sector: 'Mines', project: 'Raffineries batteries DRC', cost: '$1.8Md', years: '8-10' },
];

export default function SecondTermPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-slate-300 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Planification 2e Mandat</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-600 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Planification 2e Mandat IA</h1>
              <p className="text-slate-300 text-sm">Feuille de route 10 ans — fondations + industrialisation avancée.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Two-term overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h2 className="font-black text-blue-900 mb-1">1er Mandat — Années 1–5</h2>
            <p className="text-blue-700 text-sm mb-4">Fondations nationales : routes, énergie, écoles, hôpitaux, gouvernement digital.</p>
            <div className="space-y-2">
              {TERM1_EXAMPLES.map(p => (
                <div key={p.project} className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-blue-600">{p.sector}</p>
                      <p className="text-sm font-semibold text-gray-800">{p.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-700">{p.cost}</p>
                      <p className="text-xs text-gray-400">Ans {p.years}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h2 className="font-black text-slate-900 mb-1">2e Mandat — Années 6–10</h2>
            <p className="text-slate-700 text-sm mb-4">Industrialisation avancée : rail, IA nationale, villes intelligentes, batteries.</p>
            <div className="space-y-2">
              {TERM2_EXAMPLES.map(p => (
                <div key={p.project} className="bg-white rounded-lg p-3 border border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-500">{p.sector}</p>
                      <p className="text-sm font-semibold text-gray-800">{p.project}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-gray-700">{p.cost}</p>
                      <p className="text-xs text-gray-400">Ans {p.years}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Agent */}
        <NTOSAgentPanel
          agentId="second-term"
          agentName="Planification 2e Mandat IA"
          agentSubtitle="Feuille de route 10 ans"
          agentDescription="J'alloue automatiquement les projets entre le 1er et le 2e mandat selon la faisabilité institutionnelle, la disponibilité du financement, la capacité d'exécution et l'impact national attendu."
          inputLabel="Décrivez un projet ou demandez son allocation entre les deux mandats :"
          placeholder="Ex : Projet train rapide Kinshasa-Matadi — quel mandat ?"
          examplePrompts={[
            'Allouer : train rapide Kinshasa-Matadi',
            'Plan complet industrialisation mines',
            'Priorités 1er mandat province Équateur',
            'Projets IA pour 2e mandat',
          ]}
          demoResponse={(q) => `**Allocation Mandats — ${q}**\n\n**Analyse de faisabilité :**\n\n**1er Mandat (Années 1-5) — Fondations**\nConditions requises : Financement disponible + Capacité d'exécution existante\n\n✅ Projets alloués au 1er Mandat :\n• Réhabilitation routes nationales prioritaires\n• Programme énergie solaire décentralisée\n• Rénovation hôpitaux régionaux\n• Identité numérique nationale\nRationale : Infrastructure de base, financement BAD/BM disponible, capacité SNEL et entreprises locales\n\n**2e Mandat (Années 6-10) — Transformation**\nConditions requises : Institutions renforcées + Capacité technique avancée + Grands financements\n\n🚀 Projets alloués au 2e Mandat :\n• Train rapide Kinshasa-Lubumbashi ($3.2Md)\n• Infrastructure IA nationale\n• Zones de traitement export minière\n• Villes intelligentes Kinshasa/Lubumbashi\nRationale : Complexité technique élevée, financement $1Md+ requis, dépend des fondations du 1er mandat\n\n**Critères d'allocation :**\n• Faisabilité institutionnelle (25%)\n• Financement disponible (25%)\n• Capacité d'exécution (25%)\n• Impact électoral immédiat (25%)\n\n**Recommandation : Approuver cette allocation** ✅`}
        />
      </div>
    </div>
  );
}
