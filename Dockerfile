# Production image: the static build served by nginx. Built in CI, pulled by the server (ADR 0006).
FROM node:24-slim AS build
WORKDIR /app

# Dependencies first: this layer stays cached as long as the lockfile doesn't change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Served from the domain root, not under /homepage/ like on GitHub Pages.
ARG VITE_BASE=/
# Passed in by CI from the repo variable, never committed (see content/site.yaml).
ARG IMPRESSUM_EMAIL=""
RUN VITE_BASE=$VITE_BASE IMPRESSUM_EMAIL=$IMPRESSUM_EMAIL npm run build

FROM nginx:1.28-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
