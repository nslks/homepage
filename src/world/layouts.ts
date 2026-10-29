// Island layouts: the same stations, style and content in different arrangements (spec §3.5).
// Chosen with ?layout=… at load time; without it the original cross layout is used.
// World axes: north = -z, east = +x, south = +z. One unit = one metre.

export type Point = { x: number; z: number }

export type StationId = 'career' | 'work' | 'projects' | 'contact'

export type Placement = Point & {
  // rotation around the y axis; 0 faces south (towards the camera)
  facing: number
}

export type Route = {
  // control points; curved routes run through them as a smooth spline
  points: Point[]
  curved?: boolean
  closed?: boolean
}

export type LayoutPreset = {
  // island outline: an ellipse with semi-axes rx (east–west) and rz (north–south), roughened by noise
  island: { rx: number; rz: number; seed: number }
  spawn: Point
  stations: Record<StationId, Placement>
  // where the station labels float; derived from the routes when left out
  labels?: Record<StationId, Point>
  routes: Route[]
  // extra plazas, e.g. a crossing
  junctions: { center: Point; radius: number }[]
  // placed along the routes when left out
  lanterns?: Point[]
  pond?: { center: Point; radius: number }
}

export type LayoutId = 'kreuz' | 'rundweg' | 'wanderweg'

// The original: spawn in the south, a crossing in the middle, one station per direction
const kreuz: LayoutPreset = {
  island: { rx: 16, rz: 16, seed: 7 },
  spawn: { x: 0, z: 10 },
  stations: {
    // turned towards the camera, so the armchair is seen from the front
    career: { x: -10, z: 0, facing: Math.PI / 4 },
    work: { x: 0, z: -10, facing: 0 },
    // desk and maker bench face the camera
    projects: { x: 10, z: 0, facing: 0 },
    contact: { x: -4.6, z: 10.4, facing: 0 },
  },
  labels: {
    career: { x: -8.1, z: 1.9 },
    work: { x: 1.9, z: -7.9 },
    projects: { x: 8.1, z: 1.9 },
    contact: { x: -6, z: 11.3 },
  },
  routes: [
    {
      points: [
        { x: 0, z: 10 },
        { x: 0, z: 0 },
      ],
    },
    {
      points: [
        { x: 0, z: 0 },
        { x: -10, z: 0 },
      ],
    },
    {
      points: [
        { x: 0, z: 0 },
        { x: 0, z: -10 },
      ],
    },
    {
      points: [
        { x: 0, z: 0 },
        { x: 10, z: 0 },
      ],
    },
    {
      points: [
        { x: 0, z: 10 },
        { x: -4.6, z: 10.4 },
      ],
    },
  ],
  junctions: [{ center: { x: 0, z: 0 }, radius: 2 }],
  lanterns: [
    { x: 1.6, z: 7 },
    { x: -1.9, z: 1.9 },
    { x: 1.9, z: -1.9 },
    { x: -6.8, z: -1.5 },
    { x: 1.5, z: -6.8 },
    { x: 6.8, z: 1.5 },
    { x: -2.6, z: 11.5 },
  ],
}

// A promenade: a winding loop around a pond, stations at irregular angles off the loop
const loopRadii = [7.6, 6.9, 7.4, 6.6, 7.5, 6.9, 7.7, 6.8, 7.3, 6.7]
const loop: Point[] = loopRadii.map((radius, i) => {
  const angle = (i / loopRadii.length) * Math.PI * 2 + 0.2
  return { x: Math.cos(angle) * radius, z: 0.5 + Math.sin(angle) * radius }
})

const rundweg: LayoutPreset = {
  island: { rx: 16, rz: 15.5, seed: 19 },
  spawn: { x: 1.4, z: 11.6 },
  stations: {
    career: { x: -11, z: 2.6, facing: 0.5 },
    work: { x: -5, z: -9.9, facing: 0.25 },
    projects: { x: 8.2, z: -8.8, facing: -0.3 },
    contact: { x: 10.8, z: 5.6, facing: -0.5 },
  },
  routes: [
    { points: loop, curved: true, closed: true },
    {
      points: [
        { x: 1.4, z: 11.6 },
        { x: 1.6, z: 9.6 },
        { x: 1.2, z: 7.6 },
      ],
      curved: true,
    },
    {
      points: [
        { x: -7.3, z: 1.6 },
        { x: -9.1, z: 2.3 },
        { x: -11, z: 2.6 },
      ],
      curved: true,
    },
    {
      points: [
        { x: -3.6, z: -5.6 },
        { x: -4.6, z: -7.8 },
        { x: -5, z: -9.9 },
      ],
      curved: true,
    },
    {
      points: [
        { x: 4.8, z: -5 },
        { x: 6.6, z: -6.9 },
        { x: 8.2, z: -8.8 },
      ],
      curved: true,
    },
    {
      points: [
        { x: 7.2, z: 3.4 },
        { x: 9.1, z: 4.6 },
        { x: 10.8, z: 5.6 },
      ],
      curved: true,
    },
  ],
  junctions: [],
  pond: { center: { x: 0, z: 0.5 }, radius: 3.3 },
}

// A hike: a longer island and an S-shaped trail from the south to the northern tip; the stations
// alternate left and right in story order — who I am, where I worked, what I build, get in touch
const trail: Point[] = [
  { x: 0.5, z: 12.8 },
  { x: -1.5, z: 9.6 },
  { x: -3.2, z: 6.4 },
  { x: -1.6, z: 3.2 },
  { x: 1.6, z: 1 },
  { x: 2.2, z: -2.2 },
  { x: -0.6, z: -4.8 },
  { x: -1.4, z: -8 },
  { x: 0.2, z: -11.2 },
]

const wanderweg: LayoutPreset = {
  island: { rx: 12.5, rz: 16, seed: 23 },
  spawn: { x: 0.5, z: 12.8 },
  stations: {
    career: { x: -6.4, z: 7.4, facing: 0.55 },
    work: { x: 5.8, z: 2.6, facing: -0.4 },
    projects: { x: -5.4, z: -4.6, facing: 0.35 },
    contact: { x: 0.4, z: -12.9, facing: 0 },
  },
  routes: [
    { points: trail, curved: true },
    {
      points: [
        { x: -3.2, z: 6.4 },
        { x: -4.9, z: 7.1 },
        { x: -6.4, z: 7.4 },
      ],
      curved: true,
    },
    {
      points: [
        { x: 1.6, z: 1 },
        { x: 3.7, z: 1.6 },
        { x: 5.8, z: 2.6 },
      ],
      curved: true,
    },
    {
      points: [
        { x: -0.6, z: -4.8 },
        { x: -3, z: -4.5 },
        { x: -5.4, z: -4.6 },
      ],
      curved: true,
    },
    {
      points: [
        { x: 0.2, z: -11.2 },
        { x: 0.4, z: -12.9 },
      ],
    },
  ],
  junctions: [],
}

export const layouts: Record<LayoutId, LayoutPreset> = { kreuz, rundweg, wanderweg }
