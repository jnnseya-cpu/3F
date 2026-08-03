import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { Newspaper, Clock, ChevronRight } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export const metadata: Metadata = {
  title: "Blog — Politique, IA et Transformation de la RDC",
  description:
    "Analyses et actualités du premier parti politique congolais propulsé par l'intelligence artificielle : méritocratie, transparence financière, projets nationaux et développement de la RDC.",
  keywords: ['blog politique RDC', 'Congo D\'Abord', 'actualité politique congolaise', 'IA Afrique'],
  alternates: { canonical: `${BASE}/blog` },
  openGraph: {
    title: "Blog — Le Congo D'Abord",
    description: "Politique, IA et transformation nationale de la RDC.",
    url: `${BASE}/blog`,
    siteName: "Le Congo D'Abord",
    locale: 'fr_CD',
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-drc-blue text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-drc-yellow rounded-xl flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-drc-blue-dark" />
            </div>
            <h1 className="text-3xl font-black">Le Blog du Congo D&apos;Abord</h1>
          </div>
          <p className="text-blue-200 max-w-2xl">
            Politique, intelligence artificielle et transformation nationale — les idées qui
            construisent la RDC de demain.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(post => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-drc-blue transition-all p-6 group flex flex-col"
            >
              <span className="inline-flex self-start text-xs font-bold text-drc-blue bg-blue-50 px-3 py-1 rounded-full mb-3">
                {post.category}
              </span>
              <h2 className="font-black text-gray-900 text-lg leading-snug group-hover:text-drc-blue transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{post.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" /> {post.readMinutes} min de lecture
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-drc-blue">
                  Lire l&apos;article <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Internal links hub — strengthens crawl depth to money pages */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-black text-gray-900 mb-4">Explorer la plateforme</h2>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/register', label: "S'inscrire au parti" },
              { href: '/candidates', label: 'Sélection des candidats IA' },
              { href: '/contributions', label: 'Cotisations transparentes' },
              { href: '/training', label: 'Académie Politique' },
              { href: '/projects', label: 'Projets nationaux SNTO' },
              { href: '/infrastructure', label: 'Infrastructure participative' },
              { href: '/policy', label: 'Politiques publiques' },
              { href: '/dashboard', label: 'Tableau de bord national' },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-drc-blue hover:text-white transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
