# ─── Backend ─────────────────────────────────────────────
FROM node:20-alpine AS backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./

EXPOSE 3001
CMD ["node", "src/index.js"]
