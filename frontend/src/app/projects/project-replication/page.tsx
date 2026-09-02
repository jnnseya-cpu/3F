'use client';

import Link from 'next/link';
import { ChevronRight, Repeat2 } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function ProjectReplicationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-violet-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Réplication de Projets</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500 rounded-xl flex items-center justify-center">
              <Repeat2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Réplication de Projets IA</h1>
              <p className="text-violet-200 text-sm">Duplique les succès vers des provinces similaires avec stratégie de déploiement.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="project-replication"
            agentName="Réplication de Projets IA"
            agentSubtitle="Succès → Déploiement national"
            agentDescription="Je duplique les projets réussis vers des provinces aux conditions similaires, avec coûts de réplication, stratégie de déploiement et calendrier d'expansion nationale."
            inputLabel="Décrivez le projet réussi à répliquer et sa province d'origine :"
            placeholder="Ex : Programme solaire rural réussi au Katanga — répliquer dans 5 provinces..."
            examplePrompts={[
              'Solar Katanga → répliquer 5 provinces',
              'Cliniques rurales Kongo Central',
              'Formation agricole Kasaï',
              'WiFi scolaire Kinshasa → national',
            ]}
            demoResponse={(q) => `**Plan de Réplication — ${q}**\n\n**Projet Pilote Réussi :**\n• Province : Haut-Katanga\n• Résultats : 50 000 bénéficiaires, 95% satisfaction\n• Coût original : $45M | Timeline : 18 mois\n• Leçons apprises : 12 bonnes pratiques documentées\n\n━━━━━━━━━━━━━━━━━━━━━\n**PROVINCES IDENTIFIÉES POUR RÉPLICATION**\n━━━━━━━━━━━━━━━━━━━━━\n\n🟢 **Lualaba** — Compatibilité 94%\n   Conditions similaires, même zone minière\n   Coût réplication : $38M (économie d'échelle -15%)\n   Timeline : 14 mois | Priorité : HAUTE\n\n🟢 **Tanganyika** — Compatibilité 88%\n   Accès similaire, démographie comparable\n   Coût réplication : $42M\n   Timeline : 16 mois | Priorité : HAUTE\n\n🟡 **Maniema** — Compatibilité 76%\n   Adaptation nécessaire (géographie fluviale)\n   Coût réplication : $52M (+adaptation)\n   Timeline : 20 mois | Priorité : MOYENNE\n\n🟡 **Sud-Kivu** — Compatibilité 71%\n   Adaptation sécuritaire requise\n   Coût réplication : $58M\n   Timeline : 22 mois | Priorité : MOYENNE\n\n**Programme de réplication nationale :**\n• Total 4 provinces : $190M\n• Économies d'échelle : -18% vs 4 projets indépendants\n• Bénéficiaires supplémentaires : 180 000\n• Timeline global : 22 mois\n\n**Score de réplicabilité du projet pilote : 92/100** ✅`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Analyse de réplication</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Score de compatibilité', 'Provinces similaires', 'Économies d\'échelle', 'Adaptations nécessaires', 'Coût de réplication', 'Timeline ajusté', 'Impact additionnel'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
