import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { humanGuard } from '@/lib/guard';
import { debit, refund, ACU_COSTS } from '@/lib/acu';
import { verifyMemberToken } from '@/lib/memberAuth';

/**
 * AI Growth Engine — generation endpoint.
 * POST { toolId, inputs } → AI-generated marketing asset.
 * Uses the same Claude → OpenAI → Gemini fallback chain as agent chat.
 */

const TOOL_PROMPTS: Record<string, (inputs: Record<string, string>) => string> = {
  'social-post': i => `Rédige un post ${i.platform || 'Facebook'} en ${i.language || 'Français'} au ton ${i.tone || 'mobilisateur'} sur : "${i.topic}". Inclus emojis pertinents, un appel à l'action vers congodabord.cd/register et 4-6 hashtags dont #CongoDAbord. Adapte la longueur à la plateforme.`,
  'advert-creator': i => `Crée une publicité complète au format ${i.format || 'affiche'} pour : "${i.event}". Public cible : ${i.audience || 'citoyens congolais'}. Structure : TITRE accrocheur, ACCROCHE, CORPS, APPEL À L'ACTION, VISUEL SUGGÉRÉ (couleurs drapeau RDC).`,
  'email-campaign': i => `Crée une campagne email (${i.sequence || 'séquence de 3 emails'}) pour : "${i.goal}". Pour chaque email : objet percutant, corps complet avec personnalisation [Prénom], appel à l'action clair. Contexte : parti Le Congo D'Abord, cotisation 1 USD/mois ou 12 USD/an.`,
  'landing-page': i => `Conçois une page de destination complète pour : "${i.purpose}". Audience : ${i.audience}. Structure : HERO (titre + sous-titre + CTA), PREUVE SOCIALE, 3 BÉNÉFICES, TÉMOIGNAGE (emplacement), CTA FINAL. Textes complets prêts à intégrer.`,
  hashtag: i => `Génère des hashtags optimisés pour ${i.platform || 'toutes plateformes'} sur le sujet : "${i.topic}". Groupes : PRINCIPAUX (marque), PORTÉE NATIONALE (villes RDC), THÉMATIQUES, DIASPORA. Ajoute un conseil d'utilisation par plateforme.`,
  'video-script': i => `Écris un script vidéo de ${i.duration || '60 secondes'} en style ${i.style || 'face caméra'} sur : "${i.topic}". Format : timecodes [0:00-0:05], indication visuelle + texte à dire. Structure : ACCROCHE, PROBLÈME, SOLUTION, PREUVE, APPEL À L'ACTION vers congodabord.cd.`,
  performance: i => `Analyse ces résultats de campagne politique en RDC et produis des recommandations priorisées (🔴🟠🟡) avec actions concrètes et un objectif 30 jours : ${i.data}`,
  audience: i => `Analyse cette audience et propose une segmentation optimisée pour un parti politique congolais (segments à fort potentiel, message par segment, canal, répartition de budget) : ${i.current}`,
  analytics: i => `Analyse ces données de campagne et produis : CE QUI FONCTIONNE, CE QUI ÉCHOUE, INSIGHTS CLÉS, OÙ INVESTIR. Données : ${i.metrics}`,
  'posting-time': i => `Recommande les meilleurs horaires de publication sur ${i.platform || 'Facebook'} pour l'audience "${i.audience || 'RDC nationale'}" : créneaux d'or (heure de Kinshasa), meilleurs jours, spécificités du marché congolais (coût des données mobiles, fins de mois), calendrier hebdomadaire suggéré.`,
};

const SYSTEM = `Tu es l'AI Growth Engine du parti politique "Le Congo D'Abord" (RDC), expert en marketing politique digital africain.
Contexte : premier parti congolais propulsé par l'IA, fondé par Mr Justin Nseya. Cotisation 1 USD/mois (12 USD/an recommandé). Site : congodabord.cd. Slogan : "La compétence avant les promesses". Couleurs : bleu #007FFF, jaune #FCD116, rouge #CE1126.
Règles : réponds en français (sauf si une autre langue est demandée), sois concret et directement utilisable, n'invente JAMAIS de statistiques sur le parti (pas de nombres de membres).`;

async function generate(prompt: string): Promise<{ text: string; provider: string } | null> {
  const providers: Array<[string, () => Promise<string | null>]> = [
    ['claude', async () => {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) return null;
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6', max_tokens: 1500, system: SYSTEM, messages: [{ role: 'user', content: prompt }] }),
      });
      if (!r.ok) throw new Error(`claude ${r.status}`);
      return (await r.json()).content?.[0]?.text || null;
    }],
    ['openai', async () => {
      const key = process.env.OPENAI_API_KEY;
      if (!key) return null;
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', max_tokens: 1500, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt }] }),
      });
      if (!r.ok) throw new Error(`openai ${r.status}`);
      return (await r.json()).choices?.[0]?.message?.content || null;
    }],
    ['gemini', async () => {
      const key = process.env.GEMINI_API_KEY;
      if (!key) return null;
      const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 1500 } }),
      });
      if (!r.ok) throw new Error(`gemini ${r.status}`);
      return (await r.json()).candidates?.[0]?.content?.parts?.[0]?.text || null;
    }],
  ];

  for (const [name, fn] of providers) {
    try {
      const text = await fn();
      if (text) return { text, provider: name };
    } catch {
      continue;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`growth:${clientIp(req.headers)}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Trop de requêtes — réessayez dans une minute' }, { status: 429 });
    }

    const body = await req.json();
    const guard = humanGuard(req, body);
    if (guard) return guard;
    const { toolId, inputs, memberId, memberToken } = body;
    const promptBuilder = TOOL_PROMPTS[toolId];
    if (!promptBuilder || typeof inputs !== 'object') {
      return NextResponse.json({ error: 'toolId invalide' }, { status: 400 });
    }

    // ACU gate — every AI action is metered, no free actions
    if (!memberId || typeof memberId !== 'string') {
      return NextResponse.json(
        { error: 'ACU_REQUIRED', message: 'Compte membre requis — les outils IA consomment des ACUs.' },
        { status: 402 },
      );
    }
    if (!verifyMemberToken(memberId, req.headers.get('x-member-token') || memberToken)) {
      return NextResponse.json(
        { error: 'MEMBER_AUTH_REQUIRED', message: 'Session membre invalide — reconnectez-vous.' },
        { status: 401 },
      );
    }
    const charge = await debit(memberId, ACU_COSTS.growth);
    if (!charge.ok) {
      return NextResponse.json(
        { error: 'ACU_INSUFFICIENT', balance: charge.balance, cost: ACU_COSTS.growth,
          message: 'Solde ACU insuffisant — cotisez pour recharger vos ACUs.' },
        { status: 402 },
      );
    }

    // sanitize input values
    const clean: Record<string, string> = {};
    for (const [k, v] of Object.entries(inputs as Record<string, unknown>)) {
      if (typeof v === 'string' && v.length <= 2000) clean[k] = v;
    }

    const result = await generate(promptBuilder(clean));
    if (!result) {
      await refund(memberId, ACU_COSTS.growth);
      return NextResponse.json({ error: 'AI indisponible' }, { status: 503 });
    }
    return NextResponse.json({ output: result.text, provider: result.provider, acuRemaining: charge.remaining });
  } catch (error) {
    console.error('Growth generate error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
