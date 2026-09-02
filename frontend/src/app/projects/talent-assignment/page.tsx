'use client';

import Link from 'next/link';
import { ChevronRight, Users } from 'lucide-react';
import NTOSAgentPanel from '@/components/NTOSAgentPanel';

export default function TalentAssignmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hero-gradient text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-rose-200 text-sm mb-3">
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Affectation des Talents</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Affectation des Talents IA</h1>
              <p className="text-rose-200 text-sm">Trouve le meilleur membre du parti pour chaque poste de leadership de projet.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NTOSAgentPanel
            agentId="talent-assignment"
            agentName="Affectation des Talents IA"
            agentSubtitle="Membres → Postes de leadership"
            agentDescription="J'identifie le meilleur profil du parti pour diriger chaque projet en analysant éducation, expérience sectorielle, province d'origine et performance passée."
            inputLabel="Décrivez le projet et le poste de leadership à pourvoir :"
            placeholder="Ex : Responsable du Programme Solar Katanga — profil ingénieur énergie requis..."
            examplePrompts={[
              'Responsable Programme Solar Katanga',
              'Directeur Éducation Nord-Kivu',
              'Coordinateur Santé Kasaï',
              'Chef de projet Infrastructure Kinshasa',
            ]}
            demoResponse={(q) => `**Affectation de Talent — ${q}**\n\n**Profil recherché :**\n• Secteur : Énergie / Ingénierie\n• Province : Katanga ou connaissance approfondie\n• Expérience : 10+ ans en gestion de projets\n• Niveau : Cadre supérieur ou dirigeant\n\n━━━━━━━━━━━━━━━━━━━━━\n**CANDIDAT RECOMMANDÉ N°1**\n━━━━━━━━━━━━━━━━━━━━━\n👤 Ingénieur Senior — Haut-Katanga\nScore global : 89/100\n\n• Éducation : Master Génie Électrique (UNIKIN) — 92/100\n• Expérience : 15 ans énergie (SNEL + projets BAD) — 95/100\n• Crédibilité locale : Katanga natif, réseaux solides — 88/100\n• Leadership : Ancien DG adjoint SNEL — 90/100\n• Cotisation : Active ✓ | Formation : 95% ✓\n\n✅ **Recommandation forte** : Profil idéal pour ce projet\n\n━━━━━━━━━━━━━━━━━━━━━\n**CANDIDAT RECOMMANDÉ N°2**\n━━━━━━━━━━━━━━━━━━━━━\n👤 Consultante Énergie Renouvelable — Kinshasa\nScore global : 82/100\n\n• Expérience : 12 ans projets solaires Africa — 88/100\n• Formation spécialisée : Solar PV + stockage — 90/100\n• Limitation : Non native Katanga — mitigable\n\n**Rôle suggéré :** Directrice Technique (N°1 = Directeur)\n\n━━━━━━━━━━━━━━━━━━━━━\n**ÉQUIPE RECOMMANDÉE**\n━━━━━━━━━━━━━━━━━━━━━\n• Responsable Principal : Candidat N°1\n• Directrice Technique : Candidate N°2\n• Conseiller Communautaire : Profil local Katanga\n• Gestionnaire Financier : Profil comptabilité publique`}
          />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Critères d&apos;affectation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {['Éducation sectorielle', 'Expérience professionnelle', 'Province d\'origine', 'Expertise industrielle', 'Performance passée', 'Cotisation à jour', 'Intégrité vérifiée'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
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
