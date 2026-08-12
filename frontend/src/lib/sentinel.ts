/**
 * SENTINEL — anti-hacking AI agent (server-side).
 *
 * 1. Human gate: stateless proof-of-work challenge. A real browser runs
 *    JavaScript, solves the challenge (SHA-256 with leading zeros) and sends
 *    the signed token. Plain scripts/bots without a JS runtime cannot.
 * 2. Threat inspection: every guarded request is scanned for injection
 *    payloads, bot user-agents and header anomalies. Violations raise the
 *    IP's threat score; crossing the threshold auto-blocks the IP.
 * 3. AI incident analysis: on demand, Sentinel sends the incident log to
 *    the AI chain for a triage report (admin endpoint).
 */

import { createHmac, createHash } from 'crypto';

const SECRET = process.env.HUMAN_GATE_SECRET || process.env.JWT_SECRET || 'lcd-sentinel-dev-secret';
const CHALLENGE_TTL_MS = 10 * 60_000;
export const POW_DIFFICULTY = 3; // sha256 hex must start with N zeros (~4k tries, <1s in browser)

// ── Human gate: challenge issue + verify ─────────────────────────
export function issueChallenge(): { challenge: string; sig: string; difficulty: number } {
  const challenge = `${Date.now()}.${Math.random().toString(36).slice(2, 12)}`;
  const sig = createHmac('sha256', SECRET).update(challenge).digest('hex').slice(0, 32);
  return { challenge, sig, difficulty: POW_DIFFICULTY };
}

/** Token format: `${challenge}|${sig}|${nonce}` — sent in x-human-token. */
export function verifyHumanToken(token: string | null): { ok: boolean; reason?: string } {
  if (!token) return { ok: false, reason: 'missing' };
  const parts = token.split('|');
  if (parts.length !== 3) return { ok: false, reason: 'format' };
  const [challenge, sig, nonce] = parts;

  const expected = createHmac('sha256', SECRET).update(challenge).digest('hex').slice(0, 32);
  if (sig !== expected) return { ok: false, reason: 'signature' };

  const ts = parseInt(challenge.split('.')[0], 10);
  if (!ts || Date.now() - ts > CHALLENGE_TTL_MS) return { ok: false, reason: 'expired' };

  const hash = createHash('sha256').update(`${challenge}.${nonce}`).digest('hex');
  if (!hash.startsWith('0'.repeat(POW_DIFFICULTY))) return { ok: false, reason: 'pow' };

  return { ok: true };
}

// ── Threat inspection ────────────────────────────────────────────
const BOT_UA_PATTERNS =
  /curl|wget|python-requests|python-urllib|httpx|aiohttp|go-http-client|java\/|okhttp|libwww|scrapy|phantomjs|headless|selenium|puppeteer|playwright|bot\b|spider|crawler|postman|insomnia/i;

const INJECTION_PATTERNS: Array<[RegExp, string]> = [
  [/(\bunion\b.{0,20}\bselect\b|\bselect\b.{0,30}\bfrom\b.{0,30}\bwhere\b|\bdrop\s+table\b|\binsert\s+into\b|--\s*$|;\s*--)/i, 'sql-injection'],
  [/<script[\s>]|javascript\s*:|onerror\s*=|onload\s*=|<iframe|document\.cookie/i, 'xss'],
  [/\$\{.*\}|\{\{.*\}\}|__proto__|constructor\s*\[/, 'template-injection'],
  [/\.\.\/\.\.\/|\/etc\/passwd|\/proc\/self|\bcmd\.exe\b|\/bin\/(?:ba)?sh\b/i, 'path-traversal'],
  [/ignore (all )?(previous|above) instructions|system prompt|you are now|jailbreak|DAN mode/i, 'prompt-injection'],
];

interface Incident {
  ip: string;
  type: string;
  detail: string;
  at: number;
}

const threatScores = new Map<string, { score: number; resetAt: number }>();
const blockedIps = new Map<string, number>(); // ip -> unblock time
const incidents: Incident[] = [];

const BLOCK_THRESHOLD = 5;
const BLOCK_DURATION_MS = 30 * 60_000;
const SCORE_WINDOW_MS = 15 * 60_000;
const MAX_INCIDENTS = 500;

function raise(ip: string, type: string, detail: string, weight = 1) {
  incidents.push({ ip, type, detail: detail.slice(0, 200), at: Date.now() });
  if (incidents.length > MAX_INCIDENTS) incidents.splice(0, incidents.length - MAX_INCIDENTS);

  const now = Date.now();
  const entry = threatScores.get(ip);
  if (!entry || entry.resetAt < now) {
    threatScores.set(ip, { score: weight, resetAt: now + SCORE_WINDOW_MS });
  } else {
    entry.score += weight;
    if (entry.score >= BLOCK_THRESHOLD) {
      blockedIps.set(ip, now + BLOCK_DURATION_MS);
      incidents.push({ ip, type: 'auto-block', detail: `score ${entry.score} — blocked 30min`, at: now });
    }
  }
}

export function isBlocked(ip: string): boolean {
  const until = blockedIps.get(ip);
  if (!until) return false;
  if (until < Date.now()) {
    blockedIps.delete(ip);
    return false;
  }
  return true;
}

/**
 * Inspect a request. Returns { allow: false } when the caller must be
 * rejected (blocked IP, bot signature, or injection payload found).
 */
export function inspect(
  ip: string,
  userAgent: string | null,
  bodyValues: unknown,
): { allow: boolean; reason?: string } {
  if (isBlocked(ip)) return { allow: false, reason: 'ip-blocked' };

  if (!userAgent || userAgent.length < 10) {
    raise(ip, 'no-user-agent', userAgent || 'empty', 2);
    return { allow: false, reason: 'bot-signature' };
  }
  if (BOT_UA_PATTERNS.test(userAgent)) {
    raise(ip, 'bot-user-agent', userAgent, 2);
    return { allow: false, reason: 'bot-signature' };
  }

  // Scan all string values in the body for attack payloads
  const strings: string[] = [];
  const collect = (v: unknown, depth = 0) => {
    if (depth > 4) return;
    if (typeof v === 'string') strings.push(v);
    else if (Array.isArray(v)) v.forEach(x => collect(x, depth + 1));
    else if (v && typeof v === 'object') Object.values(v).forEach(x => collect(x, depth + 1));
  };
  collect(bodyValues);

  for (const s of strings) {
    for (const [re, type] of INJECTION_PATTERNS) {
      if (re.test(s)) {
        raise(ip, type, s, 3);
        return { allow: false, reason: type };
      }
    }
  }

  return { allow: true };
}

// ── Reporting (admin) ────────────────────────────────────────────
export function sentinelReport() {
  const now = Date.now();
  return {
    blockedIps: Array.from(blockedIps.entries())
      .filter(([, until]) => until > now)
      .map(([ip, until]) => ({ ip, minutesLeft: Math.round((until - now) / 60000) })),
    recentIncidents: incidents.slice(-50).reverse(),
    totalIncidents: incidents.length,
  };
}

export function incidentLogText(): string {
  return incidents
    .slice(-40)
    .map(i => `[${new Date(i.at).toISOString()}] ${i.ip} ${i.type}: ${i.detail}`)
    .join('\n');
}
