'use client';

import Link from 'next/link';
import { ChevronRight, DollarSign } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function NationalCostingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-green-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Costing National</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Costing National IA</h1>
              <p className="text-green-200 text-sm">CAPEX / OPEX / Scénarios de financement pour tout projet national.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="national-costing"
            agentName="Costing National IA"
            agentSubtitle="CAPEX / OPEX / Financement"
            agentDescription="Je produis des estimations de coûts détaillées avec CAPEX, OPEX, structures de financement (Gouvernement, PPP, Banque Mondiale, BAD) et scénarios bas/moyen/haut."
            inputLabel="Décrivez le projet à chiffrer :"
            placeholder="Ex : Programme d'irrigation pour 500 000 hectares en Kasaï..."
            examplePrompts={[
              'Programme irrigation Kasaï 500 000 ha',
              'Réseau ferroviaire Kinshasa-Lubumbashi',
              'Université technologique nationale',
              'Programme logements sociaux 50 000 unités',
            ]}
            demoResponse={(q) => `**Estimation Financière — ${q}**\n\n━━━━━━━━━━━━━━━━━━━━━\n**CAPEX (Investissement initial)**\n━━━━━━━━━━━━━━━━━━━━━\n• Construction / Génie civil : $340M\n• Équipements : $180M\n• Technologie / Systèmes : $45M\n• Supervision / Ingénierie : $35M\n• **CAPEX Total : $600M**\n\n━━━━━━━━━━━━━━━━━━━━━\n**OPEX (Coûts opérationnels annuels)**\n━━━━━━━━━━━━━━━━━━━━━\n• Ressources humaines : $12M/an\n• Maintenance : $8M/an\n• Opérations : $6M/an\n• **OPEX Total : $26M/an**\n\n━━━━━━━━━━━━━━━━━━━━━\n**Structure de Financement Proposée**\n━━━━━━━━━━━━━━━━━━━━━\n• Budget État RDC (30%) : $180M\n• Banque Africaine de Développement (25%) : $150M\n• Banque Mondiale / IDA (25%) : $150M\n• PPP Secteur Privé (20%) : $120M\n\n━━━━━━━━━━━━━━━━━━━━━\n**Scénarios**\n━━━━━━━━━━━━━━━━━━━━━\n🟢 Bas : $480M (périmètre réduit)\n🟡 Moyen : $600M (périmètre standard)\n🔴 Haut : $780M (périmètre étendu + aléas)\n\n**ROI social estimé : 380% sur 10 ans**\n**Seuil de rentabilité : Année 6**`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Livrables financiers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['CAPEX détaillé', 'OPEX annuel', '3 scénarios de coût', 'Structure de financement', 'ROI social', 'Seuil de rentabilité', 'Flux de trésorerie prévisionnels'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 shrink-0" />
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
