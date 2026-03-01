# 🎯 Presentation Maker — AI-Powered Slide Generator

> **Build a full-stack web app that generates professional presentations using Azure OpenAI, React, and Tailwind CSS.**

![Tech Stack](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Azure OpenAI](https://img.shields.io/badge/Azure_OpenAI-GPT--4o-green) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-purple) ![Container Apps](https://img.shields.io/badge/Azure_Container_Apps-deployed-orange)

---

## 🎬 What Is This?

A web application where you:

1. **Log in** with your Microsoft account (Entra ID)
2. **Type a topic** and choose the number of slides
3. **AI generates** a full professional presentation with different slide types
4. **Present** in full-screen with keyboard navigation, video backgrounds, and a "liquid glass" design

The app searches the web for current information (optional Bing Search) and uses **Azure OpenAI GPT-4o** to create structured slide content rendered with React.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  React 19 + TypeScript + Tailwind CSS v4         │
│  MSAL Authentication (optional, Entra ID)        │
│  HLS Video Backgrounds + Liquid Glass Design     │
├─────────────────────────────────────────────────┤
│                   Backend                        │
│  Express.js API Server                           │
│  POST /api/generate                              │
├──────────────┬──────────────────────────────────┤
│  Bing Search │  OpenAI  OR  Azure OpenAI         │
│  (optional)  │  (API key)   (DefaultAzureCredential)
└──────────────┴──────────────────────────────────┘
│                                                   │
│      Local (npm run dev)  OR  Azure Container Apps│
└───────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
├── server/                    # Express backend
│   ├── index.ts               # Server entry point
│   ├── routes/slides.ts       # POST /api/generate endpoint
│   └── services/
│       ├── openai.ts          # Azure OpenAI slide generation
│       └── search.ts          # Bing Search API integration
├── src/                       # React frontend
│   ├── App.tsx                # Root: MSAL + Router
│   ├── auth/msalConfig.ts     # Entra ID MSAL configuration
│   ├── auth/AuthContext.tsx   # Auth context (supports dev mode)
│   ├── components/
│   │   ├── Presentation.tsx   # Full-screen presentation engine
│   │   ├── VideoBackground.tsx# HLS video background component
│   │   └── Logo.tsx           # SVG logo
│   ├── hooks/useHlsVideo.ts   # Custom HLS.js hook
│   ├── pages/
│   │   ├── HomePage.tsx       # Topic input + slide count form
│   │   ├── LoginPage.tsx      # Microsoft login page
│   │   └── PresentationPage.tsx # Renders generated slides
│   └── slides/
│       ├── DynamicSlideRenderer.tsx  # AI JSON → React slides
│       └── *.tsx              # Static example slides
├── Dockerfile                 # Multi-stage Docker build
├── .env.example               # Environment variables template
└── challenges/                # 🏆 Step-by-step challenges
    ├── 00-local-setup.md
    ├── 01-azure-openai.md
    ├── 02-bing-search.md
    ├── 03-entra-id.md
    ├── 04-containerize.md
    └── 05-deploy-azure.md
```

---

## 🚀 Quick Start (Local)

### Prerequisites

- **Node.js 22+** and **npm**
- **An OpenAI API key** — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- **Git**

> **No Azure subscription needed** for local development!

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/Presentation_maker.git
cd Presentation_maker
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — set OPENAI_API_KEY to your key
# Everything else works with the defaults!
```

### 3. Run

```bash
npm run dev
```

Open **http://localhost:5173** — type a topic, pick your slide count, and generate!

> Auth is disabled by default (`VITE_AUTH_DISABLED=true`). Follow [Challenge 03](challenges/03-entra-id.md) to add Microsoft login.

---

## 🏆 Challenges

This repo is designed as a **hands-on learning experience**. Start local, then progressively add Azure infrastructure.

| # | Challenge | What You'll Learn |
|---|-----------|-------------------|
| 00 | [Run Locally](challenges/00-local-setup.md) | Clone, install, generate presentations with OpenAI |
| 01 | [Azure OpenAI](challenges/01-azure-openai.md) | Replace API key with Azure OpenAI + DefaultAzureCredential |
| 02 | [Bing Search](challenges/02-bing-search.md) | Add web search for real-time data in slides |
| 03 | [Entra ID Auth](challenges/03-entra-id.md) | Add Microsoft login with MSAL |
| 04 | [Containerize](challenges/04-containerize.md) | Build Docker image, understand multi-stage builds |
| 05 | [Deploy to Azure](challenges/05-deploy-azure.md) | Container Apps, managed identity, RBAC, go live! |

> **⚠️ Important:** Each person must create their **own Azure resources** (Challenges 01+). Never share API keys or credentials. This repo uses `DefaultAzureCredential` for Azure — no keys in code!

> **💡 Tip:** Challenge 00 works with just an OpenAI API key — no Azure needed to get started!

---

## 🎨 Design System

The presentation uses a **"liquid glass"** aesthetic:

- **Font:** Plus Jakarta Sans
- **Background:** HLS video streams from Mux
- **Glass effect:** `backdrop-filter: blur(24px) saturate(1.4)` with translucent gradients
- **Borders:** `1px solid rgba(255,255,255,0.12)` — thin, subtle
- **No shadows** — depth through blur and opacity only
- **Responsive:** All sizes use `clamp()`, spacing uses `%`

### Slide Types

The AI can generate 7 different slide types:

| Type | Description |
|------|-------------|
| `cover` | Title slide with subtitle and author |
| `intro` | Overview paragraph + optional stats sidebar |
| `content` | Text content with bullet points |
| `stats` | Big numbers in glass cards |
| `quote` | Centered quote with author attribution |
| `cards` | 3-5 feature cards with icons |
| `outro` | Closing slide with call to action |

---

## ⌨️ Presentation Controls

| Key | Action |
|-----|--------|
| `→` `↓` `Space` | Next slide |
| `←` `↑` | Previous slide |
| `F` | Toggle fullscreen |
| `Escape` | Exit fullscreen |

---

## 🔐 Security Notes

- **No API keys in code** — uses `DefaultAzureCredential` (works with `az login` locally, managed identity in production)
- **MSAL authentication** — users must log in with Microsoft account
- **`.env` is gitignored** — secrets never enter version control
- **RBAC-based access** — Cognitive Services OpenAI User role required

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite 7 |
| Video | HLS.js for streaming video backgrounds |
| Icons | Lucide React |
| Auth | MSAL React (Microsoft Entra ID) |
| Backend | Express.js 5, TypeScript (tsx) |
| AI | OpenAI API (local) or Azure OpenAI GPT-4o (production) |
| Search | Bing Search API v7 (optional) |
| Hosting | Azure Container Apps |
| Identity | DefaultAzureCredential + Managed Identity |
| Container | Docker multi-stage build |

---

## 📝 License

MIT — Use it, learn from it, build on it.
