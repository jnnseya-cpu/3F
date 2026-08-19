'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import { Map, AlertTriangle, Zap, Droplets, Navigation, Heart, BookOpen, Wifi, Leaf, Brain } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import { MOCK_INFRASTRUCTURE_NEEDS } from '@/lib/mockData';
import type { InfrastructureNeed } from '@/lib/types';

const CATEGORY_ICONS: Record<InfrastructureNeed['category'], React.FC<{className?: string}>> = {
  'Water': Droplets,
  'Electricity': Zap,
  'Roads': Navigation,
  'Healthcare': Heart,
  'Education': BookOpen,
  'Internet': Wifi,
  'Agriculture': Leaf,
};

const SEVERITY_CONFIG = {
  'Critical': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', label: 'Critique' },
  'High': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', label: 'Élevé' },
  'Medium': { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300', label: 'Moyen' },
  'Low': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', label: 'Faible' },
};

export default function InfrastructurePage() {
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'ai'>('list');
  const [severityFilter, setSeverityFilter] = useState<InfrastructureNeed['severity'] | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<InfrastructureNeed['category'] | 'all'>('all');

  const filtered = MOCK_INFRASTRUCTURE_NEEDS.filter(n => {
    const matchSev = severityFilter === 'all' || n.severity === severityFilter;
    const matchCat = categoryFilter === 'all' || n.category === categoryFilter;
    return matchSev && matchCat;
  });

  const criticalCount = MOCK_INFRASTRUCTURE_NEEDS.filter(n => n.severity === 'Critical').length;
  const totalAffected = MOCK_INFRASTRUCTURE_NEEDS.reduce((s, n) => s + n.populationAffected, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                <Map className="w-7 h-7 text-drc-yellow" /> Cartographie des Besoins en Infrastructure
              </h1>
              <p className="text-blue-200 text-sm mt-1">Identification et priorisation par l'Agent Infrastructure IA</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
                <p className="text-drc-yellow font-black text-xl">{criticalCount}</p>
                <p className="text-blue-200 text-xs">Besoins critiques</p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
                <p className="text-drc-yellow font-black text-xl">{(totalAffected / 1000000).toFixed(1)}M</p>
                <p className="text-blue-200 text-xs">Personnes affectées</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'list', label: 'Liste des Besoins', icon: AlertTriangle },
              { id: 'ai', label: 'Agent Infrastructure IA', icon: Brain },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-drc-blue text-drc-blue' : 'border-transparent text-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'list' && (
          <div>
            {/* Filters */}
            <div className="flex gap-4 flex-wrap mb-6">
              <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">Sévérité</p>
                <div className="flex gap-1">
                  {(['all', 'Critical', 'High', 'Medium', 'Low'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSeverityFilter(s)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        severityFilter === s ? 'bg-drc-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {s === 'all' ? 'Tous' : s === 'Critical' ? 'Critique' : s === 'High' ? 'Élevé' : s === 'Medium' ? 'Moyen' : 'Faible'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase">Catégorie</p>
                <div className="flex gap-1 flex-wrap">
                  {(['all', 'Water', 'Electricity', 'Roads', 'Healthcare', 'Education', 'Internet', 'Agriculture'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setCategoryFilter(c)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        categoryFilter === c ? 'bg-drc-blue text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {c === 'all' ? 'Tout' : c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Needs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map(need => {
                const Icon = CATEGORY_ICONS[need.category] || Map;
                const sevConfig = SEVERITY_CONFIG[need.severity];
                return (
                  <div key={need.id} className={`card border-l-4 ${sevConfig.border} hover:shadow-md transition-shadow`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${sevConfig.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${sevConfig.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sevConfig.bg} ${sevConfig.text}`}>
                              {sevConfig.label}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{need.category}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mt-1">{need.province}{need.territory ? ` — ${need.territory}` : ''}</h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{need.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 rounded-lg p-2 text-center">
                        <p className="font-black text-gray-900">{(need.populationAffected / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">Personnes affectées</p>
                      </div>
                      {need.estimatedCost && (
                        <div className="bg-gray-50 rounded-lg p-2 text-center">
                          <p className="font-black text-gray-900">${(need.estimatedCost / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-gray-500">Coût estimé</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                      <button className="text-xs text-drc-blue font-semibold hover:underline">
                        Créer une proposition politique →
                      </button>
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-16 text-gray-400">
                  <Map className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p>Aucun besoin trouvé pour ces filtres</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIAgentPanel
              agentName="Agent Infrastructure CDP-AI"
              agentDescription="Identification, priorisation et solutions pour les besoins d'infrastructure de la RDC"
              placeholderText="Ex: Quels sont les besoins critiques en eau potable? Priorisez les routes à construire en Équateur."
            />
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Résumé par Catégorie</h3>
              <div className="grid grid-cols-2 gap-3">
                {(['Water', 'Electricity', 'Roads', 'Healthcare', 'Education', 'Internet'] as const).map(cat => {
                  const Icon = CATEGORY_ICONS[cat];
                  const count = MOCK_INFRASTRUCTURE_NEEDS.filter(n => n.category === cat).length;
                  const hasCritical = MOCK_INFRASTRUCTURE_NEEDS.some(n => n.category === cat && n.severity === 'Critical');
                  return (
                    <div key={cat} className={`p-3 rounded-xl border ${hasCritical ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className={`w-4 h-4 ${hasCritical ? 'text-red-500' : 'text-drc-blue'}`} />
                        <span className="text-xs font-semibold text-gray-700">{cat}</span>
                      </div>
                      <p className={`text-2xl font-black ${hasCritical ? 'text-red-600' : 'text-gray-900'}`}>{count}</p>
                      <p className="text-xs text-gray-400">besoins identifiés</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
