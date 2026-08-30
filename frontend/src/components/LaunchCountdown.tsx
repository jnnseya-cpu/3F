'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { LAUNCH_MS, LAUNCH_LABEL_FR, LAUNCH_CONTEXT_FR } from '@/lib/launch';

/**
 * Live countdown to the national launch (see lib/launch.ts for the date).
 * The exact remaining time is written BEFORE the first browser paint (via a
 * layout effect), so the viewer never sees a stale or placeholder value — only
 * real, ticking numbers. suppressHydrationWarning covers the sub-second delta
 * between the server-rendered HTML and the client's first computed value.
 */

// Runs before paint on the client, falls back to a no-op effect on the server.
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface Parts { days: number; hours: number; minutes: number; seconds: number; }

function remaining(): Parts {
  const diff = Math.max(0, LAUNCH_MS - Date.now());
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function LaunchCountdown() {
  // Compute the real value immediately (runs on server render AND first client
  // render) so the numbers are correct on first paint — no "--" flash.
  const [t, setT] = useState<Parts>(() => remaining());
  const [launched, setLaunched] = useState<boolean>(() => LAUNCH_MS - Date.now() <= 0);

  // Correct to the exact current value before the browser paints (no stale
  // frame), then keep ticking every second.
  useIsomorphicLayoutEffect(() => {
    const tick = () => {
      setT(remaining());
      setLaunched(LAUNCH_MS - Date.now() <= 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const cells: Array<[number, string]> = [
    [t.days, 'jours'],
    [t.hours, 'heures'],
    [t.minutes, 'min'],
    [t.seconds, 'sec'],
  ];

  return (
    <div className="mt-8 inline-flex flex-col gap-2">
      <span className="inline-flex items-center gap-2 text-drc-yellow text-xs font-bold uppercase tracking-widest">
        <Rocket className="w-4 h-4" />
        {launched ? 'Lancement national — nous y sommes' : `Lancement national — ${LAUNCH_LABEL_FR}`}
      </span>
      <div className="flex gap-2 sm:gap-3" aria-live="polite">
        {cells.map(([value, label]) => (
          <div
            key={label}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 min-w-[64px] text-center"
          >
            <span
              className="block text-2xl sm:text-3xl font-black text-white tabular-nums"
              suppressHydrationWarning
            >
              {String(value).padStart(2, '0')}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-blue-200">{label}</span>
          </div>
        ))}
      </div>
      <span className="text-blue-200 text-xs">{LAUNCH_CONTEXT_FR}</span>
    </div>
  );
}
