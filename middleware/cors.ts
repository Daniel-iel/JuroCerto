/**
 * CORS (Cross-Origin Resource Sharing) configuration
 * Controls which domains can access the API
 */

import { Request, Response, NextFunction } from "express";

export const corsHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const allowedOrigins = getAllowedOrigins();

  const origin = req.headers.origin;

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else if (req.path !== "/api") {
    // For development and testing, allow requests without origin check for non-API routes
    if (process.env.NODE_ENV !== "production") {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "86400"); // 24 hours

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
};

/**
 * Get allowed origins based on environment
 */
function getAllowedOrigins(): string[] {
  if (process.env.NODE_ENV === "production") {
    const allowedEnv = process.env.ALLOWED_ORIGINS || "https://jurocerto.com";
    return allowedEnv.split(",").map((origin) => origin.trim());
  }

  // Development: allow localhost variants
  return [
    "http://localhost:3000",
    "http://localhost:5173", // Vite default dev port
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
  ];
}
