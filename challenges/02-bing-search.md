# Challenge 02: Bing Search (Optional)

> **Goal:** Add Bing Search so the AI has real-time web data to create better presentations.

---

## Why This Is Optional

The search service in `server/services/search.ts` has a **graceful fallback** — if no Bing API key is configured, the app still works. The AI just generates slides from its training data instead of fresh web results.

Adding Bing Search gives the AI **current, factual information** about any topic.

---

## Steps

### 1. Create a Bing Search Resource

```bash
az cognitiveservices account create \
  --name YOUR_BING_SEARCH_NAME \
  --resource-group rg-presentation-maker \
  --location global \
  --kind Bing.Search.v7 \
  --sku-name S1
```

> **Note:** Bing Search uses `global` as location and the kind must be `Bing.Search.v7`. Some subscriptions may not have access to this resource type — that's okay, the app works without it.

### 2. Get Your API Key

```bash
az cognitiveservices account keys list \
  --name YOUR_BING_SEARCH_NAME \
  --resource-group rg-presentation-maker \
  --query key1 \
  --output tsv
```

### 3. Update Your `.env`

```env
BING_SEARCH_API_KEY=YOUR_BING_SEARCH_KEY
```

### 4. Test It

Restart the dev server and generate a presentation on a recent topic (e.g., "Latest AI developments 2025"). The slides should include specific, current details from the web.

---

## How the Code Works

Check `server/services/search.ts`:

```typescript
export async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  
  // Graceful fallback — no key, no search, AI still works
  if (!apiKey) {
    return "";
  }

  const url = `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=8`;
  // ... fetches and formats results as numbered context
}
```

The search results are passed to Azure OpenAI as context in the system prompt, giving the AI factual grounding for the slides.

---

## Can't Create Bing Search?

Some Azure subscriptions restrict which resource kinds can be created. If `Bing.Search.v7` is not available:

1. **Skip this challenge** — the app works perfectly without it
2. The AI will use its training data to generate slide content
3. You can revisit this if you get access to a different subscription

---

## ✅ Success Criteria

- [ ] Bing Search resource created (or skipped)
- [ ] API key added to `.env` (or left empty)
- [ ] App generates slides with web-sourced content (or AI-only content)

---

**Previous:** [Challenge 01 — Azure OpenAI](01-azure-openai.md) | **Next:** [Challenge 03 — Entra ID](03-entra-id.md)
