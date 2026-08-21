# --- Étape 1 : build du site (Vite + React + Tailwind) ---
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Étape 2 : image finale — nginx sert le site + les fichiers, et
# proxifie /api et /resources vers un petit process Node (l'API d'admin). ---
FROM nginx:1.27-alpine

RUN apk add --no-cache nodejs npm tini

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY server ./server
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENV API_PORT=3001
ENV RESOURCES_DIR=/data/resources
VOLUME ["/data/resources"]

EXPOSE 80

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/entrypoint.sh"]
