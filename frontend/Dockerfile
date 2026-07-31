# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY tsconfig.app.json ./
COPY vite.config.ts ./
COPY index.html ./

RUN npm ci && npm install @rollup/rollup-linux-x64-musl --no-save

COPY src/ src/
COPY public/ public/

RUN npm run build

# Stage 2: Production (just dist, nginx serves separately)
FROM alpine:3.19 AS production

COPY --from=build /app/dist /dist