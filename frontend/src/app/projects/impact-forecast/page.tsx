'use client';

import Link from 'next/link';
import { ChevronRight, BarChart3 } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function ImpactForecastPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-cyan-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Prévision d&apos;Impact</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Prévision d&apos;Impact IA</h1>
              <p className="text-cyan-200 text-sm">PIB, emplois, revenus fiscaux, réduction pauvreté et impact électoral.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="impact-forecast"
            agentName="Prévision d'Impact IA"
            agentSubtitle="PIB / Emplois / Approbation"
            agentDescription="Je prédis l'impact socioéconomique complet d'un projet : contribution au PIB, création d'emplois directs et indirects, revenus fiscaux générés, réduction de la pauvreté et impact sur l'approbation électorale."
            inputLabel="Décrivez le projet pour lequel prévoir l'impact national :"
            placeholder="Ex : Programme Solaire National 100MW — impact sur 5 ans..."
            examplePrompts={[
              'Programme Solaire 100MW national',
              'Autoroute Kinshasa-Matadi',
              'Programme agriculture Kasaï',
              'Zone industrielle Haut-Katanga',
            ]}
            demoResponse={(q) => `**Prévision d'Impact — ${q}**\n\n━━━━━━━━━━━━━━━━━━━━━\n**IMPACT ÉCONOMIQUE (5 ans)**\n━━━━━━━━━━━━━━━━━━━━━\n📈 PIB : +$1.2Md (contribution directe)\n📊 Croissance PIB : +0.8 points de %\n💰 Revenus fiscaux : $180M supplémentaires\n🏭 Effet multiplicateur : 2.8x l'investissement initial\n\n━━━━━━━━━━━━━━━━━━━━━\n**CRÉATION D'EMPLOIS**\n━━━━━━━━━━━━━━━━━━━━━\n👷 Emplois directs construction : 15 000\n🏢 Emplois directs opérations : 3 500\n🔗 Emplois indirects induits : 45 000\n📚 Jeunes formés : 8 000\n**Total : 63 500 emplois**\n\n━━━━━━━━━━━━━━━━━━━━━\n**IMPACT SOCIAL**\n━━━━━━━━━━━━━━━━━━━━━\n👨‍👩‍👧 Bénéficiaires directs : 4.2M personnes\n📉 Réduction pauvreté : -2.3% dans les zones ciblées\n🏫 Écoles alimentées : 1 200\n🏥 Cliniques alimentées : 340\n\n━━━━━━━━━━━━━━━━━━━━━\n**IMPACT ÉLECTORAL ESTIMÉ**\n━━━━━━━━━━━━━━━━━━━━━\n⭐ Approbation nationale : +12 points\n🗺️ Provinces bénéficiaires : +18 points\n📺 Visibilité médiatique : Très élevée\n🗳️ Intention de vote : +8 points dans les zones\n\n**Score d'impact global : 87/100**\n**Priorité de mise en œuvre : HAUTE**`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Indicateurs analysés</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Contribution au PIB', 'Emplois créés (direct + indirect)', 'Revenus fiscaux', 'Réduction pauvreté', 'Bénéficiaires directs', 'Impact approbation', 'Score impact global'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" />
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
