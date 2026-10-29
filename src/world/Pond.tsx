import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { pond } from './layout'
import { createRandom } from './random'

// Pond in the middle of the loop layout: water, a ring of stones, a few lily pads
export function Pond() {
  if (!pond) return null
  const { center, radius } = pond
  const random = createRandom(53)
  const stones = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + random() * 0.2
    return {
      x: Math.cos(angle) * (radius + 0.15),
      z: Math.sin(angle) * (radius + 0.15),
      s: 0.25 + random() * 0.2,
      r: random() * Math.PI,
    }
  })
  const pads = [
    { x: -1.1, z: 0.6, s: 0.38 },
    { x: 0.8, z: -0.9, s: 0.3 },
    { x: 0.3, z: 1.3, s: 0.26 },
  ]
  return (
    <RigidBody type="fixed" colliders={false} position={[center.x, 0, center.z]}>
      <mesh position-y={0.04} receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.04, 32]} />
        <meshStandardMaterial color="#5aa9d6" roughness={0.15} metalness={0.1} />
      </mesh>
      {stones.map((stone, i) => (
        <mesh
          key={i}
          position={[stone.x, stone.s * 0.4, stone.z]}
          rotation-y={stone.r}
          scale={[stone.s, stone.s * 0.7, stone.s]}
          castShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#a39d94" flatShading />
        </mesh>
      ))}
      {pads.map((pad, i) => (
        <group key={i} position={[pad.x, 0.07, pad.z]}>
          <mesh>
            <cylinderGeometry args={[pad.s, pad.s, 0.02, 10, 1, false, 0.4, Math.PI * 2 - 0.4]} />
            <meshStandardMaterial color="#4f9a4a" flatShading />
          </mesh>
          {i === 0 && (
            <mesh position={[0.05, 0.06, 0.05]}>
              <icosahedronGeometry args={[0.09, 0]} />
              <meshStandardMaterial color="#f4a7c4" flatShading />
            </mesh>
          )}
        </group>
      ))}
      <CylinderCollider args={[0.6, radius + 0.3]} position-y={0.6} />
    </RigidBody>
  )
}
