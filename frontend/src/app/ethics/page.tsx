'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, Brain, Users } from 'lucide-react';
import AIAgentPanel from '@/components/AIAgentPanel';
import { MOCK_ETHICS_CASES } from '@/lib/mockData';
import type { EthicsCase } from '@/lib/types';

const STATUS_CONFIG: Record<EthicsCase['status'], { bg: string; text: string; label: string; icon: React.FC<{className?: string}> }> = {
  'Open': { bg: 'bg-red-100', text: 'text-red-700', label: 'Ouvert', icon: AlertTriangle },
  'Under Investigation': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'En cours', icon: Clock },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-700', label: 'Résolu', icon: CheckCircle },
  'Dismissed': { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Classé', icon: Shield },
};

const TYPE_LABELS: Record<EthicsCase['type'], string> = {
  'Corruption': 'Corruption',
  'Misconduct': 'Mauvaise conduite',
  'Fraud': 'Fraude',
  'Violence': 'Violence',
  'Hate Speech': 'Discours haineux',
  'Other': 'Autre',
};

export default function EthicsPage() {
  const [activeTab, setActiveTab] = useState<'cases' | 'report' | 'charter' | 'ai'>('cases');
  const [showReportForm, setShowReportForm] = useState(false);

  const openCases = MOCK_ETHICS_CASES.filter(c => c.status === 'Open' || c.status === 'Under Investigation').length;
  const resolvedCases = MOCK_ETHICS_CASES.filter(c => c.status === 'Resolved').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      <div className="bg-drc-blue text-white">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black flex items-center gap-2">
                <Shield className="w-7 h-7 text-drc-yellow" /> Commission Éthique et Discipline
              </h1>
              <p className="text-blue-200 text-sm mt-1">Intégrité, transparence et responsabilité partisane</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
                <p className="text-drc-yellow font-black text-xl">{openCases}</p>
                <p className="text-blue-200 text-xs">Cas actifs</p>
              </div>
              <div className="bg-white/10 rounded-lg px-4 py-2 text-center">
                <p className="text-blue-300 font-black text-xl">{resolvedCases}</p>
                <p className="text-blue-200 text-xs">Résolus</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'cases', label: 'Dossiers', icon: FileText },
              { id: 'report', label: 'Signaler', icon: AlertTriangle },
              { id: 'charter', label: 'Charte Éthique', icon: Shield },
              { id: 'ai', label: 'Agent Éthique IA', icon: Brain },
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
        {activeTab === 'cases' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Dossiers Éthiques Actifs</h2>
              <button
                onClick={() => setActiveTab('report')}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" /> Signaler un cas
              </button>
            </div>

            <div className="space-y-4">
              {MOCK_ETHICS_CASES.map(c => {
                const statusConf = STATUS_CONFIG[c.status];
                const StatusIcon = statusConf.icon;
                return (
                  <div key={c.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${statusConf.bg} flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`w-5 h-5 ${statusConf.text}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusConf.bg} ${statusConf.text}`}>
                              {statusConf.label}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                              {TYPE_LABELS[c.type]}
                            </span>
                            <span className="text-xs text-gray-400">
                              Signalé le {new Date(c.reportedAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">Dossier #{c.id.toUpperCase()}</p>
                        </div>
                      </div>
                      {c.impactOnScore !== 0 && (
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-drc-red">{c.impactOnScore} pts</p>
                          <p className="text-xs text-gray-400">Impact score</p>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mb-3">{c.description}</p>

                    {c.resolution && (
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs font-semibold text-green-700 mb-1">Résolution</p>
                        <p className="text-sm text-gray-700">{c.resolution}</p>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>Identité du membre protégée selon procédure</span>
                      </div>
                      {c.status !== 'Resolved' && c.status !== 'Dismissed' && (
                        <button className="text-drc-blue font-semibold hover:underline">
                          Voir détails →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="max-w-2xl mx-auto">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" /> Signaler un Cas d'Éthique
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Toutes les déclarations sont confidentielles. L'identité du déclarant est protégée par la Charte d'éthique CDP.
              </p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>Important :</strong> Les fausses déclarations sont sanctionnées par la même commission.
                  Ce formulaire est réservé aux faits avérés ou sérieusement soupçonnés.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="form-label">Type de violation</label>
                  <select className="form-select">
                    <option value="">Sélectionner...</option>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Province concernée</label>
                  <input className="form-input" placeholder="Ex: Nord-Kivu" />
                </div>
                <div>
                  <label className="form-label">Description des faits</label>
                  <textarea className="form-input" rows={5} placeholder="Décrivez les faits de manière précise et factuelle..." />
                </div>
                <div>
                  <label className="form-label">Date approximative des faits</label>
                  <input type="date" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Preuves disponibles (description)</label>
                  <textarea className="form-input" rows={2} placeholder="Ex: Témoins, documents, photos, vidéos..." />
                </div>
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <input type="checkbox" className="mt-0.5" aria-label="J'accepte la charte d'éthique et confirme la véracité des informations" />
                  <p className="text-sm text-gray-700">
                    Je déclare que les informations fournies sont vraies à ma connaissance et j'accepte
                    que mon identité soit protégée selon la Charte d'éthique CDP.
                  </p>
                </div>
                <button className="btn-primary w-full">Soumettre le signalement</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'charter' && (
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-drc-blue rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-drc-yellow" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Charte d'Éthique et d'Intégrité</h2>
                <p className="text-gray-500 mt-1">Le Congo D’Abord — CDP</p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    title: 'I. Principes Fondamentaux',
                    content: 'Tout membre de Congo D\'Abord s\'engage à agir avec intégrité, honnêteté et transparence dans toutes ses activités partisanes et politiques. La méritocratie, l\'équité et le service au peuple congolais sont les valeurs cardinales du parti.',
                  },
                  {
                    title: 'II. Interdictions Absolues',
                    content: 'Sont strictement interdits: la corruption sous toutes ses formes, le détournement de fonds du parti, les discours haineux ethniques ou tribaux, l\'utilisation de ressources du parti à des fins personnelles, et toute forme de violence physique ou verbale.',
                  },
                  {
                    title: 'III. Obligation de Déclaration',
                    content: 'Tout membre témoin d\'une violation éthique a l\'obligation de le déclarer à la Commission d\'Éthique. Le silence complice est considéré comme une violation de second degré.',
                  },
                  {
                    title: 'IV. Protection des Lanceurs d\'Alerte',
                    content: 'L\'identité des déclarants est strictement protégée. Aucune sanction ne peut être prise contre un membre ayant déclaré de bonne foi une violation éthique.',
                  },
                  {
                    title: 'V. Procédure Disciplinaire',
                    content: 'Toute plainte déclenche une enquête indépendante. Les sanctions possibles incluent: avertissement, suspension temporaire, suspension des droits de vote, exclusion du parti, et signalement aux autorités compétentes pour les cas criminels.',
                  },
                  {
                    title: 'VI. Impact sur le Score IA',
                    content: 'Tout cas d\'éthique avéré impacte directement le score de sélection du membre. Un cas de corruption grave entraîne l\'inéligibilité permanente à toute nomination ou candidature.',
                  },
                ].map(section => (
                  <div key={section.title} className="border-l-4 border-drc-blue pl-4">
                    <h3 className="font-bold text-gray-900 mb-2">{section.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <p className="text-drc-blue font-bold">Signé et approuvé par</p>
                <p className="text-gray-900 font-black text-lg mt-1">Mr Justin Nseya</p>
                <p className="text-gray-500 text-sm">Fondateur & Président — Le Congo D’Abord</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIAgentPanel
              agentName="Agent Éthique CDP-AI"
              agentDescription="Surveillance d'intégrité, analyse des cas, recommandations disciplinaires"
              placeholderText="Ex: Analysez le cas EC-001. Quelles sanctions sont appropriées pour fraude de cotisation?"
            />
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900">Mécanismes de Surveillance Automatique</h3>
              <div className="space-y-2">
                {[
                  'Analyse automatique des anomalies financières',
                  'Détection de discours diviseurs sur les communications du parti',
                  'Vérification croisée des déclarations de contribution',
                  'Alerte si double affiliation à un autre parti détectée',
                  'Surveillance des activités de leadership incompatibles',
                  'Rapport hebdomadaire de risques d\'intégrité à la direction',
                  'Score d\'intégrité mis à jour automatiquement après chaque cas',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <Shield className="w-4 h-4 text-drc-blue shrink-0" />
                    {item}
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
