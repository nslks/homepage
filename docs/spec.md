# Homepage — Product Specification

> Status: agreed · Owner: @nslks · Last updated: 2026-10-29

## 1. Vision

A serious, career-focused personal homepage presented as a small, walkable 3D island in a
low-poly style. Visitors steer a character between **stations** that present who I am, where
I have worked and what I build. The site doubles as a technical showcase (3D, CI/CD, IaC).
Recruiters must be able to reach everything important **without having to walk**.

### Target audience

1. **Primary:** recruiters and hiring managers — seriousness and fast access to facts matter most.
2. **Secondary:** fellow developers and the community — the 3D world is the hook.

## 2. Scope

### In scope for mobile support (milestone `M1.1 – Mobile`)

The same 3D island on phones and tablets — see [§5.5](#55-mobile--touch).

### In scope for the MVP (milestone `M1 – MVP`)

- Desktop browsers (see [§7 Constraints](#7-constraints)); phones and tablets follow in `M1.1 – Mobile`.
- German content only; all content is modelled bilingually (`de`/`en`) from day one.
- Floating low-poly island with four stations plus a welcome sign.
- Character (male/female toggle), keyboard controls, isometric follow camera.
- Day/night mode with animated transition.
- Loading screen, intro camera flight, controls hint, HUD, content panels.
- Legal modal (Impressum + Datenschutz).
- Notice for non-desktop devices (replaced by full mobile support in M1.1, [§5.5](#55-mobile--touch)).

### Explicitly out of scope for the MVP (own epics, see [§9](#9-milestones--roadmap))

Azure hosting, CI expansion, English translation, classic fallback view and
extended accessibility, sound, world polish, real project links, coupling to `cvgenerator`,
custom domain, analytics (never planned, see [ADR 0004](adr/0004-no-cookies-no-tracking.md)).

## 3. World

### 3.1 Island

- A single **floating island**. Its edges are the natural boundary of the world.
- **Invisible colliders** along the edge — the character can never fall off or leave the screen.
- Small enough that every station is reachable in **~5–10 seconds** of walking.
- Visible **paths** lead from the spawn point to every station.
- MVP atmosphere: trees, rocks, drifting clouds; wind in the trees by day, lanterns and
  fireflies by night. Anything beyond this belongs to the *Polish* epic.

### 3.2 Layout

```
                 N
          [ Work experience ]
                 |
 [ About me ] -- + -- [ Projects ]
  (signpost)     |     (houses with doors)
                 |
     [ Mailbox ] [ Welcome sign ]
              SPAWN
                 S
```

| Station | Position | Look | Content |
|---|---|---|---|
| Welcome sign | South, at spawn | Large wooden sign | Name + title (from YAML) |
| **Contact** | Next to spawn | Mailbox | Links: LinkedIn, GitHub, mail |
| **About me** ("Über mich") | West | Signpost | Intro text, education, skills, languages |
| **Work experience** ("Berufserfahrung") | North | Small office building | One entry per employer — jobs appear only here |
| **Projects** ("Eigene Projekte") | East | Small houses on an arc, one door per project | Summary, tech, link |

Station positions are code constants (see [ADR 0003](adr/0003-content-in-yaml.md)).

### 3.3 Station affordance

A visitor must recognise **what** a station is and **that** it is interactive at first sight:

1. **Distinct silhouette** — a mailbox looks like a mailbox, an office like an office, doors like doors.
2. **Floating label** above each station (icon + title), camera-facing, rendered as HTML so it
   stays crisp, readable from a distance.
3. **Paths** from spawn to every station.
4. **Proximity highlight** — subtle glow/outline when the character is in range, plus a
   prompt ("E drücken").
5. **Idle motion** — a gentle bob or particle hint that sets stations apart from decoration.

### 3.4 Day / night

- **Day:** warm pastels (rich green, sandy paths, light sky blue), soft shadows, sun.
- **Night:** cool blue-violet, moonlight, clearly **warm** lanterns as contrast; stations stay legible.
- Initial mode follows `prefers-color-scheme`.
- Toggling plays an animated transition of ~1–2 s (sun sets, moon rises, lanterns switch on).
- The choice is persisted (see [§7](#7-constraints), *Persistence*).

## 4. Character & controls

### 4.1 Character

- Free **CC0** rigged low-poly characters (e.g. Quaternius or KayKit) with a matching
  male/female pair and idle/walk/run animations.
- Generic look; only outfit colours are adapted to the island palette.
- **Gender toggle** (♂/♀) next to the day/night toggle; swap plays a small dust-puff effect.
  Default: male. Choice is persisted.

### 4.2 Controls

| Input | Action |
|---|---|
| `W A S D` / arrow keys | Move at running pace (camera-relative: `W` = up on screen); there is no separate walk or run key |
| `E` / `Enter` | Open the station in range |
| `Esc` | Close the open panel |
| Click on a station label | Open that station's panel directly, from any distance |
| Click / tap on the ground | Walk there along a path around obstacles (M1.1, [§5.5](#55-mobile--touch)) |
| Click / tap on a station model or a project door | Open that station / that project directly (M1.1) |

- **No jumping.**
- Movement is blocked while a panel is open.

### 4.3 Camera

- Elevated, isometric-like angle that **smoothly follows** the character.
- A large part of the island is always visible; the distance adapts to the aspect ratio, so
  portrait screens zoom out (M1.1).

## 5. UI

### 5.1 First visit flow

1. **Loading screen:** name + progress bar, nothing else.
2. **Intro flight:** camera flies over the island down to the character (< 2 s, skippable by any key/click).
3. **Controls hint:** short overlay (WASD/arrows, E), dismissible.

### 5.2 HUD

```
┌──────────────────────────────────────────────────────────────┐
│ Enes Alkis                                       ☀️/🌙   ♂/♀ │
│                                                              │
│                        (3D world)                            │
│                                                              │
│        LinkedIn · Kontakt              Impressum · Datenschutz│
└──────────────────────────────────────────────────────────────┘
```

- There is **no CV PDF** on the site. "Kontakt" opens the contact panel without walking.

### 5.3 Panels

- HTML overlays (readable, selectable, crisp) — not 3D text.
- Semi-transparent cards with backdrop blur; colours follow the current day/night mode.
- Self-hosted **Inter** font (no Google Fonts, no CDN).
- Keyboard operable: focus moves into the panel, `Tab` cycles within it, `Esc` closes.
- **Project panels:** summary, tech stack, button "Zum Projekt" opening the link in a **new tab**
  (`rel="noopener noreferrer"`). Without a URL the button is disabled and reads "Bald verfügbar".

### 5.4 Legal

- "Impressum · Datenschutz" opens a modal with two switchable tabs, minimal required content,
  sourced from YAML.

### 5.5 Mobile & touch

*MVP:* devices not matching the desktop query get a plain card ("Diese Seite ist für Desktop
gemacht"). *M1.1* replaces it with the full experience:

- **No device split:** keyboard, mouse and touch work at the same time on every device; only the
  layout follows the viewport width. The card remains only for devices without WebGL
  (*Fallback* epic).
- **Tap-to-move:** tapping (or clicking) the ground walks the character there along a path found
  on a navigation grid of the island (A\*), around trees, rocks and buildings. A pulsing ring in
  the accent colour marks the target until the character arrives; unreachable spots resolve to
  the nearest reachable point.
- **Tap targets:** tapping a station label or model opens its panel; tapping a project door opens
  that project.
- **Gestures:** pinch and drag on the 3D canvas do nothing (no accidental zoom, no camera
  rotation — see Polish #63); browser zoom stays available outside the canvas.
- **Camera:** portrait first; distance adapts to the aspect ratio; rotating the device updates
  camera and layout immediately, an open panel stays open.
- **Panels as bottom sheets** on narrow screens: full width, ~90 % height, content scrolls inside;
  closed by swiping down, tapping the dimmed backdrop or the close button. The legal modal too.
- **Compact HUD:** name top left, toggles top right, bottom bar with icons only (LinkedIn,
  Kontakt, ⓘ for Impressum/Datenschutz); safe-area insets respected; touch targets ≥ 44 px.
- **Controls hint on touch:** "Tippe auf den Boden, um zu laufen · Tippe auf ein Schild, um es zu
  öffnen" instead of keyboard keys.
- **Adaptive quality:** start at *medium*; if the frame rate stays below 30 fps for a few seconds,
  step down, step up again when it is stable. Tiers control pixel ratio, shadow resolution, the
  number of real lantern lights at night and the number of fireflies. Rendering pauses while
  the tab is hidden.
- **No haptics** (would feel cheap; inconsistent support anyway).

## 6. Content

All texts live in YAML under `content/`, validated against a Zod schema at build time
(see [ADR 0003](adr/0003-content-in-yaml.md)). Every user-facing text field is bilingual:

```yaml
summary:
  de: "…"
  en: "…"   # may be empty until the i18n epic
```

| File | Fields |
|---|---|
| `site.yaml` | `name`, `title`, `tagline`, `legal.impressum`, `legal.datenschutz` |
| `career.yaml` | `intro`, `education[]: { period, title, place }`, `skills[]: { group, items[] }`, `languages[]` |
| `work.yaml` | `entries[]: { company, role, period, highlights[] (3–5), tech[] }` |
| `projects.yaml` | `entries[]: { name, summary, tech[], url?, repoUrl?, doorColor? }` — **max 6** |
| `contact.yaml` | `links[]: { kind, label, url }` |
| `ui.yaml` | all UI strings (button labels, prompts, hints) |

- Initial content is a **one-time draft import** from `cvgenerator/data/cv.yaml`, shortened
  for the web and approved by me. After that the homepage YAML is its own source of truth.
- Title for now: **Software Engineer**.
- Projects start as placeholders **Projekt A, B, C** without URLs.

## 7. Constraints

| Area | Constraint |
|---|---|
| Devices | MVP: desktop only = `(pointer: fine) and (min-width: 1024px)` · M1.1: all devices with WebGL 2, layout by viewport width |
| Browsers | Current Chrome, Firefox, Safari, Edge with WebGL 2 — desktop, and from M1.1 iOS Safari and Android Chrome |
| Performance | 60 fps on an average laptop · 30+ fps on a mid-range phone from ~2023 (M1.1) · initial payload < 5 MB · interactive after ~3 s |
| Privacy | No cookies, no analytics, no tracking, no third-party requests (fonts/assets self-hosted) |
| Persistence | User preferences (theme, character) are stored in `localStorage` — no cookies, nothing transmitted |
| Development | Only inside the dev container (local OrbStack or GitHub Codespaces), nothing installed on the host |
| Licensing | Code MIT; personal content all rights reserved; third-party assets listed in `CREDITS.md` |

## 8. Way of working

- Specs and ADRs live in `docs/`; **user stories are GitHub issues** with Given/When/Then
  acceptance criteria, grouped under **epic** parent issues (sub-issues).
- One short-lived branch + PR per issue, CI must pass, **squash merge**, Conventional Commits.
- `main` is protected and auto-deploys.
- Everything in the repository is written in English; the site's content is German (MVP).

## 9. Milestones & roadmap

| Milestone | Content |
|---|---|
| **M0 – Foundation** | Dev container, Vite + R3F skeleton, minimal CI (lint, typecheck, build), deploy to GitHub Pages |
| **M1 – MVP** | Everything in §2 *In scope for the MVP* |
| **M1.1 – Mobile** | Phones and tablets: tap-to-move with pathfinding, bottom sheets, compact HUD, adaptive quality ([§5.5](#55-mobile--touch)) |
| **M2 – Azure Hosting** | Terraform, Azure Static Web Apps, deployment pipeline, switch-over |
| **Backlog** | Epics: CI expansion · i18n (EN) · Fallback & accessibility · Sound · Polish · Real projects & links · `cvgenerator` coupling · Custom domain |
