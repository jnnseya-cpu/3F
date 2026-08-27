'use client';

import { useEffect, useState } from 'react';
import { Rocket } from 'lucide-react';
import { LAUNCH_MS, LAUNCH_LABEL_FR, LAUNCH_CONTEXT_FR } from '@/lib/launch';

/**
 * Countdown to the national launch (see lib/launch.ts for the date). Renders a
 * stable placeholder on the server and hydrates the live timer on the client
 * (no hydration mismatch).
 */

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
  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState<Parts>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setT(remaining());
    const id = setInterval(() => setT(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const launched = mounted && LAUNCH_MS - Date.now() <= 0;

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
        {cells.map(([value, label], i) => (
          <div
            key={label}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 sm:px-4 py-2 min-w-[64px] text-center"
          >
            <span className="block text-2xl sm:text-3xl font-black text-white tabular-nums">
              {mounted ? String(value).padStart(2, '0') : '--'}
            </span>
            <span className="block text-[10px] uppercase tracking-wider text-blue-200">{label}</span>
            {/* subtle separator dot except after the last cell */}
            {i < cells.length - 1 && <span className="sr-only">:</span>}
          </div>
        ))}
      </div>
      <span className="text-blue-200 text-xs">{LAUNCH_CONTEXT_FR}</span>
    </div>
  );
}
