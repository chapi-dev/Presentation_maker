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
  | "outro"
  | "split"
  | "comparison"
  | "big-number"
  | "image-text"
  | "diagram";

export interface DiagramNode {
  id: string;
  label: string;
  icon?: string;    // key from AZURE_ICONS
  description?: string;
}

export interface DiagramConnection {
  from: string;
  to: string;
  label?: string;
}

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
  imageQuery?: string;
  leftTitle?: string;
  leftContent?: string;
  rightTitle?: string;
  rightContent?: string;
  // Diagram slide fields
  diagramType?: "flow" | "architecture" | "layers" | "cycle";
  nodes?: DiagramNode[];
  connections?: DiagramConnection[];
  architectureImage?: string; // URL from Learn
  sourceUrl?: string;         // Learn source reference
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
  searchContext: string,
  learnDiagrams: { src: string; alt: string }[] = []
): Promise<SlideData[]> {
  const model = process.env.OPENAI_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";

  const client = createClient();

  const systemPrompt = `You are an expert technical presentation designer. You create visually stunning, deeply informative slide decks with rich technical detail.

CRITICAL RULES:
- Return ONLY a valid JSON array of slide objects — no markdown, no code fences, no explanation.
- NEVER include dates, years, or time-specific references. No "2024", "2023", "this year", "recently", "last decade", "currently", etc. All content must be TIMELESS.
- The first slide MUST be type "cover" and the last MUST be type "outro".
- Use a DIVERSE mix of slide types. NEVER use the same type more than twice. Avoid consecutive identical types.
- Every slide MUST have "type" and "title".

AVAILABLE SLIDE TYPES:

"cover" — Opening slide
  Fields: title, subtitle, author (use "AI Presentation")

"intro" — Overview with optional key metrics
  Fields: title, content (2-3 detailed sentences), optionally stats [{value, label}] with 2-3 items

"content" — Main body with text and/or bullet points
  Fields: title, content (detailed paragraph), and/or bullets (array of 3-5 insightful strings)

"stats" — Key metrics showcase in glass cards
  Fields: title, stats [{value, label}] with 2-4 items, optionally content

"quote" — Expert insight or key principle
  Fields: quote {text, author} — use real industry experts or well-known technical figures

"cards" — Feature/concept grid with icons
  Fields: title, cards [{title, description, icon}] with 3-5 items
  icon MUST be one of: ${VALID_ICONS.join(", ")}

"split" — Two-column layout for contrasting ideas or detailed breakdown
  Fields: title, leftTitle, leftContent (2-3 sentences), rightTitle, rightContent (2-3 sentences)

"comparison" — Side-by-side comparison with introductory context
  Fields: title, content (brief intro sentence), leftTitle, leftContent (2-3 sentences), rightTitle, rightContent (2-3 sentences)

"big-number" — Hero statistic with context
  Fields: title, stats [{value, label}] with exactly 1 item, content (2-3 sentences explaining significance)

"image-text" — Visual accent panel with detailed text
  Fields: title, content (detailed paragraph 3-4 sentences), imageQuery (1-2 English words for abstract visual, e.g. "neural network", "cloud computing", "data flow")

"diagram" — Architecture or flow diagram showing how components connect (GREAT for Azure/Microsoft/technical topics)
  Fields: title, content (1-2 sentences explaining the architecture), diagramType (one of: "flow", "architecture", "layers", "cycle"),
  nodes: [{id: "unique-id", label: "Service Name", icon: "azure-icon-key", description: "Short description"}] (3-7 nodes),
  connections: [{from: "node-id", to: "node-id", label: "optional relationship label"}]
  Available icon keys for nodes: app-service, functions, storage, database, container, kubernetes, network, security, monitor, ai, api, identity, messaging, compute, devops, cloud
  Use this type when explaining system architectures, data flows, integration patterns, or service relationships.

"outro" — Closing slide
  Fields: title, content (call to action or summary)

CONTENT QUALITY REQUIREMENTS:
- Write substantive, specific content — NEVER use vague generalities or filler text.
- Include real technical concepts, patterns, frameworks, methodologies, and architecture details.
- Stats should use realistic numbers (percentages, multipliers, metrics) with meaningful context labels.
- Each bullet should contain a complete, valuable technical insight (not just a label or keyword).
- Paragraphs should be 2-4 sentences, packed with actionable technical detail.
- For split/comparison: each side should have 2-3 sentences of substantive content.
- For quotes: use real, attributable quotes from known technical leaders or industry experts.

LANGUAGE:
- All text in the SAME language as the topic. If the topic is in Spanish, write everything in Spanish, etc.
- pageLabel should be "Page XXX" format (001, 002, etc.). Cover and outro don't need one.`;

  const hasLearnContext = searchContext.includes("MICROSOFT LEARN DOCUMENTATION");
  const diagramHint = learnDiagrams.length > 0
    ? `\nIMPORTANT: Architecture diagrams were found in Microsoft Learn. Include at least 1-2 "diagram" type slides showing how the services/components connect. Available diagrams: ${learnDiagrams.map(d => d.alt).join(", ")}`
    : "";

  const learnHint = hasLearnContext
    ? `\nThis is a Microsoft/Azure topic. Use the Microsoft Learn documentation below as the PRIMARY source of truth. Structure the presentation to follow the documentation's logical sections. Include "diagram" slides to show architectures and service relationships.`
    : "";

  const userPrompt = `Create a professional technical presentation with exactly ${numSlides} slides about: "${topic}"

${searchContext ? `Context from research:\n${searchContext}\n` : ""}${learnHint}${diagramHint}

Requirements:
- Use at LEAST 5 different slide types for maximum visual variety
- Ensure deep technical detail throughout — be specific, not generic
- NO dates or year references anywhere in any slide${hasLearnContext ? "\n- For Microsoft/Azure topics, include at least one 'diagram' slide showing architecture/flow" : ""}
- Generate exactly ${numSlides} slides
- Return ONLY the JSON array`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.85,
    max_tokens: 10000,
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "[]";

  // Strip markdown code fences if the model includes them
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "");

  try {
    const slides: SlideData[] = JSON.parse(cleaned);
    // Add page labels and enrich diagram slides with Learn images
    return slides.map((s, i) => {
      const enriched: SlideData = {
        ...s,
        pageLabel:
          s.type === "cover" || s.type === "outro"
            ? undefined
            : `Page ${String(i).padStart(3, "0")}`,
      };

      // If this is a diagram slide and we have architecture diagrams from Learn, attach one
      if (s.type === "diagram" && learnDiagrams.length > 0 && !s.architectureImage) {
        const diagramIndex = slides.filter((sl, idx) => sl.type === "diagram" && idx < i).length;
        if (diagramIndex < learnDiagrams.length) {
          enriched.architectureImage = learnDiagrams[diagramIndex].src;
        }
      }

      return enriched;
    });
  } catch {
    console.error("Failed to parse AI response:", cleaned);
    throw new Error("El modelo AI retornó una respuesta inválida. Intenta de nuevo.");
  }
}
