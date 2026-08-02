'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import { Brain, Filter, AlertCircle, CheckCircle, Users } from 'lucide-react';
import CandidateCard from '@/components/CandidateCard';
import { calculateCandidateScore } from '@/lib/scoring';
import type { Member } from '@/lib/types';
import AIAgentPanel from '@/components/AIAgentPanel';

const DEMO_CANDIDATES: Member[] = [
  {
    id: 'm001', firstName: 'Jean-Baptiste', lastName: 'Mutombo',
    dateOfBirth: '1980-03-15', gender: 'M', nationality: 'Congolaise',
    phone: '+243812345678', email: 'jb@example.com',
    location: { country: 'RD Congo', continent: 'Afrique', province: 'Haut-Katanga' },
    education: { level: 'Master', score: 88, field: 'Administration publique', institution: 'UNIKIN' },
    work: { currentEmployer: 'Gouvernement Provincial', jobTitle: 'Directeur adjoint', sector: 'Public', yearsExperience: 12, score: 91 },
    political: { languagesSpoken: ['fr', 'sw', 'ts'], hasIntegrityCase: false },
    role: 'Provincial Coordinator', contributionStatus: 'Active',
    memberSince: '2024-01-15', trainingCompletion: 85, integrityScore: 94,
    localCredibilityScore: 82, leadershipScore: 79,
  },
  {
    id: 'm002', firstName: 'Marie-Claire', lastName: 'Kalonga',
    dateOfBirth: '1978-07-22', gender: 'F', nationality: 'Congolaise',
    phone: '+243897654321', email: 'mc@example.com',
    location: { country: 'RD Congo', continent: 'Afrique', province: 'Nord-Kivu' },
    education: { level: 'Bachelor', score: 75, field: 'Économie', institution: 'UCB' },
    work: { currentEmployer: 'ONG Développement', jobTitle: 'Directrice', sector: 'ONG', yearsExperience: 15, score: 85 },
    political: { languagesSpoken: ['fr', 'sw', 'ln'], hasIntegrityCase: false },
    role: 'Provincial Coordinator', contributionStatus: 'Active',
    memberSince: '2024-02-10', trainingCompletion: 78, integrityScore: 96,
    localCredibilityScore: 88, leadershipScore: 85,
  },
  {
    id: 'm003', firstName: 'Patrick', lastName: 'Mbeki',
    dateOfBirth: '1985-11-08', gender: 'M', nationality: 'Congolaise',
    phone: '+243856789012', email: 'pm@example.com',
    location: { country: 'RD Congo', continent: 'Afrique', province: 'Kinshasa' },
    education: { level: 'Master', score: 92, field: 'Droit public', institution: 'UNIKIN' },
    work: { currentEmployer: 'Cabinet juridique', jobTitle: 'Avocat senior', sector: 'Juridique', yearsExperience: 10, score: 88 },
    political: { languagesSpoken: ['fr', 'ln', 'kg'], hasIntegrityCase: false },
    role: 'National Coordinator', contributionStatus: 'Active',
    memberSince: '2024-01-01', trainingCompletion: 92, integrityScore: 91,
    localCredibilityScore: 76, leadershipScore: 84,
  },
];

const ROLES = [
  { id: 'sg-national', label: 'Secrétaire Général National', level: 'National' },
  { id: 'tresorier-national', label: 'Trésorier National', level: 'National' },
  { id: 'directeur-politique', label: 'Directeur National des Politiques', level: 'National' },
  { id: 'pres-provincial-hk', label: 'Président Provincial — Haut-Katanga', level: 'Provincial' },
  { id: 'pres-provincial-nk', label: 'Président Provincial — Nord-Kivu', level: 'Provincial' },
  { id: 'pres-provincial-kin', label: 'Président Provincial — Kinshasa', level: 'Provincial' },
  { id: 'coord-infra-hk', label: 'Coordinateur Infrastructure — Haut-Katanga', level: 'Provincial' },
  { id: 'pres-commune', label: 'Président de Commune — Kalamu', level: 'Local' },
];

const JUSTIFICATIONS = [
  "Profil exceptionnel en administration publique avec 12 ans d'expérience gouvernementale. Fort ancrage local et excellente intégrité.",
  "Leadership prouvé dans le secteur ONG. Excellente crédibilité locale en Nord-Kivu et expertise en développement communautaire.",
  "Solide formation juridique et maîtrise du droit public congolais. Engagement fort envers les valeurs démocratiques.",
];

export default function CandidatesPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [showAIPanel, setShowAIPanel] = useState(false);

  const filteredRoles = filterLevel === 'all' ? ROLES : ROLES.filter(r => r.level === filterLevel);

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-drc-blue" />
                <span className="text-drc-blue text-sm font-semibold">Le Congo D’Abord — Agent de Sélection</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">Recommandations IA — Candidats</h1>
              <p className="text-gray-500 text-sm mt-1">
                Le système propose 3 personnes qualifiées pour chaque rôle. La décision finale appartient aux organes du parti.
              </p>
            </div>
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className="hidden md:flex btn-primary items-center gap-2 text-sm"
            >
              <Brain className="w-4 h-4" /> Consulter l&apos;Agent IA
            </button>
          </div>

          {/* Important Notice */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Règle fondamentale :</strong> L&apos;IA ne nomme personne. Elle propose uniquement.
              Aucun membre sans cotisation active ne figure dans les propositions.
              La révision humaine est obligatoire avant toute nomination officielle.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Role Selector */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-gray-500" />
                <h3 className="font-bold text-gray-900 text-sm">Sélectionner un rôle</h3>
              </div>

              {/* Level Filter */}
              <div className="flex flex-wrap gap-1 mb-3">
                {['all', 'National', 'Provincial', 'Local'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition-all ${
                      filterLevel === level ? 'bg-drc-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {level === 'all' ? 'Tous' : level}
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                {filteredRoles.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all ${
                      selectedRole.id === role.id
                        ? 'bg-drc-blue text-white font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <p className="font-medium leading-tight">{role.label}</p>
                    <p className={`text-xs mt-0.5 ${selectedRole.id === role.id ? 'text-blue-200' : 'text-gray-400'}`}>
                      Niveau {role.level}
                    </p>
                  </button>
                ))}
              </div>

              {/* Scoring Formula */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-bold text-gray-700 mb-2">Formule de scoring IA</p>
                {[
                  { label: 'Expérience', weight: 20 },
                  { label: 'Éducation', weight: 15 },
                  { label: 'Crédibilité locale', weight: 15 },
                  { label: 'Leadership', weight: 15 },
                  { label: 'Cotisation', weight: 10 },
                  { label: 'Formation', weight: 10 },
                  { label: 'Intégrité', weight: 10 },
                  { label: 'Langues', weight: 5 },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">{item.label}</span>
                    <span className="text-xs font-bold text-drc-blue">{item.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Candidates */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-drc-blue" />
              <h2 className="font-bold text-gray-900">
                Top 3 — <span className="text-drc-blue">{selectedRole.label}</span>
              </h2>
              <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
                <CheckCircle className="w-3 h-3 text-green-500" />
                Généré par Le Congo D’Abord
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DEMO_CANDIDATES.map((member, i) => {
                const score = calculateCandidateScore(
                  member.education.score,
                  member.work.score,
                  member.localCredibilityScore,
                  member.leadershipScore,
                  100,
                  member.trainingCompletion,
                  member.integrityScore,
                  Math.min(100, (member.political.languagesSpoken.length / 5) * 100),
                );
                return (
                  <CandidateCard
                    key={member.id}
                    member={member}
                    scores={score}
                    rank={(i + 1) as 1 | 2 | 3}
                    justification={JUSTIFICATIONS[i]}
                    riskFlags={i === 1 ? ['Expérience gouvernementale limitée à vérifier'] : []}
                    roleName={selectedRole.label}
                  />
                );
              })}
            </div>

            {/* AI Panel */}
            {showAIPanel && (
              <div className="mt-6">
                <AIAgentPanel
                  agentName="Agent de Sélection des Candidats"
                  agentDescription="Analyse les profils et propose les 3 meilleurs candidats pour chaque rôle"
                  placeholderText="Ex: Qui sont les meilleurs candidats pour le poste de gouverneur provincial de Kinshasa ?"
                />
              </div>
            )}

            {/* Mobile AI Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" /> {showAIPanel ? 'Masquer l\'Agent IA' : 'Consulter l\'Agent IA'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
