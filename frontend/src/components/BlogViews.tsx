'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

/**
 * Per-article view counter. On mount: increments once per browser per slug
 * (localStorage guard stops refresh/rerender inflation), then shows the count.
 * Renders nothing until a real count is available (no fabricated numbers).
 */
export default function BlogViews({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const key = `lcd_viewed_${slug}`;
    let alreadyViewed = false;
    try { alreadyViewed = localStorage.getItem(key) === '1'; } catch { /* private mode */ }

    (async () => {
      try {
        if (alreadyViewed) {
          // Just read the current count, don't double-count
          const r = await fetch(`/api/blog/views?slug=${encodeURIComponent(slug)}`);
          if (r.ok) { const d = await r.json(); if (!cancelled && typeof d.count === 'number') setCount(d.count); }
          return;
        }
        const r = await fetch('/api/blog/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug }),
        });
        if (r.ok) {
          const d = await r.json();
          try { localStorage.setItem(key, '1'); } catch { /* ignore */ }
          if (!cancelled && typeof d.count === 'number') setCount(d.count);
        }
      } catch { /* offline — counter simply doesn't show */ }
    })();

    return () => { cancelled = true; };
  }, [slug]);

  if (count === null) return null; // no ledger / not loaded → show nothing

  return (
    <span className="flex items-center gap-1" title={`${count} vues`}>
      <Eye className="w-3 h-3" />
      {count.toLocaleString('fr-FR')} {count === 1 ? 'vue' : 'vues'}
    </span>
  );
}
