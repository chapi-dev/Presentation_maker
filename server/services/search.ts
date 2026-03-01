export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

/**
 * Search the web using Bing Search API v7.
 * Returns top relevant snippets to feed into the AI model.
 */
export async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.BING_SEARCH_API_KEY;

  if (!apiKey || apiKey === "YOUR_BING_KEY") {
    console.warn("Bing Search API key not configured — skipping web search.");
    return "No web search results available. Generate content based on your training data.";
  }

  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=8&mkt=en-US`;

  const response = await fetch(url, {
    headers: { "Ocp-Apim-Subscription-Key": apiKey },
  });

  if (!response.ok) {
    console.warn(`Bing Search returned ${response.status} — skipping.`);
    return "Web search failed. Generate content based on your training data.";
  }

  const data = (await response.json()) as any;
  const results: SearchResult[] =
    data.webPages?.value?.map((r: any) => ({
      title: r.name,
      snippet: r.snippet,
      url: r.url,
    })) ?? [];

  if (results.length === 0) {
    return "No relevant web results found. Generate content based on your training data.";
  }

  // Format results as context for the AI
  return results
    .map((r, i) => `[${i + 1}] ${r.title}\n${r.snippet}\nSource: ${r.url}`)
    .join("\n\n");
}
