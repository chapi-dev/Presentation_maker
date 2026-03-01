import { Router, type Request, type Response } from "express";
import { generateSlides } from "../services/openai.js";
import { searchWeb } from "../services/search.js";

const router = Router();

interface GenerateBody {
  topic: string;
  numSlides: number;
}

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { topic, numSlides } = req.body as GenerateBody;

    if (!topic || !numSlides || numSlides < 2 || numSlides > 20) {
      res.status(400).json({
        error: "Se requiere un tema y entre 2-20 slides.",
      });
      return;
    }

    console.log(`Generating ${numSlides} slides about: "${topic}"`);

    // Step 1: Search the web for information
    console.log("Searching the web...");
    const searchResults = await searchWeb(topic);

    // Step 2: Generate slides using Azure OpenAI with the search context
    console.log("Generating slides with AI...");
    const slides = await generateSlides(topic, numSlides, searchResults);

    res.json({ slides });
  } catch (error: any) {
    console.error("Error generating slides:", error);
    res.status(500).json({
      error: error.message || "Error generando las slides.",
    });
  }
});

export default router;
