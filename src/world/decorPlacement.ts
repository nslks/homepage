import { PATH_WIDTH, paths, plazas, type Point } from './layout'
import { createRandom } from './random'

export type TreeKind = 'pine' | 'round'
export type Tree = Point & { kind: TreeKind; scale: number; leaves: number; phase: number }
export type Rock = Point & { scale: number; rotation: number }
export type Bush = Point & { scale: number }
export type Cloud = { radius: number; y: number; angle: number; speed: number; puffs: number }

// Decor may stand on the outer grass ring, beyond the walking boundary
const MAX_RADIUS = 14.2
// The camera looks north from the south; only low decor there so it never hides the spawn
const LOW_DECOR_ONLY_SOUTH_OF = 5.5

function distanceToSegment(p: Point, a: Point, b: Point) {
  const dx = b.x - a.x
  const dz = b.z - a.z
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.z - a.z) * dz) / (dx * dx + dz * dz)))
  return Math.hypot(p.x - (a.x + t * dx), p.z - (a.z + t * dz))
}

function isFree(p: Point, clearance: number, placed: Point[]) {
  if (Math.hypot(p.x, p.z) > MAX_RADIUS) return false
  if (paths.some(([a, b]) => distanceToSegment(p, a, b) < PATH_WIDTH / 2 + clearance)) return false
  if (
    plazas.some(
      ({ center, radius }) => Math.hypot(p.x - center.x, p.z - center.z) < radius + clearance,
    )
  )
    return false
  return placed.every((q) => Math.hypot(p.x - q.x, p.z - q.z) > clearance * 1.6)
}

function scatter<T extends Point>(
  seed: number,
  count: number,
  clearance: number,
  placed: Point[],
  accept: (p: Point) => boolean,
  create: (p: Point, random: () => number) => T,
): T[] {
  const random = createRandom(seed)
  const result: T[] = []
  for (let attempt = 0; attempt < count * 40 && result.length < count; attempt++) {
    const angle = random() * Math.PI * 2
    const radius = Math.sqrt(random()) * MAX_RADIUS
    const p = { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius }
    if (!accept(p) || !isFree(p, clearance, placed)) continue
    const item = create(p, random)
    result.push(item)
    placed.push(item)
  }
  return result
}

const placed: Point[] = []

export const trees: Tree[] = scatter(
  3,
  26,
  1.3,
  placed,
  (p) => p.z < LOW_DECOR_ONLY_SOUTH_OF,
  (p, random) => ({
    ...p,
    kind: random() < 0.55 ? 'pine' : 'round',
    scale: 0.8 + random() * 0.5,
    leaves: Math.floor(random() * 3),
    phase: random() * Math.PI * 2,
  }),
)

export const rocks: Rock[] = scatter(
  5,
  14,
  0.9,
  placed,
  () => true,
  (p, random) => ({ ...p, scale: 0.35 + random() * 0.45, rotation: random() * Math.PI }),
)

export const bushes: Bush[] = scatter(
  9,
  18,
  0.8,
  placed,
  () => true,
  (p, random) => ({ ...p, scale: 0.45 + random() * 0.35 }),
)

export const clouds: Cloud[] = (() => {
  const random = createRandom(13)
  return Array.from({ length: 9 }, (_, i) => ({
    radius: 22 + random() * 10,
    // most clouds float above, a few drift below the island
    y: i % 3 === 0 ? -6 - random() * 4 : 5 + random() * 6,
    angle: random() * Math.PI * 2,
    speed: 0.01 + random() * 0.015,
    puffs: 3 + Math.floor(random() * 3),
  }))
})()
