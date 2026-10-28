import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { BOUNDARY_INSET, ISLAND_RADIUS, islandOutline } from './layout'
import { createIslandGeometry } from './islandGeometry'

const WALL_HEIGHT = 4
const WALL_THICKNESS = 0.5

// Invisible walls along the outline, inset so the character stays on the grass
const walls = islandOutline.map((p, i) => {
  const q = islandOutline[(i + 1) % islandOutline.length]!
  const inset = (point: typeof p) => {
    const length = Math.hypot(point.x, point.z)
    const factor = (length - BOUNDARY_INSET) / length
    return { x: point.x * factor, z: point.z * factor }
  }
  const a = inset(p)
  const b = inset(q)
  return {
    position: [(a.x + b.x) / 2, WALL_HEIGHT / 2, (a.z + b.z) / 2] as const,
    rotationY: -Math.atan2(b.z - a.z, b.x - a.x),
    // slightly longer than the segment so corners overlap without gaps
    halfLength: Math.hypot(b.x - a.x, b.z - a.z) / 2 + WALL_THICKNESS,
  }
})

export function Island() {
  const geometry = useMemo(() => createIslandGeometry(islandOutline), [])

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading />
      </mesh>

      <CylinderCollider args={[0.5, ISLAND_RADIUS + 1]} position={[0, -0.5, 0]} />
      {walls.map((wall, i) => (
        <CuboidCollider
          key={i}
          args={[wall.halfLength, WALL_HEIGHT / 2, WALL_THICKNESS / 2]}
          position={wall.position}
          rotation={[0, wall.rotationY, 0]}
        />
      ))}
    </RigidBody>
  )
}
