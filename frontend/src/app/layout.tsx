import './globals.css';
import type { Metadata } from 'next';
import AppShell from '@/components/AppShell';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Le Congo D'Abord — Parti Politique IA de la RDC",
    template: "%s | Le Congo D'Abord",
  },
  description:
    "Le Congo D'Abord — le premier parti politique congolais dirigé par des citoyens et renforcé par l'intelligence artificielle. 26 provinces, 5 langues, sélection des candidats au mérite, transparence totale.",
  keywords: [
    'parti politique RDC', "Congo D'Abord", 'Justin Nseya', 'élections RDC',
    'politique congolaise', 'intelligence artificielle Afrique',
  ],
  openGraph: {
    title: "Le Congo D'Abord — Parti Politique IA de la RDC",
    description:
      "Le premier parti politique congolais propulsé par l'intelligence artificielle. La compétence avant les promesses.",
    type: 'website',
    locale: 'fr_CD',
    siteName: "Le Congo D'Abord",
    url: BASE,
  },
  twitter: {
    card: 'summary_large_image',
    title: "Le Congo D'Abord — Parti Politique IA de la RDC",
    description: 'La compétence avant les promesses. Rejoignez le premier parti politique IA de la RDC.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23007FFF'/><text x='50%25' y='60%25' font-size='18' text-anchor='middle' fill='%23FCD116' font-family='serif' font-weight='bold'>C</text></svg>",
  },
};

const ORG_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "Le Congo D'Abord",
  alternateName: 'LCD',
  description: "Premier parti politique congolais propulsé par l'intelligence artificielle",
  founder: { '@type': 'Person', name: 'Justin Nseya' },
  foundingLocation: { '@type': 'Place', name: 'Kinshasa, République Démocratique du Congo' },
  email: 'contact@congodabord.cd',
  areaServed: 'CD',
  knowsLanguage: ['fr', 'ln', 'kg', 'ts', 'sw'],
  url: BASE,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
