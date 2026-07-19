/**
 * Input sanitization utilities for security
 * Prevents injection and XSS attacks
 */

/**
 * Removes potentially dangerous control characters and special sequences
 * Designed to prevent prompt injection attacks
 */
export const sanitizeForAI = (input: string): string => {
  if (!input || typeof input !== "string") {
    return "";
  }

  let sanitized = input;

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Remove control characters (except newline, tab, carriage return)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Trim excessive whitespace
  sanitized = sanitized.trim();

  // Remove consecutive newlines (max 3)
  sanitized = sanitized.replace(/\n{4,}/g, "\n\n\n");

  return sanitized;
};

/**
 * Escapes HTML entities to prevent XSS when displaying user content
 */
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== "string") {
    return "";
  }

  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return text.replace(/[&<>"']/g, (char) => map[char] || char);
};

/**
 * Validates that input doesn't contain potentially malicious patterns
 * Returns true if input is safe, false otherwise
 */
export const isSafeInput = (input: string): boolean => {
  if (!input || typeof input !== "string") {
    return false;
  }

  // Check for SQL injection patterns
  const sqlPatterns = /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|SCRIPT|JAVASCRIPT)\b)/gi;
  if (sqlPatterns.test(input)) {
    return false;
  }

  // Check for prompt injection patterns (common jailbreak attempts)
  const injectionPatterns =
    /(ignore.*instructions|forget.*previous|system.*override|disregard.*prompt|you are|you\'re now|pretend|roleplay|act as|behave as)/gi;
  if (injectionPatterns.test(input)) {
    return false;
  }

  // Check for excessive special characters that might indicate attack
  const specialCharCount = (input.match(/[!@#$%^&*()_+=\[\]{};:'",.<>?/\\|`~]/g) || []).length;
  if (specialCharCount > input.length * 0.3) {
    return false;
  }

  return true;
};

/**
 * Sanitizes object recursively to prevent injection
 */
export const sanitizeObject = (obj: any): any => {
  if (typeof obj === "string") {
    return sanitizeForAI(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item));
  }

  if (obj !== null && typeof obj === "object") {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
};
