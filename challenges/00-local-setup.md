# Challenge 00: Run It Locally

> **Goal:** Get the app running on your machine in 5 minutes — no Azure needed.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 22+ | [nodejs.org](https://nodejs.org/) |
| npm | 10+ | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| An OpenAI API key | — | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |

> **That's it!** No Azure subscription, no Docker, no cloud accounts. Just Node.js and an OpenAI key.

### Verify installation

```bash
node --version    # v22.x.x or higher
npm --version     # 10.x.x or higher
git --version
```

---

## Steps

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/Presentation_maker.git
cd Presentation_maker
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set **only these two values**:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4o-mini
```

> **`gpt-4o-mini`** is cheap and fast — perfect for testing. You can use `gpt-4o` for higher quality.

Everything else in `.env` can stay as-is. Notice:
- `VITE_AUTH_DISABLED=true` — skips Microsoft login (you don't need Entra ID yet)
- Azure OpenAI lines are commented out — not needed for local dev
- Bing Search is empty — the AI will use its training data

### 3. Start the app

```bash
npm run dev
```

This starts:
- **Frontend:** Vite dev server at `http://localhost:5173`
- **Backend:** Express API at `http://localhost:3001`

### 4. Try it!

1. Open **http://localhost:5173**
2. You'll go directly to the generator form (auth is disabled)
3. Type a topic, pick the number of slides, click **Generate**
4. Watch the AI create your presentation!
5. Use arrow keys to navigate, `F` for fullscreen

---

## What Just Happened?

```
Browser → POST /api/generate → Express server
                                   ├── searchWeb() → (skipped, no Bing key)
                                   └── OpenAI API → GPT-4o-mini
                                         ↓
                               JSON slide data
                                         ↓
                              React renders slides
                              with video backgrounds
                              and liquid glass design
```

The `.env` file controls everything:

| Variable | Value | Effect |
|----------|-------|--------|
| `OPENAI_API_KEY` | Your key | Uses OpenAI directly |
| `OPENAI_MODEL` | `gpt-4o-mini` | Which model to call |
| `VITE_AUTH_DISABLED` | `true` | Skips Microsoft login |
| `BING_SEARCH_API_KEY` | *(empty)* | AI uses training data |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `ECONNREFUSED` on `/api/generate` | Make sure the Express server is running (check terminal for errors) |
| `No AI provider configured` | Set `OPENAI_API_KEY` in `.env` |
| `401 Unauthorized` from OpenAI | Check your API key is valid at [platform.openai.com](https://platform.openai.com) |
| `rate_limit_exceeded` | Wait a minute and try again, or add billing to your OpenAI account |
| Slides look empty | Check browser console — the AI response might be malformed. Try again. |

---

## ✅ Success Criteria

- [ ] `npm run dev` starts without errors
- [ ] App loads at `http://localhost:5173`
- [ ] You can generate and view a presentation
- [ ] Keyboard navigation works (arrows, F for fullscreen)

---

**Next:** [Challenge 01 — Azure OpenAI](01-azure-openai.md) *(switch to Azure's managed AI service)*
