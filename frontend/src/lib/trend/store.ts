/**
 * Trend Intelligence — keyless pipeline + SHARED store, embedded in the platform.
 *
 * Briefs persist in Firestore (via the Admin SDK) so EVERY agent invocation — AI
 * chat, growth tools, SEO autopilot — can resolve the same approved brief at run
 * time (spec §4/§14). Without Firebase, falls back to an in-process store (dev/
 * demo only; cross-invocation resolution then needs Firebase).
 */
import { adminDb } from '@/lib/firebaseAdmin';
import {
  robustZ, countGate, demandFromZ, median, opportunityScore, confidenceScore,
  corroborationFromFamilies, classify, round2, type Disposition,
} from './scoring';

export interface Observation {
  source_family: string;
  topic_id: string;
  market: string;
  locale: string;
  count: number;
  baseline: number;
  history: number[];
  observed_at: string;
  source_quality: number;
  freshness: number;
  coverage: number;
}

export interface PlatformProfile {
  fit: number; intent: number; timing: number; readiness: number;
  optIn: boolean;
}
export const DEFAULT_PROFILE: PlatformProfile = { fit: 70, intent: 65, timing: 75, readiness: 70, optIn: false };

export interface Opportunity {
  topic_id: string; market: string; locale: string;
  demand: number; opportunity_score: number; confidence: number;
  disposition: Disposition; families: string[]; gatePassed: boolean;
  evidence_ids: string[]; breakdown: Record<string, number>;
}

export interface StoredBrief {
  id: string; version: number; status: 'draft' | 'approved' | 'expired';
  topic_id: string; market: string; locale: string;
  opportunity_score: number; confidence: number;
  valid_from: string; expires_at: string; evidence_ids: string[];
  allowed_channels: string[]; objective: string; created_at: string;
  audience?: string; intent?: string;
}

// in-process fallback (dev/demo)
const mem: { observations: Observation[]; briefs: Record<string, StoredBrief> } = { observations: [], briefs: {} };
const obsKey = (o: Observation) => `${o.source_family}|${o.topic_id}|${o.market}|${o.observed_at}`;

export function ingest(batch: Observation[]): { accepted: number; duplicate: number; rejected: number } {
  let accepted = 0, duplicate = 0, rejected = 0;
  const seen = new Set(mem.observations.map(obsKey));
  for (const o of batch) {
    if (!o || typeof o.topic_id !== 'string' || typeof o.count !== 'number' || !/^[A-Z]{2}$/.test(o.market || '')) { rejected++; continue; }
    const k = obsKey(o);
    if (seen.has(k)) { duplicate++; continue; }
    seen.add(k); mem.observations.push(o); accepted++;
  }
  return { accepted, duplicate, rejected };
}
export function setObservations(list: Observation[]) { mem.observations = list; }
export function observationCount() { return mem.observations.length; }

export function buildOpportunities(profile: PlatformProfile = DEFAULT_PROFILE): Opportunity[] {
  const groups = new Map<string, Observation[]>();
  for (const o of mem.observations) {
    const g = `${o.topic_id}|${o.market}`;
    (groups.get(g) ?? groups.set(g, []).get(g)!).push(o);
  }
  const out: Opportunity[] = [];
  for (const [, obs] of groups) {
    const families = [...new Set(obs.map(o => o.source_family))].sort();
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

// ---- Brief persistence: Firestore (shared) with in-process fallback ----
const COLL = 'trend_briefs';

export async function createBrief(topic_id: string, market: string): Promise<StoredBrief | { error: string }> {
  const opp = buildOpportunities().find(o => o.topic_id === topic_id && o.market === market);
  if (!opp) return { error: 'opportunity not found' };
  if (opp.disposition !== 'brief' && opp.disposition !== 'auto_eligible') return { error: `not eligible (disposition: ${opp.disposition})` };
  const id = `gb_${topic_id}_${market}`.toLowerCase().replace(/[^a-z0-9_]/g, '');
  const prev = await getBrief(id);
  const now = new Date();
  const brief: StoredBrief = {
    id, version: (prev?.version ?? 0) + 1, status: 'draft',
    topic_id, market, locale: opp.locale,
    opportunity_score: opp.opportunity_score, confidence: opp.confidence,
    valid_from: now.toISOString(), expires_at: new Date(now.getTime() + 7 * 864e5).toISOString(),
    evidence_ids: opp.evidence_ids, allowed_channels: ['seo', 'organic_social'],
    objective: 'qualified outcomes per eligible session', created_at: now.toISOString(),
    audience: `Audience intéressée par « ${topic_id} »`, intent: `en savoir plus sur ${topic_id}`,
  };
  await putBrief(brief);
  return brief;
}

export async function approveBrief(id: string): Promise<StoredBrief | { error: string }> {
  const b = await getBrief(id);
  if (!b) return { error: 'brief not found' };
  b.status = 'approved';
  await putBrief(b);
  return b;
}

/** Approved, in-window brief for a scope (spec §16 GET /briefs:effective). */
export async function effectiveBrief(market: string, topic_id?: string): Promise<StoredBrief | null> {
  const now = Date.now();
  const all = await allBriefs();
  const matches = all.filter(b =>
    b.status === 'approved' && b.market === market && (!topic_id || b.topic_id === topic_id) &&
    Date.parse(b.valid_from) <= now && now < Date.parse(b.expires_at));
  return matches.sort((a, b) => b.version - a.version)[0] ?? null;
}

export async function listBriefs(): Promise<StoredBrief[]> { return allBriefs(); }

async function getBrief(id: string): Promise<StoredBrief | null> {
  const db = adminDb();
  if (db) { const d = await db.collection(COLL).doc(id).get(); return d.exists ? (d.data() as StoredBrief) : null; }
  return mem.briefs[id] ?? null;
}
async function putBrief(b: StoredBrief): Promise<void> {
  const db = adminDb();
  if (db) { await db.collection(COLL).doc(b.id).set(b); return; }
  mem.briefs[b.id] = b;
}
async function allBriefs(): Promise<StoredBrief[]> {
  const db = adminDb();
  if (db) { const s = await db.collection(COLL).limit(200).get(); return s.docs.map(d => d.data() as StoredBrief); }
  return Object.values(mem.briefs);
}
