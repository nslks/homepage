import { palette } from './palette'
import { PATH_WIDTH, paths, plazas } from './layout'

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

export function Paths() {
  return (
    <group>
      {paths.map(([a, b], i) => {
        const length = Math.hypot(b.x - a.x, b.z - a.z)
        return (
          <mesh
            key={i}
            position={[(a.x + b.x) / 2, 0.01, (a.z + b.z) / 2]}
            rotation={[-Math.PI / 2, 0, Math.atan2(b.z - a.z, b.x - a.x) * -1]}
            receiveShadow
          >
            <planeGeometry args={[length, PATH_WIDTH]} />
            {sandMaterial(palette.path, 1)}
          </mesh>
        )
      })}
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
