import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { MeshStandardMaterial } from 'three'
import { environment } from '../world/environment'
import { createRandom } from '../world/random'
import { Station } from './Station'

const BODY = { width: 3.8, height: 4.2, depth: 2.6 }
const FLOORS = 3
const BAYS = 5
const frame = '#2f3e4e'
const core = '#d9dde2'
const LIT = '#ffd59a'

// Glass-fronted office block: full-height glazing between thin mullions, floor bands,
// a glass entrance with canopy and roof plant — reads as "office", not as a school
const glass = new MeshStandardMaterial({
  color: '#7fb3d5',
  roughness: 0.25,
  metalness: 0.1,
  flatShading: true,
})
// a few offices stay lit at night
const litGlass = new MeshStandardMaterial({
  color: '#7fb3d5',
  emissive: LIT,
  emissiveIntensity: 0,
  flatShading: true,
})

function Office() {
  const lit = useMemo(() => {
    const random = createRandom(31)
    return Array.from({ length: FLOORS * BAYS }, () => random() < 0.35)
  }, [])

  useFrame(() => {
    litGlass.emissiveIntensity = (1 - environment.daylight) * 0.9
  })

  const front = BODY.depth / 2 + 0.02
  const bayWidth = (BODY.width - 0.3) / BAYS
  const floorHeight = (BODY.height - 0.3) / FLOORS

  return (
    <RigidBody type="fixed" colliders={false} position-z={-1}>
      {/* concrete core and roof slab */}
      <mesh position-y={BODY.height / 2} castShadow receiveShadow>
        <boxGeometry args={[BODY.width, BODY.height, BODY.depth]} />
        <meshStandardMaterial color={core} flatShading />
      </mesh>
      <mesh position-y={BODY.height + 0.06}>
        <boxGeometry args={[BODY.width + 0.12, 0.12, BODY.depth + 0.12]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>

      {/* curtain wall: one glass pane per bay and floor, the ground floor centre is the entrance */}
      {Array.from({ length: FLOORS }, (_, f) =>
        Array.from({ length: BAYS }, (_, b) => {
          const isEntrance = f === 0 && b === Math.floor(BAYS / 2)
          return (
            <mesh
              key={`${f}-${b}`}
              position={[
                -BODY.width / 2 + 0.15 + bayWidth * (b + 0.5),
                0.15 + floorHeight * (f + 0.5),
                front,
              ]}
              material={isEntrance ? undefined : lit[f * BAYS + b] ? litGlass : glass}
            >
              <boxGeometry args={[bayWidth - 0.08, floorHeight - 0.12, 0.04]} />
              {isEntrance && <meshStandardMaterial color="#3c6e8f" roughness={0.2} flatShading />}
            </mesh>
          )
        }),
      )}
      {/* floor bands */}
      {Array.from({ length: FLOORS + 1 }, (_, f) => (
        <mesh key={f} position={[0, 0.15 + floorHeight * f, front + 0.02]}>
          <boxGeometry args={[BODY.width, 0.1, 0.06]} />
          <meshStandardMaterial color={frame} flatShading />
        </mesh>
      ))}

      {/* entrance canopy */}
      <mesh position={[0, floorHeight + 0.05, front + 0.45]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.9]} />
        <meshStandardMaterial color={frame} flatShading />
      </mesh>

      {/* roof plant */}
      <mesh position={[-0.8, BODY.height + 0.35, -0.3]} castShadow>
        <boxGeometry args={[1, 0.5, 0.8]} />
        <meshStandardMaterial color="#aab2ba" flatShading />
      </mesh>
      <mesh position={[0.9, BODY.height + 0.25, 0.2]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.6]} />
        <meshStandardMaterial color="#aab2ba" flatShading />
      </mesh>

      <CuboidCollider
        args={[BODY.width / 2, BODY.height / 2, BODY.depth / 2]}
        position-y={BODY.height / 2}
      />
    </RigidBody>
  )
}

export function WorkStation() {
  return (
    <Station id="work" labelHeight={5.4}>
      <Office />
    </Station>
  )
}
