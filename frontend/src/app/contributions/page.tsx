'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import { DollarSign, CheckCircle, Clock, XCircle, TrendingUp, Users, AlertTriangle, Download } from 'lucide-react';
import ContributionBadge from '@/components/ContributionBadge';
import type { ContributionStatus } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const MONTHLY_DATA = [
  { month: 'Jan', collected: 67000, target: 90000 },
  { month: 'Fév', collected: 79000, target: 95000 },
  { month: 'Mar', collected: 91000, target: 100000 },
  { month: 'Avr', collected: 103000, target: 105000 },
  { month: 'Mai', collected: 118000, target: 115000 },
  { month: 'Jun', collected: 136700, target: 120000 },
];

const STATUS_BREAKDOWN = [
  { name: 'Actif', value: 27340, color: '#006400', status: 'Active' as ContributionStatus },
  { name: 'Période de grâce', value: 4210, color: '#FCD116', status: 'Grace Period' as ContributionStatus },
  { name: 'Suspendu', value: 3120, color: '#CE1126', status: 'Suspended' as ContributionStatus },
  { name: 'Inéligible', value: 1890, color: '#6b7280', status: 'Ineligible' as ContributionStatus },
  { name: 'Exempté', value: 310, color: '#3b82f6', status: 'Exempted' as ContributionStatus },
];

const PROVINCE_BREAKDOWN = [
  { name: 'Kinshasa', members: 4250, active: 3180, revenue: 15900 },
  { name: 'Haut-Katanga', members: 2380, active: 1750, revenue: 8750 },
  { name: 'Nord-Kivu', members: 2140, active: 1550, revenue: 7750 },
  { name: 'Kasaï-Oriental', members: 1280, active: 950, revenue: 4750 },
  { name: 'Kongo Central', members: 1850, active: 1340, revenue: 6700 },
  { name: 'Kwilu', members: 1680, active: 1230, revenue: 6150 },
];

const MEMBER_CONTRIBUTIONS = [
  { name: 'Marie-Claire Kalonga', province: 'Nord-Kivu', status: 'Active' as ContributionStatus, lastPayment: '2025-06-01', months: 18 },
  { name: 'Jean-Baptiste Mutombo', province: 'Haut-Katanga', status: 'Active' as ContributionStatus, lastPayment: '2025-06-01', months: 17 },
  { name: 'Patrick Mbeki', province: 'Kinshasa', status: 'Active' as ContributionStatus, lastPayment: '2025-06-02', months: 18 },
  { name: 'Amina Kabila', province: 'Maniema', status: 'Grace Period' as ContributionStatus, lastPayment: '2025-04-15', months: 14 },
  { name: 'Didier Tshibanda', province: 'Kasaï-Central', status: 'Suspended' as ContributionStatus, lastPayment: '2025-02-01', months: 8 },
  { name: 'Félicité Muamba', province: 'Kwilu', status: 'Active' as ContributionStatus, lastPayment: '2025-06-01', months: 18 },
];

const EXPENSE_BREAKDOWN = [
  { category: 'Opérations du parti', amount: 45000, percentage: 35 },
  { category: 'Formation des membres', amount: 32200, percentage: 25 },
  { category: 'Communication & médias', amount: 19300, percentage: 15 },
  { category: 'Infrastructure IT (Le Congo D’Abord)', amount: 25600, percentage: 20 },
  { category: 'Réserves & fonds d\'urgence', amount: 6450, percentage: 5 },
];

export default function ContributionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'provinces' | 'transparency'>('overview');

  const totalRevenue = MONTHLY_DATA.reduce((sum, m) => sum + m.collected, 0);
  const totalMembers = STATUS_BREAKDOWN.reduce((sum, s) => sum + s.value, 0);
  const activeCount = STATUS_BREAKDOWN.find(s => s.status === 'Active')?.value || 0;

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
                <DollarSign className="w-5 h-5 text-drc-blue" />
                <span className="text-drc-blue text-sm font-semibold">Le Congo D’Abord — Agent Financier</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900">Gestion des Cotisations</h1>
              <p className="text-gray-500 text-sm mt-1">
                Cotisation mensuelle : <strong className="text-drc-blue">1 USD / membre / mois</strong>
              </p>
            </div>
            <button className="hidden md:flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
              <Download className="w-4 h-4" /> Exporter rapport
            </button>
          </div>

          {/* Alert */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="text-sm text-blue-800">
              <strong>Règle absolue :</strong> Aucune contribution = aucune éligibilité à la sélection, au leadership ou aux candidatures.
              Les données financières personnelles ne sont jamais affichées publiquement.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5">
            {[
              { id: 'overview', label: 'Vue d\'ensemble' },
              { id: 'members', label: 'Membres' },
              { id: 'provinces', label: 'Provinces' },
              { id: 'transparency', label: 'Transparence' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab.id ? 'bg-drc-blue text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Membres totaux', value: totalMembers.toLocaleString(), sub: 'inscrits', icon: Users, color: 'text-drc-blue' },
                { label: 'Cotisants actifs', value: activeCount.toLocaleString(), sub: `${Math.round(activeCount / totalMembers * 100)}% des membres`, icon: CheckCircle, color: 'text-emerald-600' },
                { label: 'Recettes juin 2025', value: '$136,700', sub: 'USD collectés', icon: DollarSign, color: 'text-yellow-700' },
                { label: 'Total 2025', value: `$${(totalRevenue / 1000).toFixed(0)}k`, sub: 'cumulé 2025', icon: TrendingUp, color: 'text-blue-600' },
              ].map(card => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="stat-card">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-gray-500 uppercase">{card.label}</p>
                      <Icon className={`w-4 h-4 ${card.color}`} />
                    </div>
                    <p className={`text-2xl font-black ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-gray-400">{card.sub}</p>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 card">
                <h3 className="font-bold text-gray-900 mb-1">Recettes mensuelles 2025</h3>
                <p className="text-xs text-gray-500 mb-4">Collecté vs objectif (USD)</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={MONTHLY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => [`$${Number(v).toLocaleString()}`, '']} />
                    <Bar dataKey="collected" fill="#006400" name="Collecté" radius={[4,4,0,0]} />
                    <Bar dataKey="target" fill="#e5e7eb" name="Objectif" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-900 mb-1">Statut des membres</h3>
                <p className="text-xs text-gray-500 mb-4">Distribution par statut</p>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={STATUS_BREAKDOWN} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                      {STATUS_BREAKDOWN.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => [Number(v).toLocaleString(), 'Membres']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {STATUS_BREAKDOWN.map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                        <ContributionBadge status={item.status} showIcon={false} />
                      </div>
                      <span className="font-bold">{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Statut des contributions par membre</h3>
              <span className="text-xs text-gray-500">Données anonymisées pour la démo</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Membre', 'Province', 'Statut', 'Dernier paiement', 'Mois actifs', 'Total payé'].map(h => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MEMBER_CONTRIBUTIONS.map((m, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{m.name}</td>
                      <td className="py-3 px-3 text-gray-600">{m.province}</td>
                      <td className="py-3 px-3"><ContributionBadge status={m.status} /></td>
                      <td className="py-3 px-3 text-gray-600">{m.lastPayment}</td>
                      <td className="py-3 px-3 text-gray-600">{m.months}</td>
                      <td className="py-3 px-3 font-semibold text-drc-blue">${(m.months * 5).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 italic">
                Note : Les données personnelles financières des membres sont strictement confidentielles.
                Ce tableau est accessible uniquement aux officiers autorisés du parti.
              </p>
            </div>
          </div>
        )}

        {/* Provinces Tab */}
        {activeTab === 'provinces' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROVINCE_BREAKDOWN.map(prov => (
                <div key={prov.name} className="card">
                  <h4 className="font-bold text-gray-900 mb-3">{prov.name}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Membres totaux</span>
                      <span className="font-bold">{prov.members.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cotisants actifs</span>
                      <span className="font-bold text-drc-blue">{prov.active.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Recettes mensuelles</span>
                      <span className="font-bold text-yellow-700">${prov.revenue.toLocaleString()}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">Taux de cotisation</span>
                        <span className="font-semibold">{Math.round(prov.active / prov.members * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 bg-drc-blue rounded-full" style={{ width: `${prov.active / prov.members * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transparency Tab */}
        {activeTab === 'transparency' && (
          <div className="space-y-6">
            <div className="card bg-blue-50 border-green-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-drc-blue mt-0.5" />
                <div>
                  <h3 className="font-bold text-drc-blue-dark">Tableau de bord de transparence financière</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Le Congo D’Abord s&apos;engage à une totale transparence sur les finances du parti.
                    Ce tableau est accessible au public. Les données financières individuelles restent strictement privées.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Recettes 2025 (cumul)</h3>
                {[
                  { label: 'Total collecté', value: `$${(totalRevenue / 1000).toFixed(0)}k USD` },
                  { label: 'Membres cotisants actifs', value: activeCount.toLocaleString() },
                  { label: 'Balance disponible', value: '$388,200 USD' },
                  { label: 'Réserves d\'urgence', value: '$32,250 USD' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-gray-100 last:border-0">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className="font-bold text-drc-blue">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 className="font-bold text-gray-900 mb-4">Utilisation des fonds</h3>
                <div className="space-y-3">
                  {EXPENSE_BREAKDOWN.map(exp => (
                    <div key={exp.category}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">{exp.category}</span>
                        <span className="font-bold text-gray-900">${exp.amount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="h-2 bg-drc-blue rounded-full" style={{ width: `${exp.percentage}%` }} />
                      </div>
                      <p className="text-xs text-gray-400 text-right">{exp.percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card border-orange-200 bg-orange-50">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-orange-800">Alertes de conformité</h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-700">
                    <li>• Plafond de donation individuelle : 500 USD / mois (aucune violation détectée)</li>
                    <li>• Paiements suspects détectés : 0 ce mois</li>
                    <li>• Rapport d&apos;audit : Disponible pour examen du comité (Q1 2025 complété)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
