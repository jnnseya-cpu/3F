'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import Link from 'next/link';
import {
  Shield, TrendingUp, Users, AlertTriangle, MapPin, Brain, DollarSign,
  ArrowRight, ChevronRight, BookOpen, Globe
} from 'lucide-react';
import DashboardStats from '@/components/DashboardStats';
import ContributionBadge from '@/components/ContributionBadge';
import ScoreBar from '@/components/ScoreBar';
import { DRC_PROVINCES, getTopProvincesByMembers } from '@/lib/provinces';
import { scoreMemberForCandidate } from '@/lib/scoring';
import type { Member } from '@/lib/types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Demo data
const DEMO_STATS = {
  totalMembers: 36870,
  membersInDRC: 32150,
  diasporaMembers: 4720,
  activeContributors: 27340,
  monthlyRevenue: 136700,
  electionReadiness: 61,
  integrityAlerts: 4,
  trainingCompletion: 67,
  provincesCovered: 26,
  infrastructureNeeds: 143,
};

const DEMO_MEMBER: Member = {
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
};

const DEMO_MEMBER_2: Member = {
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
};

const DEMO_MEMBER_3: Member = {
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
};

const TOP_CANDIDATES = [DEMO_MEMBER, DEMO_MEMBER_2, DEMO_MEMBER_3];

const MONTHLY_TREND = [
  { month: 'Jan', members: 18000, revenue: 67000 },
  { month: 'Fév', members: 21000, revenue: 79000 },
  { month: 'Mar', members: 24500, revenue: 91000 },
  { month: 'Avr', members: 27000, revenue: 103000 },
  { month: 'Mai', members: 31000, revenue: 118000 },
  { month: 'Jun', members: 36870, revenue: 136700 },
];

const TOP_5_PROVINCES = getTopProvincesByMembers(5);

const DIASPORA_DATA = [
  { name: 'Europe', value: 2140, color: '#006400' },
  { name: 'Afrique', value: 1230, color: '#008000' },
  { name: 'Amériques', value: 780, color: '#FCD116' },
  { name: 'Asie', value: 370, color: '#CE1126' },
  { name: 'Océanie', value: 200, color: '#004d00' },
];

const ROLE_GAPS = [
  { role: 'Secrétaire provincial', provinces: 8, filled: 18 },
  { role: 'Coordinateur territoire', provinces: 56, filled: 89 },
  { role: 'Officier femmes', provinces: 12, filled: 14 },
  { role: 'Officier jeunesse', provinces: 18, filled: 8 },
  { role: 'Officier données', provinces: 11, filled: 15 },
];

export default function FounderDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'provinces' | 'candidates' | 'finance'>('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      {/* Header */}
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-drc-yellow" />
                <span className="text-drc-yellow text-sm font-semibold">Le Congo D’Abord — Tableau de bord Présidentiel</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black">Bienvenue, Mr Justin Nseya</h1>
              <p className="text-blue-200 text-sm mt-1">Fondateur &amp; Président — Le Congo D'Abord</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-blue-200 text-xs">Rapport généré le</p>
              <p className="text-white font-bold">{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'provinces', label: 'Provinces' },
              { id: 'candidates', label: 'Candidats IA' },
              { id: 'finance', label: 'Finance' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-white text-drc-blue' : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <DashboardStats stats={DEMO_STATS} />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Growth Chart */}
              <div className="lg:col-span-2 card">
                <h3 className="font-bold text-gray-900 mb-1">Croissance des membres — 2025</h3>
                <p className="text-xs text-gray-500 mb-4">Évolution mensuelle des adhésions et recettes</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={MONTHLY_TREND}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val, name) => [
                      typeof val === 'number' ? val.toLocaleString() : val,
                      name === 'members' ? 'Membres' : 'Recettes ($)'
                    ]} />
                    <Line type="monotone" dataKey="members" stroke="#006400" strokeWidth={2.5} dot={{ fill: '#006400', r: 4 }} />
                    <Line type="monotone" dataKey="revenue" stroke="#FCD116" strokeWidth={2} dot={{ fill: '#FCD116', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Diaspora Pie */}
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-1">Diaspora mondiale</h3>
                <p className="text-xs text-gray-500 mb-4">Distribution par continent</p>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={DIASPORA_DATA} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {DIASPORA_DATA.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => [Number(val).toLocaleString(), 'Membres']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {DIASPORA_DATA.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-gray-600">{d.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{d.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leadership Gaps & Integrity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Leadership Gaps */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Lacunes de leadership</h3>
                  <Link href="/candidates" className="text-drc-blue text-xs font-semibold hover:underline flex items-center gap-1">
                    Voir candidats IA <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {ROLE_GAPS.map(gap => (
                    <div key={gap.role}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{gap.role}</span>
                        <span className="text-xs text-gray-500">{gap.filled}/{gap.filled + gap.provinces} comblés</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="h-2 bg-drc-blue rounded-full"
                          style={{ width: `${(gap.filled / (gap.filled + gap.provinces)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrity Alerts */}
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-gray-900">Alertes intégrité</h3>
                  <span className="ml-auto badge-grace">{DEMO_STATS.integrityAlerts} actives</span>
                </div>
                <div className="space-y-2">
                  {[
                    { type: 'Cotisation frauduleuse', province: 'Kasaï-Oriental', severity: 'Élevée' },
                    { type: 'Profil dupliqué', province: 'Kinshasa', severity: 'Moyenne' },
                    { type: 'Rapport non soumis', province: 'Nord-Kivu', severity: 'Faible' },
                    { type: 'Conduite inappropriée', province: 'Haut-Katanga', severity: 'Faible' },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{alert.type}</p>
                        <p className="text-xs text-gray-500">{alert.province}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        alert.severity === 'Élevée' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'Moyenne' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{alert.severity}</span>
                    </div>
                  ))}
                </div>
                <Link href="/ethics" className="mt-4 flex items-center gap-1 text-drc-blue text-xs font-semibold hover:underline">
                  Gérer les cas d&apos;éthique <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Provinces Tab */}
        {activeTab === 'provinces' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Membres par province (Top 5)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={TOP_5_PROVINCES.map(p => ({ name: p.name, membres: p.memberCount, cotisants: p.activeContributors }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(val) => [Number(val).toLocaleString(), '']} />
                  <Bar dataKey="membres" fill="#006400" name="Membres" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cotisants" fill="#FCD116" name="Cotisants actifs" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DRC_PROVINCES.map(province => (
                <div key={province.id} className="card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{province.name}</h4>
                      <p className="text-xs text-gray-500">{province.capital}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-drc-blue">{(province.memberCount || 0).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">membres</p>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Cotisants actifs</span>
                      <span className="font-semibold text-emerald-600">{(province.activeContributors || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 bg-emerald-500 rounded-full"
                        style={{ width: `${province.memberCount ? ((province.activeContributors || 0) / province.memberCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Préparation électorale</span>
                      <span className="font-semibold text-drc-blue">{province.electionReadiness || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 bg-drc-blue rounded-full"
                        style={{ width: `${province.electionReadiness || 0}%` }}
                      />
                    </div>
                  </div>
                  <Link href={`/dashboard/provincial?province=${province.id}`} className="mt-3 flex items-center gap-1 text-xs text-drc-blue font-semibold hover:underline">
                    Tableau provincial <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="card bg-blue-50 border-green-100">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-drc-blue mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-drc-blue-dark">Règle IA — Sélection des candidats</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    L&apos;IA propose uniquement 3 personnes par rôle. La décision finale appartient
                    aux organes du parti (comité local, provincial, direction nationale ou Président
                    selon la constitution du parti). Aucune cotisation = aucune éligibilité.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOP_CANDIDATES.map((member, i) => {
                const score = scoreMemberForCandidate(member);
                return (
                  <div key={member.id} className={`card ${i === 0 ? 'candidate-rank-1' : i === 1 ? 'candidate-rank-2' : 'candidate-rank-3'}`}>
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-xs font-bold text-gray-500">{i + 1}e proposition — Secrétaire Général National</span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-drc-blue flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-gray-500">{member.location.province}</p>
                        <ContributionBadge status={member.contributionStatus} />
                      </div>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <ScoreBar label="Expérience" score={score.workExperience} compact />
                      <ScoreBar label="Leadership" score={score.leadership} compact />
                      <ScoreBar label="Intégrité" score={score.integrityScore} compact />
                      <ScoreBar label="Formation" score={score.trainingCompletion} compact />
                    </div>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Score total IA</span>
                      <span className="text-xl font-black text-drc-blue">{score.total}/100</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link href="/candidates" className="btn-primary inline-flex items-center gap-2">
                Voir toutes les recommandations IA <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Finance Tab */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Recettes ce mois', value: `$${DEMO_STATS.monthlyRevenue.toLocaleString()}`, sub: 'USD collectés', color: 'text-emerald-600', icon: DollarSign },
                { label: 'Membres cotisants', value: DEMO_STATS.activeContributors.toLocaleString(), sub: 'sur 36,870 membres', color: 'text-drc-blue', icon: Users },
                { label: 'Taux de cotisation', value: `${Math.round((DEMO_STATS.activeContributors / DEMO_STATS.totalMembers) * 100)}%`, sub: 'membres à jour', color: 'text-blue-600', icon: TrendingUp },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="stat-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                      <p className="text-xs font-semibold text-gray-500 uppercase">{stat.label}</p>
                    </div>
                    <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.sub}</p>
                  </div>
                );
              })}
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Évolution des recettes mensuelles (2025)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={MONTHLY_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Recettes']} />
                  <Bar dataKey="revenue" fill="#006400" radius={[6, 6, 0, 0]} name="Recettes" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Transparence financière</h3>
                <span className="badge-active">Dashboard public actif</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Membres totaux', value: DEMO_STATS.totalMembers.toLocaleString() },
                  { label: 'Cotisants actifs', value: DEMO_STATS.activeContributors.toLocaleString() },
                  { label: 'Total collecté 2025', value: '$521,700' },
                  { label: 'Balance disponible', value: '$388,200' },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="text-lg font-black text-drc-blue">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 italic">
                Note : Les données financières personnelles des membres ne sont pas affichées publiquement.
                Ce tableau montre uniquement les agrégats du parti.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
