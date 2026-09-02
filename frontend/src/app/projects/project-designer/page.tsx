'use client';

import Link from 'next/link';
import { ChevronRight, FolderKanban } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function ProjectDesignerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Concepteur de Projets</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Concepteur de Projets IA</h1>
              <p className="text-indigo-200 text-sm">Convertit chaque promesse électorale en projets structurés et financables.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="project-designer"
            agentName="Concepteur de Projets IA"
            agentSubtitle="Promesse → Projets concrets"
            agentDescription="Je décompose une promesse électorale en projets concrets avec portée, coût, bénéfices, risques, timeline et stratégie d'approvisionnement pour chaque projet."
            inputLabel="Entrez une promesse électorale ou un défi national à convertir en projets :"
            placeholder="Ex : Améliorer l'accès à l'électricité en milieu rural..."
            examplePrompts={[
              'Améliorer l\'électricité rurale',
              'Réformer le système éducatif',
              'Développer l\'agriculture',
              'Construire des routes nationales',
            ]}
            demoResponse={(q) => `**Conception de Projets — « ${q} »**\n\n**Programme Parent :** Programme National de ${q}\n\n**Projets identifiés (5) :**\n\n1. **Mini-Réseaux Solaires Ruraux**\n   • Portée : 500 villages isolés\n   • Coût : $120M | Timeline : 36 mois\n   • Bénéficiaires : 2.5M personnes\n\n2. **Extension du Réseau Hydro-électrique**\n   • Portée : 8 provinces\n   • Coût : $450M | Timeline : 48 mois\n   • Bénéficiaires : 8M personnes\n\n3. **Mise à Niveau du Réseau National**\n   • Portée : Kinshasa + 4 villes\n   • Coût : $200M | Timeline : 24 mois\n   • Bénéficiaires : 5M personnes\n\n4. **Compteurs Intelligents**\n   • Portée : National\n   • Coût : $85M | Timeline : 18 mois\n   • Bénéficiaires : Tous abonnés\n\n5. **Programme Énergie Rurale Communautaire**\n   • Portée : 10 000 villages\n   • Coût : $300M | Timeline : 60 mois\n   • Bénéficiaires : 15M personnes\n\n**Risques majeurs :**\n• Financement (probabilité : élevée)\n• Capacité d'exécution locale (probabilité : moyenne)\n• Sécurité en zones Est (probabilité : élevée)\n\n*Chaque projet peut être décomposé en WBS via l'Agent de Décomposition.*`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Livrables par projet</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Portée et périmètre', 'Coût estimé', 'Bénéfices attendus', 'Risques identifiés', 'Timeline réaliste', 'Stratégie d\'approvisionnement', 'Province(s) ciblée(s)'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
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
