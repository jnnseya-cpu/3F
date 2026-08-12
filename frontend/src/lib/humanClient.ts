'use client';

/**
 * Client-side proof-of-humanity solver.
 * Fetches a challenge, brute-forces a nonce so SHA-256(challenge.nonce)
 * starts with the required zeros, and returns the x-human-token value.
 * Runs only in a real browser with Web Crypto — scripts on plain HTTP can't.
 */

async function sha256Hex(input: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

let cachedToken: { token: string; expires: number } | null = null;

export async function getHumanToken(): Promise<string | null> {
  // Reuse a valid token for ~8 minutes (challenge TTL is 10)
  if (cachedToken && cachedToken.expires > Date.now()) return cachedToken.token;

  try {
    const res = await fetch('/api/security/challenge');
    if (!res.ok) return null;
    const { challenge, sig, difficulty } = await res.json();
    const prefix = '0'.repeat(difficulty);

    let nonce = 0;
    // Bounded loop — succeeds in a few thousand iterations for difficulty 3
    for (; nonce < 5_000_000; nonce++) {
      const hash = await sha256Hex(`${challenge}.${nonce}`);
      if (hash.startsWith(prefix)) break;
    }
    const token = `${challenge}|${sig}|${nonce}`;
    cachedToken = { token, expires: Date.now() + 8 * 60_000 };
    return token;
  } catch {
    return null;
  }
}

/** Wrapper: fetch with the human token header attached. */
export async function humanFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getHumanToken();
  const headers = new Headers(init.headers);
  if (token) headers.set('x-human-token', token);
  return fetch(url, { ...init, headers });
}
