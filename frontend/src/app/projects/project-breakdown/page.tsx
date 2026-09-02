'use client';

import Link from 'next/link';
import { ChevronRight, Cpu } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function ProjectBreakdownPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-purple-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Décomposition de Projets</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Décomposition de Projets IA</h1>
              <p className="text-purple-200 text-sm">Structure WBS complète avec phases, tâches, coûts et responsables.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="project-breakdown"
            agentName="Décomposition de Projets IA"
            agentSubtitle="WBS — Structure de décomposition"
            agentDescription="Je crée la structure de décomposition du travail (WBS) complète : phases, tâches, durées, coûts, responsables et dépendances entre tâches."
            inputLabel="Décrivez le projet à décomposer en WBS :"
            placeholder="Ex : Construction d'une centrale solaire de 50MW au Katanga..."
            examplePrompts={[
              'Centrale solaire 50MW Katanga',
              'Construction d\'hôpital provincial',
              'Programme de formation enseignants',
              'Réseau fibre optique national',
            ]}
            demoResponse={(q) => `**WBS — ${q}**\n\n**Phase 1 : Faisabilité** (3 mois | $2M)\n├── 1.1 Étude géotechnique\n├── 1.2 Étude d'impact environnemental\n├── 1.3 Analyse financière\n└── 1.4 Rapport de faisabilité\n\n**Phase 2 : Financement** (6 mois | $500K)\n├── 2.1 Dossier de financement BAD/BM\n├── 2.2 Négociations PPP\n├── 2.3 Signature des accords\n└── 2.4 Mobilisation des fonds\n\n**Phase 3 : Approvisionnement** (4 mois | $1M)\n├── 3.1 Appels d'offres internationaux\n├── 3.2 Évaluation des soumissions\n├── 3.3 Attribution des marchés\n└── 3.4 Mobilisation des équipes\n\n**Phase 4 : Construction** (18 mois | $180M)\n├── 4.1 Travaux de génie civil\n├── 4.2 Installation des équipements\n├── 4.3 Raccordement au réseau\n└── 4.4 Tests et essais\n\n**Phase 5 : Mise en Service** (2 mois | $3M)\n├── 5.1 Commissioning technique\n├── 5.2 Formation des opérateurs\n└── 5.3 Transfert à l'exploitant\n\n**Phase 6 : Opérations** (25 ans | $5M/an)\n├── 6.1 Maintenance préventive\n├── 6.2 Reporting performance\n└── 6.3 Extension capacité\n\n**Durée totale : 33 mois | Coût total : $206M**`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">WBS comprend</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['6 phases standard', 'Tâches et sous-tâches', 'Durée par tâche', 'Coût par phase', 'Responsable assigné', 'Dépendances critiques', 'Chemin critique (CPM)'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
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
