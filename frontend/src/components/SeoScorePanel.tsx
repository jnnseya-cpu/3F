import type { BlogPost } from '@/lib/blogPosts';
import { computeSeoScore, seoScoreColor } from '@/lib/seoScore';
import { Gauge, Check, X } from 'lucide-react';

/**
 * On-page SEO score for an article, computed from its own content (no external
 * service — renders instantly, server-side). Shows the overall score/grade and
 * the individual checks so an editor can see exactly what to improve.
 */
export default function SeoScorePanel({ post }: { post: BlogPost }) {
  const { score, grade, checks } = computeSeoScore(post);
  const color = seoScoreColor(score);

  return (
    <details className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group">
      <summary className="flex items-center gap-4 p-6 cursor-pointer select-none list-none">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-xl shrink-0"
          style={{ backgroundColor: color }}
        >
          {score}
        </div>
        <div className="flex-1">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
            <Gauge className="w-3.5 h-3.5" /> Score SEO on-page
          </p>
          <p className="font-black text-gray-900 text-lg" style={{ color }}>{grade}</p>
          <p className="text-xs text-gray-400 group-open:hidden">Voir le détail des critères →</p>
        </div>
      </summary>

      <ul className="border-t border-gray-100 divide-y divide-gray-50">
        {checks.map(c => (
          <li key={c.label} className="flex items-center gap-3 px-6 py-3 text-sm">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: c.ok ? '#15803D' : '#CE1126' }}
            >
              {c.ok ? <Check className="w-3 h-3 text-white" /> : <X className="w-3 h-3 text-white" />}
            </span>
            <span className={c.ok ? 'text-gray-700' : 'text-gray-900 font-semibold'}>{c.label}</span>
            <span className="ml-auto text-xs text-gray-400">{c.hint}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
