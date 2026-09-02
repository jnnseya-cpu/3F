'use client';

import { useState } from 'react';
import DemoDataBanner from '@/components/DemoDataBanner';
import Link from 'next/link';
import {
  FolderKanban, Cpu, PenLine, DollarSign, Users, BarChart3,
  Globe, Repeat2, Lightbulb, Clock, LayoutDashboard, ChevronRight,
  Zap, Building2, GraduationCap, HeartPulse, Wheat, HardHat,
  Home, Briefcase, Shield, Wifi, CheckCircle2, Clock3, AlertCircle,
} from 'lucide-react';

const AGENT_CARDS = [
  {
    id: 'manifesto-architect',
    href: '/projects/manifesto-architect',
    icon: PenLine,
    color: 'bg-blue-600',
    title: 'Architecte du Manifeste IA',
    subtitle: 'Vision → Programmes nationaux',
    desc: 'Transforme la vision du parti en programmes exécutables avec objectifs, KPIs, budgets et ministères impliqués.',
  },
  {
    id: 'project-designer',
    href: '/projects/project-designer',
    icon: FolderKanban,
    color: 'bg-indigo-600',
    title: 'Concepteur de Projets IA',
    subtitle: 'Promesse → Projets concrets',
    desc: 'Convertit chaque promesse électorale en projets structurés avec portée, coût, risques et stratégie d\'approvisionnement.',
  },
  {
    id: 'project-breakdown',
    href: '/projects/project-breakdown',
    icon: Cpu,
    color: 'bg-purple-600',
    title: 'Décomposition de Projets IA',
    subtitle: 'Projets → Structure WBS',
    desc: 'Crée automatiquement la structure de décomposition du travail (WBS) avec phases, tâches, durées et dépendances.',
  },
  {
    id: 'national-costing',
    href: '/projects/national-costing',
    icon: DollarSign,
    color: 'bg-green-600',
    title: 'Costing National IA',
    subtitle: 'CAPEX / OPEX / Financement',
    desc: 'Produit des estimations de coûts détaillées avec scénarios bas/moyen/haut et structures de financement PPP.',
  },
  {
    id: 'funding-matchmaker',
    href: '/projects/funding-matchmaker',
    icon: Globe,
    color: 'bg-teal-600',
    title: 'Courtier en Financement IA',
    subtitle: 'Projets → Sources de fonds',
    desc: 'Identifie les bailleurs de fonds adaptés (Banque Mondiale, BAD, FMI, fonds privés) et calcule un score de probabilité.',
  },
  {
    id: 'delivery-structure',
    href: '/projects/delivery-structure',
    icon: Building2,
    color: 'bg-orange-600',
    title: 'Structure de Livraison IA',
    subtitle: 'Gouvernance de projet',
    desc: 'Conçoit la gouvernance complète : responsable politique, technique, provincial, communautaire et unité de suivi.',
  },
  {
    id: 'talent-assignment',
    href: '/projects/talent-assignment',
    icon: Users,
    color: 'bg-rose-600',
    title: 'Affectation des Talents IA',
    subtitle: 'Membres → Postes de leadership',
    desc: 'Trouve le meilleur membre du parti pour diriger chaque projet en analysant éducation, expérience et province.',
  },
  {
    id: 'impact-forecast',
    href: '/projects/impact-forecast',
    icon: BarChart3,
    color: 'bg-cyan-600',
    title: 'Prévision d\'Impact IA',
    subtitle: 'PIB / Emplois / Approbation',
    desc: 'Prédit l\'impact sur le PIB, la création d\'emplois, les revenus fiscaux, la réduction de la pauvreté et l\'impact électoral.',
  },
  {
    id: 'project-replication',
    href: '/projects/project-replication',
    icon: Repeat2,
    color: 'bg-violet-600',
    title: 'Réplication de Projets IA',
    subtitle: 'Succès → Déploiement national',
    desc: 'Duplique les projets réussis vers des provinces similaires avec stratégie de déploiement et coûts de réplication.',
  },
  {
    id: 'development-strategist',
    href: '/projects/development-strategist',
    icon: Lightbulb,
    color: 'bg-yellow-600',
    title: 'Stratège de Développement IA',
    subtitle: 'Think tank national',
    desc: 'Génère continuellement de nouveaux projets de développement : zones industrielles, corridors d\'exportation, villes intelligentes.',
  },
  {
    id: 'second-term',
    href: '/projects/second-term',
    icon: Clock,
    color: 'bg-slate-600',
    title: 'Planification 2e Mandat IA',
    subtitle: 'Feuille de route 10 ans',
    desc: 'Alloue les projets entre le 1er mandat (fondations) et le 2e mandat (industrialisation, IA nationale, villes intelligentes).',
  },
  {
    id: 'command-centre',
    href: '/projects/command-centre',
    icon: LayoutDashboard,
    color: 'bg-drc-blue',
    title: 'Centre de Commandement',
    subtitle: 'Tableau de bord exécutif',
    desc: 'Vue complète : projets livrés, budgets engagés, emplois créés, classement provincial et score de préparation électorale.',
  },
];

const SECTORS = [
  { icon: HardHat, label: 'Infrastructure', count: 24, color: 'text-orange-600' },
  { icon: Zap, label: 'Énergie', count: 18, color: 'text-yellow-600' },
  { icon: GraduationCap, label: 'Éducation', count: 31, color: 'text-blue-600' },
  { icon: HeartPulse, label: 'Santé', count: 22, color: 'text-red-600' },
  { icon: Wheat, label: 'Agriculture', count: 16, color: 'text-green-600' },
  { icon: Home, label: 'Logement', count: 12, color: 'text-purple-600' },
  { icon: Briefcase, label: 'Emploi', count: 19, color: 'text-teal-600' },
  { icon: Wifi, label: 'Numérique', count: 14, color: 'text-indigo-600' },
  { icon: Shield, label: 'Sécurité', count: 9, color: 'text-gray-600' },
];

const SAMPLE_PROJECTS = [
  { id: 'KIN-001', name: 'Programme Eau Potable Kinshasa', sector: 'Infrastructure', province: 'Kinshasa', status: 'Actif', priority: 'Critique' },
  { id: 'NAT-002', name: 'Programme Solaire 100MW National', sector: 'Énergie', province: 'National', status: 'Planifié', priority: 'Élevé' },
  { id: 'EDU-003', name: 'Modernisation des Écoles Nationales', sector: 'Éducation', province: 'National', status: 'Actif', priority: 'Élevé' },
  { id: 'KAT-004', name: 'Zone Industrielle Haut-Katanga', sector: 'Emploi', province: 'Haut-Katanga', status: 'Étude', priority: 'Moyen' },
  { id: 'KIV-005', name: 'Réseau de Santé Numérique Nord-Kivu', sector: 'Santé', province: 'Nord-Kivu', status: 'Actif', priority: 'Élevé' },
];

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; color: string }> = {
  'Actif': { icon: CheckCircle2, color: 'text-green-600 bg-green-50' },
  'Planifié': { icon: Clock3, color: 'text-blue-600 bg-blue-50' },
  'Étude': { icon: AlertCircle, color: 'text-yellow-600 bg-yellow-50' },
};

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sector.toLowerCase().includes(search.toLowerCase()) ||
    p.province.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <DemoDataBanner />
      {/* Hero */}
      <div className="hero-gradient text-white py-14 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-3">
            <Link href="/" className="hover:text-white">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">SNTO — Système National de Transformation</span>
          </div>
          <h1 className="text-3xl font-black mb-2">
            Système National de Transformation Opérationnel
          </h1>
          <p className="text-blue-200 text-lg max-w-3xl">
            De la promesse électorale à la livraison nationale. 11 agents IA convertissent
            le manifeste en programmes exécutables, suivent la livraison et mesurent l'impact.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-drc-yellow text-drc-blue-dark font-bold px-4 py-2 rounded-lg text-sm">
            <span>Manifeste → Programme → Projets → Livraison → Résultats → Réélection</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Projets Total', value: '156', sub: 'Tous statuts' },
            { label: 'En Livraison', value: '43', sub: 'Actifs' },
            { label: 'Budget Engagé', value: '$2.4Md', sub: 'USD' },
            { label: 'Emplois Prévus', value: '1.2M', sub: 'Sur 5 ans' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm text-center">
              <p className="text-2xl font-black text-drc-blue">{s.value}</p>
              <p className="font-semibold text-gray-800 text-sm mt-1">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* 11 NTOS AI Agents */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-1">11 Agents IA — SNTO</h2>
          <p className="text-gray-500 text-sm mb-6">Chaque agent couvre une phase du cycle de vie des projets nationaux.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AGENT_CARDS.map(a => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.id}
                  href={a.href}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-drc-blue transition-all p-5 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${a.color} w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm group-hover:text-drc-blue transition-colors leading-snug">{a.title}</p>
                      <p className="text-xs text-drc-blue font-semibold mt-0.5">{a.subtitle}</p>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Project Sectors */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-1">Catégories de Projets</h2>
          <p className="text-gray-500 text-sm mb-5">156 projets répartis en 9 secteurs stratégiques.</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {SECTORS.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
                  <p className="text-xs font-semibold text-gray-700 leading-tight">{s.label}</p>
                  <p className="text-lg font-black text-gray-900 mt-1">{s.count}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Repository Table */}
        <section>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div>
              <h2 className="text-xl font-black text-gray-900">Répertoire National des Projets</h2>
              <p className="text-gray-500 text-sm">Base de données centralisée de tous les projets nationaux.</p>
            </div>
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-drc-blue w-64"
            />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['ID', 'Nom du Projet', 'Secteur', 'Province', 'Statut', 'Priorité'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(p => {
                  const sc = STATUS_CONFIG[p.status] || STATUS_CONFIG['Étude'];
                  const StatusIcon = sc.icon;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.id}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{p.name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.sector}</td>
                      <td className="px-4 py-3 text-gray-600">{p.province}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          p.priority === 'Critique' ? 'bg-red-100 text-red-700' :
                          p.priority === 'Élevé' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{p.priority}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400">Aucun projet trouvé pour &quot;{search}&quot;</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
