# ADR 0006 — Self-hosted container on a VPS

- Status: accepted, live since 2026-11-27
- Date: 2026-11-27
- Supersedes: the GitHub Pages part of ADR 0005, once the own domain is live

## Context

The site moves to an own domain on a Hetzner VPS that also runs private side projects.
All of them are deployed the same way: CI builds an image, the server only pulls it.

## Decision

- GitHub Actions builds a container image (static build + nginx) on every push to `main`
  and pushes it to GHCR as `ghcr.io/nslks/homepage` (`latest` and the commit SHA).
- The image is built with `VITE_BASE=/`; the site is served from the domain root.
- On the server, a reverse proxy terminates TLS and forwards to the container.
- nginx writes no access log, so no visitor IPs are stored (ADR 0004).
- GitHub Pages keeps running until the domain is live, then `deploy-pages.yml` is removed.

## Consequences

- The Hosting section in the Datenschutz (`content/site.yaml`) must name the new hoster
  when the switch happens.
- Rollbacks are a matter of pulling an older SHA tag.
- Azure (M2 in ADR 0005) remains open; the image runs there unchanged.
