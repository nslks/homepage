import { useMemo } from 'react'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { palette } from './palette'
import { PATH_WIDTH, plazas, polylines, type Point } from './layout'

// Lifted slightly and offset in depth so the sand never flickers against the grass
const sandMaterial = (color: string, offset: number) => (
  <meshStandardMaterial
    color={color}
    flatShading
    polygonOffset
    polygonOffsetFactor={-offset}
    polygonOffsetUnits={-offset}
  />
)

// All paths as one ribbon mesh: each polyline gets left/right edges along averaged normals,
// so curves stay smooth and the whole network is a single draw call
function createRibbon(lines: Point[][], width: number): BufferGeometry {
  const positions: number[] = []
  const half = width / 2
  for (const line of lines) {
    const closed =
      line.length > 2 &&
      Math.hypot(line[0]!.x - line[line.length - 1]!.x, line[0]!.z - line[line.length - 1]!.z) <
        0.01
    const edges = line.map((p, i) => {
      const prev = line[i - 1] ?? (closed ? line[line.length - 2]! : p)
      const next = line[i + 1] ?? (closed ? line[1]! : p)
      let dx = next.x - prev.x
      let dz = next.z - prev.z
      const length = Math.hypot(dx, dz) || 1
      dx /= length
      dz /= length
      return { lx: p.x - dz * half, lz: p.z + dx * half, rx: p.x + dz * half, rz: p.z - dx * half }
    })
    for (let i = 1; i < edges.length; i++) {
      const a = edges[i - 1]!
      const b = edges[i]!
      positions.push(a.lx, 0, a.lz, b.lx, 0, b.lz, a.rx, 0, a.rz)
      positions.push(b.lx, 0, b.lz, b.rx, 0, b.rz, a.rx, 0, a.rz)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  // upward normals regardless of winding
  geometry.setAttribute(
    'normal',
    new Float32BufferAttribute(
      positions.map((_, i) => (i % 3 === 1 ? 1 : 0)),
      3,
    ),
  )
  return geometry
}

export function Paths() {
  const ribbon = useMemo(() => createRibbon(polylines, PATH_WIDTH), [])
  return (
    <group>
      <mesh geometry={ribbon} position-y={0.01} receiveShadow>
        <meshStandardMaterial
          color={palette.path}
          flatShading={false}
          side={2}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>
      {plazas.map(({ center, radius }, i) => (
        <mesh
          key={i}
          position={[center.x, 0.02, center.z]}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <circleGeometry args={[radius, 8]} />
          {sandMaterial(palette.plaza, 2)}
        </mesh>
      ))}
    </group>
  )
}
