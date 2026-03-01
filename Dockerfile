# ── Build stage ──
FROM node:22-alpine AS builder
WORKDIR /app

ARG VITE_MSAL_CLIENT_ID
ARG VITE_MSAL_AUTHORITY
ENV VITE_MSAL_CLIENT_ID=$VITE_MSAL_CLIENT_ID
ENV VITE_MSAL_AUTHORITY=$VITE_MSAL_AUTHORITY

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Production stage ──
FROM node:22-alpine
WORKDIR /app

# Install only production deps + tsx (needed for server)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm install tsx

# Copy built frontend and server source
COPY --from=builder /app/dist ./dist
COPY server ./server
COPY tsconfig.server.json ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "--import", "tsx", "server/index.ts"]
