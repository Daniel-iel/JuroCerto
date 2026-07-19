import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [ip: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number; // milliseconds
  keyGenerator?: (req: Request) => string;
}

/**
 * Simple in-memory rate limiter middleware
 * Tracks requests per IP address within a time window
 */
export const createRateLimiter = (options: RateLimitOptions) => {
  const { maxRequests, windowMs, keyGenerator = (req) => req.ip || "unknown" } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Initialize or check existing entry
    if (!store[key]) {
      store[key] = { count: 1, resetTime: now + windowMs };
      next();
      return;
    }

    const entry = store[key];

    // Reset if window has expired
    if (now > entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + windowMs;
      next();
      return;
    }

    // Increment counter
    entry.count++;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      console.warn(
        `[RATE_LIMIT] ${key} exceeded limit (${entry.count}/${maxRequests}) on ${req.path}`
      );
      res
        .status(429)
        .set("Retry-After", retryAfter.toString())
        .json({
          error: "Too many requests. Please try again later.",
          retryAfter,
        });
      return;
    }

    next();
  };
};

/**
 * Cleanup old entries from store (call periodically)
 */
export const cleanupRateLimitStore = (): void => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
};

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
