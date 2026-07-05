// Simple in-memory sliding-window rate limiter.
// For multi-instance deployments swap this for Upstash Redis or similar.

type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;

let lastSweep = Date.now();

function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return;
  lastSweep = now;
  const cutoff = now - WINDOW_MS;
  buckets.forEach((bucket, key) => {
    bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);
    if (bucket.timestamps.length === 0) buckets.delete(key);
  });
}

/**
 * Returns true if the request is allowed, false if rate-limited.
 * Default: 100 requests per minute per key.
 */
export function rateLimit(key: string, limit = 100): boolean {
  const now = Date.now();
  sweep(now);
  const bucket = buckets.get(key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => t > now - WINDOW_MS);
  if (bucket.timestamps.length >= limit) return false;
  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return true;
}

export function rateLimitResponse() {
  return Response.json(
    { error: "Too many requests. Try again in a minute." },
    { status: 429, headers: { "Retry-After": "60" } }
  );
}
