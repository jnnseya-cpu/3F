'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, MapPin, TrendingUp, Shield, BookOpen, Star, Brain, AlertTriangle } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import ProvinceMap from '@/components/ProvinceMap';
import { DRC_PROVINCES } from '@/lib/provinces';
import type { Province } from '@/lib/types';

export default function ProvincialDashboardPage() {
  const [selectedProvince, setSelectedProvince] = useState<Province>(DRC_PROVINCES[0]);


  return (
    <div className="min-h-screen bg-gray-50">
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

              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-white">{selectedProvince.territories.length}</p>
                  <p className="text-blue-200 text-xs">Territoires</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black text-drc-yellow">2027</p>
                  <p className="text-blue-200 text-xs">Ouverture des inscriptions</p>
                </div>
              </div>
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
                <p className="text-sm text-gray-500 leading-relaxed py-2">
                  La liste des membres de {selectedProvince.name} s&apos;affichera ici dès
                  l&apos;ouverture des inscriptions. Aucune donnée n&apos;est inventée avant.
                </p>
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
