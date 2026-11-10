/**
 * Trend Intelligence — real first-party signal collection from the platform itself.
 *
 * Reads the platform's own live data (blog view counts in Firestore `blog_views`)
 * and turns it into trend observations. This is the "embedded" signal source: no
 * seed, no external feed — the OS's own engagement drives the trend engine.
 *
 * Honest limitation (spec §3): page views are ATTENTION, not buyer intent, and are
 * a single source family (confidence capped at 69). Richer temporal signals
 * (periodic snapshots, internal search, registrations by topic) are the next slice.
 * Without Firebase or with no views yet, returns [] — never fabricated signals.
 */
import { adminDb } from '@/lib/firebaseAdmin';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blogPosts';
import { median } from './scoring';
import type { Observation } from './store';

function marketLocale(lang?: string): { market: string; locale: string } {
  // DRC-hosted platform; map article language to a locale within market CD.
  if (lang === 'ln') return { market: 'CD', locale: 'ln-CD' };
  if (lang === 'sw') return { market: 'CD', locale: 'sw-CD' };
  return { market: 'CD', locale: 'fr-CD' };
}

/**
 * Collect observations from live blog view counts. Each article with views becomes
 * one observation whose comparison set is the whole field of article views (a
 * cross-sectional anomaly: "this topic has unusual traction vs the rest"). Returns
 * [] when Firebase is absent or no article has views yet.
 */
export async function collectPlatformObservations(): Promise<Observation[]> {
  const db = adminDb();
  if (!db) return [];
  let snap;
  try {
    snap = await db.collection('blog_views').limit(500).get();
  } catch {
    return [];
  }
  const counts: { slug: string; count: number; updatedAt?: string }[] = [];
  snap.forEach(d => {
    const c = Number(d.get('count') || 0);
    if (c > 0 && getPostBySlug(d.id)) counts.push({ slug: d.id, count: c, updatedAt: d.get('updatedAt') });
  });
  if (counts.length === 0) return [];

  const field = counts.map(c => c.count);
  const base = median(field);
  const now = Date.now();

  return counts.map(({ slug, count, updatedAt }) => {
    const post = getPostBySlug(slug)!;
    const { market, locale } = marketLocale(post.lang);
    // freshness: taper over 14 days since last view update
    const ageDays = updatedAt ? (now - Date.parse(updatedAt)) / 864e5 : 0;
    const freshness = Math.max(0, Math.min(100, 100 - (ageDays / 14) * 100));
    return {
      source_family: 'first_party_pageviews',
      topic_id: slug,
      market,
      locale,
      count,
      baseline: base,
      history: field,            // compare against the field of all article views
      observed_at: updatedAt || new Date().toISOString(),
      source_quality: 70,        // attention, not intent (§3)
      freshness,
      coverage: 80,
    };
  });
}
