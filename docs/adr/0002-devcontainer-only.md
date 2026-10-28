# ADR 0002 — Develop exclusively in a dev container

- Status: accepted
- Date: 2026-10-28

## Context

Nothing (Node, npm packages, tooling) should be installed on the host machine.

## Decision

All development happens inside a **dev container** defined in `.devcontainer/`. The same
definition runs locally (OrbStack, VS Code Dev Containers) and in **GitHub Codespaces**.

- The Vite dev server port (`5173`) is forwarded; the site is opened in the host browser,
  so WebGL renders on the host GPU.
- File watching uses polling where bind mounts do not propagate events reliably.
- Headless browser tests run inside the container with software WebGL.

## Consequences

- Reproducible environment for me, CI and any contributor.
- Requires a container runtime locally (OrbStack) or Codespaces quota.
