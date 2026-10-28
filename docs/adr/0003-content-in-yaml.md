# ADR 0003 — Content in YAML, layout in code

- Status: accepted
- Date: 2026-10-28

## Context

Content (CV, projects, contact, legal texts) changes more often than the 3D world and must
not require code changes. A second, classic view and an English translation are planned.

## Decision

Three layers:

| Layer | Location | Examples |
|---|---|---|
| Content | `content/*.yaml` | name, title, career, jobs, projects, contact, legal |
| UI strings | `content/ui.yaml` | prompts, button labels, hints |
| World layout | typed TypeScript constants | station positions, models, lights |

- All user-facing text fields are bilingual objects (`de`, `en`).
- YAML is validated against a **Zod** schema at build time; invalid content fails the build.
- Station positions stay in code because moving a station also means changing paths and decor.

## Consequences

- Adding a project = adding a YAML entry; a door appears automatically (max 6).
- The same content can feed a future classic view and the English version.
