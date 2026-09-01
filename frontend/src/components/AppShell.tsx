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
      <footer className="text-white mt-20 relative overflow-hidden"
              style={{ backgroundImage: 'radial-gradient(900px 400px at 90% -30%, rgba(51,153,255,0.25), transparent 60%), linear-gradient(180deg, #0055CC 0%, #002f77 100%)' }}>
        <div className="flag-stripe" />
        <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2 max-w-md">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ backgroundImage: 'linear-gradient(145deg, #1f8bff, #0055CC)', boxShadow: '0 6px 14px -4px rgba(0,0,0,0.4)' }}>
                <span className="text-drc-yellow font-black">★</span>
              </div>
              <h3 className="text-drc-yellow font-display font-extrabold text-xl tracking-tight">Le Congo D’Abord</h3>
            </div>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              Le premier parti politique congolais dirigé par des citoyens,
              renforcé par l&apos;intelligence artificielle — structuré du village
              jusqu&apos;à la Présidence, sur la compétence et la transparence.
            </p>
            <p className="text-blue-200/70 text-xs mt-4 font-medium tracking-wide">La compétence avant les promesses.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90 text-sm uppercase tracking-widest text-[11px]">Direction Nationale</h4>
            <p className="text-blue-200/70 text-xs uppercase tracking-wider">Fondateur &amp; Président</p>
            <p className="text-white font-bold text-sm mt-0.5">Mr Justin Nseya</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90 text-sm uppercase tracking-widest text-[11px]">Contact</h4>
            <p className="text-blue-100/80 text-sm">contact@congodabord.cd</p>
            <p className="text-blue-100/80 text-sm mt-1">Kinshasa, RD Congo</p>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <p className="text-blue-200/70">© 2025 Le Congo D&apos;Abord. Tous droits réservés.</p>
            <p className="inline-flex items-center gap-2 text-drc-yellow font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-drc-yellow animate-pulse" />
              Lancement national — {LAUNCH_LABEL_FR}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
