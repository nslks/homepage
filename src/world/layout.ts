import { type LayoutId, layouts, type Point, type Route, type StationId } from './layouts'
import { createRandom } from './random'

export type { Placement, Point, StationId } from './layouts'

// Active layout from ?layout=… (spec §3.5); everything below is derived from it once at load
const requested = new URLSearchParams(window.location.search).get('layout')
export const layoutId: LayoutId =
  requested && requested in layouts ? (requested as LayoutId) : 'kreuz'
const preset = layouts[layoutId]

const OUTLINE_SEGMENTS = 28
export const ISLAND_RADIUS = Math.max(preset.island.rx, preset.island.rz)

// Irregular island outline: an ellipse with smoothed random bulges
export const islandOutline: Point[] = (() => {
  const { rx, rz, seed } = preset.island
  const random = createRandom(seed)
  const raw = Array.from({ length: OUTLINE_SEGMENTS }, () => (random() - 0.5) * 2.4)
  return raw.map((_, i) => {
    const prev = raw[(i - 1 + OUTLINE_SEGMENTS) % OUTLINE_SEGMENTS]!
    const next = raw[(i + 1) % OUTLINE_SEGMENTS]!
    const angle = (i / OUTLINE_SEGMENTS) * Math.PI * 2
    const base = (rx * rz) / Math.hypot(rz * Math.cos(angle), rx * Math.sin(angle))
    const radius = base + (prev + raw[i]! * 2 + next) / 4
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

export const spawn: Point = preset.spawn
export const stations = preset.stations
export const pond = preset.pond ?? null

export const PATH_WIDTH = 1.8
export const STATION_PLAZA_RADIUS = 2.6
const CONTACT_PLAZA_RADIUS = 1.4
const plazaRadius = (id: StationId) =>
  id === 'contact' ? CONTACT_PLAZA_RADIUS : STATION_PLAZA_RADIUS

// Standing within this distance of a station's centre puts it in range
export const interactionRadius = Object.fromEntries(
  (Object.keys(stations) as StationId[]).map((id) => [
    id,
    plazaRadius(id) + (id === 'contact' ? 0.9 : 0.6),
  ]),
) as Record<StationId, number>

// Uniform Catmull-Rom spline through the control points, sampled about every metre
function sampleRoute(route: Route): Point[] {
  const points = route.points
  if (!route.curved || points.length < 3) return points
  const at = (i: number) =>
    route.closed
      ? points[(i + points.length) % points.length]!
      : points[Math.min(points.length - 1, Math.max(0, i))]!
  const result: Point[] = []
  const spans = route.closed ? points.length : points.length - 1
  for (let i = 0; i < spans; i++) {
    const p0 = at(i - 1)
    const p1 = at(i)
    const p2 = at(i + 1)
    const p3 = at(i + 2)
    const steps = Math.max(2, Math.ceil(Math.hypot(p2.x - p1.x, p2.z - p1.z)))
    for (let s = 0; s < steps; s++) {
      const t = s / steps
      const t2 = t * t
      const t3 = t2 * t
      const blend = (a: number, b: number, c: number, d: number) =>
        0.5 *
        (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3)
      result.push({ x: blend(p0.x, p1.x, p2.x, p3.x), z: blend(p0.z, p1.z, p2.z, p3.z) })
    }
  }
  result.push(route.closed ? result[0]! : points[points.length - 1]!)
  return result
}

// Path centre lines as polylines (rendered as ribbons) and as segments (for decor clearance)
export const polylines: Point[][] = preset.routes.map(sampleRoute)
export const paths: [Point, Point][] = polylines.flatMap((line) =>
  line.slice(1).map((point, i) => [line[i]!, point] as [Point, Point]),
)

export const plazas: { center: Point; radius: number }[] = [
  { center: spawn, radius: 2.2 },
  ...preset.junctions,
  ...(Object.keys(stations) as StationId[]).map((id) => ({
    center: stations[id],
    radius: plazaRadius(id),
  })),
]

// Label anchors: given by the layout, or at the plaza entrance beside the arriving path
export const stationSigns: Record<StationId, Point> =
  preset.labels ??
  (Object.fromEntries(
    (Object.keys(stations) as StationId[]).map((id) => {
      const station = stations[id]
      const line = polylines.find((l) => {
        const end = l[l.length - 1]!
        return Math.hypot(end.x - station.x, end.z - station.z) < 0.1
      })
      const from = line?.[line.length - 3] ?? { x: station.x, z: station.z + 1 }
      const length = Math.hypot(station.x - from.x, station.z - from.z) || 1
      const dir = { x: (station.x - from.x) / length, z: (station.z - from.z) / length }
      // of the two sides of the path, the one closer to the camera (south)
      const side = -dir.x >= 0 ? { x: dir.z, z: -dir.x } : { x: -dir.z, z: dir.x }
      const entry = plazaRadius(id) * 0.75
      return [
        id,
        {
          x: station.x - dir.x * entry + side.x * 1.2,
          z: station.z - dir.z * entry + side.z * 1.2,
        },
      ]
    }),
  ) as Record<StationId, Point>)

// Lanterns light the paths at night: given by the layout, or every few metres beside the paths
export const lanterns: Point[] =
  preset.lanterns ??
  (() => {
    const SPACING = 6.5
    const OFFSET = 1.45
    const placed: Point[] = []
    polylines.forEach((line, l) => {
      // distance still to walk until the next lantern, carried across segments
      let untilNext = SPACING / 2
      let side = l % 2 === 0 ? 1 : -1
      for (let i = 1; i < line.length; i++) {
        const a = line[i - 1]!
        const b = line[i]!
        const length = Math.hypot(b.x - a.x, b.z - a.z)
        let d = untilNext
        for (; d < length; d += SPACING) {
          const t = d / length
          const p = {
            x: a.x + (b.x - a.x) * t + (-(b.z - a.z) / length) * OFFSET * side,
            z: a.z + (b.z - a.z) * t + ((b.x - a.x) / length) * OFFSET * side,
          }
          side = -side
          const clear =
            plazas.every(
              ({ center, radius }) => Math.hypot(p.x - center.x, p.z - center.z) > radius + 0.6,
            ) &&
            (!pond || Math.hypot(p.x - pond.center.x, p.z - pond.center.z) > pond.radius + 0.8) &&
            placed.every((q) => Math.hypot(p.x - q.x, p.z - q.z) > 3) &&
            Math.hypot(p.x, p.z) < islandRadiusAt(p) - BOUNDARY_INSET - 0.5
          if (clear) placed.push(p)
        }
        untilNext = d - length
      }
    })
    return placed
  })()
