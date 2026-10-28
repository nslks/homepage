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

export type StationId = 'career' | 'work' | 'projects' | 'contact'

export type Placement = Point & {
  // rotation around the y axis; 0 faces south (towards the camera)
  facing: number
}

// Spec §3.2: spawn in the south, career west, work north, projects east, contact next to spawn
export const spawn: Point = { x: 0, z: 10 }
export const crossing: Point = { x: 0, z: 0 }
export const welcomeSign: Placement = { x: 2.6, z: 11.2, facing: 0 }

export const stations: Record<StationId, Placement> = {
  career: { x: -10, z: 0, facing: Math.PI / 2 },
  work: { x: 0, z: -10, facing: 0 },
  projects: { x: 10, z: 0, facing: -Math.PI / 2 },
  contact: { x: -4.6, z: 10.4, facing: 0 },
}

export const PATH_WIDTH = 1.8
export const STATION_PLAZA_RADIUS = 2.6
const CONTACT_PLAZA_RADIUS = 1.4

// Straight path segments between points; the decor keeps clear of them
export const paths: [Point, Point][] = [
  [spawn, crossing],
  [crossing, stations.career],
  [crossing, stations.work],
  [crossing, stations.projects],
  [spawn, stations.contact],
]

export const plazas: { center: Point; radius: number }[] = [
  { center: spawn, radius: 2.2 },
  { center: crossing, radius: 2 },
  ...Object.entries(stations).map(([id, center]) => ({
    center,
    radius: id === 'contact' ? CONTACT_PLAZA_RADIUS : STATION_PLAZA_RADIUS,
  })),
]
