import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/rateLimit';
import { humanGuard } from '@/lib/guard';
import { debit, refund, ACU_COSTS } from '@/lib/acu';
import { verifyMemberToken } from '@/lib/memberAuth';

/**
 * AI Agent chat — multi-provider router with automatic fallback.
 * Order: Claude (primary) → OpenAI → Gemini.
 * A provider is used only if its API key env var is set; if it errors,
 * the next configured provider is tried.
 */

const SYSTEM_PROMPT = (agentName: string) => `Tu es ${agentName}, un agent IA spécialisé du système Le Congo D'Abord du parti politique "Le Congo D'Abord" en République Démocratique du Congo.

Le parti est fondé par Mr Justin Nseya, Président et Fondateur. Il est le premier parti politique congolais assisté par intelligence artificielle.

Contexte du parti:
- 26 provinces couvertes
- ~35,000 membres inscrits
- Cotisation: $1 USD/mois (ou $12/an recommandé)
- 23 agents IA spécialisés (12 parti + 11 SNTO)
- Formule de scoring candidats: Education (15%) + Expérience (20%) + Crédibilité locale (15%) + Leadership (15%) + Cotisation (10%) + Formation (10%) + Intégrité (10%) + Langue (5%)
- Règle inviolable: Sans cotisation à jour = pas d'éligibilité à la sélection

Réponds en français par défaut, sauf si demandé autrement. Sois précis, professionnel et ancré dans le contexte de la RDC.`;

async function tryClaude(system: string, message: string): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
      max_tokens: 1024,
      system,
      messages: [{ role: 'user', content: message }],
    }),
  });
  if (!res.ok) throw new Error(`Claude ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text || null;
}

async function tryOpenAI(system: string, message: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: message },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

async function tryGemini(system: string, message: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`chat:${clientIp(req.headers)}`, 10, 60_000)) {
      return NextResponse.json(
        { error: 'Trop de requêtes — réessayez dans une minute' },
        { status: 429 },
      );
    }
    const body = await req.json();
    const guard = humanGuard(req, body);
    if (guard) return guard;
    const { agentName, message, memberId, memberToken } = body;
    if (!message || typeof message !== 'string' || message.length > 4000) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // ACU gate — every AI action is metered, no free actions
    if (!memberId || typeof memberId !== 'string') {
      return NextResponse.json(
        { error: 'ACU_REQUIRED', message: 'Compte membre requis — les actions IA consomment des ACUs.' },
        { status: 402 },
      );
    }
    // Bind the spend to a server-issued token (when enforcement is on)
    if (!verifyMemberToken(memberId, req.headers.get('x-member-token') || memberToken)) {
      return NextResponse.json(
        { error: 'MEMBER_AUTH_REQUIRED', message: 'Session membre invalide — reconnectez-vous.' },
        { status: 401 },
      );
    }
    const charge = await debit(memberId, ACU_COSTS.chat);
    if (!charge.ok) {
      return NextResponse.json(
        { error: 'ACU_INSUFFICIENT', balance: charge.balance, cost: ACU_COSTS.chat,
          message: 'Solde ACU insuffisant — cotisez pour recharger vos ACUs.' },
        { status: 402 },
      );
    }

    const system = SYSTEM_PROMPT(agentName || 'Agent CDP');
    const providers: Array<[string, (s: string, m: string) => Promise<string | null>]> = [
      ['claude', tryClaude],
      ['openai', tryOpenAI],
      ['gemini', tryGemini],
    ];

    const errors: string[] = [];
    for (const [name, fn] of providers) {
      try {
        const text = await fn(system, message);
        if (text) return NextResponse.json({ response: text, provider: name, acuRemaining: charge.remaining });
        // null = provider not configured, skip silently
      } catch (e) {
        errors.push(`${name}: ${e instanceof Error ? e.message : 'error'}`);
      }
    }

    // No provider configured or all failed — refund the charge (no value delivered)
    await refund(memberId, ACU_COSTS.chat);
    console.error('All AI providers unavailable:', errors.join(' | '));
    return NextResponse.json(
      { error: 'AI service unavailable', detail: errors.length ? 'all providers failed' : 'no provider configured' },
      { status: 503 },
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
