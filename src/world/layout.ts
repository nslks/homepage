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

// Island radius in the direction of a point, interpolated between outline vertices
export function islandRadiusAt(p: Point): number {
  const segments = islandOutline.length
  const angle = (Math.atan2(p.z, p.x) + Math.PI * 2) % (Math.PI * 2)
  const position = (angle / (Math.PI * 2)) * segments
  const i = Math.floor(position) % segments
  const a = islandOutline[i]!
  const b = islandOutline[(i + 1) % segments]!
  const t = position - Math.floor(position)
  return Math.hypot(a.x, a.z) * (1 - t) + Math.hypot(b.x, b.z) * t
}

export type StationId = 'career' | 'work' | 'projects' | 'contact'

export type Placement = Point & {
  // rotation around the y axis; 0 faces south (towards the camera)
  facing: number
}

// Spec §3.2: spawn in the south, career west, work north, projects east, contact next to spawn
export const spawn: Point = { x: 0, z: 10 }
export const crossing: Point = { x: 0, z: 0 }
// beside the spawn, angled towards the camera so it never hides the character
export const welcomeSign: Placement = { x: 3.9, z: 9.4, facing: -0.35 }

export const stations: Record<StationId, Placement> = {
  career: { x: -10, z: 0, facing: Math.PI / 2 },
  work: { x: 0, z: -10, facing: 0 },
  projects: { x: 10, z: 0, facing: -Math.PI / 2 },
  contact: { x: -4.6, z: 10.4, facing: 0 },
}

export const PATH_WIDTH = 1.8
export const STATION_PLAZA_RADIUS = 2.6
const CONTACT_PLAZA_RADIUS = 1.4

// Standing within this distance of a station's centre puts it in range
export const interactionRadius: Record<StationId, number> = {
  career: STATION_PLAZA_RADIUS + 0.6,
  work: STATION_PLAZA_RADIUS + 0.6,
  projects: STATION_PLAZA_RADIUS + 0.6,
  contact: CONTACT_PLAZA_RADIUS + 0.9,
}

// Straight path segments between points; the decor keeps clear of them
export const paths: [Point, Point][] = [
  [spawn, crossing],
  [crossing, stations.career],
  [crossing, stations.work],
  [crossing, stations.projects],
  [spawn, stations.contact],
]

// Lanterns light the paths at night: beside the path edges, never on them
export const lanterns: Point[] = [
  { x: 1.6, z: 7 },
  { x: -1.9, z: 1.9 },
  { x: 1.9, z: -1.9 },
  { x: -6.8, z: -1.5 },
  { x: 1.5, z: -6.8 },
  { x: 6.8, z: 1.5 },
  { x: -2.6, z: 11.5 },
]

export const plazas: { center: Point; radius: number }[] = [
  { center: spawn, radius: 2.2 },
  { center: crossing, radius: 2 },
  ...Object.entries(stations).map(([id, center]) => ({
    center,
    radius: id === 'contact' ? CONTACT_PLAZA_RADIUS : STATION_PLAZA_RADIUS,
  })),
]
