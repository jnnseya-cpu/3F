import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { DRC_PROVINCES } from '@/lib/provinces';
import { MapPin, Users, Building2, ChevronRight, ArrowLeft, CheckCircle } from 'lucide-react';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

function findProvince(slug: string) {
  return DRC_PROVINCES.find(p => p.id === slug);
}

export function generateStaticParams() {
  return DRC_PROVINCES.map(p => ({ slug: p.id }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = findProvince(params.slug);
  if (!p) return {};
  const title = `Le Congo D'Abord en ${p.name} — Rejoindre le parti à ${p.capital}`;
  const description = `Engagez-vous en politique dans la province du ${p.name} (chef-lieu ${p.capital}). Le Congo D'Abord couvre ${p.territories.length} territoires : inscription, cotisation 1 USD/mois, sélection au mérite et formation gratuite.`;
  return {
    title,
    description,
    keywords: [`parti politique ${p.name}`, `rejoindre parti ${p.capital}`, `engagement politique ${p.name}`, `élections ${p.name}`, "Congo D'Abord"],
    alternates: { canonical: `${BASE}/province/${p.id}` },
    openGraph: { title, description, url: `${BASE}/province/${p.id}`, siteName: "Le Congo D'Abord", locale: 'fr_CD', type: 'website' },
  };
}

export default function ProvincePage({ params }: { params: { slug: string } }) {
  const p = findProvince(params.slug);
  if (!p) notFound();

  const cities = Array.from(new Set(p.territories.flatMap(t => t.communes))).slice(0, 12);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: `Le Congo D'Abord — ${p.name}`,
    description: `Section provinciale du parti Le Congo D'Abord dans le ${p.name}, RDC.`,
    areaServed: { '@type': 'AdministrativeArea', name: p.name },
    url: `${BASE}/province/${p.id}`,
    parentOrganization: { '@type': 'Organization', name: "Le Congo D'Abord", url: BASE },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-drc-blue text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/province" className="inline-flex items-center gap-1 text-blue-200 text-sm hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Toutes les provinces
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-drc-yellow rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-drc-blue-dark" />
            </div>
            <div>
              <h1 className="text-3xl font-black">Le Congo D&apos;Abord en {p.name}</h1>
              <p className="text-blue-200">Chef-lieu : {p.capital} · {p.territories.length} territoires</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-gray-700 leading-relaxed mb-4">
            Dans la province du <strong>{p.name}</strong>, dont le chef-lieu est <strong>{p.capital}</strong>,
            <Link href="/" className="text-drc-blue font-semibold underline decoration-drc-yellow decoration-2 underline-offset-2"> Le Congo D&apos;Abord </Link>
            offre à chaque citoyen un chemin clair vers l&apos;engagement politique : compétence avant les promesses, transparence avant l&apos;opacité.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Que vous soyez à {p.capital} ou dans l&apos;un des {p.territories.length} territoires de la province, vous pouvez
            <Link href="/register" className="text-drc-blue font-semibold underline decoration-drc-yellow decoration-2 underline-offset-2"> vous inscrire en ligne</Link>,
            mettre votre <Link href="/contributions" className="text-drc-blue font-semibold underline decoration-drc-yellow decoration-2 underline-offset-2">cotisation de 1 USD/mois</Link> à jour,
            et devenir éligible à la <Link href="/candidates" className="text-drc-blue font-semibold underline decoration-drc-yellow decoration-2 underline-offset-2">sélection des candidats au mérite</Link>.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, label: 'Population', value: p.population ? `${(p.population / 1_000_000).toFixed(1)}M` : '—' },
            { icon: Building2, label: 'Territoires', value: String(p.territories.length) },
            { icon: MapPin, label: 'Chef-lieu', value: p.capital },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                <Icon className="w-5 h-5 text-drc-blue mx-auto mb-2" />
                <p className="font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            );
          })}
        </div>

        {/* Territories */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-4">Territoires couverts en {p.name}</h2>
          <div className="flex flex-wrap gap-2">
            {p.territories.map(t => (
              <span key={t.id} className="text-sm bg-blue-50 text-drc-blue border border-blue-200 px-3 py-1.5 rounded-full font-medium">{t.name}</span>
            ))}
          </div>
          {cities.length > 0 && (
            <>
              <h3 className="font-bold text-gray-900 mt-6 mb-3 text-sm">Communes et localités</h3>
              <div className="flex flex-wrap gap-2">
                {cities.map(c => (
                  <span key={c} className="text-xs bg-gray-50 text-gray-600 border border-gray-200 px-3 py-1 rounded-full">{c}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Why join here */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-4">Pourquoi rejoindre en {p.name} ?</h2>
          <ul className="space-y-3">
            {[
              <>Votre voix remonte du village jusqu&apos;au <Link href="/dashboard" className="text-drc-blue font-semibold underline">tableau de bord national</Link></>,
              <>Vos besoins locaux deviennent des <Link href="/infrastructure" className="text-drc-blue font-semibold underline">projets d&apos;infrastructure chiffrés</Link> via le <Link href="/projects" className="text-drc-blue font-semibold underline">SNTO</Link></>,
              <>Formation politique gratuite via l&apos;<Link href="/training" className="text-drc-blue font-semibold underline">Académie</Link> — 14 modules</>,
              <>Sélection des candidats par le mérite, pas par l&apos;argent</>,
            ].map((li, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>{li}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-drc-blue rounded-2xl p-6 text-center">
          <p className="text-white font-black text-lg mb-3">Faites du {p.name} un modèle de transformation</p>
          <Link href="/register" className="inline-block bg-drc-yellow text-drc-blue-dark font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors">
            Rejoindre à {p.capital} — 1 USD/mois
          </Link>
        </div>

        {/* Nearby provinces — internal linking */}
        <div>
          <h2 className="font-black text-gray-900 mb-4">Autres provinces</h2>
          <div className="flex flex-wrap gap-2">
            {DRC_PROVINCES.filter(o => o.id !== p.id).slice(0, 10).map(o => (
              <Link key={o.id} href={`/province/${o.id}`} className="text-sm text-drc-blue border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-drc-blue hover:text-white transition-colors font-medium">
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
