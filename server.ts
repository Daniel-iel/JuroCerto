import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load env variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parser with reasonable limit for base64 images
app.use(express.json({ limit: "25mb" }));

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

// 1. Advisor Chat Endpoint with High Thinking
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const client = getAiClient();
    
    // We use gemini-3.1-pro-preview as explicitly requested.
    // "set thinkingLevel to ThinkingLevel.HIGH. Do not set maxOutputTokens."
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await client.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || "You are an expert AI Financial Advisor at YieldWise. Provide extremely analytical, clear, and professional investment advice, answering queries thoroughly. Use markdown tables, bold highlights, bullet points, and clean lists.",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// 2. Image Analysis Endpoint with High Thinking
app.post("/api/analyze-image", async (req, res) => {
  try {
    const { base64Image, mimeType, prompt } = req.body;
    if (!base64Image) {
      return res.status(400).json({ error: "base64Image is required" });
    }

    const client = getAiClient();
    
    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/png",
        data: base64Image,
      },
    };

    const textPart = {
      text: prompt || "Analyze this financial document, statement, or investment chart. Extract the exact numbers, interpret key performance parameters, list potential risks, and recommend optimized YieldWise actions.",
    };

    const response = await client.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        systemInstruction: "You are an expert financial document and statement analysis engine at YieldWise. Be extremely precise, double-check all calculations, and present your findings in a clean, structured report using Markdown.",
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in Image Analysis:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
