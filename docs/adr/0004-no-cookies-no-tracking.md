# ADR 0004 — No cookies, no analytics, no third-party requests

- Status: accepted
- Date: 2026-10-28

## Context

The site is hosted in Germany's legal context (GDPR, TTDSG). Every cookie, tracker or
third-party request (e.g. Google Fonts, CDNs) adds consent and privacy obligations.

## Decision

- No cookies, no analytics, no tracking of any kind.
- No requests to third parties: fonts, models and textures are self-hosted.
- Nothing is stored in the browser — no `localStorage` either (revised 2026-10-29).
  Theme follows the system preference, the character starts as the default on every visit.
- Impressum and Datenschutz are provided in a modal with the minimum required content.

## Consequences

- No consent banner needed, and no storage section in the Datenschutz.
- Theme and character choices don't survive a reload.
- No usage data; success cannot be measured on the site itself.
