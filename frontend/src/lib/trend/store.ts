/**
 * Trend Intelligence — keyless deterministic pipeline + in-process store (slice 1).
 *
 * Turns raw count observations into scored opportunities (spec §5/§17) with zero
 * AI and zero external keys. The store is in-process (survives across requests in
 * one server process) — the demonstrable keyless path. Production persistence
 * (Firestore via the Admin SDK) is the next slice; the pipeline functions here are
 * storage-agnostic and reused unchanged.
 */
import {
  robustZ, countGate, demandFromZ, median, opportunityScore, confidenceScore,
  corroborationFromFamilies, classify, round2, type Disposition,
} from './scoring';

export interface Observation {
  source_family: string;   // e.g. 'first_party_search', 'public_rss'
  topic_id: string;
  market: string;          // ISO alpha-2
  locale: string;
  count: number;           // comparable current count
  baseline: number;        // baseline median b
  history: number[];       // comparable historical counts
  observed_at: string;     // RFC3339
  source_quality: number;  // 0–100 (configured per family)
  freshness: number;       // 0–100
  coverage: number;        // 0–100
}

export interface PlatformProfile {
  fit: number; intent: number; timing: number; readiness: number; // 0–100
  optIn: boolean;
}

/** Default profile for the host (the party OS). Readiness>0 so topics are activatable. */
export const DEFAULT_PROFILE: PlatformProfile = { fit: 70, intent: 65, timing: 75, readiness: 70, optIn: false };

export interface Opportunity {
  topic_id: string;
  market: string;
  locale: string;
  demand: number;
  opportunity_score: number;
  confidence: number;
  disposition: Disposition;
  families: string[];
  gatePassed: boolean;
  evidence_ids: string[];
  breakdown: Record<string, number>;
}

interface Store {
  observations: Observation[];
  briefs: Record<string, StoredBrief>;
}
interface StoredBrief {
  id: string; version: number; status: 'draft' | 'approved' | 'expired';
  topic_id: string; market: string; locale: string;
  opportunity_score: number; confidence: number;
  valid_from: string; expires_at: string; evidence_ids: string[];
  allowed_channels: string[]; objective: string; created_at: string;
}

// Module-scope store (one per server process). Not shared across serverless instances.
const store: Store = { observations: [], briefs: {} };

const obsKey = (o: Observation) => `${o.source_family}|${o.topic_id}|${o.market}|${o.observed_at}`;

/** Ingest a batch, deduped by (family, topic, market, observed_at). */
export function ingest(batch: Observation[]): { accepted: number; duplicate: number; rejected: number } {
  let accepted = 0, duplicate = 0, rejected = 0;
  const seen = new Set(store.observations.map(obsKey));
  for (const o of batch) {
    if (!o || typeof o.topic_id !== 'string' || typeof o.count !== 'number' || !/^[A-Z]{2}$/.test(o.market || '')) { rejected++; continue; }
    const k = obsKey(o);
    if (seen.has(k)) { duplicate++; continue; }
    seen.add(k); store.observations.push(o); accepted++;
  }
  return { accepted, duplicate, rejected };
}

/** Compute scored opportunities from current observations (keyless, deterministic). */
export function buildOpportunities(profile: PlatformProfile = DEFAULT_PROFILE): Opportunity[] {
  const groups = new Map<string, Observation[]>();
  for (const o of store.observations) {
    const g = `${o.topic_id}|${o.market}`;
    (groups.get(g) ?? groups.set(g, []).get(g)!).push(o);
  }
  const out: Opportunity[] = [];
  for (const [, obs] of groups) {
    const families = [...new Set(obs.map(o => o.source_family))].sort();
    // demand = median of highest-weight valid observation per family (§17)
    const perFamilyDemand: number[] = [];
    let gateAny = false;
    for (const fam of families) {
      const fobs = obs.filter(o => o.source_family === fam);
      const best = fobs.reduce((a, b) => (b.count > a.count ? b : a));
      const z = robustZ(best.count, best.history.length ? best.history : [best.baseline]);
      if (countGate(best.count, z)) gateAny = true;
      perFamilyDemand.push(demandFromZ(z));
    }
    const demand = round2(median(perFamilyDemand));
    const singleFamily = families.length < 2;
    const conf = round2(confidenceScore({
      sourceQuality: median(obs.map(o => o.source_quality)),
      corroboration: corroborationFromFamilies(families.length),
      coverage: median(obs.map(o => o.coverage)),
      freshness: median(obs.map(o => o.freshness)),
    }, singleFamily));
    const score = round2(opportunityScore({ demand, fit: profile.fit, intent: profile.intent, timing: profile.timing, readiness: profile.readiness }));
    const veto = profile.readiness <= 0;
    const first = obs[0];
    out.push({
      topic_id: first.topic_id, market: first.market, locale: first.locale,
      demand, opportunity_score: score, confidence: conf,
      disposition: classify(score, conf, { veto, optIn: profile.optIn }),
      families, gatePassed: gateAny,
      evidence_ids: obs.map((_, i) => `ev_${first.topic_id}_${i}`).slice(0, 8),
      breakdown: { demand, fit: profile.fit, intent: profile.intent, timing: profile.timing, readiness: profile.readiness },
    });
  }
  return out.sort((a, b) => b.opportunity_score - a.opportunity_score);
}

export function createBrief(topic_id: string, market: string): StoredBrief | { error: string } {
  const opp = buildOpportunities().find(o => o.topic_id === topic_id && o.market === market);
  if (!opp) return { error: 'opportunity not found' };
  if (opp.disposition !== 'brief' && opp.disposition !== 'auto_eligible') return { error: `not eligible (disposition: ${opp.disposition})` };
  const id = `gb_${topic_id}_${market}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const prev = store.briefs[id];
  const now = new Date();
  const brief: StoredBrief = {
    id, version: (prev?.version ?? 0) + 1, status: 'draft',
    topic_id, market, locale: opp.locale,
    opportunity_score: opp.opportunity_score, confidence: opp.confidence,
    valid_from: now.toISOString(),
    expires_at: new Date(now.getTime() + 7 * 864e5).toISOString(), // 7 days (§17 persistent default)
    evidence_ids: opp.evidence_ids, allowed_channels: ['seo', 'organic_social'],
    objective: 'qualified outcomes per eligible session', created_at: now.toISOString(),
  };
  store.briefs[id] = brief;
  return brief;
}

export function approveBrief(id: string): StoredBrief | { error: string } {
  const b = store.briefs[id];
  if (!b) return { error: 'brief not found' };
  b.status = 'approved';
  return b;
}

/** Resolve the approved, in-window brief for a scope (§16 GET /briefs:effective). */
export function effectiveBrief(market: string, topic_id?: string): StoredBrief | null {
  const now = Date.now();
  const matches = Object.values(store.briefs).filter(b =>
    b.status === 'approved' && b.market === market && (!topic_id || b.topic_id === topic_id) &&
    Date.parse(b.valid_from) <= now && now < Date.parse(b.expires_at));
  return matches.sort((a, b) => b.version - a.version)[0] ?? null;
}

export function listBriefs(): StoredBrief[] { return Object.values(store.briefs); }
export function resetStore() { store.observations = []; store.briefs = {}; }
export function observationCount() { return store.observations.length; }
