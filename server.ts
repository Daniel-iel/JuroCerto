import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { authenticateApiKey } from "./middleware/auth";
import { createRateLimiter } from "./middleware/rateLimit";
import { securityHeaders } from "./middleware/securityHeaders";
import { corsHandler } from "./middleware/cors";
import { enforceHttps, addHstsHeader } from "./middleware/https";
import { logger, requestLogger } from "./src/utils/logger";
import {
  validateMessages,
  validateSystemInstruction,
  validateImageData,
  validateImagePrompt,
} from "./src/utils/inputValidator";
import { sanitizeForAI } from "./src/utils/sanitizers";
import {
  validateImageComprehensive,
  detectMimeTypeFromSignature,
} from "./src/utils/imageValidator";
import {
  handleValidationError,
  handleAuthenticationError,
  handleServerError,
  handleRateLimitError,
} from "./src/utils/errorHandler";
import { API_VERSION } from "./src/utils/integrityCheck";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const HOST = process.env.HOST || "localhost";

// Enable JSON parser with reasonable limit for base64 images
app.use(express.json({ limit: "25mb" }));

// Security middleware (applied globally)
app.use(enforceHttps);
app.use(addHstsHeader);
app.use(securityHeaders);
app.use(corsHandler);
app.use(requestLogger);

// Rate limiters for different endpoints
const apiRateLimiter = createRateLimiter({
  maxRequests: 10,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

const imageAnalysisRateLimiter = createRateLimiter({
  maxRequests: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY environment variable is not set.");
}

// Helper to check Gemini client
const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but is missing.");
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return ai;
};

// 1. Advisor Chat Endpoint with High Thinking (Protected)
app.post("/api/chat", apiRateLimiter, authenticateApiKey, async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;

    // Validate input
    const validatedMessages = validateMessages(messages);
    const validatedSystemInstruction = validateSystemInstruction(systemInstruction);

    // Sanitize messages for AI
    const sanitizedMessages = validatedMessages.map((msg) => ({
      ...msg,
      content: sanitizeForAI(msg.content),
    }));

    const client = getAiClient();

    // We use gemini-3.1-pro-preview as explicitly requested.
    // "set thinkingLevel to ThinkingLevel.HIGH. Do not set maxOutputTokens."
    const formattedContents = sanitizedMessages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    logger.debug("AI Chat request", {
      messageCount: sanitizedMessages.length,
      ip: req.ip,
    });

    const response = await client.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: formattedContents,
      config: {
        systemInstruction:
          validatedSystemInstruction ||
          "You are an expert AI Financial Advisor at YieldWise. Provide extremely analytical, clear, and professional investment advice, answering queries thoroughly. Use markdown tables, bold highlights, bullet points, and clean lists.",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    logger.info("AI Chat request completed successfully");
    res.setHeader("X-API-Version", API_VERSION.CURRENT);
    res.json({ 
      text: response.text,
      apiVersion: API_VERSION.CURRENT 
    });
  } catch (error: any) {
    const errorMessage =
      error.message || "Internal server error in AI Chat";

    // Check for validation errors
    if (
      errorMessage.includes("Invalid") ||
      errorMessage.includes("required") ||
      errorMessage.includes("exceeds") ||
      errorMessage.includes("must be")
    ) {
      return handleValidationError(res, errorMessage);
    }

    // Check for authentication errors
    if (errorMessage.includes("unauthorized")) {
      return handleAuthenticationError(res, errorMessage);
    }

    // Server error
    handleServerError(res, error, "/api/chat");
  }
});

// 2. Image Analysis Endpoint with High Thinking (Protected)
app.post("/api/analyze-image", imageAnalysisRateLimiter, authenticateApiKey, async (req, res) => {
  try {
    const { base64Image, mimeType, prompt } = req.body;

    // Validate input
    const { base64: validatedBase64, mimeType: validatedMimeType } =
      validateImageData(base64Image, mimeType);
    
    // Enhanced image validation with magic byte verification
    validateImageComprehensive(validatedBase64, validatedMimeType);
    
    const validatedPrompt = validateImagePrompt(prompt);

    const client = getAiClient();

    logger.debug("Image analysis request", {
      mimeType: validatedMimeType,
      detectedFormat: detectMimeTypeFromSignature(validatedBase64),
      ip: req.ip,
    });

    const imagePart = {
      inlineData: {
        mimeType: validatedMimeType,
        data: validatedBase64,
      },
    };

    const textPart = {
      text: sanitizeForAI(validatedPrompt),
    };

    const response = await client.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        systemInstruction:
          "You are an expert financial document and statement analysis engine at YieldWise. Be extremely precise, double-check all calculations, and present your findings in a clean, structured report using Markdown.",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    logger.info("Image analysis request completed successfully");
    res.setHeader("X-API-Version", API_VERSION.CURRENT);
    res.json({ 
      text: response.text,
      apiVersion: API_VERSION.CURRENT 
    });
  } catch (error: any) {
    const errorMessage =
      error.message || "Internal server error in Image Analysis";
    
    // Check if it's a validation error (should return 400)
    if (
      errorMessage.includes("exceeds") ||
      errorMessage.includes("Invalid") ||
      errorMessage.includes("required") ||
      errorMessage.includes("does not match") ||
      errorMessage.includes("malicious") ||
      errorMessage.includes("not allowed")
    ) {
      return handleValidationError(res, errorMessage);
    }

    // Check for authentication errors
    if (errorMessage.includes("unauthorized")) {
      return handleAuthenticationError(res, errorMessage);
    }

    // Server error
    handleServerError(res, error, "/api/analyze-image");
  }
});

// Health check endpoint (no auth required)
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Vite middleware and server initialization
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    logger.info(`Server running`, {
      url: `http://${HOST}:${PORT}`,
      environment: process.env.NODE_ENV || "development",
      apiKeyConfigured: !!process.env.JUROCERTO_API_KEY,
    });
  });
}

startServer().catch((error) => {
  logger.error("Failed to start server", {
    error: error.message,
    stack: error.stack,
  });
});
