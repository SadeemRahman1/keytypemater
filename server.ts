import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/gemini/generate-drill", async (req, res) => {
    try {
      const { targetKeys, topic, difficulty, wordCount } = req.body;

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      let prompt = `Generate a typing practice text snippet for a touch typing application.
The snippet should be approximately ${wordCount || 35} words long.
Output ONLY the raw text to be typed. No quotes, no markdown formatting, no explanations.`;

      if (targetKeys && targetKeys.length > 0) {
        prompt += `\nEmphasize words containing these specific letters/keys heavily: ${targetKeys.join(", ")}.`;
      }

      if (topic) {
        prompt += `\nTopic or Style: ${topic} (e.g. JavaScript programming code, medical terminology, sci-fi story, literature quote, business jargon).`;
      }

      if (difficulty) {
        prompt += `\nDifficulty level: ${difficulty}. For 'easy', use basic words and simple punctuation. For 'hard', include numbers, symbols, and varied casing.`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
        },
      });

      const generatedText = response.text?.trim() || "The quick brown fox jumps over the lazy dog.";
      // Clean up any extraneous markdown backticks if returned
      const cleanText = generatedText.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();

      res.json({ success: true, text: cleanText });
    } catch (error: any) {
      console.error("Error generating AI drill:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to generate AI typing drill",
        fallbackText: "Practice makes perfect. Focus on rhythm and precision rather than pure speed.",
      });
    }
  });

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for dev / static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KeyType Master server listening on http://localhost:${PORT}`);
  });
}

startServer();
