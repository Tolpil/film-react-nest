# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY tsconfig.app.json ./
COPY vite.config.ts ./
COPY index.html ./

RUN npm ci

COPY src/ src/
COPY public/ public/

RUN npm run build

# Stage 2: Production (nginx)
FROM nginx:1.25-alpine AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]