'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import PageViewTracker from '@/components/PageViewTracker';
import type { Language } from '@/lib/translations';
import { LAUNCH_LABEL_FR } from '@/lib/launch';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  return (
    <>
      <PageViewTracker />
      <Navbar language={language} setLanguage={setLanguage} />
      <main>{children}</main>
      <footer className="bg-drc-blue-dark text-white mt-16">
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-drc-yellow font-bold text-lg mb-3">Le Congo D’Abord</h3>
            <p className="text-blue-200 text-sm leading-relaxed">
              Le premier parti politique congolais dirigé par des citoyens,
              renforcé par l&apos;intelligence artificielle.
            </p>
            <p className="text-blue-300 text-xs mt-3 font-semibold">Le Congo D&apos;Abord v1.0</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-200">Direction Nationale</h4>
            <p className="text-blue-300 text-sm">Fondateur &amp; Président</p>
            <p className="text-white font-bold text-sm">Mr Justin Nseya</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-blue-200">Contact</h4>
            <p className="text-blue-300 text-sm">contact@congodabord.cd</p>
            <p className="text-blue-300 text-sm mt-1">Kinshasa, RD Congo</p>
          </div>
        </div>
        <div className="border-t border-white/10 text-center py-4 text-blue-300 text-xs">
          <p className="text-drc-yellow font-semibold mb-1">Lancement national — {LAUNCH_LABEL_FR}</p>
          © 2025 Le Congo D&apos;Abord. Tous droits réservés.
        </div>
      </footer>
    </>
  );
}
