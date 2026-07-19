/**
 * Input validation utilities for API requests
 * Ensures data integrity and prevents injection attacks
 */

export interface ValidatedMessage {
  role: "user" | "assistant";
  content: string;
}

const MAX_MESSAGE_LENGTH = 2000;
const MAX_MESSAGES_COUNT = 50;
const VALID_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 25;

/**
 * Validates chat message array
 * @throws Error if validation fails
 */
export const validateMessages = (messages: any): ValidatedMessage[] => {
  if (!Array.isArray(messages)) {
    throw new Error("Messages must be an array");
  }

  if (messages.length === 0) {
    throw new Error("Messages array cannot be empty");
  }

  if (messages.length > MAX_MESSAGES_COUNT) {
    throw new Error(`Messages count exceeds maximum of ${MAX_MESSAGES_COUNT}`);
  }

  return messages.map((msg, index) => {
    if (!msg.role || !msg.content) {
      throw new Error(`Message at index ${index} missing 'role' or 'content'`);
    }

    if (msg.role !== "user" && msg.role !== "assistant") {
      throw new Error(
        `Message at index ${index} has invalid role. Expected 'user' or 'assistant', got '${msg.role}'`
      );
    }

    if (typeof msg.content !== "string") {
      throw new Error(`Message at index ${index} content must be a string`);
    }

    const content = msg.content.trim();
    if (content.length === 0) {
      throw new Error(`Message at index ${index} cannot be empty`);
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new Error(
        `Message at index ${index} exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`
      );
    }

    return {
      role: msg.role,
      content,
    };
  });
};

/**
 * Validates system instruction (optional field)
 */
export const validateSystemInstruction = (instruction: any): string | null => {
  if (instruction === undefined || instruction === null) {
    return null;
  }

  if (typeof instruction !== "string") {
    throw new Error("systemInstruction must be a string");
  }

  const trimmed = instruction.trim();
  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length > 1000) {
    throw new Error("systemInstruction exceeds maximum length of 1000 characters");
  }

  return trimmed;
};

/**
 * Validates base64 image data
 */
export const validateImageData = (
  base64Image: any,
  mimeType: any
): { base64: string; mimeType: string } => {
  if (!base64Image) {
    throw new Error("base64Image is required");
  }

  if (typeof base64Image !== "string") {
    throw new Error("base64Image must be a string");
  }

  // Validate base64 format
  if (!isValidBase64(base64Image)) {
    throw new Error("base64Image is not valid base64 format");
  }

  // Estimate file size (rough: base64 is ~33% larger than binary)
  const estimatedSizeMB = (base64Image.length * 0.75) / (1024 * 1024);
  if (estimatedSizeMB > MAX_IMAGE_SIZE_MB) {
    throw new Error(
      `Image exceeds maximum size of ${MAX_IMAGE_SIZE_MB}MB (estimated: ${estimatedSizeMB.toFixed(2)}MB)`
    );
  }

  // Validate MIME type
  const mime = mimeType || "image/png";
  if (!VALID_MIME_TYPES.includes(mime)) {
    throw new Error(
      `Invalid MIME type '${mime}'. Allowed: ${VALID_MIME_TYPES.join(", ")}`
    );
  }

  return {
    base64: base64Image,
    mimeType: mime,
  };
};

/**
 * Validates image analysis prompt
 */
export const validateImagePrompt = (prompt: any): string => {
  if (prompt === undefined || prompt === null) {
    return "Analyze this financial document, statement, or investment chart. Extract the exact numbers, interpret key performance parameters, list potential risks, and recommend optimized YieldWise actions.";
  }

  if (typeof prompt !== "string") {
    throw new Error("prompt must be a string");
  }

  const trimmed = prompt.trim();
  if (trimmed.length === 0) {
    return "Analyze this financial document, statement, or investment chart. Extract the exact numbers, interpret key performance parameters, list potential risks, and recommend optimized YieldWise actions.";
  }

  if (trimmed.length > 500) {
    throw new Error("prompt exceeds maximum length of 500 characters");
  }

  return trimmed;
};

/**
 * Simple base64 validation
 */
function isValidBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (e) {
    return false;
  }
}
