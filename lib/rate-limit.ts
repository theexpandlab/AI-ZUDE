/**
 * Lightweight in-memory rate limiter (PRD §6.3, §8 — protect the email-send
 * budget + data integrity). Fixed window per key (IP).
 *
 * NOTE: in-memory state is per serverless instance, so this is a best-effort
 * first line of defence, not a hard global limit. If abuse appears, swap for a
 * shared store (Upstash/Redis) or add a CAPTCHA — see PRD §6.3.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 5;

export function rateLimit(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now > existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfterSec: 0 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSec: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { ok: true, retryAfterSec: 0 };
}

/** Occasionally prune expired buckets to bound memory. */
export function pruneRateLimitBuckets(): void {
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (now > v.resetAt) buckets.delete(k);
  }
}
