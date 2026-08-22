import './globals.css';
import type { Metadata, Viewport } from 'next';
import AppShell from '@/components/AppShell';
import AnalyticsScripts from '@/components/AnalyticsScripts';

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
  manifest: '/manifest.webmanifest',
  applicationName: "Le Congo D'Abord",
  appleWebApp: {
    capable: true,
    title: "Le Congo D'Abord",
    statusBarStyle: 'default',
    startupImage: [
      { url: '/apple-splash-750x1334.png', media: '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/apple-splash-828x1792.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/apple-splash-1125x2436.png', media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { url: '/apple-splash-1242x2688.png', media: '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { url: '/apple-splash-1170x2532.png', media: '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { url: '/apple-splash-1290x2796.png', media: '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)' },
      { url: '/apple-splash-1620x2160.png', media: '(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/apple-splash-1668x2388.png', media: '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
      { url: '/apple-splash-2048x2732.png', media: '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' },
    ],
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#007FFF',
  width: 'device-width',
  initialScale: 1,
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
        <AnalyticsScripts />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
