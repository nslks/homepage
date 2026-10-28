# ADR 0001 — React Three Fiber as the 3D stack

- Status: accepted
- Date: 2026-10-28

## Context

The site is a small interactive 3D world with HTML overlays (panels, HUD, modals),
character physics and collisions. Plain three.js would require hand-writing the render loop,
scene graph management, collision handling and UI synchronisation.

## Decision

Use **React Three Fiber** (three.js renderer for React) with **@react-three/drei** (helpers:
loaders, HTML labels, animations), **@react-three/rapier** (physics, character controller,
colliders), **Vite** and **TypeScript**.

## Consequences

- Declarative scene, far less boilerplate; HTML UI is regular React.
- It is still three.js underneath — any three.js API remains available.
- Adds React as a dependency and a learning curve for R3F idioms.
