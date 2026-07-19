/**
 * HTTPS enforcement middleware
 * Redirects HTTP to HTTPS in production
 * Adds HSTS header for strict transport security
 */

import { Request, Response, NextFunction } from "express";

/**
 * Middleware to enforce HTTPS in production
 * Redirects HTTP requests to HTTPS
 */
export const enforceHttps = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Skip in development
  if (process.env.NODE_ENV !== "production") {
    next();
    return;
  }

  // Check if request is already HTTPS or proxied through HTTPS
  const isSecure = req.protocol === "https" || req.get("x-forwarded-proto") === "https";

  if (!isSecure) {
    // Redirect to HTTPS
    const host = req.get("host");
    const url = `https://${host}${req.url}`;
    res.redirect(301, url);
    return;
  }

  next();
};

/**
 * Middleware to add HSTS (HTTP Strict Transport Security) header
 * Forces browsers to always use HTTPS
 */
export const addHstsHeader = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // In production: 1 year (31536000 seconds)
  // In development: 1 hour (3600 seconds) for easier testing
  const maxAge =
    process.env.NODE_ENV === "production"
      ? 31536000 // 1 year
      : 3600; // 1 hour

  res.setHeader(
    "Strict-Transport-Security",
    `max-age=${maxAge}; includeSubDomains; preload`
  );

  next();
};
