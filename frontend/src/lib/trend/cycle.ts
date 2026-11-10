/**
 * Trend Intelligence — automatic background cycle (invisible operation).
 *
 * Runs with no human interaction and no user-facing surface: reads the platform's
 * own real signals, scores them, and auto-manages the Growth Brief within strict
 * guardrails. The existing agents (chat, growth, SEO autopilot) then resolve the
 * effective brief at run time and adapt — the user never sees a trend UI.
 *
 * Safety: a brief is only auto-created+approved when an opportunity reaches the
 * 'brief'/'auto_eligible' disposition (score ≥75 AND confidence ≥75). Page views
 * alone are a single source family capped at 69 confidence (§3), so nothing
 * auto-activates until genuinely corroborated signal exists — conservative by
 * design. The brief only steers DRAFT generation and topic choice, never a live
 * publish or irreversible send (spec §7 pilot: drafts and internal tasks only).
 */
import { collectPlatformObservations } from './signals';
import { setObservations, buildOpportunities, createBrief, approveBrief } from './store';

export interface CycleResult {
  signals: number;
  opportunities: number;
  eligible: number;
  activated: string | null;
  note?: string;
}

export async function runTrendCycle(): Promise<CycleResult> {
  const obs = await collectPlatformObservations();
  setObservations(obs);
  if (obs.length === 0) {
    return { signals: 0, opportunities: 0, eligible: 0, activated: null, note: 'no real signals available' };
  }
  const opps = buildOpportunities();
  const eligible = opps.filter(o => o.disposition === 'brief' || o.disposition === 'auto_eligible');
  if (eligible.length === 0) {
    return { signals: obs.length, opportunities: opps.length, eligible: 0, activated: null, note: 'no opportunity cleared the brief gate (score≥75 & confidence≥75)' };
  }
  // Activate the single top eligible opportunity (one active brief per scope).
  const top = eligible[0];
  const created = await createBrief(top.topic_id, top.market);
  if ('error' in created) {
    return { signals: obs.length, opportunities: opps.length, eligible: eligible.length, activated: null, note: created.error };
  }
  await approveBrief(created.id);
  return { signals: obs.length, opportunities: opps.length, eligible: eligible.length, activated: created.id };
}
