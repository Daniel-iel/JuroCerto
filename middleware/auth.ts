import { Request, Response, NextFunction } from "express";

/**
 * Bearer token authentication middleware
 * Validates Authorization header format: Bearer <api-key>
 * Required for all protected API endpoints
 */
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }

  // Expected format: "Bearer <api-key>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ error: "Invalid Authorization header format. Use: Bearer <api-key>" });
    return;
  }

  const token = parts[1];

  // Validate API key from environment variable
  const validApiKey = process.env.JUROCERTO_API_KEY;
  if (!validApiKey) {
    console.error("JUROCERTO_API_KEY environment variable not set");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  if (token !== validApiKey) {
    console.warn(`[AUTH] Failed authentication attempt from ${req.ip}`);
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  // Authentication successful
  next();
};
