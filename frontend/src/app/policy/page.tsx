'use client';

import { useState } from 'react';
import { Brain, FileText, Zap, BookOpen } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import PreLaunchState from '@/components/PreLaunchState';

const CATEGORIES = ['Tous', 'Énergie', 'Technologie', 'Agriculture', 'Santé', 'Éducation', 'Sécurité', 'Économie'];

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'generate' | 'ai'>('proposals');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
            <FileText className="w-7 h-7 text-drc-yellow" /> Intelligence Politique CDP-AI
          </h1>
          <p className="text-blue-200 text-sm mt-1">Propositions et analyses de politiques publiques générées par IA</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'proposals', label: 'Propositions', icon: FileText },
              { id: 'generate', label: 'Générer une Politique', icon: Zap },
              { id: 'ai', label: 'Agent Politique IA', icon: Brain },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id ? 'border-drc-blue text-drc-blue' : 'border-transparent text-gray-600 hover:text-gray-900'
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
        {activeTab === 'proposals' && (
          <PreLaunchState
            title="Propositions de politiques — à venir"
            message="Les propositions de politiques publiques adoptées par le parti seront publiées ici. En attendant, utilisez l'onglet « Générer une Politique » ou l'Agent Politique IA pour produire une analyse."
          />
        )}

        {activeTab === 'generate' && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-drc-yellow" /> Générer une Proposition de Politique
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Décrivez un défi ou une opportunité et l'IA générera une proposition de politique publique adaptée au contexte congolais.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Domaine politique</label>
                  <select className="form-select">
                    <option>Sélectionner...</option>
                    {CATEGORIES.filter(c => c !== 'Tous').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Province ou territoire ciblé</label>
                  <input className="form-input" placeholder="Ex: Nord-Kivu, ou national" />
                </div>
                <div>
                  <label className="form-label">Défi ou problème à résoudre</label>
                  <textarea className="form-input" rows={4} placeholder="Ex: Manque d'accès à l'électricité dans les zones rurales du Kasaï-Central affectant 500 000 personnes..." />
                </div>
                <div>
                  <label className="form-label">Budget disponible estimé</label>
                  <input className="form-input" placeholder="Ex: $2,000,000 USD" />
                </div>
                <button className="btn-primary w-full flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5" /> Générer la proposition IA
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIAgentPanel
              agentName="Agent Intelligence Politique CDP-AI"
              agentDescription="Analyse de politiques, comparaisons, recommandations basées sur données DRC"
              placeholderText="Ex: Proposez une politique de développement rural pour le Kwilu. Analysez la situation minière au Haut-Katanga."
            />
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Capacités de l'Agent Politique</h3>
              <div className="space-y-2">
                {[
                  'Analyse de politiques publiques existantes',
                  'Génération de propositions basées sur les données locales',
                  'Comparaison de meilleures pratiques africaines',
                  'Estimation d\'impact et de coûts',
                  'Identification des parties prenantes clés',
                  'Analyse des risques d\'implémentation',
                  'Traduction en 5 langues congolaises',
                  'Alignement avec les Objectifs de Développement Durable',
                ].map((cap, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <BookOpen className="w-4 h-4 text-drc-blue shrink-0" />
                    {cap}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
