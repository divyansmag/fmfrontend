# Single service: builds the frontend, then runs the API which also serves it.
FROM node:22-slim AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY backend/ ./
COPY --from=web /web/dist ./public
EXPOSE 3001
CMD ["node", "src/server.js"]
