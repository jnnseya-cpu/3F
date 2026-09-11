'use client';

import { useEffect, useState } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

/**
 * PWA install pop-up. Listens for the browser's `beforeinstallprompt`, then
 * offers a dismissible card to install the app to the home screen. Respects a
 * per-browser "dismissed" flag so it never nags, and hides once installed.
 */

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'lcd_install_dismissed';

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === '1'; } catch { /* private mode */ }
    // Already installed (standalone) → never show.
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (dismissed || standalone) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      // Small delay so it doesn't fight the first paint.
      setTimeout(() => setShow(true), 2500);
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    const onInstalled = () => { setShow(false); setDeferred(null); };
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    try { await deferred.userChoice; } catch { /* ignore */ }
    setShow(false);
    setDeferred(null);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  if (!show || !deferred) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-[60] sm:inset-x-auto sm:right-6 sm:max-w-sm animate-fade-up">
      <div className="surface-lg p-4 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
             style={{ backgroundImage: 'linear-gradient(145deg, #1f8bff, #0055CC)' }}>
          <Smartphone className="w-5 h-5 text-drc-yellow" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-extrabold text-gray-900 text-sm">Installer Le Congo D&apos;Abord</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Ajoutez l&apos;application à votre écran d&apos;accueil : accès rapide, hors-ligne, comme une vraie app.
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={install} className="btn-primary !py-2 !px-3 text-xs flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" /> Installer
            </button>
            <button onClick={dismiss} className="text-xs font-semibold text-gray-500 px-3 py-2 rounded-lg hover:bg-gray-100">
              Plus tard
            </button>
          </div>
        </div>
        <button onClick={dismiss} aria-label="Fermer" className="text-gray-300 hover:text-gray-500 shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
