import type { BlogPost } from './blogPosts';

/**
 * On-page SEO score for a blog article — computed from the article's own
 * content (no external service, works immediately). Mirrors the checks a
 * tool like Yoast/RankMath runs: title & meta length, keyword usage,
 * word count, internal links, cross-links.
 */

export interface SeoCheck {
  label: string;
  ok: boolean;
  weight: number;
  hint: string;
}

export interface SeoResult {
  score: number;                 // 0–100
  grade: 'Excellent' | 'Bon' | 'Moyen' | 'Faible';
  checks: SeoCheck[];
}

const INTERNAL_LINK_RE = /\{[^|]+\|\/[^}]+\}/g;

export function computeSeoScore(post: BlogPost): SeoResult {
  const titleLen = post.title.length;
  const descLen = post.description.length;
  const wordCount = post.content.join(' ').split(/\s+/).filter(Boolean).length;
  const internalLinks = post.content.join(' ').match(INTERNAL_LINK_RE)?.length ?? 0;
  const firstKeyword = (post.keywords[0] || '').toLowerCase();
  const keywordInTitle = !!firstKeyword && post.title.toLowerCase().includes(firstKeyword.split(' ')[0]);
  const keywordInDesc = !!firstKeyword && post.description.toLowerCase().includes(firstKeyword.split(' ')[0]);

  const checks: SeoCheck[] = [
    { label: 'Longueur du titre (40–65)', ok: titleLen >= 40 && titleLen <= 65, weight: 15,
      hint: `${titleLen} caractères` },
    { label: 'Méta-description (110–160)', ok: descLen >= 110 && descLen <= 160, weight: 15,
      hint: `${descLen} caractères` },
    { label: 'Mots-clés définis (≥ 3)', ok: post.keywords.length >= 3, weight: 12,
      hint: `${post.keywords.length} mots-clés` },
    { label: 'Mot-clé dans le titre', ok: keywordInTitle, weight: 12,
      hint: keywordInTitle ? 'présent' : 'absent' },
    { label: 'Mot-clé dans la description', ok: keywordInDesc, weight: 8,
      hint: keywordInDesc ? 'présent' : 'absent' },
    { label: 'Longueur du contenu (≥ 300 mots)', ok: wordCount >= 300, weight: 16,
      hint: `${wordCount} mots` },
    { label: 'Liens internes (≥ 3)', ok: internalLinks >= 3, weight: 14,
      hint: `${internalLinks} liens` },
    { label: 'Articles liés (maillage)', ok: post.related.length >= 1, weight: 8,
      hint: `${post.related.length} liés` },
  ];

  const total = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
  const score = Math.round((earned / total) * 100);

  const grade: SeoResult['grade'] =
    score >= 85 ? 'Excellent' : score >= 70 ? 'Bon' : score >= 50 ? 'Moyen' : 'Faible';

  return { score, grade, checks };
}

/** Tailwind-ready color for a score (semantic, not the DRC brand accent). */
export function seoScoreColor(score: number): string {
  if (score >= 85) return '#15803D';   // emerald — excellent
  if (score >= 70) return '#007FFF';   // blue — good
  if (score >= 50) return '#B8860B';   // amber — average
  return '#CE1126';                    // red — poor
}
