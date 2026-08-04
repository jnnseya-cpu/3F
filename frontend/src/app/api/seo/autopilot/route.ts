import { NextRequest, NextResponse } from 'next/server';
import { debit, ACU_COSTS } from '@/lib/acu';

/**
 * SEO Autopilot — runs on a daily Vercel cron (see vercel.json "crons").
 *
 * Each run:
 *  1. Picks the next topic from the SEO editorial calendar (rotating)
 *  2. Asks the AI router (Claude → OpenAI → Gemini) to write a French,
 *     keyword-optimized article with internal links in {text|/path} format
 *  3. Stores the article in Firestore collection `blog` — the blog page
 *     can then surface AI-generated posts alongside the seed posts
 *
 * Security: requires CRON_SECRET (Vercel sets Authorization: Bearer <CRON_SECRET>
 * automatically on cron invocations when the env var is defined).
 */

const TOPICS = [
  "Pourquoi la diaspora congolaise doit s'engager en politique — et comment le faire depuis l'étranger",
  "Élections en RDC : comment vérifier qu'un candidat mérite votre vote",
  "L'énergie solaire peut-elle électrifier la RDC ? Les chiffres et les projets",
  "Jeunesse congolaise : 5 compétences politiques à développer avant 30 ans",
  "Comment la transparence financière peut tuer la corruption politique en RDC",
  "Villes intelligentes en Afrique : quel modèle pour Kinshasa ?",
  "L'agriculture congolaise : de l'autosuffisance à l'exportation",
  "Femmes en politique congolaise : briser les barrières par le mérite",
  "Le mobile money comme outil de démocratie participative en RDC",
  "Éducation en RDC : ce qu'un programme national sérieux doit contenir",
  "Pourquoi chaque village congolais mérite une voix nationale",
  "L'intelligence artificielle au service du développement africain : mythes et réalités",
];

const INTERNAL_LINKS = [
  "{s'inscrire au parti|/register}",
  '{la sélection des candidats au mérite|/candidates}',
  '{les cotisations transparentes|/contributions}',
  "{l'Académie Politique|/training}",
  '{les projets nationaux SNTO|/projects}',
  "{l'infrastructure participative|/infrastructure}",
  '{le tableau de bord national|/dashboard}',
  '{les politiques publiques|/policy}',
];

async function generateArticle(topic: string): Promise<{ title: string; description: string; keywords: string[]; content: string[] } | null> {
  const prompt = `Écris un article de blog SEO en français pour le parti politique congolais "Le Congo D'Abord" (premier parti propulsé par l'IA en RDC, fondé par Mr Justin Nseya).

SUJET: ${topic}

RÈGLES STRICTES:
1. 5-7 paragraphes, ton professionnel et engageant, ancré dans le contexte RDC
2. Insère naturellement AU MOINS 4 de ces liens internes (format exact {texte|/chemin}): ${INTERNAL_LINKS.join(', ')}
3. Optimise pour les mots-clés de recherche congolais pertinents
4. Termine par un appel à l'action vers {l'inscription|/register}
5. AUCUNE fausse statistique sur le parti (pas de nombres de membres inventés)

Réponds UNIQUEMENT en JSON valide:
{"title": "...", "description": "meta description 150-160 caractères", "keywords": ["mot1", "mot2", "mot3", "mot4", "mot5"], "content": ["paragraphe 1", "paragraphe 2", ...]}`;

  // Reuse the provider chain inline (Claude → OpenAI → Gemini)
  const providers: Array<() => Promise<string | null>> = [
    async () => {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) return null;
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!r.ok) throw new Error(`claude ${r.status}`);
      return (await r.json()).content?.[0]?.text || null;
    },
    async () => {
      const key = process.env.OPENAI_API_KEY;
      if (!key) return null;
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', max_tokens: 3000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!r.ok) throw new Error(`openai ${r.status}`);
      return (await r.json()).choices?.[0]?.message?.content || null;
    },
    async () => {
      const key = process.env.GEMINI_API_KEY;
      if (!key) return null;
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 3000 } }),
      });
      if (!r.ok) throw new Error(`gemini ${r.status}`);
      return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text || null;
    },
  ];

  for (const p of providers) {
    try {
      const raw = await p();
      if (!raw) continue;
      const jsonText = raw.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      if (parsed.title && Array.isArray(parsed.content) && parsed.content.length >= 3) return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export async function GET(req: NextRequest) {
  // Verify cron authenticity
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get('authorization');
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rotate topic by day of year so each run gets a different subject
  const dayOfYear = Math.floor((Date.now() - Date.UTC(new Date().getUTCFullYear(), 0, 0)) / 86_400_000);
  const topic = TOPICS[dayOfYear % TOPICS.length];

  // ACU gate — the autopilot spends from the party's system account
  const charge = await debit('system-autopilot', ACU_COSTS.autopilot);
  if (!charge.ok) {
    return NextResponse.json(
      { status: 'skipped', reason: 'ACU_INSUFFICIENT', balance: charge.balance,
        message: 'Compte ACU system-autopilot épuisé — rechargez-le dans Firestore acu_accounts/system-autopilot.' },
      { status: 402 },
    );
  }

  const article = await generateArticle(topic);
  if (!article) {
    return NextResponse.json({ status: 'skipped', reason: 'no AI provider available' }, { status: 503 });
  }

  const slug = slugify(article.title);
  const record = {
    ...article,
    slug,
    date: new Date().toISOString().slice(0, 10),
    author: "Le Congo D'Abord",
    category: 'Autopilot SEO',
    readMinutes: Math.max(3, Math.round(article.content.join(' ').split(' ').length / 200)),
    generatedAt: new Date().toISOString(),
  };

  // Persist to Firestore if configured
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const apiKey = process.env.FIREBASE_API_KEY;
  if (projectId && apiKey) {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blog?documentId=${slug}&key=${apiKey}`;
    const fields: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(record)) {
      if (Array.isArray(v)) fields[k] = { arrayValue: { values: v.map(x => ({ stringValue: String(x) })) } };
      else if (typeof v === 'number') fields[k] = { integerValue: String(v) };
      else fields[k] = { stringValue: String(v) };
    }
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) {
      console.error('Autopilot Firestore write failed:', (await res.text()).slice(0, 200));
      return NextResponse.json({ status: 'generated_not_stored', slug, title: article.title });
    }
    return NextResponse.json({ status: 'published', slug, title: article.title });
  }

  return NextResponse.json({ status: 'generated_no_storage', slug, title: article.title });
}
