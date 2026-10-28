import { BufferGeometry, Color, Float32BufferAttribute } from 'three'
import { palette } from './palette'
import type { Point } from './layout'
import { createRandom } from './random'

type Ring = { scale: number; y: number; color: string; jitter: number }

// Top grass rim down to a rocky tip; scale is relative to the outline
const rings: Ring[] = [
  { scale: 1, y: 0, color: palette.grassEdge, jitter: 0 },
  { scale: 0.97, y: -0.7, color: palette.dirt, jitter: 0.15 },
  { scale: 0.82, y: -2.6, color: palette.rock, jitter: 0.6 },
  { scale: 0.55, y: -5.2, color: palette.rockDark, jitter: 0.8 },
  { scale: 0.22, y: -8.4, color: palette.rockDark, jitter: 0.5 },
  { scale: 0.02, y: -10, color: palette.rockDark, jitter: 0 },
]

// Non-indexed, flat-shaded low-poly island built from the outline
export function createIslandGeometry(outline: Point[]): BufferGeometry {
  const random = createRandom(11)
  const positions: number[] = []
  const colors: number[] = []
  const color = new Color()

  const ringPoints = rings.map((ring) =>
    outline.map((p) => {
      const scale = ring.scale + (random() - 0.5) * ring.jitter * 0.1
      return [p.x * scale, ring.y + (random() - 0.5) * ring.jitter, p.z * scale] as const
    }),
  )

  const pushTriangle = (vertices: (readonly [number, number, number])[], hex: string) => {
    color.set(hex)
    for (const v of vertices) {
      positions.push(...v)
      colors.push(color.r, color.g, color.b)
    }
  }

  // Grass top: concentric bands of facets with slight colour variation, wound to face up
  const top = ringPoints[0]!
  const bands = [0, 0.3, 0.55, 0.8, 1]
  const bandPoints = bands.map((f) => top.map(([x, , z]) => [x * f, 0, z * f] as const))
  const grass = new Color(palette.grass)
  const facetColor = () =>
    '#' +
    grass
      .clone()
      .offsetHSL((random() - 0.5) * 0.02, 0, (random() - 0.5) * 0.06)
      .getHexString()
  for (let r = 0; r < bands.length - 1; r++) {
    const inner = bandPoints[r]!
    const outer = bandPoints[r + 1]!
    for (let i = 0; i < top.length; i++) {
      const j = (i + 1) % top.length
      if (r === 0) {
        pushTriangle([inner[i]!, outer[j]!, outer[i]!], facetColor())
      } else {
        pushTriangle([inner[i]!, inner[j]!, outer[i]!], facetColor())
        pushTriangle([inner[j]!, outer[j]!, outer[i]!], facetColor())
      }
    }
  }

  // Sides between consecutive rings, wound to face outwards
  for (let r = 0; r < rings.length - 1; r++) {
    const upper = ringPoints[r]!
    const lower = ringPoints[r + 1]!
    for (let i = 0; i < upper.length; i++) {
      const j = (i + 1) % upper.length
      pushTriangle([upper[i]!, upper[j]!, lower[i]!], rings[r]!.color)
      pushTriangle([upper[j]!, lower[j]!, lower[i]!], rings[r]!.color)
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return geometry
}
