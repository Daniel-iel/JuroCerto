/**
 * Enhanced image validation with magic byte verification
 * Prevents malicious files disguised as images
 */

/**
 * Common image file signatures (magic bytes)
 * These are the first few bytes of file formats that uniquely identify them
 */
const IMAGE_SIGNATURES: { [key: string]: Buffer } = {
  // JPEG: FF D8 FF
  "image/jpeg": Buffer.from([0xff, 0xd8, 0xff]),
  // PNG: 89 50 4E 47 08 0D 0A 1A
  "image/png": Buffer.from([0x89, 0x50, 0x4e, 0x47]),
  // WebP: RIFF .... WEBP
  "image/webp": Buffer.from([0x52, 0x49, 0x46, 0x46]),
};

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_MB = 25;

/**
 * Validates image by checking magic bytes (file signature)
 * This prevents attacks where malicious files are renamed to .jpg/.png
 *
 * @param base64String - Base64 encoded image data
 * @param mimeType - Declared MIME type
 * @returns true if image signature matches declared MIME type
 * @throws Error if validation fails
 */
export const validateImageSignature = (
  base64String: string,
  mimeType: string
): boolean => {
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(
      `MIME type '${mimeType}' not allowed. Supported: ${ALLOWED_MIME_TYPES.join(", ")}`
    );
  }

  // Decode base64 to get binary data
  let binaryData: Buffer;
  try {
    binaryData = Buffer.from(base64String, "base64");
  } catch (error) {
    throw new Error("Invalid base64 encoding");
  }

  // Check file size
  const sizeMB = binaryData.length / (1024 * 1024);
  if (sizeMB > MAX_IMAGE_SIZE_MB) {
    throw new Error(
      `Image exceeds maximum size of ${MAX_IMAGE_SIZE_MB}MB (actual: ${sizeMB.toFixed(2)}MB)`
    );
  }

  // Check magic bytes
  const signature = IMAGE_SIGNATURES[mimeType];
  if (!signature) {
    throw new Error(`Unknown MIME type: ${mimeType}`);
  }

  // Compare first bytes of file with expected signature
  const fileSignature = binaryData.slice(0, signature.length);

  // For WebP, we need to check a bit differently (RIFF ... WEBP)
  if (mimeType === "image/webp") {
    const webpSignature = binaryData.slice(8, 12);
    if (webpSignature.toString() !== "WEBP") {
      throw new Error(
        `File signature does not match WebP format. Declared: ${mimeType}`
      );
    }
    return true;
  }

  // For JPEG and PNG, check standard signatures
  if (!fileSignature.equals(signature)) {
    throw new Error(
      `File signature does not match declared MIME type '${mimeType}'. This may indicate a malicious file.`
    );
  }

  return true;
};

/**
 * Extract MIME type from file signature (magic bytes)
 * Useful for verifying that declared MIME type matches actual file format
 */
export const detectMimeTypeFromSignature = (
  base64String: string
): string | null => {
  try {
    const binaryData = Buffer.from(base64String, "base64");

    // Check PNG
    if (
      binaryData.slice(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]))
    ) {
      return "image/png";
    }

    // Check JPEG
    if (binaryData.slice(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
      return "image/jpeg";
    }

    // Check WebP
    if (
      binaryData.slice(0, 4).toString() === "RIFF" &&
      binaryData.slice(8, 12).toString() === "WEBP"
    ) {
      return "image/webp";
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Comprehensive image validation
 * Combines size, MIME type, and signature validation
 */
export const validateImageComprehensive = (
  base64Image: string,
  declaredMimeType: string
): { valid: true; detectedMimeType: string } => {
  if (!base64Image || typeof base64Image !== "string") {
    throw new Error("base64Image must be a non-empty string");
  }

  // Validate signature
  validateImageSignature(base64Image, declaredMimeType);

  // Detect actual format from signature
  const detectedMimeType = detectMimeTypeFromSignature(base64Image);

  if (!detectedMimeType) {
    throw new Error("Could not detect image format from file signature");
  }

  // Warn if detected format differs from declared format
  if (detectedMimeType !== declaredMimeType) {
    console.warn(
      `[IMAGE_VALIDATION] MIME type mismatch: declared='${declaredMimeType}', detected='${detectedMimeType}'`
    );
  }

  return {
    valid: true,
    detectedMimeType,
  };
};
