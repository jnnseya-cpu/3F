'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import Link from 'next/link';
import { Users, MapPin, CheckCircle, BookOpen, DollarSign, Brain, Plus, AlertCircle } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import { MOCK_MEMBERS } from '@/lib/mockData';
import ContributionBadge from '@/components/ContributionBadge';

const LOCAL_INFO = {
  name: 'Commune de Gombe',
  territory: 'Lukunga',
  province: 'Kinshasa',
  cellLeader: 'Coordinateur Local',
  memberCount: 127,
  activeContributors: 98,
  monthlyRevenue: 490,
};

export default function LocalDashboardPage() {
  const [activeTab, setActiveTab] = useState<'members' | 'activity' | 'needs' | 'ai'>('members');

  const localMembers = MOCK_MEMBERS.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link href="/dashboard" className="text-blue-200 text-sm hover:text-white">← National</Link>
            <span className="text-blue-300">/</span>
            <Link href="/dashboard/provincial" className="text-blue-200 text-sm hover:text-white">Provincial</Link>
            <span className="text-blue-300">/</span>
            <span className="text-blue-200 text-sm">Local</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <MapPin className="w-7 h-7 text-drc-yellow" /> Cellule Locale — {LOCAL_INFO.name}
          </h1>
          <p className="text-blue-200 text-sm mt-1">{LOCAL_INFO.territory} · {LOCAL_INFO.province} · Vue Chef de Cellule</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Local Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="stat-card border-l-4 border-drc-blue">
            <Users className="w-5 h-5 text-drc-blue" />
            <p className="text-3xl font-black text-drc-blue">{LOCAL_INFO.memberCount}</p>
            <p className="text-xs text-gray-400">Membres locaux</p>
          </div>
          <div className="stat-card border-l-4 border-green-500">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-3xl font-black text-green-600">{LOCAL_INFO.activeContributors}</p>
            <p className="text-xs text-gray-400">Cotisants actifs</p>
          </div>
          <div className="stat-card border-l-4 border-yellow-500">
            <DollarSign className="w-5 h-5 text-yellow-600" />
            <p className="text-3xl font-black text-yellow-600">${LOCAL_INFO.monthlyRevenue}</p>
            <p className="text-xs text-gray-400">Revenus/mois</p>
          </div>
          <div className="stat-card border-l-4 border-purple-500">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <p className="text-3xl font-black text-purple-600">77%</p>
            <p className="text-xs text-gray-400">Taux cotisation</p>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            {[
              { id: 'members', label: 'Membres', icon: Users },
              { id: 'activity', label: 'Activités', icon: CheckCircle },
              { id: 'needs', label: 'Besoins locaux', icon: AlertCircle },
              { id: 'ai', label: 'Agent IA', icon: Brain },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-drc-blue text-drc-blue bg-blue-50' : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'members' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Membres de la Cellule</h2>
              <Link href="/register" className="btn-primary text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Inscrire un membre
              </Link>
            </div>
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Membre</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Rôle</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase">Cotisation</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Formation</th>
                  </tr>
                </thead>
                <tbody>
                  {localMembers.map(member => (
                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-drc-blue text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{member.firstName} {member.lastName}</p>
                            <p className="text-xs text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden sm:table-cell text-xs">{member.role}</td>
                      <td className="py-3 px-4">
                        <ContributionBadge status={member.contributionStatus} size="sm" />
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2 w-16">
                            <div className="h-2 rounded-full bg-drc-blue" style={{ width: `${member.trainingCompletion}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{member.trainingCompletion}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Activités Récentes de la Cellule</h2>
            <div className="space-y-3">
              {[
                { type: 'Réunion', desc: 'Réunion mensuelle de la cellule Gombe', date: '2024-11-10', participants: 45 },
                { type: 'Formation', desc: 'Session "Fondamentaux Démocratiques" en ligne', date: '2024-11-05', participants: 32 },
                { type: 'Inscription', desc: '12 nouveaux membres inscrits ce mois', date: '2024-11-01', participants: 12 },
                { type: 'Cotisation', desc: 'Collecte mensuelle — 98 paiements confirmés', date: '2024-10-31', participants: 98 },
                { type: 'Événement', desc: 'Journée de sensibilisation au marché de Gombe', date: '2024-10-22', participants: 200 },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                    activity.type === 'Réunion' ? 'bg-blue-500' :
                    activity.type === 'Formation' ? 'bg-purple-500' :
                    activity.type === 'Inscription' ? 'bg-drc-blue' :
                    activity.type === 'Cotisation' ? 'bg-yellow-500' : 'bg-pink-500'
                  }`}>
                    {activity.type[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{activity.type}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-drc-blue">{activity.participants} pers.</p>
                    <p className="text-xs text-gray-400">{new Date(activity.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'needs' && (
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Besoins Locaux Identifiés</h2>
            <p className="text-gray-500 text-sm mb-4">
              Signalez les besoins de votre communauté. Ces données alimentent l'Agent Infrastructure IA national.
            </p>
            <div className="space-y-3 mb-6">
              {[
                { need: 'Éclairage public défaillant — Quartier Résidentiel B', priority: 'Élevé', votes: 34 },
                { need: 'Réfection de la route menant au marché central', priority: 'Critique', votes: 67 },
                { need: 'Point d\'eau potable pour les ménages sans raccordement', priority: 'Critique', votes: 89 },
                { need: 'Centre de santé communautaire débordé — besoin d\'extension', priority: 'Élevé', votes: 45 },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className={`px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${
                    item.priority === 'Critique' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {item.priority}
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{item.need}</p>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-drc-blue">{item.votes}</p>
                    <p className="text-xs text-gray-400">voix</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn-primary text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> Signaler un besoin local
            </button>
          </div>
        )}

        {activeTab === 'ai' && (
          <AIAgentPanel
            agentName="Agent Local CDP-AI"
            agentDescription={`Assistant pour la cellule de ${LOCAL_INFO.name}`}
            placeholderText="Ex: Comment améliorer le taux de cotisation? Quels membres nécessitent un suivi?"
          />
        )}
      </div>
    </div>
  );
}
