import { createRandom } from './random'

// World axes: north = -z, east = +x, south = +z. One unit = one metre.

export const ISLAND_RADIUS = 16
const OUTLINE_SEGMENTS = 28

export type Point = { x: number; z: number }

// Irregular island outline: base radius with smoothed random bulges
export const islandOutline: Point[] = (() => {
  const random = createRandom(7)
  const raw = Array.from({ length: OUTLINE_SEGMENTS }, () => (random() - 0.5) * 2.4)
  return raw.map((_, i) => {
    const prev = raw[(i - 1 + OUTLINE_SEGMENTS) % OUTLINE_SEGMENTS]!
    const next = raw[(i + 1) % OUTLINE_SEGMENTS]!
    const radius = ISLAND_RADIUS + (prev + raw[i]! * 2 + next) / 4
    const angle = (i / OUTLINE_SEGMENTS) * Math.PI * 2
    return { x: Math.cos(angle) * radius, z: Math.sin(angle) * radius }
  })
})()

// How far inside the grass edge the invisible boundary sits
export const BOUNDARY_INSET = 1.2
