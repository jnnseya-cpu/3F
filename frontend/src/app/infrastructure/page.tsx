'use client';

import { useState } from 'react';
import { Map, AlertTriangle, Zap, Droplets, Navigation, Heart, BookOpen, Wifi, Leaf, Brain } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import PreLaunchState from '@/components/PreLaunchState';
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

  return (
    <div className="min-h-screen bg-gray-50">
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
          <PreLaunchState
            title="Besoins d'infrastructure — à signaler"
            message="Les besoins signalés par les membres (routes, eau, écoles, santé…) apparaîtront ici, classés par gravité, une fois les inscriptions ouvertes. Utilisez l'Agent Infrastructure IA pour une analyse immédiate."
          />
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
                  return (
                    <div key={cat} className="p-3 rounded-xl border border-gray-100 bg-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-drc-blue" />
                        <span className="text-xs font-semibold text-gray-700">{cat}</span>
                      </div>
                      <p className="text-xs text-gray-400">Analysé par l'agent IA</p>
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
