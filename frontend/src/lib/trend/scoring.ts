/**
 * Trend Intelligence — deterministic scoring engine (spec §5).
 *
 * KEYLESS / DETERMINISTIC path: pure functions, no AI model or provider needed.
 * All thresholds are spec defaults and overridable per source/geography later.
 * Conformance: the §5 example (TI-03) MUST yield opportunity 86.25, confidence 83.5.
 */

export const log1p = (x: number) => Math.log(1 + x);

/** median of a numeric array (no mutation of input). */
export function median(xs: number[]): number {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Median Absolute Deviation. */
export function mad(xs: number[]): number {
  if (xs.length === 0) return 0;
  const med = median(xs);
  return median(xs.map(x => Math.abs(x - med)));
}

/** Log lift of a comparable current count c vs baseline median b (§5.3). */
export function logLift(c: number, b: number): number {
  return Math.log((c + 1) / (b + 1));
}

/** Robust anomaly z-score on log counts (§5.3). Floor on scale = 0.2. */
export function robustZ(c: number, history: number[]): number {
  const logs = history.map(log1p);
  const scale = Math.max(1.4826 * mad(logs), 0.2);
  return (log1p(c) - median(logs)) / scale;
}

/** Count-feed gate (§5.3): c >= cMin and z >= zMin. Index/rank feeds use their own gates. */
export function countGate(c: number, z: number, cMin = 20, zMin = 2): boolean {
  return c >= cMin && z >= zMin;
}

/** Reference count-feed demand mapping (§17): clamp(50 + 10*z, 0, 100) after gates. */
export function demandFromZ(z: number): number {
  return Math.min(100, Math.max(0, 50 + 10 * z));
}

export interface OpportunityInputs {
  demand: number;    // 0–100 (from calibrated source scores)
  fit: number;       // 0–100 (profile product/category/geo/persona)
  intent: number;    // 0–100 (explicit behaviour + taxonomy)
  timing: number;    // 0–100 (remaining actionable window)
  readiness: number; // 0–100 (stock/partner/capacity/approved assets)
}

/** 0–100 opportunity score (§5.4): 25 demand, 25 fit, 20 intent, 15 timing, 15 readiness.
 *  Missing readiness (0) blocks activation downstream (veto), but the score still computes. */
export function opportunityScore(i: OpportunityInputs): number {
  return 0.25 * i.demand + 0.25 * i.fit + 0.20 * i.intent + 0.15 * i.timing + 0.15 * i.readiness;
}

export interface ConfidenceInputs {
  sourceQuality: number;   // 0–100 (mean of contributing families' quality)
  corroboration: number;   // 0–100 (0=1 family, 80=2, 100=3+)
  coverage: number;        // 0–100 (mean valid observed/expected ratio ×100)
  freshness: number;       // 0–100 (per-family taper to stale-after)
}

/** 0–100 confidence (§5.5): 35 source quality, 25 corroboration, 20 coverage, 20 freshness.
 *  A single source family is capped at 69 (§5.5). */
export function confidenceScore(i: ConfidenceInputs, singleFamily = false): number {
  const raw = 0.35 * i.sourceQuality + 0.25 * i.corroboration + 0.20 * i.coverage + 0.20 * i.freshness;
  return singleFamily ? Math.min(69, raw) : raw;
}

/** Corroboration value from the number of independent source families (§17). */
export function corroborationFromFamilies(n: number): number {
  if (n >= 3) return 100;
  if (n === 2) return 80;
  return 0;
}

export type Disposition = 'archive' | 'watch' | 'brief' | 'auto_eligible';

/**
 * Decision table (§5). `veto` (out-of-market, unsupported claim, no inventory, etc.)
 * and `optIn` (tenant opt-in for bounded auto actions) gate the top tiers.
 */
export function classify(
  score: number,
  confidence: number,
  opts: { veto?: boolean; optIn?: boolean } = {},
): Disposition {
  if (score < 60 || confidence < 55) return 'archive';
  if (score >= 85 && confidence >= 85 && opts.optIn && !opts.veto) return 'auto_eligible';
  if (score >= 75 && confidence >= 75 && !opts.veto) return 'brief';
  return 'watch';
}

/** Round only for display (§17: score at full precision). */
export const round2 = (x: number) => Math.round(x * 100) / 100;
