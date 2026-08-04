/**
 * ACU — AI Compute Units. Every AI action is metered and gated.
 * No ACUs = no AI action, enforced server-side. No exceptions.
 *
 * Earning ACUs (credited by the payment webhook):
 *   - monthly plan  ($1)  →  5 ACUs
 *   - quarterly     ($3)  → 18 ACUs
 *   - annual        ($12) → 80 ACUs (bonus for annual commitment)
 *
 * Ledger storage: Firestore collection `acu_accounts/{memberId}` { balance }.
 * Without Firebase configured there is no ledger — and therefore no AI:
 * requests are refused (402), never served free.
 */

export const ACU_COSTS = {
  chat: 1,        // one agent conversation turn
  growth: 2,      // one growth-tool generation
  autopilot: 5,   // one autopilot blog article (system account)
} as const;

export const ACU_GRANTS: Record<string, number> = {
  monthly: 5,
  quarterly: 18,
  annual: 80,
};

const PROJECT = () => process.env.FIREBASE_PROJECT_ID;
const KEY = () => process.env.FIREBASE_API_KEY;

function docUrl(memberId: string): string {
  return `https://firestore.googleapis.com/v1/projects/${PROJECT()}/databases/(default)/documents/acu_accounts/${encodeURIComponent(memberId)}?key=${KEY()}`;
}

export function ledgerConfigured(): boolean {
  return Boolean(PROJECT() && KEY());
}

export async function getBalance(memberId: string): Promise<number> {
  if (!ledgerConfigured()) return 0;
  const res = await fetch(docUrl(memberId), { cache: 'no-store' });
  if (res.status === 404) return 0;
  if (!res.ok) throw new Error(`ACU ledger read failed: ${res.status}`);
  const doc = await res.json();
  return parseInt(doc.fields?.balance?.integerValue ?? '0', 10) || 0;
}

async function setBalance(memberId: string, balance: number): Promise<void> {
  const url = `${docUrl(memberId)}&updateMask.fieldPaths=balance&updateMask.fieldPaths=updatedAt`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        balance: { integerValue: String(Math.max(0, balance)) },
        updatedAt: { stringValue: new Date().toISOString() },
      },
    }),
  });
  if (!res.ok) throw new Error(`ACU ledger write failed: ${res.status}`);
}

/**
 * Attempt to spend `cost` ACUs. Returns the outcome:
 *  - ok: charge applied, `remaining` is the new balance
 *  - insufficient: balance too low (or ledger unavailable) — AI must NOT run
 */
export async function debit(
  memberId: string,
  cost: number,
): Promise<{ ok: true; remaining: number } | { ok: false; reason: 'insufficient' | 'no_ledger'; balance: number }> {
  if (!ledgerConfigured()) return { ok: false, reason: 'no_ledger', balance: 0 };
  const balance = await getBalance(memberId);
  if (balance < cost) return { ok: false, reason: 'insufficient', balance };
  await setBalance(memberId, balance - cost);
  return { ok: true, remaining: balance - cost };
}

/** Credit ACUs (called by the payment webhook after a verified payment). */
export async function credit(memberId: string, amount: number): Promise<number> {
  if (!ledgerConfigured()) throw new Error('ACU ledger not configured');
  const balance = await getBalance(memberId);
  const next = balance + amount;
  await setBalance(memberId, next);
  return next;
}
