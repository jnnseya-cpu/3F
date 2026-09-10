import { NextRequest, NextResponse } from 'next/server';
import { debit, refund, ACU_COSTS } from '@/lib/acu';

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

async function generateArticle(topic: string): Promise<{ title: string; description: string; keywords: string[]; content: string[]; faq: { q: string; a: string }[] } | null> {
  const prompt = `Écris un article de blog SEO en français pour le parti politique congolais "Le Congo D'Abord" (premier parti propulsé par l'IA en RDC, fondé par Mr Justin Nseya).

SUJET: ${topic}

RÈGLES STRICTES (respecte EXACTEMENT pour un score SEO ≥ 90/100) :
1. TITRE : entre 40 et 60 caractères, contenant le mot-clé principal.
2. MÉTA-DESCRIPTION : entre 120 et 155 caractères, contenant aussi le mot-clé principal.
3. CONTENU : 6 à 9 paragraphes, AU MOINS 350 mots au total, ton professionnel ancré dans le contexte RDC.
4. LIENS INTERNES : insère naturellement AU MOINS 5 de ces liens (format exact {texte|/chemin}) : ${INTERNAL_LINKS.join(', ')}. Termine par {l'inscription|/register}.
5. MOTS-CLÉS : 5 mots-clés de recherche congolais ; le 1er est le mot-clé principal (présent dans le titre ET la description).
6. FAQ : 3 questions-réponses fréquentes et utiles (réponses de 2-3 phrases chacune).
7. AUCUNE fausse statistique sur le parti (pas de nombres de membres inventés).

Réponds UNIQUEMENT en JSON valide :
{"title": "...", "description": "...", "keywords": ["principal", "m2", "m3", "m4", "m5"], "content": ["paragraphe 1", "..."], "faq": [{"q": "...", "a": "..."}, {"q": "...", "a": "..."}, {"q": "...", "a": "..."}]}`;

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
  // Fail closed: without a configured secret this AI-spending endpoint must
  // not be publicly triggerable (would let anyone burn the party's ACUs/API).
  if (!cronSecret) {
    return NextResponse.json({ error: 'Cron not configured' }, { status: 503 });
  }
  if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
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
    await refund('system-autopilot', ACU_COSTS.autopilot);
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
