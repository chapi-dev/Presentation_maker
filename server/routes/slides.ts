import { Router, type Request, type Response } from "express";
import { generateSlides } from "../services/openai.js";
import { searchWeb } from "../services/search.js";
import { buildLearnContext, isMicrosoftTopic } from "../services/microsoftLearn.js";

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

    // Step 1: Check if it's a Microsoft/Azure topic → use Learn docs
    const isMsTopic = isMicrosoftTopic(topic);
    let searchContext = "";
    let learnDiagrams: { src: string; alt: string }[] = [];

    if (isMsTopic) {
      console.log("📚 Microsoft topic detected — searching Microsoft Learn...");
      const learnContext = await buildLearnContext(topic);
      searchContext = learnContext.formattedContext;
      learnDiagrams = learnContext.architectureDiagrams.map((d) => ({
        src: d.src,
        alt: d.alt,
      }));
      console.log(`✅ Learn context ready (${searchContext.length} chars, ${learnDiagrams.length} diagrams)`);
    } else {
      // Fallback to Bing search for non-Microsoft topics
      console.log("Searching the web...");
      searchContext = await searchWeb(topic);
    }

    // Step 2: Generate slides using AI with the search/Learn context
    console.log("Generating slides with AI...");
    const slides = await generateSlides(topic, numSlides, searchContext, learnDiagrams);

    res.json({ slides });
  } catch (error: any) {
    console.error("Error generating slides:", error);
    res.status(500).json({
      error: error.message || "Error generando las slides.",
    });
  }
});

export default router;
