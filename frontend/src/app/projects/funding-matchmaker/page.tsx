'use client';

import Link from 'next/link';
import { ChevronRight, Globe } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function FundingMatchmakerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-teal-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Courtier en Financement</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Courtier en Financement IA</h1>
              <p className="text-teal-200 text-sm">Identifie les bailleurs de fonds adaptés et calcule la probabilité d'obtention.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="funding-matchmaker"
            agentName="Courtier en Financement IA"
            agentSubtitle="Projets → Sources de financement"
            agentDescription="Je recherche et classe les sources de financement les plus adaptées à chaque projet : Banque Mondiale, BAD, FMI, fonds privés, impact investors, avec un score de probabilité d'obtention."
            inputLabel="Décrivez votre projet et son secteur pour trouver les bailleurs adaptés :"
            placeholder="Ex : Projet d'électrification rurale solaire, $200M, secteur énergie..."
            examplePrompts={[
              'Électrification rurale $200M',
              'Hôpitaux régionaux $150M',
              'Formation professionnelle $50M',
              'Infrastructure routière $500M',
            ]}
            demoResponse={(q) => `**Matching Financement — ${q}**\n\n**Sources de financement identifiées :**\n\n🏦 **Banque Mondiale / IDA**\n   Score de compatibilité : 92/100\n   Montant potentiel : jusqu'à $300M\n   Conditions : taux concessionnel 0.75%\n   Délai d'approbation : 12-18 mois\n\n🌍 **Banque Africaine de Développement**\n   Score de compatibilité : 88/100\n   Montant potentiel : jusqu'à $200M\n   Conditions : taux 1.5% sur 25 ans\n   Délai : 8-12 mois\n\n💚 **Fonds Vert pour le Climat**\n   Score de compatibilité : 85/100\n   Montant potentiel : jusqu'à $100M (subvention)\n   Conditions : composante verte requise\n   Délai : 18-24 mois\n\n🇧🇪 **Union Européenne — NDICI**\n   Score de compatibilité : 78/100\n   Montant potentiel : jusqu'à $80M\n   Conditions : gouvernance + transparence\n   Délai : 12-18 mois\n\n🏭 **PPP Secteur Privé / Impact Funds**\n   Score de compatibilité : 71/100\n   Montant potentiel : jusqu'à $150M\n   Conditions : garantie État + retour minimal 8%\n   Délai : 6-9 mois\n\n**Stratégie recommandée :** Financement mixte BAD + BM + PPP\n**Probabilité globale d'obtention : 84%**`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Bailleurs couverts</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              {['Banque Mondiale / IDA', 'BAD / FAD', 'FMI', 'UE / NDICI', 'Fonds Vert Climat', 'China Exim Bank', 'USAID / MCC', 'Impact Funds', 'Fonds souverains', 'Capital privé'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
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
