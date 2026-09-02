'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Brain, Shield, Globe, TrendingUp, MapPin, BookOpen,
  CheckCircle, ArrowRight, Star, Zap, Award, ChevronRight
} from 'lucide-react';
import { translations } from '@/lib/translations';
import type { Language } from '@/lib/translations';
import { DRC_PROVINCES, getTotalMembers, getTotalActiveContributors } from '@/lib/provinces';
import LaunchCountdown from '@/components/LaunchCountdown';
import FounderSection from '@/components/FounderSection';

const SLOGANS = [
  { lang: 'Français', text: "Le Congo d'abord. La compétence avant les promesses." },
  { lang: 'Lingala', text: 'Congo liboso. Mayele, bosolo, mosala.' },
  { lang: 'Kikongo', text: 'Congo dyamosi. Ntima, bosolo, misala.' },
  { lang: 'Tshiluba', text: 'Congo pamutu. Bualu, bosolo, misalu.' },
  { lang: 'Kiswahili', text: 'Congo kwanza. Uwezo, uwazi na maendeleo.' },
];

const AI_AGENTS = [
  { icon: Users, title: "Inscription des membres", desc: "Enregistre chaque membre dans la structure administrative de la RDC.", color: "bg-blue-100 text-blue-700" },
  { icon: MapPin, title: "Cartographie administrative", desc: "Mappe chaque membre du village au niveau national.", color: "bg-blue-100 text-blue-700" },
  { icon: Brain, title: "Analyse CV & Compétences", desc: "Évalue l'éducation, l'expérience et l'aptitude au leadership.", color: "bg-purple-100 text-purple-700" },
  { icon: Star, title: "Sélection des candidats", desc: "Propose 3 personnes qualifiées pour chaque rôle.", color: "bg-yellow-100 text-yellow-700" },
  { icon: Award, title: "Matching des rôles", desc: "Associe les membres aux postes selon leurs compétences.", color: "bg-orange-100 text-orange-700" },
  { icon: BookOpen, title: "Intelligence politique", desc: "Génère politiques, manifestes et plans provinciaux.", color: "bg-indigo-100 text-indigo-700" },
  { icon: Globe, title: "Intelligence infrastructure", desc: "Cartographie les besoins locaux en routes, eau, énergie.", color: "bg-teal-100 text-teal-700" },
  { icon: TrendingUp, title: "Finance & Cotisations", desc: "Suivi transparent des 1 USD/mois par membre.", color: "bg-emerald-100 text-emerald-700" },
  { icon: BookOpen, title: "Académie politique", desc: "14 modules de formation pour les futurs leaders.", color: "bg-pink-100 text-pink-700" },
  { icon: Shield, title: "Éthique & Discipline", desc: "Protège l'intégrité du parti contre la corruption.", color: "bg-red-100 text-red-700" },
  { icon: Zap, title: "Communication IA", desc: "Discours, communiqués et messages en 5 langues.", color: "bg-amber-100 text-amber-700" },
  { icon: CheckCircle, title: "Préparation électorale", desc: "Tableau de bord de disponibilité électorale.", color: "bg-cyan-100 text-cyan-700" },
];

const DIFFERENCES = [
  "Chaque membre cartographié du village au national",
  "Candidats sélectionnés par compétence, pas par argent",
  "L'IA propose 3 personnes — les humains décident",
  "Finances du parti 100% transparentes",
  "Les problèmes locaux deviennent des plans d'infrastructure",
  "La diaspora congolaise pleinement intégrée",
  "Leadership gagné par le mérite, pas acheté",
  "Les données exposent les lacunes structurelles",
];

export default function LandingPage() {
  const [activeLang] = useState<Language>('fr');
  const [activeSloganIdx, setActiveSloganIdx] = useState(0);
  const tr = translations[activeLang];

  const totalMembers = getTotalMembers();
  const totalContributors = getTotalActiveContributors();

  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="text-white relative overflow-hidden" style={{background: '#007FFF'}}>
        {/* DRC FLAG BACKGROUND */}
        <div className="absolute inset-0" style={{
          background: '#007FFF',
        }}>
          {/* Depth wash */}
          <div className="absolute inset-0" style={{background: 'radial-gradient(1100px 520px at 82% -10%, rgba(51,153,255,0.55), transparent 60%), linear-gradient(135deg, #0a6ae6 0%, #0055CC 55%, #002f77 100%)'}} />
          {/* Red diagonal stripe with yellow borders — actual DRC flag, kept as a
              subtle crisp accent (not muddied by an overlay on top of it) */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(
                -55deg,
                transparent 0%,
                transparent calc(50% - 78px),
                rgba(252,209,22,0.85) calc(50% - 78px),
                rgba(252,209,22,0.85) calc(50% - 64px),
                rgba(206,17,38,0.85) calc(50% - 64px),
                rgba(206,17,38,0.85) calc(50% + 64px),
                rgba(252,209,22,0.85) calc(50% + 64px),
                rgba(252,209,22,0.85) calc(50% + 78px),
                transparent calc(50% + 78px),
                transparent 100%
              )
            `,
            opacity: 0.5,
            mixBlendMode: 'soft-light',
          }} />
          {/* Yellow star top-left */}
          <div className="absolute top-8 left-8 text-drc-yellow" style={{fontSize: '4rem', lineHeight: 1, opacity: 0.55, filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.25))'}}>★</div>
          {/* Left-side darkening for crisp text contrast */}
          <div className="absolute inset-0" style={{background: 'linear-gradient(90deg, rgba(0,25,70,0.55) 0%, rgba(0,25,70,0.20) 45%, transparent 75%)'}} />
          {/* Fine grain to kill flat banding (premium, non-AI look) */}
          <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-4xl animate-fade-up">
            {/* Party badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-drc-yellow animate-pulse" />
              <span className="text-sm font-semibold text-drc-yellow">Adhésion gratuite</span>
              <span className="text-white/50 text-sm">•</span>
              <span className="text-sm text-white/85">Chaque franc traçable publiquement</span>
            </div>

            {/* Headline — the promise, not the brand flex */}
            <h1 className="text-4xl md:text-6xl font-black mb-5 leading-[1.05]">
              <span className="text-white">Ils ont pris votre voix</span>{' '}
              <span className="text-white/70">et votre argent.</span><br />
              <span className="text-drc-yellow">Reprenez le pouvoir.</span>
            </h1>

            {/* Sub — pain → mechanism → reframe the money */}
            <p className="text-lg md:text-xl text-blue-100/90 mb-6 leading-relaxed max-w-2xl text-pretty">
              Pendant des décennies, les partis ont encaissé vos cotisations puis oublié
              votre village. <strong className="text-white">Le Congo D&apos;Abord</strong> est
              construit autrement : chaque cotisation est <strong className="text-white">suivie
              publiquement</strong>, et chaque candidat est choisi par un{' '}
              <strong className="text-white">score de mérite</strong> que ni l&apos;argent, ni la
              tribu, ni le piston ne peuvent truquer.
            </p>

            <p className="text-base text-drc-yellow font-semibold mb-8">
              Vous ne payez pas pour adhérer. Vous adhérez pour reprendre le contrôle.
            </p>

            {/* CTAs — remove the money barrier, lead with proof */}
            <div className="flex flex-wrap gap-3">
              <Link href="/register" className="btn-secondary flex items-center gap-2 text-base">
                Prendre ma place — c&apos;est gratuit <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contributions" className="glass text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/15 transition-all flex items-center gap-2">
                Voir où va chaque dollar <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Founder — credibility, kept human */}
            <div className="flex items-center gap-3 mt-8">
              <div className="w-10 h-10 bg-drc-yellow rounded-full flex items-center justify-center shrink-0">
                <span className="text-drc-blue-dark font-black text-sm">JN</span>
              </div>
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest">Fondateur &amp; Président</p>
                <p className="text-white font-bold text-lg">Mr Justin Nseya</p>
              </div>
            </div>

            {/* Countdown to national launch — 4 January 2027 */}
            <LaunchCountdown />
          </div>
        </div>

        {/* Stats bar */}
        <div className="bg-black/25 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Provinces couvertes', value: '26/26' },
              { label: 'Langues nationales', value: '5' },
              { label: 'Agents IA actifs', value: '23' },
              { label: 'Niveaux de structure', value: '7' },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center px-3 py-1 ${i > 0 ? 'md:border-l md:border-white/10' : ''}`}>
                <p className="font-display text-3xl font-extrabold text-drc-yellow tracking-tight tabular-nums">{stat.value}</p>
                <p className="text-blue-200/90 text-xs mt-0.5 tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SLOGANS IN 5 LANGUAGES ===== */}
      <section className="bg-drc-blue-dark py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {SLOGANS.map((s, i) => (
              <button
                key={i}
                onClick={() => setActiveSloganIdx(i)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeSloganIdx === i
                    ? 'bg-drc-yellow text-drc-blue-dark font-bold'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {s.lang}
              </button>
            ))}
          </div>
          <p className="text-center text-white text-xl font-bold mt-4 italic">
            &ldquo;{SLOGANS[activeSloganIdx].text}&rdquo;
          </p>
        </div>
      </section>

      {/* ===== 3 VERIFIABLE PROMISES (trust before pitch) ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-drc-red">Ne nous croyez pas sur parole</p>
            <h2 className="section-title mt-2">Vérifiez chaque promesse vous-même</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Les partis promettent. Nous, nous vous donnons les moyens de contrôler — avant, pendant, et après.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              {
                icon: TrendingUp,
                tag: 'Votre argent',
                title: 'Chaque dollar est suivi publiquement',
                body: "Pas de caisse noire. Chaque cotisation entre dans un registre consultable — vous voyez ce qui rentre et où ça va, en continu.",
                href: '/contributions',
                cta: 'Ouvrir le registre',
              },
              {
                icon: Award,
                tag: 'Vos candidats',
                title: 'Le mérite décide, pas le piston',
                body: "Chaque candidat reçoit un score public (éducation, expérience, intégrité, ancrage local). Ni l'argent, ni la tribu, ni les relations ne peuvent le truquer.",
                href: '/candidates',
                cta: 'Voir la formule du score',
              },
              {
                icon: MapPin,
                tag: 'Votre place',
                title: 'Du village à la Présidence',
                body: "Une structure à 7 niveaux, de votre village jusqu'au national. Où que vous soyez, vous avez une place et une voix — pas seulement à Kinshasa.",
                href: '/dashboard',
                cta: 'Voir la structure',
              },
            ].map(card => {
              const Icon = card.icon;
              return (
                <Link key={card.title} href={card.href} className="card-hover group flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-drc-blue" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-drc-blue/70">{card.tag}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-drc-blue transition-colors">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed flex-1">{card.body}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-drc-blue mt-4">
                    {card.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <FounderSection />

      {/* ===== AI AGENTS ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-drc-blue px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Brain className="w-4 h-4" /> Comment le mérite reste incorruptible
            </div>
            <h2 className="section-title">12 Agents IA Spécialisés</h2>
            <p className="section-subtitle">
              Chaque agent gère un domaine précis — ensemble ils forment le cerveau stratégique du parti.
            </p>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              L&apos;IA ne remplace pas le leadership humain. Elle agit comme moteur de données,
              système d&apos;audit et couche de recommandation — les décisions politiques restent
              entre les mains des organes humains du parti.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AI_AGENTS.map((agent, i) => {
              const Icon = agent.icon;
              return (
                <div key={i} className="agent-card group">
                  <div className={`w-10 h-10 rounded-lg ${agent.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-drc-blue transition-colors">{agent.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{agent.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== SNTO PROMO ===== */}
      <section className="py-16 bg-drc-blue-dark text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-drc-yellow text-drc-blue-dark px-4 py-2 rounded-full text-sm font-black mb-4">
              NOUVEAU — Système National de Transformation Opérationnel
            </div>
            <h2 className="text-2xl font-black mb-3">Manifeste → Programme → Projets → Livraison → Résultats</h2>
            <p className="text-blue-200 max-w-2xl mx-auto">
              11 agents IA convertissent chaque promesse électorale en projets nationaux financables,
              suivis, évalués et présentés aux électeurs avec transparence totale.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { n: '11', label: 'Agents SNTO' },
              { n: '9', label: 'Secteurs stratégiques' },
              { n: '26', label: 'Provinces couvertes' },
              { n: '10 ans', label: 'Feuille de route' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-drc-yellow">{s.n}</p>
                <p className="text-blue-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="/projects" className="inline-flex items-center gap-2 bg-drc-yellow text-drc-blue-dark font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors">
              Explorer le SNTO →
            </a>
          </div>
        </div>
      </section>

      {/* ===== STRUCTURE ===== */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <MapPin className="w-4 h-4" /> Structure nationale
              </div>
              <h2 className="section-title">Du Village à la Présidence</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Le Congo D’Abord est structuré à travers les 26 provinces de la RDC, de Kinshasa
                à Haut-Katanga, couvrant chaque territoire, commune, secteur, chefferie, groupement et village.
              </p>

              <div className="space-y-3">
                {[
                  { level: '🏛️ National', desc: 'Direction nationale — Mr Justin Nseya' },
                  { level: '🗺️ Provincial (×26)', desc: '26 provinces dont Kinshasa' },
                  { level: '🏙️ Territoire/Ville', desc: '145 territoires, 33 villes' },
                  { level: '🏘️ Commune/Secteur/Chefferie', desc: 'Entités décentralisées' },
                  { level: '🏠 Quartier/Groupement', desc: 'Coordination locale' },
                  { level: '🌿 Village/Cellule', desc: 'Niveau de base — chaque citoyen compte' },
                  { level: '🌍 Diaspora', desc: 'Afrique, Europe, Amériques, Asie, Océanie' },
                ].map(item => (
                  <div key={item.level} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-base">{item.level.split(' ')[0]}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.level.substring(2)}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Province Grid */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-drc-blue" /> 26 Provinces — Couverture nationale
              </h3>
              <div className="grid grid-cols-2 gap-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-2">
                {DRC_PROVINCES.map(province => (
                  <div key={province.id} className="bg-white rounded-lg p-3 border border-gray-100 hover:border-drc-blue transition-colors">
                    <p className="text-xs font-bold text-gray-900 truncate">{province.name}</p>
                    <p className="text-xs text-gray-500">{province.capital}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-drc-blue">
                        {(province.memberCount || 0).toLocaleString()} membres
                      </span>
                      <div className="w-16 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-1.5 bg-drc-blue rounded-full"
                          style={{ width: `${province.electionReadiness || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES US DIFFERENT ===== */}
      <section className="py-20 bg-drc-blue">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ce qui nous différencie
            </h2>
            <p className="text-blue-200 text-lg max-w-2xl mx-auto">
              Dirigé par les citoyens. Assisté par l&apos;IA. Fondé sur les données. Transparent. Méritocratique.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIFFERENCES.map((diff, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white">
                <div className="w-8 h-8 bg-drc-yellow rounded-full flex items-center justify-center text-drc-blue-dark font-black text-sm mb-3">
                  {i + 1}
                </div>
                <p className="text-sm font-medium leading-relaxed">{diff}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-drc-blue rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-drc-yellow" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            Prenez votre place. Aujourd&apos;hui, c&apos;est gratuit.
          </h2>
          <p className="text-gray-600 mb-2 text-lg">
            L&apos;adhésion ne coûte <strong className="text-drc-blue">rien</strong>. Vous décidez de
            cotiser <strong>1 USD/mois</strong> seulement quand vous êtes prêt — et vous voyez
            exactement où va cet argent.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Être membre vous ouvre la sélection interne au mérite, les formations de l&apos;Académie
            et une voix réelle, de votre village jusqu&apos;au national.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Prendre ma place — gratuit <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/contributions" className="border-2 border-drc-blue text-drc-blue px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center gap-2">
              Voir où va chaque dollar <TrendingUp className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-10 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-gray-600">
            <strong className="text-drc-blue">Engagement de confidentialité :</strong> Vos données sont utilisées
            uniquement pour la gestion du parti. Aucune surveillance privée, aucune vente de données,
            aucune exploitation politique sans votre consentement.
          </div>
        </div>
      </section>
    </div>
  );
}
