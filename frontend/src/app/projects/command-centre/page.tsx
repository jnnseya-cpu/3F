'use client';

import Link from 'next/link';
import DemoDataBanner from '@/components/DemoDataBanner';
import {
  ChevronRight, CheckCircle2, Clock3, AlertTriangle, DollarSign,
  Users, MapPin, TrendingUp, Star, Zap, LayoutDashboard,
} from 'lucide-react';

const PROVINCE_RANKINGS = [
  { rank: 1, name: 'Haut-Katanga', score: 87, projects: 14, delivered: 9 },
  { rank: 2, name: 'Kinshasa', score: 83, projects: 22, delivered: 14 },
  { rank: 3, name: 'Kongo Central', score: 76, projects: 11, delivered: 7 },
  { rank: 4, name: 'Nord-Kivu', score: 71, projects: 13, delivered: 7 },
  { rank: 5, name: 'Lualaba', score: 68, projects: 9, delivered: 5 },
  { rank: 6, name: 'Kasaï-Oriental', score: 61, projects: 8, delivered: 4 },
];

const MINISTER_RANKINGS = [
  { name: 'Min. Infrastructures', score: 91, onTrack: 8, delayed: 1 },
  { name: 'Min. Éducation', score: 84, onTrack: 11, delayed: 2 },
  { name: 'Min. Énergie', score: 79, onTrack: 6, delayed: 2 },
  { name: 'Min. Santé', score: 74, onTrack: 7, delayed: 3 },
  { name: 'Min. Agriculture', score: 68, onTrack: 5, delayed: 3 },
];

const TIMELINE = [
  { label: 'Janv. 2025', event: 'Lancement SNTO', done: true },
  { label: 'Mars 2025', event: '50 projets approuvés', done: true },
  { label: 'Juin 2025', event: '1er bilan semestriel', done: true },
  { label: 'Déc. 2025', event: 'Revue annuelle T1', done: false },
  { label: 'Juin 2026', event: 'Phase industrialisation', done: false },
  { label: 'Déc. 2026', event: 'Évaluation mi-mandat', done: false },
];

export default function CommandCentrePage() {
  const electionReadiness = 74;

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      {/* Header */}
      <div className="bg-drc-blue text-white py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/projects" className="hover:text-white">SNTO</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Centre de Commandement</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-drc-yellow rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-drc-blue-dark" />
            </div>
            <h1 className="text-2xl font-black">Centre de Commandement National</h1>
          </div>
          <p className="text-blue-200">Tableau de bord exécutif — Suivi en temps réel de la livraison nationale.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { icon: CheckCircle2, label: 'Projets livrés', value: '43', sub: 'sur 156', color: 'text-green-600' },
            { icon: Clock3, label: 'En cours', value: '78', sub: 'actifs', color: 'text-blue-600' },
            { icon: AlertTriangle, label: 'En retard', value: '18', sub: 'à surveiller', color: 'text-orange-500' },
            { icon: DollarSign, label: 'Budget engagé', value: '$2.4Md', sub: 'USD total', color: 'text-drc-blue' },
            { icon: Users, label: 'Emplois créés', value: '284K', sub: 'à ce jour', color: 'text-teal-600' },
            { icon: MapPin, label: 'Bénéficiaires', value: '6.2M', sub: 'citoyens', color: 'text-purple-600' },
          ].map(k => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${k.color}`} />
                <p className="text-xl font-black text-gray-900">{k.value}</p>
                <p className="text-xs font-semibold text-gray-700">{k.label}</p>
                <p className="text-xs text-gray-400">{k.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Election Readiness Score */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-drc-yellow" />
                Score de Préparation Électorale
              </h2>
              <p className="text-gray-500 text-sm">Basé sur la livraison des projets, couverture provinciale et impact citoyen.</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black text-drc-blue">{electionReadiness}<span className="text-xl text-gray-400">/100</span></p>
              <p className="text-sm font-semibold text-orange-600">Bon — Amélioration possible</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-drc-blue to-drc-yellow transition-all duration-1000"
              style={{ width: `${electionReadiness}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Livraison projets', score: 78 },
              { label: 'Couverture provinces', score: 69 },
              { label: 'Satisfaction citoyens', score: 71 },
              { label: 'Visibilité médiatique', score: 82 },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-drc-blue" style={{ width: `${item.score}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Province + Minister Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Province Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-drc-blue" />
              Classement Provincial
            </h2>
            <div className="space-y-3">
              {PROVINCE_RANKINGS.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    p.rank === 1 ? 'bg-drc-yellow text-drc-blue-dark' :
                    p.rank === 2 ? 'bg-gray-300 text-gray-700' :
                    p.rank === 3 ? 'bg-orange-300 text-orange-800' :
                    'bg-gray-100 text-gray-500'
                  }`}>{p.rank}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-800">{p.name}</span>
                      <span className="text-sm font-bold text-drc-blue">{p.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-drc-blue" style={{ width: `${p.score}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{p.delivered}/{p.projects} projets livrés</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Minister Performance */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-drc-blue" />
              Performance Ministérielle
            </h2>
            <div className="space-y-4">
              {MINISTER_RANKINGS.map((m, i) => (
                <div key={m.name} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-900">{m.name}</span>
                    <span className={`text-sm font-black ${m.score >= 80 ? 'text-green-600' : m.score >= 70 ? 'text-drc-blue' : 'text-orange-500'}`}>
                      {m.score}/100
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${m.score >= 80 ? 'bg-green-500' : m.score >= 70 ? 'bg-drc-blue' : 'bg-orange-400'}`}
                      style={{ width: `${m.score}%` }}
                    />
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 font-semibold">{m.onTrack} dans les délais</span>
                    <span className="text-orange-500 font-semibold">{m.delayed} en retard</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 10-Year Timeline */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5 text-drc-yellow" />
            Feuille de Route — 2 Mandats (10 ans)
          </h2>
          <p className="text-gray-500 text-sm mb-6">1er mandat : Fondations. 2e mandat : Industrialisation et IA nationale.</p>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4 pl-12">
              {TIMELINE.map((t, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-10 w-4 h-4 rounded-full border-2 ${
                    t.done ? 'bg-drc-blue border-drc-blue' : 'bg-white border-gray-300'
                  }`} />
                  <div className={`rounded-xl p-4 border ${t.done ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-xs font-bold text-drc-blue mb-0.5">{t.label}</p>
                    <p className={`text-sm font-semibold ${t.done ? 'text-gray-900' : 'text-gray-500'}`}>{t.event}</p>
                    {t.done && <span className="text-xs text-green-600 font-semibold">✓ Complété</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
