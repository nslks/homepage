# ADR 0004 — No cookies, no analytics, no third-party requests

- Status: accepted
- Date: 2026-10-28

## Context

The site is hosted in Germany's legal context (GDPR, TTDSG). Every cookie, tracker or
third-party request (e.g. Google Fonts, CDNs) adds consent and privacy obligations.

## Decision

- No cookies, no analytics, no tracking of any kind.
- No requests to third parties: fonts, models and textures are self-hosted.
- User preferences (theme, character) are kept in `localStorage` only on explicit user
  action; nothing leaves the browser.
- Impressum and Datenschutz are provided in a modal with the minimum required content.

## Consequences

- No consent banner needed.
- No usage data; success cannot be measured on the site itself.
