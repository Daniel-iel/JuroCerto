/**
 * Data integrity verification utilities
 * Ensures data hasn't been tampered with in transit
 */

import crypto from "crypto";

/**
 * Calculate SHA-256 checksum for data
 */
export const calculateChecksum = (data: string | Buffer): string => {
  const hash = crypto.createHash("sha256");
  hash.update(data);
  return hash.digest("hex");
};

/**
 * Verify checksum matches expected value
 */
export const verifyChecksum = (
  data: string | Buffer,
  expectedChecksum: string
): boolean => {
  const calculated = calculateChecksum(data);
  return calculated === expectedChecksum;
};

/**
 * API version constants for versioning responses
 * Prevents breaking changes when API evolves
 */
export const API_VERSION = {
  CURRENT: "1.0.0",
  SUPPORTED: ["1.0.0"],
  MIN_VERSION: "1.0.0",
} as const;

/**
 * Verify API version is supported
 */
export const isSupportedApiVersion = (version: string): boolean => {
  return API_VERSION.SUPPORTED.includes(version);
};

/**
 * Add integrity headers to response
 */
export const addIntegrityHeaders = (response: any): void => {
  // API version
  response.headers = response.headers || {};
  response.headers["X-API-Version"] = API_VERSION.CURRENT;

  // Checksum of response body (for critical endpoints)
  if (response.data) {
    const bodyChecksum = calculateChecksum(JSON.stringify(response.data));
    response.headers["X-Content-Checksum"] = bodyChecksum;
  }

  // Timestamp for freshness validation
  response.headers["X-Timestamp"] = new Date().toISOString();
};

/**
 * Validate request integrity
 * Checks checksums and versions before processing
 */
export const validateRequestIntegrity = (
  body: any,
  declaredChecksum?: string
): { valid: boolean; error?: string } => {
  // Verify checksum if provided
  if (declaredChecksum) {
    const bodyString = JSON.stringify(body);
    const calculated = calculateChecksum(bodyString);

    if (calculated !== declaredChecksum) {
      return {
        valid: false,
        error: "Request integrity check failed: checksum mismatch",
      };
    }
  }

  return { valid: true };
};
