import { NextRequest, NextResponse } from 'next/server';
import { sentinelReport, incidentLogText } from '@/lib/sentinel';

/**
 * Sentinel admin endpoint.
 *  GET  → live report: blocked IPs + recent incidents
 *  GET ?analyze=1 → AI threat-triage of the incident log (Claude→OpenAI→Gemini)
 * Protected by SENTINEL_ADMIN_KEY (Authorization: Bearer <key>).
 */

async function aiAnalyze(log: string): Promise<string | null> {
  const prompt = `Tu es l'agent de cybersécurité Sentinel du parti Le Congo D'Abord. Analyse ce journal d'incidents de sécurité et produis : 1) niveau de menace global (Faible/Moyen/Élevé/Critique), 2) types d'attaques détectées, 3) IPs les plus dangereuses, 4) recommandations d'action immédiates. Sois concis et actionnable.\n\nJOURNAL:\n${log || '(aucun incident)'}`;

  const key = process.env.ANTHROPIC_API_KEY;
  if (key) {
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (r.ok) return (await r.json()).content?.[0]?.text || null;
    } catch { /* fall through */ }
  }
  const okey = process.env.OPENAI_API_KEY;
  if (okey) {
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${okey}` },
        body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-4o-mini', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
      });
      if (r.ok) return (await r.json()).choices?.[0]?.message?.content || null;
    } catch { /* fall through */ }
  }
  return null;
}

export async function GET(req: NextRequest) {
  const adminKey = process.env.SENTINEL_ADMIN_KEY;
  if (adminKey) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const report = sentinelReport();
  if (req.nextUrl.searchParams.get('analyze') === '1') {
    const analysis = await aiAnalyze(incidentLogText());
    return NextResponse.json({ ...report, aiAnalysis: analysis || 'Analyse IA indisponible (aucune clé configurée).' });
  }
  return NextResponse.json(report);
}
