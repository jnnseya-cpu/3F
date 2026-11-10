/**
 * Trend Intelligence — brief resolution SDK for the platform's existing agents.
 *
 * The spec's core idea: existing agents resolve the EFFECTIVE brief at run time and
 * adapt, without rewriting their prompts permanently (§4/§14). `activeBriefGuidance`
 * returns a short block to append to an agent's system prompt. It is fail-safe:
 * any error, no Firebase, or no approved brief → '' (the agent runs its baseline
 * behaviour, per the §16 "204 → baseline" rule).
 */
import { effectiveBrief } from './store';

/** DRC-hosted platform default market. */
export const PLATFORM_MARKET = 'CD';

/**
 * Resolve the active approved brief for the market and return run-time guidance
 * for an agent's system prompt, or '' if there is none. Never throws.
 */
export async function activeBriefGuidance(market: string = PLATFORM_MARKET): Promise<string> {
  try {
    const b = await effectiveBrief(market);
    if (!b) return '';
    return [
      '',
      '--- BRIEF DE CROISSANCE ACTIF (priorité temporaire, ne remplace pas la politique du parti) ---',
      `Sujet prioritaire : « ${b.topic_id} ». Objectif : ${b.objective}.`,
      b.audience ? `Audience : ${b.audience}.` : '',
      b.intent ? `Intention : ${b.intent}.` : '',
      `Canaux autorisés : ${b.allowed_channels.join(', ')}. Mets ce sujet en avant quand c'est pertinent,`,
      `avec des liens internes et des appels à l'action adaptés. N'invente aucune statistique.`,
      `(brief ${b.id} v${b.version}, score ${b.opportunity_score}/conf ${b.confidence}, expire ${b.expires_at})`,
      '--- FIN DU BRIEF ---',
      '',
    ].filter(Boolean).join('\n');
  } catch {
    return '';
  }
}

/** The briefed priority topic for the market, or null — used by the SEO autopilot. */
export async function briefedTopic(market: string = PLATFORM_MARKET): Promise<string | null> {
  try {
    const b = await effectiveBrief(market);
    return b?.topic_id ?? null;
  } catch {
    return null;
  }
}
