import { NextRequest } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds (only in Node.js runtime)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}, 60_000);

/**
 * Checks whether a client has exceeded the rate limit for a given action.
 *
 * Uses a simple in-memory sliding-window counter.
 * This is safe for single-process Hostinger Node.js deployments but is NOT
 * a replacement for a distributed rate limiter (e.g. Redis) in multi-instance clusters.
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  if (entry.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: Math.max(0, entry.resetAt - now),
    };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count, resetInMs: Math.max(0, entry.resetAt - now) };
}

/**
 * Builds a rate-limit-aware NextResponse with appropriate headers.
 */
export function rateLimitResponse(
  limitResult: { allowed: boolean; remaining: number; resetInMs: number },
  retryAfterMs?: number
): Response | null {
  if (limitResult.allowed) return null;

  const retryAfterSeconds = retryAfterMs
    ? Math.ceil(retryAfterMs / 1000)
    : Math.ceil(limitResult.resetInMs / 1000);

  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests. Please wait a moment and try again.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
        'X-RateLimit-Remaining': '0',
      },
    }
  );
}

/**
 * Derives a safe rate-limit key from the request.
 * Uses IP address when available; falls back to a constant (which will
 * effectively rate-limit all unknown clients together — safe default).
 */
export function getRateLimitIdentifier(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return `rl:${forwardedFor.split(',')[0].trim()}`;
  }
  const raw = req.headers.get('x-real-ip') || req.ip || 'unknown';
  return `rl:${raw}`;
}
