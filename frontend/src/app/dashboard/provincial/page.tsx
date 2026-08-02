'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import Link from 'next/link';
import { Users, MapPin, TrendingUp, Shield, BookOpen, Star, Brain, AlertTriangle } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import ProvinceMap from '@/components/ProvinceMap';
import { DRC_PROVINCES } from '@/lib/provinces';
import { MOCK_MEMBERS } from '@/lib/mockData';
import type { Province } from '@/lib/types';

export default function ProvincialDashboardPage() {
  const [selectedProvince, setSelectedProvince] = useState<Province>(DRC_PROVINCES[0]);

  const provinceMembers = MOCK_MEMBERS.filter(m => m.location.province === selectedProvince.name);

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Link href="/dashboard" className="text-blue-200 text-sm hover:text-white transition-colors">← Tableau national</Link>
            <span className="text-blue-300">/</span>
            <span className="text-blue-200 text-sm">Provincial</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <MapPin className="w-7 h-7 text-drc-yellow" /> Tableau de Bord Provincial
          </h1>
          <p className="text-blue-200 text-sm mt-1">Vue Coordinateur Provincial</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Province Selector */}
          <div className="lg:col-span-1 card">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">Sélectionner la Province</h3>
            <ProvinceMap
              selectedProvince={selectedProvince.id}
              onSelectProvince={setSelectedProvince}
              compact={true}
            />
          </div>

          {/* Province Details */}
          <div className="lg:col-span-3 space-y-5">
            {/* Province Header */}
            <div className="card bg-gradient-to-br from-drc-blue to-drc-blue-dark text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black">{selectedProvince.name}</h2>
                  <p className="text-blue-200">Chef-lieu: {selectedProvince.capital}</p>
                </div>
                <div className="text-right">
                  <p className="text-drc-yellow font-black text-3xl">{selectedProvince.electionReadiness || 0}%</p>
                  <p className="text-blue-200 text-xs">Préparation électorale</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-drc-yellow">{(selectedProvince.memberCount || 0).toLocaleString()}</p>
                  <p className="text-blue-200 text-xs">Membres</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-blue-300">{(selectedProvince.activeContributors || 0).toLocaleString()}</p>
                  <p className="text-blue-200 text-xs">Cotisants actifs</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-white">{selectedProvince.territories.length}</p>
                  <p className="text-blue-200 text-xs">Territoires</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Revenu mensuel', value: `$${((selectedProvince.activeContributors || 0) * 5).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600' },
                { label: 'Taux de cotisation', value: `${selectedProvince.memberCount ? Math.round(((selectedProvince.activeContributors || 0) / selectedProvince.memberCount) * 100) : 0}%`, icon: Shield, color: 'text-blue-600' },
                { label: 'Cellules locales', value: (selectedProvince.territories.length * 3).toString(), icon: MapPin, color: 'text-purple-600' },
                { label: 'Candidats qualifiés', value: Math.floor((selectedProvince.memberCount || 0) * 0.03).toString(), icon: Star, color: 'text-yellow-600' },
              ].map(stat => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="stat-card">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Territories */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-drc-blue" /> Territoires — {selectedProvince.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProvince.territories.map(territory => (
                  <div key={territory.id} className="p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-drc-blue transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm text-gray-900">{territory.name}</p>
                      <Link href="/dashboard/local" className="text-xs text-drc-blue hover:underline">Voir →</Link>
                    </div>
                    <p className="text-xs text-gray-500">{territory.communes.length} communes</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {territory.communes.slice(0, 3).map(commune => (
                        <span key={commune} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                          {commune}
                        </span>
                      ))}
                      {territory.communes.length > 3 && (
                        <span className="text-xs text-gray-400">+{territory.communes.length - 3}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Members + AI Agent */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-drc-blue" /> Membres de la Province
                </h3>
                {provinceMembers.length > 0 ? (
                  <div className="space-y-2">
                    {provinceMembers.slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-drc-blue text-white flex items-center justify-center text-xs font-bold">
                          {m.firstName[0]}{m.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{m.firstName} {m.lastName}</p>
                          <p className="text-xs text-gray-400">{m.role}</p>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${m.contributionStatus === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Aucun membre local dans la démo</p>
                )}
              </div>

              <AIAgentPanel
                agentName={`Agent ${selectedProvince.name} CDP-AI`}
                agentDescription={`Analyse et recommandations pour la province de ${selectedProvince.name}`}
                placeholderText={`Ex: Quels sont les besoins prioritaires de ${selectedProvince.name}?`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
