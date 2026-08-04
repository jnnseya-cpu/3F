import Link from 'next/link';
import type { Metadata } from 'next';
import { GROWTH_TOOLS } from '@/lib/growthTools';
import {
  Rocket, MessageSquare, Megaphone, Mail, Layout, Hash, Video,
  TrendingUp, Users, BarChart3, Clock, ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Growth Engine — Outils de Croissance',
  description:
    "10 outils IA intégrés pour maximiser la portée du parti : posts sociaux, publicités, campagnes email, pages de destination, hashtags, scripts vidéo, analytique et optimisation d'audience.",
};

const ICONS: Record<string, typeof MessageSquare> = {
  MessageSquare, Megaphone, Mail, Layout, Hash, Video, TrendingUp, Users, BarChart3, Clock,
};

const CREATION_TOOLS = ['social-post', 'advert-creator', 'email-campaign', 'landing-page', 'hashtag', 'video-script'];
const INSIGHT_TOOLS = ['performance', 'audience', 'analytics', 'posting-time'];

export default function GrowthEnginePage() {
  const creation = GROWTH_TOOLS.filter(t => CREATION_TOOLS.includes(t.id));
  const insights = GROWTH_TOOLS.filter(t => INSIGHT_TOOLS.includes(t.id));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-drc-blue text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-drc-yellow rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6 text-drc-blue-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-black">AI Growth Engine</h1>
              <p className="text-blue-200">Outils intégrés pour maximiser la portée du parti et soutenir les partenaires.</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { n: '10', label: 'Outils IA' },
              { n: '5', label: 'Langues supportées' },
              { n: '6', label: 'Plateformes couvertes' },
              { n: '24/7', label: 'Disponibilité' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-drc-yellow">{s.n}</p>
                <p className="text-blue-200 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Creation tools */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-1">Création de Contenu</h2>
          <p className="text-gray-500 text-sm mb-6">Générez posts, publicités, emails, pages et vidéos en quelques secondes.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {creation.map(tool => {
              const Icon = ICONS[tool.icon] || MessageSquare;
              return (
                <Link
                  key={tool.id}
                  href={`/growth/${tool.id}`}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-drc-blue transition-all p-6 group"
                >
                  <div className={`${tool.color} w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-drc-blue transition-colors leading-snug">{tool.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{tool.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-drc-blue mt-4">
                    Ouvrir l&apos;outil <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Insight tools */}
        <section>
          <h2 className="text-xl font-black text-gray-900 mb-1">Analyse &amp; Optimisation</h2>
          <p className="text-gray-500 text-sm mb-6">L&apos;IA analyse vos résultats et vous dit exactement quoi améliorer.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {insights.map(tool => {
              const Icon = ICONS[tool.icon] || BarChart3;
              return (
                <Link
                  key={tool.id}
                  href={`/growth/${tool.id}`}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-drc-blue transition-all p-6 group"
                >
                  <div className={`${tool.color} w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-drc-blue transition-colors leading-snug text-sm">{tool.name}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{tool.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-drc-blue mt-3">
                    Ouvrir <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Workflow */}
        <section className="bg-drc-blue-dark rounded-2xl p-8 text-white">
          <h2 className="text-xl font-black mb-6 text-center">Le Cycle de Croissance</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { step: '1', label: 'Créer', desc: 'Posts, pubs, emails, vidéos' },
              { step: '2', label: 'Publier', desc: 'Aux meilleurs horaires' },
              { step: '3', label: 'Mesurer', desc: 'Analytique de campagne' },
              { step: '4', label: 'Optimiser', desc: 'Audience + performance' },
              { step: '5', label: 'Recommencer', desc: 'Plus fort à chaque cycle' },
            ].map(s => (
              <div key={s.step} className="bg-white/10 rounded-xl p-4">
                <span className="inline-flex w-8 h-8 bg-drc-yellow text-drc-blue-dark rounded-full items-center justify-center font-black mb-2">{s.step}</span>
                <p className="font-bold text-drc-yellow">{s.label}</p>
                <p className="text-blue-200 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
