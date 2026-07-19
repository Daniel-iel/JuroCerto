/**
 * Security headers middleware configuration
 * Implements OWASP recommended headers for web application security
 */

import { Request, Response, NextFunction } from "express";

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking attacks
  res.setHeader("X-Frame-Options", "DENY");

  // Enable XSS protection (legacy, but still useful for older browsers)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Enforce HTTPS in production
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  // Referrer policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions policy (formerly Feature-Policy)
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  // Content Security Policy
  // Development: Allow Vite WebSocket, Google Fonts, Gemini API
  // Production: Allow only essential external resources (Gemini API, Google Fonts)
  const isDevelopment = process.env.NODE_ENV !== "production";
  const cspPolicy = isDevelopment
    ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com ws://localhost:*"
    : "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://generativelanguage.googleapis.com";
  
  res.setHeader("Content-Security-Policy", cspPolicy);

  next();
};
