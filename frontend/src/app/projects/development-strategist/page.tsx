'use client';

import Link from 'next/link';
import { ChevronRight, Lightbulb } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function DevelopmentStrategistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-yellow-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Stratège de Développement</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Stratège de Développement IA</h1>
              <p className="text-yellow-100 text-sm">Think tank national — génère continuellement de nouveaux projets de transformation.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="development-strategist"
            agentName="Stratège de Développement IA"
            agentSubtitle="Think tank national RDC"
            agentDescription="Je génère continuellement de nouveaux projets de développement pour la RDC : zones industrielles, corridors d'exportation, villes intelligentes, industries extractives à valeur ajoutée, nouvelles économies."
            inputLabel="Demandez de nouveaux projets pour un secteur ou une province :"
            placeholder="Ex : Générer 5 projets innovants pour développer Kasaï-Oriental..."
            examplePrompts={[
              'Projets innovants Kasaï-Oriental',
              'Industrialisation secteur minier',
              'Corridors d\'exportation agricole',
              'Villes intelligentes RDC',
            ]}
            demoResponse={(q) => `**Projets Stratégiques Générés — ${q}**\n\n🏭 **1. Zone Économique Spéciale de Mbuji-Mayi**\nSecteur : Mines & Industrie\nConcept : Zone dédiée au diamant industriel et pierres précieuses, transformation locale, exportation premium\nImpact estimé : 25 000 emplois | $400M revenus/an\nTimeline : 4 ans | Financement : PPP + BAD\n\n🌾 **2. Pôle Agro-industriel du Kasaï**\nSecteur : Agriculture\nConcept : Hub de transformation des produits agricoles (manioc, maïs, arachides) vers produits finis pour export\nImpact : 18 000 emplois | $200M revenus/an\nTimeline : 3 ans\n\n⚡ **3. Corridor Énergétique Kasaï-Katanga**\nSecteur : Énergie\nConcept : Ligne THT reliant le potentiel solaire du Kasaï aux industries du Katanga\nImpact : 500 000 bénéficiaires | -30% coût énergie industrie\nTimeline : 5 ans\n\n🎓 **4. Académie STEM de Mbuji-Mayi**\nSecteur : Éducation\nConcept : Université technologique spécialisée en géologie, mines, ingénierie, IA\nImpact : 5 000 étudiants/an | Remplacement des experts expatriés\nTimeline : 3 ans\n\n📱 **5. Plateforme E-Commerce Agricole RDC**\nSecteur : Numérique\nConcept : Marketplace B2B pour agriculteurs + acheteurs régionaux Afrique centrale\nImpact : 50 000 agriculteurs connectés | +40% revenus agriculteurs\nTimeline : 18 mois\n\n**Score stratégique global du portefeuille : 91/100** 🌟`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Domaines couverts</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {['Zones économiques spéciales', 'Corridors d\'exportation', 'Transformation minière', 'Agro-industrie', 'Villes intelligentes', 'Académies STEM', 'Réseaux numérique', 'Tourisme & culture', 'Finance & bancarisation'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-600 shrink-0" />
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
