/**
 * ACU — AI Compute Units. Every AI action is metered and gated.
 * No ACUs = no AI action, enforced server-side. No exceptions.
 *
 * Earning ACUs (credited by the payment webhook, from the VERIFIED paid
 * amount — see lib/plans.ts). Spending is ATOMIC: debit uses a Firestore
 * compare-and-swap (optimistic concurrency) so N parallel requests can
 * never each spend the same balance (no TOCTOU → no free AI).
 *
 * Ledger storage: Firestore `acu_accounts/{memberId}` { balance, updatedAt }.
 * Without Firebase configured there is no ledger — and therefore no AI:
 * requests are refused (402), never served free.
 */

export const ACU_COSTS = {
  chat: 1,        // one agent conversation turn
  growth: 2,      // one growth-tool generation
  autopilot: 5,   // one autopilot blog article (system account)
} as const;

// Kept for backward-compat; the webhook now derives grants from the paid
// amount via lib/plans.ts, not from this map.
export const ACU_GRANTS: Record<string, number> = {
  monthly: 5,
  quarterly: 18,
  annual: 80,
};

const PROJECT = () => process.env.FIREBASE_PROJECT_ID;
const KEY = () => process.env.FIREBASE_API_KEY;
const BASE = () => `https://firestore.googleapis.com/v1/projects/${PROJECT()}/databases/(default)/documents`;

function docPath(memberId: string): string {
  return `projects/${PROJECT()}/databases/(default)/documents/acu_accounts/${memberId}`;
}
function docUrl(memberId: string): string {
  return `${BASE()}/acu_accounts/${encodeURIComponent(memberId)}?key=${KEY()}`;
}

export function ledgerConfigured(): boolean {
  return Boolean(PROJECT() && KEY());
}

/** Read balance only (no concurrency token). */
export async function getBalance(memberId: string): Promise<number> {
  if (!ledgerConfigured()) return 0;
  const res = await fetch(docUrl(memberId), { cache: 'no-store' });
  if (res.status === 404) return 0;
  if (!res.ok) throw new Error(`ACU ledger read failed: ${res.status}`);
  const doc = await res.json();
  return parseInt(doc.fields?.balance?.integerValue ?? '0', 10) || 0;
}

/** Read balance + the document's updateTime (the CAS token). */
async function readBalanceWithToken(
  memberId: string,
): Promise<{ balance: number; updateTime: string | null; exists: boolean }> {
  const res = await fetch(docUrl(memberId), { cache: 'no-store' });
  if (res.status === 404) return { balance: 0, updateTime: null, exists: false };
  if (!res.ok) throw new Error(`ACU ledger read failed: ${res.status}`);
  const doc = await res.json();
  return {
    balance: parseInt(doc.fields?.balance?.integerValue ?? '0', 10) || 0,
    updateTime: doc.updateTime ?? null,
    exists: true,
  };
}

/**
 * Commit a new balance guarded by a precondition:
 *  - existing doc → require updateTime unchanged (compare-and-swap)
 *  - new doc      → require it does not exist
 * Returns true on success, false if the precondition failed (someone else
 * wrote first — caller should retry).
 */
async function commitBalance(
  memberId: string,
  newBalance: number,
  precondition: { updateTime: string } | { exists: false },
): Promise<boolean> {
  const res = await fetch(`${BASE()}:commit?key=${KEY()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: docPath(memberId),
            fields: {
              balance: { integerValue: String(Math.max(0, Math.trunc(newBalance))) },
              updatedAt: { stringValue: new Date().toISOString() },
            },
          },
          updateMask: { fieldPaths: ['balance', 'updatedAt'] },
          currentDocument: precondition,
        },
      ],
    }),
  });
  if (res.ok) return true;
  // 400/409 FAILED_PRECONDITION → lost the race, signal retry.
  if (res.status === 400 || res.status === 409) return false;
  throw new Error(`ACU ledger write failed: ${res.status}`);
}

/**
 * Atomically spend `cost` ACUs (compare-and-swap with bounded retries).
 * A member can never overspend, even under concurrent requests.
 */
export async function debit(
  memberId: string,
  cost: number,
): Promise<{ ok: true; remaining: number } | { ok: false; reason: 'insufficient' | 'no_ledger'; balance: number }> {
  if (!ledgerConfigured()) return { ok: false, reason: 'no_ledger', balance: 0 };

  for (let attempt = 0; attempt < 6; attempt++) {
    const { balance, updateTime, exists } = await readBalanceWithToken(memberId);
    if (balance < cost) return { ok: false, reason: 'insufficient', balance };
    // No doc but positive balance is impossible; if !exists balance is 0 → handled above.
    const precondition = exists && updateTime ? { updateTime } : ({ exists: false } as const);
    const committed = await commitBalance(memberId, balance - cost, precondition);
    if (committed) return { ok: true, remaining: balance - cost };
    // else: concurrent writer won the race — re-read and retry
  }
  // Couldn't win the CAS after retries: refuse rather than risk overspend.
  return { ok: false, reason: 'insufficient', balance: await getBalance(memberId) };
}

/**
 * Atomically credit ACUs using a Firestore increment transform
 * (naturally race-safe — no read-modify-write window).
 * Called by the payment webhook after a verified, de-duplicated payment.
 */
export async function credit(memberId: string, amount: number): Promise<void> {
  if (!ledgerConfigured()) throw new Error('ACU ledger not configured');
  const inc = Math.trunc(amount);
  if (inc === 0) return;
  const res = await fetch(`${BASE()}:commit?key=${KEY()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      writes: [
        {
          update: {
            name: docPath(memberId),
            fields: { updatedAt: { stringValue: new Date().toISOString() } },
          },
          updateMask: { fieldPaths: ['updatedAt'] },
          updateTransforms: [{ fieldPath: 'balance', increment: { integerValue: String(inc) } }],
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`ACU credit failed: ${res.status}`);
}

/**
 * Refund ACUs that were debited for an action that then failed (e.g. all
 * AI providers were down). Best-effort; uses the atomic increment path.
 */
export async function refund(memberId: string, amount: number): Promise<void> {
  try {
    await credit(memberId, amount);
  } catch (e) {
    console.error('ACU refund failed:', e);
  }
}
