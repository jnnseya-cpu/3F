import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BLOG_POSTS, getPostBySlug } from '@/lib/blogPosts';
import { Clock, ChevronRight, ArrowLeft, Share2 } from 'lucide-react';
import BlogViews from '@/components/BlogViews';
import SeoScorePanel from '@/components/SeoScorePanel';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://congodabord.cd';

export function generateStaticParams() {
  return BLOG_POSTS.map(post => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `${BASE}/blog/${post.slug}`;
  const locale = post.lang === 'ln' ? 'ln_CD' : post.lang === 'sw' ? 'sw_CD' : 'fr_CD';
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: "Le Congo D'Abord",
      locale,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

/** Renders {text|/path} tokens as internal hyperlinks — the dynamic linking engine. */
function renderParagraph(text: string, key: number) {
  const parts = text.split(/(\{[^}]+\})/g);
  return (
    <p key={key} className="text-gray-700 leading-relaxed mb-5">
      {parts.map((part, i) => {
        const m = part.match(/^\{([^|]+)\|([^}]+)\}$/);
        if (m) {
          return (
            <Link key={i} href={m[2]} className="text-drc-blue font-semibold underline decoration-drc-yellow decoration-2 underline-offset-2 hover:text-drc-blue-dark">
              {m[1]}
            </Link>
          );
        }
        return part;
      })}
    </p>
  );
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = post.related
    .map(slug => getPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: post.author, url: BASE },
    publisher: { '@type': 'Organization', name: "Le Congo D'Abord", url: BASE },
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
    keywords: post.keywords.join(', '),
    inLanguage: post.lang || 'fr',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="bg-drc-blue text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-1 text-blue-200 text-sm hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" /> Tous les articles
          </Link>
          <span className="block text-drc-yellow text-xs font-bold uppercase tracking-wider mb-2">{post.category}</span>
          <h1 className="text-3xl font-black leading-tight mb-3">{post.title}</h1>
          <div className="flex items-center gap-4 text-blue-200 text-sm">
            <span>{post.author}</span>
            <span>{new Date(post.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readMinutes} min</span>
            <BlogViews slug={post.slug} />
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          {post.content.map((para, i) => renderParagraph(para, i))}

          {/* Share — earns organic backlinks */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Partager cet article
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} — ${BASE}/blog/${post.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${BASE}/blog/${post.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${BASE}/blog/${post.slug}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="text-sm bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors"
              >
                X / Twitter
              </a>
            </div>
          </div>
        </div>

        {/* On-page SEO score — computed from the article itself */}
        <SeoScorePanel post={post} />

        {/* Related articles — dynamic cross-links */}
        {related.length > 0 && (
          <div className="mt-8">
            <h2 className="font-black text-gray-900 mb-4">Articles liés</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map(r => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:border-drc-blue hover:shadow-md transition-all group"
                >
                  <span className="text-xs font-bold text-drc-blue">{r.category}</span>
                  <p className="font-bold text-gray-900 text-sm leading-snug mt-1 group-hover:text-drc-blue transition-colors">{r.title}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-drc-blue mt-2">
                    Lire <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 bg-drc-blue rounded-2xl p-6 text-center">
          <p className="text-white font-black text-lg mb-3">Prêt à transformer le Congo ?</p>
          <Link href="/register" className="inline-block bg-drc-yellow text-drc-blue-dark font-black px-6 py-3 rounded-xl hover:bg-yellow-300 transition-colors">
            Rejoindre le parti — 1 USD/mois
          </Link>
        </div>
      </article>
    </div>
  );
}
