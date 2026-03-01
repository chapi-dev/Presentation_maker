import OpenAI, { AzureOpenAI } from "openai";
import { DefaultAzureCredential, getBearerTokenProvider } from "@azure/identity";

/** Slide types the frontend knows how to render */
export type SlideType =
  | "cover"
  | "intro"
  | "content"
  | "stats"
  | "quote"
  | "cards"
  | "outro";

export interface SlideData {
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string;
  bullets?: string[];
  quote?: { text: string; author: string };
  stats?: { value: string; label: string }[];
  cards?: { title: string; description: string; icon: string }[];
  contactItems?: { icon: string; text: string }[];
  author?: string;
  pageLabel?: string;
}

const VALID_ICONS = [
  "Monitor",
  "Brain",
  "Briefcase",
  "Lightbulb",
  "Shield",
  "TrendingUp",
  "BarChart3",
  "Target",
  "Zap",
  "Globe",
  "Users",
  "Rocket",
  "Star",
  "Award",
  "Database",
  "Cpu",
  "Layers",
  "Settings",
  "Heart",
  "BookOpen",
];

/**
 * Creates the appropriate OpenAI client based on environment configuration.
 *
 * Priority:
 *   1. OPENAI_API_KEY → regular OpenAI (simplest, great for local dev)
 *   2. AZURE_OPENAI_ENDPOINT → Azure OpenAI with DefaultAzureCredential
 */
function createClient(): OpenAI {
  const openaiKey = process.env.OPENAI_API_KEY;
  const azureEndpoint = process.env.AZURE_OPENAI_ENDPOINT;

  // Option 1: Regular OpenAI API key (easiest for local development)
  if (openaiKey && !openaiKey.includes("YOUR_")) {
    console.log("✓ Using OpenAI API with API key");
    return new OpenAI({ apiKey: openaiKey });
  }

  // Option 2: Azure OpenAI + DefaultAzureCredential (for Azure deployment)
  if (azureEndpoint && !azureEndpoint.includes("YOUR_")) {
    console.log("✓ Using Azure OpenAI with DefaultAzureCredential");
    const credential = new DefaultAzureCredential();
    const scope = "https://cognitiveservices.azure.com/.default";
    const azureADTokenProvider = getBearerTokenProvider(credential, scope);

    return new AzureOpenAI({
      endpoint: azureEndpoint,
      azureADTokenProvider,
      apiVersion: "2024-08-01-preview",
    });
  }

  throw new Error(
    "No AI provider configured. Set OPENAI_API_KEY (for local dev) or AZURE_OPENAI_ENDPOINT (for Azure) in your .env file."
  );
}

export async function generateSlides(
  topic: string,
  numSlides: number,
  searchContext: string
): Promise<SlideData[]> {
  const model = process.env.OPENAI_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

  const client = createClient();

  const systemPrompt = `You are an expert presentation designer. You create professional, compelling slide decks.

RULES:
- Return ONLY a valid JSON array of slide objects — no markdown, no code fences, no explanation.
- The first slide MUST be type "cover" and the last MUST be type "outro".
- Use a mix of slide types: "cover", "intro", "content", "stats", "quote", "cards", "outro".
- Every slide MUST have a "type" and a "title".
- For "cover": include title, subtitle, author (use "Presentation by AI").
- For "intro": include title, content (a paragraph), optionally stats (array of {value, label}).
- For "content": include title, content (a paragraph), and/or bullets (array of strings).
- For "stats": include title, stats (array of {value, label} with 2-4 items), optionally content.
- For "quote": include quote.text and quote.author.
- For "cards": include title, cards (array of 3-5 {title, description, icon}). Icon must be one of: ${VALID_ICONS.join(", ")}.
- For "outro": include title, content (call to action text).
- All text in English unless the topic is in another language — then match that language.
- Make content insightful, data-driven, and professional. Use real statistics from the web search results when available.
- Each slide's pageLabel should be "Page XXX" format (001, 002, etc.). Cover and outro don't need one.`;

  const userPrompt = `Create a professional presentation with exactly ${numSlides} slides about: "${topic}"

Here is current web research on this topic:
${searchContext}

Generate exactly ${numSlides} slides. Return ONLY the JSON array.`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "[]";

  // Strip markdown code fences if the model includes them
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");

  try {
    const slides: SlideData[] = JSON.parse(cleaned);
    // Add page labels
    return slides.map((s, i) => ({
      ...s,
      pageLabel:
        s.type === "cover" || s.type === "outro"
          ? undefined
          : `Page ${String(i).padStart(3, "0")}`,
    }));
  } catch {
    console.error("Failed to parse AI response:", cleaned);
    throw new Error("El modelo AI retornó una respuesta inválida. Intenta de nuevo.");
  }
}
