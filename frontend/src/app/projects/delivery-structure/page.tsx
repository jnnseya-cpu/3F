'use client';

import Link from 'next/link';
import { ChevronRight, Building2 } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function DeliveryStructurePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-orange-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Structure de Livraison</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Structure de Livraison IA</h1>
              <p className="text-orange-200 text-sm">Gouvernance complète : responsables politiques, techniques, provinciaux et communautaires.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="delivery-structure"
            agentName="Structure de Livraison IA"
            agentSubtitle="Gouvernance de projet"
            agentDescription="Je conçois la structure de gouvernance complète pour chaque projet : responsable politique (parti), ministère de tutelle, expert technique, gouverneur provincial, représentant communautaire et unité de suivi indépendante."
            inputLabel="Décrivez le projet pour lequel concevoir la structure de gouvernance :"
            placeholder="Ex : Programme de construction de 500 écoles dans 10 provinces..."
            examplePrompts={[
              'Programme construction 500 écoles',
              'Réseau santé numérique national',
              'Zone économique spéciale Kinshasa',
              'Programme eau potable rural',
            ]}
            demoResponse={(q) => `**Structure de Gouvernance — ${q}**\n\n🏛️ **Responsable Politique (Parti)**\n   Rôle : Champion politique et accountability\n   Profil requis : Membre senior, élu ou désigné par le Bureau Politique\n   Responsabilités : Arbitrage politique, rapports au Président\n\n🏢 **Responsable Ministériel**\n   Ministère de tutelle principal\n   Rôle : Autorité contractante et gestionnaire de budget\n   Coordination avec : Min. Finances, Min. Plan\n\n⚙️ **Responsable Technique**\n   Profil : Expert sectoriel (ingénieur, spécialiste)\n   Rôle : Supervision technique, normes de qualité\n   Équipe : 3-5 experts locaux + 1-2 consultants internationaux\n\n🗺️ **Responsable Provincial**\n   Gouverneur ou délégué provincial\n   Rôle : Coordination sur le terrain, foncier, sécurité\n   Présence : Dans chaque province concernée\n\n👥 **Responsable Communautaire**\n   Représentants locaux élus\n   Rôle : Consultation communautaire, acceptation sociale\n   Mechanism : Comités de développement locaux\n\n📊 **Unité de Livraison (PMO)**\n   Coordinateur de projet + 4 gestionnaires\n   Rôle : Suivi quotidien, rapports mensuels, gestion des risques\n\n🔍 **Unité de Supervision Indépendante**\n   ONG + Auditeur externe\n   Rôle : Transparence, vérification indépendante\n   Rapports : Trimestriels au Parlement et au public\n\n**Comité de Pilotage :** Réunion mensuelle tous responsables`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">7 niveaux de gouvernance</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Responsable Politique', 'Lead Ministériel', 'Expert Technique', 'Gouverneur Provincial', 'Représentant Communauté', 'Unité PMO', 'Supervision Indépendante'].map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
