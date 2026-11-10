/**
 * Trend Intelligence — Growth Brief v1 contract (spec §6 + Appendix A).
 *
 * This is the single shared object the trend layer passes to the host's existing
 * SEO/marketing agents. It is a CLOSED object: unknown fields are rejected.
 * Validation mirrors the JSON Schema plus the "runtime rules beyond JSON Schema"
 * (§507): valid_from < expires_at, valid_from ≤ now < expires_at, etc.
 */

export const BRIEF_CHANNELS = [
  'seo', 'organic_social', 'sales_enablement', 'owned_placement', 'lifecycle', 'paid',
] as const;
export type BriefChannel = (typeof BRIEF_CHANNELS)[number];

/** v1 draft routes actually enabled (§507); the rest reserve routing values only. */
export const V1_ENABLED_CHANNELS: BriefChannel[] = ['seo', 'organic_social'];

export interface GrowthBrief {
  schema_version: 1;
  brief_id: string;
  brief_version: number;
  tenant_id: string;
  platform_id: string;
  market: string;              // ISO alpha-2, or ZZ for global (§16)
  locale: string;
  topic_id: string;
  opportunity_score: number;   // 0–100
  confidence: number;          // 0–100
  valid_from: string;          // RFC3339 UTC (…Z)
  expires_at: string;          // RFC3339 UTC (…Z)
  evidence_ids: string[];      // ≥1
  audience: string;
  intent: string;
  approved_claim_ids: string[];
  cta_id: string;
  allowed_channels: BriefChannel[];
  prohibited_claims: string[];
  objective: string;
  experiment_id: string;
  policy_version: number;
}

const ID_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const MARKET_RE = /^[A-Z]{2}$/;
const UTC_RE = /Z$/;

const REQUIRED: (keyof GrowthBrief)[] = [
  'schema_version', 'brief_id', 'brief_version', 'tenant_id', 'platform_id', 'market',
  'locale', 'topic_id', 'opportunity_score', 'confidence', 'valid_from', 'expires_at',
  'evidence_ids', 'audience', 'intent', 'approved_claim_ids', 'cta_id', 'allowed_channels',
  'prohibited_claims', 'objective', 'experiment_id', 'policy_version',
];

const ALLOWED = new Set<string>(REQUIRED as string[]);

export interface ValidationResult { ok: boolean; errors: string[]; brief?: GrowthBrief; }

const isId = (v: unknown) => typeof v === 'string' && ID_RE.test(v);
const isScore = (v: unknown) => typeof v === 'number' && v >= 0 && v <= 100;
const isUtc = (v: unknown) => typeof v === 'string' && UTC_RE.test(v) && !Number.isNaN(Date.parse(v));
const isShortText = (v: unknown) => typeof v === 'string' && v.length >= 1 && v.length <= 500;
const isIdList = (v: unknown, min = 0) =>
  Array.isArray(v) && v.length >= min && v.length <= 64 && new Set(v).size === v.length && v.every(isId);

/**
 * Schema + runtime validation (§6, §507). `now` defaults to current time so the
 * active-window rule can be checked; pass a fixed time for deterministic tests.
 */
export function validateBrief(input: unknown, now: Date = new Date()): ValidationResult {
  const e: string[] = [];
  if (typeof input !== 'object' || input === null) return { ok: false, errors: ['not an object'] };
  const b = input as Record<string, unknown>;

  // closed object: reject unknown fields
  for (const k of Object.keys(b)) if (!ALLOWED.has(k)) e.push(`unknown field: ${k}`);
  for (const k of REQUIRED) if (!(k in b)) e.push(`missing field: ${k}`);

  if (b.schema_version !== 1) e.push('schema_version must be 1');
  if (!isId(b.brief_id)) e.push('brief_id invalid');
  if (typeof b.brief_version !== 'number' || b.brief_version < 1 || !Number.isInteger(b.brief_version)) e.push('brief_version invalid');
  if (!isId(b.tenant_id)) e.push('tenant_id invalid');
  if (!isId(b.platform_id)) e.push('platform_id invalid');
  if (typeof b.market !== 'string' || !MARKET_RE.test(b.market)) e.push('market must be ISO alpha-2');
  if (typeof b.locale !== 'string' || b.locale.length < 2 || b.locale.length > 35) e.push('locale invalid');
  if (!isId(b.topic_id)) e.push('topic_id invalid');
  if (!isScore(b.opportunity_score)) e.push('opportunity_score 0–100');
  if (!isScore(b.confidence)) e.push('confidence 0–100');
  if (!isUtc(b.valid_from)) e.push('valid_from must be RFC3339 UTC (…Z)');
  if (!isUtc(b.expires_at)) e.push('expires_at must be RFC3339 UTC (…Z)');
  if (!isIdList(b.evidence_ids, 1)) e.push('evidence_ids: 1–64 unique ids');
  if (!isShortText(b.audience)) e.push('audience invalid');
  if (!isShortText(b.intent)) e.push('intent invalid');
  if (!isIdList(b.approved_claim_ids, 0)) e.push('approved_claim_ids invalid');
  if (!isId(b.cta_id)) e.push('cta_id invalid');
  if (!Array.isArray(b.allowed_channels) || b.allowed_channels.length < 1 || b.allowed_channels.length > 6
      || new Set(b.allowed_channels).size !== b.allowed_channels.length
      || !b.allowed_channels.every(c => (BRIEF_CHANNELS as readonly string[]).includes(c as string))) {
    e.push('allowed_channels: 1–6 unique from the channel enum');
  }
  if (!Array.isArray(b.prohibited_claims) || b.prohibited_claims.length > 32
      || !b.prohibited_claims.every(isShortText)) e.push('prohibited_claims invalid');
  if (!isShortText(b.objective)) e.push('objective invalid');
  if (!isId(b.experiment_id)) e.push('experiment_id invalid');
  if (typeof b.policy_version !== 'number' || b.policy_version < 1 || !Number.isInteger(b.policy_version)) e.push('policy_version invalid');

  // runtime rules beyond JSON Schema (§507)
  if (isUtc(b.valid_from) && isUtc(b.expires_at)) {
    const vf = Date.parse(b.valid_from as string);
    const ex = Date.parse(b.expires_at as string);
    if (!(vf < ex)) e.push('valid_from must be before expires_at');
    if (!(vf <= now.getTime() && now.getTime() < ex)) e.push('brief is not currently in its active window');
  }

  return e.length ? { ok: false, errors: e } : { ok: true, errors: [], brief: b as unknown as GrowthBrief };
}
