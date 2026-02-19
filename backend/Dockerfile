# ─── Backend ─────────────────────────────────────────────
FROM node:20-alpine AS backend

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./

# Copier les artifacts Hardhat (nécessaires aux ABIs)
# Note: deployed-addresses.json sera monté via volume en dev Docker
COPY artifacts/ ./artifacts/

EXPOSE 3001
CMD ["node", "src/index.js"]
