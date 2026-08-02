/**
 * In-memory rate limiter for API routes (per serverless instance).
 * Not perfectly global across Vercel instances, but stops the common
 * launch-day abuse patterns (scripted hammering, cost blowups) with
 * zero external dependencies.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the map can't grow unbounded
const CLEANUP_INTERVAL = 5 * 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  Array.from(buckets.entries()).forEach(([key, b]) => {
    if (b.resetAt < now) buckets.delete(key);
  });
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key      identifier (usually IP + route)
 * @param limit    max requests per window
 * @param windowMs window length in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  cleanup();
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
