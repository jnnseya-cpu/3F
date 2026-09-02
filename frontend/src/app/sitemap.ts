import { MetadataRoute } from 'next';
import { BLOG_POSTS } from '@/lib/blogPosts';
import { DRC_PROVINCES } from '@/lib/provinces';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE}/register`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${BASE}/invite`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE}/blog`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${BASE}/growth`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE}/projects`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE}/dashboard`, priority: 0.7, changeFrequency: 'daily' as const },
    { url: `${BASE}/candidates`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${BASE}/contributions`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${BASE}/promesses`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${BASE}/training`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${BASE}/policy`, priority: 0.6, changeFrequency: 'weekly' as const },
    { url: `${BASE}/infrastructure`, priority: 0.6, changeFrequency: 'weekly' as const },
    { url: `${BASE}/ethics`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${BASE}/projects/command-centre`, priority: 0.6, changeFrequency: 'weekly' as const },
    ...[
      'manifesto-architect', 'project-designer', 'project-breakdown', 'national-costing',
      'funding-matchmaker', 'delivery-structure', 'talent-assignment', 'impact-forecast',
      'project-replication', 'development-strategist', 'second-term',
    ].map(slug => ({ url: `${BASE}/projects/${slug}`, priority: 0.5, changeFrequency: 'monthly' as const })),
  ].map(p => ({ ...p, lastModified: now }));

  const blogPages = BLOG_POSTS.map(post => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.8,
    changeFrequency: 'weekly' as const,
  }));

  const provincePages = [
    { url: `${BASE}/province`, lastModified: now, priority: 0.7, changeFrequency: 'monthly' as const },
    ...DRC_PROVINCES.map(p => ({
      url: `${BASE}/province/${p.id}`,
      lastModified: now,
      priority: 0.6,
      changeFrequency: 'monthly' as const,
    })),
  ];

  return [...staticPages, ...blogPages, ...provincePages];
}
