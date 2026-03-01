/**
 * Microsoft Learn Integration Service
 *
 * Searches and scrapes Microsoft Learn documentation to provide
 * accurate, up-to-date content for Azure/Microsoft technology presentations.
 */

/* ── Types ── */
export interface LearnArticle {
  title: string;
  url: string;
  description: string;
  sections: LearnSection[];
  images: LearnImage[];
}

export interface LearnSection {
  heading: string;
  content: string;
  level: number;
}

export interface LearnImage {
  src: string;
  alt: string;
  isArchitectureDiagram: boolean;
}

export interface LearnContext {
  articles: LearnArticle[];
  formattedContext: string;
  architectureDiagrams: LearnImage[];
  isMicrosoftTopic: boolean;
}

/* ── Microsoft topic detection ── */

const MS_KEYWORDS = [
  "azure", "microsoft", "dotnet", ".net", "c#", "csharp", "typescript",
  "visual studio", "vs code", "vscode", "windows", "office", "power platform",
  "power bi", "powerbi", "power automate", "power apps", "sharepoint", "teams",
  "dynamics", "sql server", "cosmos db", "cosmosdb", "active directory", "entra",
  "intune", "defender", "sentinel", "synapse", "fabric", "copilot",
  "bicep", "arm template", "app service", "container apps", "aks",
  "kubernetes", "functions", "logic apps", "event grid", "service bus",
  "storage account", "blob", "key vault", "cognitive services",
  "openai", "ai search", "ai foundry", "machine learning", "devops",
  "github actions", "blazor", "maui", "xamarin", "entity framework",
  "signalr", "grpc", "aspnet", "asp.net", "nuget", "msal",
  "graph api", "microsoft graph", "onedrive", "outlook",
];

export function isMicrosoftTopic(topic: string): boolean {
  const lower = topic.toLowerCase();
  return MS_KEYWORDS.some((kw) => lower.includes(kw));
}

/* ── Microsoft Learn Search API ── */

interface LearnSearchResult {
  title: string;
  url: string;
  description: string;
}

async function searchLearn(query: string, count = 6): Promise<LearnSearchResult[]> {
  try {
    // Use the Microsoft Learn browser search endpoint
    const searchUrl = `https://learn.microsoft.com/api/search?search=${encodeURIComponent(query)}&locale=en-us&$top=${count}&scoringProfile=defined-search`;

    const response = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
        "User-Agent": "PresentationMaker/1.0",
      },
    });

    if (!response.ok) {
      console.warn(`Learn Search API returned ${response.status}`);
      return [];
    }

    const data = (await response.json()) as any;
    const results: LearnSearchResult[] = (data.results || [])
      .slice(0, count)
      .map((r: any) => ({
        title: r.title || "",
        url: r.url || "",
        description: r.description || r.descriptions?.[0] || "",
      }))
      .filter((r: LearnSearchResult) => r.url && r.title);

    return results;
  } catch (err) {
    console.warn("Learn search failed:", err);
    return [];
  }
}

/* ── Scrape a Microsoft Learn page ── */

async function scrapeLearnPage(url: string): Promise<LearnArticle | null> {
  try {
    // Ensure HTTPS and add locale if needed
    const fullUrl = url.startsWith("http") ? url : `https://learn.microsoft.com${url}`;

    const response = await fetch(fullUrl, {
      headers: {
        Accept: "text/html",
        "User-Agent": "PresentationMaker/1.0",
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ${fullUrl}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/is);
    const title = titleMatch ? stripHtml(titleMatch[1]) : "";

    // Extract meta description
    const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]*?)"/i) ||
      html.match(/<meta\s+content="([^"]*?)"\s+name="description"/i);
    const description = descMatch ? descMatch[1] : "";

    // Extract main content sections
    const sections = extractSections(html);

    // Extract images (especially architecture diagrams)
    const images = extractImages(html, fullUrl);

    return { title, url: fullUrl, description, sections, images };
  } catch (err) {
    console.warn(`Error scraping ${url}:`, err);
    return null;
  }
}

function extractSections(html: string): LearnSection[] {
  const sections: LearnSection[] = [];

  // Find the main content area
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
    html.match(/id="main-column"[^>]*>([\s\S]*)/i);

  const content = mainMatch ? mainMatch[1] : html;

  // Extract headings and their following content
  const headingRegex = /<h([2-4])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  const headings: { level: number; text: string; index: number }[] = [];

  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: parseInt(match[1]),
      text: stripHtml(match[2]),
      index: match.index + match[0].length,
    });
  }

  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index;
    const end = i + 1 < headings.length ? headings[i + 1].index - 100 : content.length;
    const sectionHtml = content.slice(start, end);

    // Extract paragraph text from section
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch: RegExpExecArray | null;
    while ((pMatch = pRegex.exec(sectionHtml)) !== null) {
      const text = stripHtml(pMatch[1]).trim();
      if (text.length > 20) {
        paragraphs.push(text);
      }
    }

    // Also extract list items
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch: RegExpExecArray | null;
    while ((liMatch = liRegex.exec(sectionHtml)) !== null) {
      const text = stripHtml(liMatch[1]).trim();
      if (text.length > 10 && text.length < 500) {
        paragraphs.push(`• ${text}`);
      }
    }

    if (paragraphs.length > 0) {
      sections.push({
        heading: headings[i].text,
        content: paragraphs.join("\n"),
        level: headings[i].level,
      });
    }
  }

  return sections.slice(0, 15); // Limit sections
}

function extractImages(html: string, pageUrl: string): LearnImage[] {
  const images: LearnImage[] = [];
  const imgRegex = /<img[^>]*\ssrc="([^"]*)"[^>]*(?:\salt="([^"]*)")?[^>]*>/gi;

  let match: RegExpExecArray | null;
  while ((match = imgRegex.exec(html)) !== null) {
    let src = match[1];
    const alt = match[2] || "";

    // Skip tiny icons, tracking pixels, and non-content images
    if (
      src.includes("icon") ||
      src.includes("avatar") ||
      src.includes("badge") ||
      src.includes("1x1") ||
      src.includes("tracking") ||
      src.length < 10
    ) {
      continue;
    }

    // Make relative URLs absolute
    if (src.startsWith("/")) {
      src = `https://learn.microsoft.com${src}`;
    } else if (src.startsWith("./") || !src.startsWith("http")) {
      const base = pageUrl.substring(0, pageUrl.lastIndexOf("/") + 1);
      src = `${base}${src.replace("./", "")}`;
    }

    // Detect architecture diagrams based on common patterns
    const isArchitecture =
      alt.toLowerCase().includes("architecture") ||
      alt.toLowerCase().includes("diagram") ||
      alt.toLowerCase().includes("flow") ||
      alt.toLowerCase().includes("overview") ||
      src.includes("architecture") ||
      src.includes("diagram") ||
      src.includes("flow") ||
      src.includes("overview") ||
      src.includes("media/") ||
      (alt.length > 15 && src.includes(".png"));

    images.push({ src, alt, isArchitectureDiagram: isArchitecture });
  }

  // Also try to find images from alt attribute first pattern
  const altFirstRegex = /<img[^>]*\salt="([^"]*)"[^>]*\ssrc="([^"]*)"[^>]*>/gi;
  while ((match = altFirstRegex.exec(html)) !== null) {
    let src = match[2];
    const alt = match[1] || "";

    if (images.some((img) => img.src === src)) continue;

    if (src.startsWith("/")) {
      src = `https://learn.microsoft.com${src}`;
    }

    const isArchitecture =
      alt.toLowerCase().includes("architecture") ||
      alt.toLowerCase().includes("diagram") ||
      alt.toLowerCase().includes("flow");

    if (alt.length > 10) {
      images.push({ src, alt, isArchitectureDiagram: isArchitecture });
    }
  }

  return images.slice(0, 10);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ── Azure service icons (inline SVG paths for the diagram slide) ── */

export const AZURE_ICONS: Record<string, { path: string; color: string; label: string }> = {
  "app-service": {
    path: "M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.2L19.8 7 12 11.8 4.2 7 12 4.2zM3.5 8.3l8 4v9.4l-8-4V8.3zm17 0v9.4l-8 4V12.3l8-4z",
    color: "#0078D4",
    label: "App Service",
  },
  "functions": {
    path: "M7 2l-5 10h6l-4 10 14-14h-7l5-6H7zm1.6 2h5.8l-5 6h6.2L6.2 19.2 9.2 12H3.6l3.0-8z",
    color: "#FFB900",
    label: "Functions",
  },
  "storage": {
    path: "M20 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zm0 10H4V8h16v8zM6 10h4v2H6v-2zm6 0h6v2h-6v-2zM6 13h4v2H6v-2z",
    color: "#0078D4",
    label: "Storage",
  },
  "database": {
    path: "M12 2C6.48 2 2 3.79 2 6v12c0 2.21 4.48 4 10 4s10-1.79 10-4V6c0-2.21-4.48-4-10-4zm0 2c4.42 0 8 1.34 8 3s-3.58 3-8 3-8-1.34-8-3 3.58-3 8-3zM4 9.26C5.81 10.36 8.78 11 12 11s6.19-.64 8-1.74V12c0 1.66-3.58 3-8 3s-8-1.34-8-3V9.26zM4 14.26C5.81 15.36 8.78 16 12 16s6.19-.64 8-1.74V18c0 1.66-3.58 3-8 3s-8-1.34-8-3v-3.74z",
    color: "#E8731B",
    label: "Database",
  },
  "container": {
    path: "M21 8c0-.55-.45-1-1-1h-5V4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h5v3c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V8zM9 16H4V4h10v3h-4c-.55 0-1 .45-1 1v8zm11 3H10V8h10v11z",
    color: "#0078D4",
    label: "Container",
  },
  "kubernetes": {
    path: "M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.18l6.63 3.69v7.26L12 18.82l-6.63-3.69V7.87L12 4.18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
    color: "#326CE5",
    label: "Kubernetes",
  },
  "network": {
    path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
    color: "#3999C6",
    label: "Network",
  },
  "security": {
    path: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V12z",
    color: "#E74856",
    label: "Security",
  },
  "monitor": {
    path: "M19 3H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h4l-1 3v1h8v-1l-1-3h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H5V5h14v11z",
    color: "#68217A",
    label: "Monitor",
  },
  "ai": {
    path: "M21 11.18V9l-3-1.5V5c0-1.1-.9-2-2-2h-2.5L12 1 10.5 3H8c-1.1 0-2 .9-2 2v2.5L3 9v2.18l3 1.32V15c0 1.1.9 2 2 2h2.5l1.5 2 1.5-2H16c1.1 0 2-.9 2-2v-2.5l3-1.32zM12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z",
    color: "#0078D4",
    label: "AI",
  },
  "api": {
    path: "M14 12l-2 2-2-2 2-2 2 2zm-2-6l2.12 2.12 2.5-2.5L12 1 7.38 5.62l2.5 2.5L12 6zm-6 6l2.12-2.12-2.5-2.5L1 12l4.62 4.62 2.5-2.5L6 12zm12 0l-2.12 2.12 2.5 2.5L23 12l-4.62-4.62-2.5 2.5L18 12zm-6 6l-2.12-2.12-2.5 2.5L12 23l4.62-4.62-2.5-2.5L12 18z",
    color: "#47B5B1",
    label: "API",
  },
  "identity": {
    path: "M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    color: "#FFB900",
    label: "Identity",
  },
  "messaging": {
    path: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z",
    color: "#FF8C00",
    label: "Messaging",
  },
  "compute": {
    path: "M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z",
    color: "#0078D4",
    label: "Compute",
  },
  "devops": {
    path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V19c-2.76 0-5-2.24-5-5 0-2.76 2.24-5 5-5V7c3.87 0 7 3.13 7 7h-2.5L18 17.5 21.5 14H19c0-3.87-3.13-7-7-7v2c2.76 0 5 2.24 5 5s-2.24 5-5 5v2.8c4.56-.93 8-4.96 8-9.8z",
    color: "#0078D4",
    label: "DevOps",
  },
  "cloud": {
    path: "M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z",
    color: "#0078D4",
    label: "Cloud",
  },
};

/* ── Build context from Learn ── */

export async function buildLearnContext(topic: string): Promise<LearnContext> {
  const isMsTopic = isMicrosoftTopic(topic);

  if (!isMsTopic) {
    return {
      articles: [],
      formattedContext: "",
      architectureDiagrams: [],
      isMicrosoftTopic: false,
    };
  }

  console.log("🔍 Searching Microsoft Learn for:", topic);

  // Search for relevant Learn articles
  const searchResults = await searchLearn(topic);
  console.log(`📄 Found ${searchResults.length} Learn articles`);

  if (searchResults.length === 0) {
    return {
      articles: [],
      formattedContext: "No Microsoft Learn articles found. Use training data.",
      architectureDiagrams: [],
      isMicrosoftTopic: true,
    };
  }

  // Scrape top articles in parallel (limit to 3 to avoid being too slow)
  const articlesToScrape = searchResults.slice(0, 3);
  const scrapedArticles = await Promise.all(
    articlesToScrape.map((r) => scrapeLearnPage(r.url))
  );

  const articles = scrapedArticles.filter((a): a is LearnArticle => a !== null);
  console.log(`✅ Successfully scraped ${articles.length} articles`);

  // Collect architecture diagrams
  const architectureDiagrams = articles
    .flatMap((a) => a.images)
    .filter((img) => img.isArchitectureDiagram);

  console.log(`🖼️  Found ${architectureDiagrams.length} architecture diagrams`);

  // Format context for the AI model
  const formattedContext = formatLearnContext(articles, searchResults);

  return {
    articles,
    formattedContext,
    architectureDiagrams,
    isMicrosoftTopic: true,
  };
}

function formatLearnContext(
  articles: LearnArticle[],
  searchResults: LearnSearchResult[]
): string {
  let context = "=== MICROSOFT LEARN DOCUMENTATION ===\n\n";

  // Add search result summaries first
  context += "RELEVANT ARTICLES:\n";
  for (const r of searchResults) {
    context += `• ${r.title}: ${r.description}\n  Source: ${r.url}\n`;
  }
  context += "\n";

  // Add detailed content from scraped articles
  for (const article of articles) {
    context += `--- ${article.title} ---\n`;
    context += `Source: ${article.url}\n`;
    if (article.description) {
      context += `Description: ${article.description}\n`;
    }
    context += "\n";

    for (const section of article.sections.slice(0, 8)) {
      context += `## ${section.heading}\n`;
      // Limit content per section to keep context manageable
      const truncated =
        section.content.length > 600
          ? section.content.slice(0, 600) + "..."
          : section.content;
      context += `${truncated}\n\n`;
    }

    // Note images/diagrams
    if (article.images.length > 0) {
      const archImages = article.images.filter((img) => img.isArchitectureDiagram);
      if (archImages.length > 0) {
        context += "ARCHITECTURE DIAGRAMS available:\n";
        for (const img of archImages) {
          context += `  - ${img.alt} (${img.src})\n`;
        }
        context += "\n";
      }
    }
  }

  return context;
}
