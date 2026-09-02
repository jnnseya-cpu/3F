import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck, Receipt, Award, FileBarChart, ArrowRight,
  CheckCircle2, Clock, ExternalLink, Scale,
} from 'lucide-react';
import { FOUNDER } from '@/lib/founder';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export const metadata: Metadata = {
  title: 'Comment nous tenons ces promesses — Le Congo D’Abord',
  description:
    "Chaque engagement du parti Le Congo D'Abord est adossé à un mécanisme vérifiable : registre public des cotisations, score de mérite transparent, rapports de dépenses trimestriels. Vérifiez par vous-même.",
  alternates: { canonical: `${BASE}/promesses` },
  openGraph: {
    title: "Comment nous tenons nos promesses — Le Congo D'Abord",
    description: 'Des engagements adossés à des mécanismes vérifiables, pas des slogans.',
    url: `${BASE}/promesses`,
    siteName: "Le Congo D'Abord",
    locale: 'fr_CD',
    type: 'website',
  },
};

interface Promise {
  icon: React.ComponentType<{ className?: string }>;
  pledge: string;
  mechanism: string;
  live: boolean;
  status: string;
  verifyHref: string;
  verifyLabel: string;
}

const PROMISES: Promise[] = [
  {
    icon: Receipt,
    pledge: 'Chaque cotisation est suivie dans un registre public',
    mechanism:
      "Chaque paiement vérifié est enregistré automatiquement et agrégé dans un registre public : total cotisé, nombre de cotisations, membres actifs. Aucune caisse noire, aucune saisie manuelle qui pourrait être maquillée. Les montants individuels restent privés ; seuls les totaux sont publics.",
    live: true,
    status: "Le registre est en ligne et affichera les chiffres réels dès la première cotisation (lancement : 4 janvier 2027). Aucun chiffre n'est inventé avant.",
    verifyHref: '/contributions',
    verifyLabel: 'Ouvrir le registre public',
  },
  {
    icon: Award,
    pledge: 'Les candidats sont choisis par un score de mérite transparent',
    mechanism:
      "Chaque candidat reçoit un score calculé selon une formule publique et pondérée : éducation, expérience, crédibilité locale, leadership, cotisation à jour, formation, intégrité et maîtrise des langues. La formule est affichée ; le calcul est le même pour tous. Ni l'argent, ni la tribu, ni les relations ne peuvent la contourner.",
    live: true,
    status: 'La formule de scoring est publiée et consultable dès maintenant sur la page des candidats.',
    verifyHref: '/candidates',
    verifyLabel: 'Voir la formule du score',
  },
  {
    icon: FileBarChart,
    pledge: 'Les rapports de dépenses sont publiés chaque trimestre',
    mechanism:
      "En complément du registre des recettes, chaque trimestre un rapport détaillé des dépenses est publié : où va l'argent, par catégorie, avec les justificatifs. Les recettes sont traçables en continu ; les dépenses sont rendues des comptes à intervalle fixe et régulier.",
    live: false,
    status: "Premier rapport trimestriel publié après l'ouverture des cotisations (2027), puis tous les trois mois.",
    verifyHref: '/contributions',
    verifyLabel: 'Voir la page finances',
  },
];

export default function PromisesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hero-gradient text-white py-16 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="inline-flex items-center gap-2 text-drc-yellow text-xs font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-4 h-4" /> Redevabilité
          </p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            Comment nous tenons ces promesses
          </h1>
          <p className="text-blue-100/90 text-lg max-w-2xl text-pretty">
            Les partis promettent. Nous, nous adossons chaque engagement à un{' '}
            <strong className="text-white">mécanisme vérifiable</strong> — pas à un slogan.
            Voici exactement comment, et comment le vérifier vous-même.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        {PROMISES.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="surface p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-drc-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">{p.pledge}</h2>
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        p.live ? 'bg-emerald-50 text-emerald-700' : 'bg-yellow-50 text-yellow-700'
                      }`}
                    >
                      {p.live ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {p.live ? 'Actif' : 'Dès le lancement'}
                    </span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Le mécanisme</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{p.mechanism}</p>

                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Statut</p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-5">{p.status}</p>

                  <Link
                    href={p.verifyHref}
                    className="inline-flex items-center gap-2 text-sm font-bold text-drc-blue hover:gap-3 transition-all"
                  >
                    {p.verifyLabel} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Accountability principle */}
        <div className="surface-lg p-6 md:p-8 mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-5 h-5 text-drc-blue" />
            <h2 className="font-display text-xl font-extrabold text-gray-900">Notre règle de redevabilité</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">
            Une promesse sans moyen de vérification n&apos;est qu&apos;un slogan. Nous nous
            engageons à ne publier <strong>aucun chiffre inventé</strong> : tant qu&apos;une donnée
            n&apos;est pas réelle, la page l&apos;indique clairement. Le pouvoir de vérifier
            appartient aux membres et aux citoyens — pas au parti.
          </p>
          <p className="text-sm text-gray-500">
            Engagements portés publiquement par <strong className="text-gray-700">{FOUNDER.name}</strong>, {FOUNDER.role}.
          </p>
        </div>

        {/* CTA */}
        <div className="hero-gradient rounded-2xl p-8 text-center mt-8">
          <p className="text-white font-black text-xl mb-2">Tenez-nous responsables.</p>
          <p className="text-blue-100/90 text-sm mb-6 max-w-md mx-auto">
            Adhérez gratuitement, suivez chaque franc, et vérifiez chaque promesse — de votre
            village jusqu&apos;au national.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/register" className="btn-secondary flex items-center gap-2">
              Prendre ma place — gratuit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contributions"
              className="glass text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/15 transition-all flex items-center gap-2"
            >
              Voir le registre <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
