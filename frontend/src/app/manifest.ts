import { MetadataRoute } from 'next';

/**
 * PWA web app manifest. Drives the Android/Chrome install + auto-generated
 * splash screen (name + background_color + 512 icon). iOS splash is handled
 * by apple-touch-startup-image links in layout.tsx.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Le Congo D'Abord",
    short_name: "Congo D'Abord",
    description:
      "Le premier parti politique congolais dirigé par des citoyens et renforcé par l'intelligence artificielle.",
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#007FFF',
    theme_color: '#007FFF',
    lang: 'fr',
    categories: ['politics', 'social', 'government'],
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
