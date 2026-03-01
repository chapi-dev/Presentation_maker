# Challenge 04: Containerize

> **Goal:** Build a Docker image for the app, ready for cloud deployment.

---

## What You'll Learn

The Dockerfile uses a **multi-stage build**:

1. **Stage 1 (Build):** Install all dependencies, build the Vite frontend
2. **Stage 2 (Production):** Copy only what's needed, keep the image small

MSAL requires the Client ID and Authority at **build time** (they're baked into the JavaScript bundle via `import.meta.env`), so we pass them as build arguments.

---

## Steps

### 1. Understand the Dockerfile

```dockerfile
# ── Stage 1: Build ──
FROM node:22-alpine AS build
WORKDIR /app

# MSAL values must be available at build time for Vite
ARG VITE_MSAL_CLIENT_ID
ARG VITE_MSAL_AUTHORITY
ENV VITE_MSAL_CLIENT_ID=$VITE_MSAL_CLIENT_ID
ENV VITE_MSAL_AUTHORITY=$VITE_MSAL_AUTHORITY

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build           # Vite bundles frontend → dist/

# ── Stage 2: Production ──
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm i tsx
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/tsconfig.server.json ./
EXPOSE 3000
CMD ["npx", "tsx", "server/index.ts"]
```

**Key points:**
- `ARG` + `ENV` for `VITE_*` vars lets Vite embed them at build time
- `npm ci --omit=dev` in Stage 2 → only production dependencies (smaller image)
- The server uses `tsx` to run TypeScript directly (no compilation step)

### 2. Build the Docker Image

```bash
docker build \
  --build-arg VITE_MSAL_CLIENT_ID=YOUR_APP_CLIENT_ID \
  --build-arg VITE_MSAL_AUTHORITY=https://login.microsoftonline.com/YOUR_TENANT_ID \
  -t presentation-maker:local \
  .
```

> Replace the values with YOUR Client ID and Tenant ID from Challenge 02.

### 3. Run the Container Locally

```bash
docker run -it --rm \
  -p 3000:3000 \
  -e AZURE_OPENAI_ENDPOINT=https://YOUR_OPENAI_RESOURCE.openai.azure.com/ \
  -e BING_SEARCH_API_KEY="" \
  presentation-maker:local
```

> **Note:** `DefaultAzureCredential` won't find your `az login` session inside Docker. To test locally you would need to mount Azure credentials or use a service principal. For now, just verify the container starts and the frontend loads.

Open **http://localhost:3000** — you should see the login page.

### 4. Verify Image Size

```bash
docker images presentation-maker:local
```

With the multi-stage build, the image should be roughly **200-300 MB** (Node.js Alpine + dependencies).

---

## Understanding Build Args vs Environment Variables

| Variable | When Needed | How Set |
|----------|-------------|---------|
| `VITE_MSAL_CLIENT_ID` | **Build time** | `--build-arg` (baked into JS bundle) |
| `VITE_MSAL_AUTHORITY` | **Build time** | `--build-arg` (baked into JS bundle) |
| `AZURE_OPENAI_ENDPOINT` | **Run time** | `-e` flag or Container Apps config |
| `BING_SEARCH_API_KEY` | **Run time** | `-e` flag or Container Apps config |

> **Why?** Vite replaces `import.meta.env.VITE_*` at build time with literal values. Server-side `process.env.*` variables are read at runtime.

---

## ✅ Success Criteria

- [ ] Docker image builds without errors
- [ ] Container starts and serves the frontend on port 3000
- [ ] You understand the difference between build-time and run-time variables

---

**Previous:** [Challenge 03 — Entra ID](03-entra-id.md) | **Next:** [Challenge 05 — Deploy to Azure](05-deploy-azure.md)
