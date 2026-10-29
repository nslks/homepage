import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { MeshStandardMaterial } from 'three'
import { environment } from '../world/environment'
import { Station } from './Station'

const fabric = '#3d7ac8'
const fabricDark = '#2f62a3'
const wood = '#9c6b45'
const rug = '#e07a5f'
const books = ['#c8553d', '#3d405b', '#e0a63a', '#5fae55']

// Armchair facing +z: seat, wing back and armrests
function Armchair() {
  return (
    <group>
      <mesh position={[0, 0.32, 0]} castShadow>
        <boxGeometry args={[0.95, 0.3, 0.85]} />
        <meshStandardMaterial color={fabric} flatShading />
      </mesh>
      <mesh position={[0, 0.85, -0.37]} castShadow>
        <boxGeometry args={[0.95, 0.9, 0.2]} />
        <meshStandardMaterial color={fabricDark} flatShading />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.52, 0.55, 0]} castShadow>
          <boxGeometry args={[0.16, 0.42, 0.85]} />
          <meshStandardMaterial color={fabricDark} flatShading />
        </mesh>
      ))}
      {[-0.38, 0.38].flatMap((x) =>
        [-0.3, 0.3].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.08, z]}>
            <boxGeometry args={[0.08, 0.16, 0.08]} />
            <meshStandardMaterial color={wood} flatShading />
          </mesh>
        )),
      )}
    </group>
  )
}

const shade = new MeshStandardMaterial({
  color: '#fff1d6',
  emissive: '#ffb45e',
  emissiveIntensity: 0,
  flatShading: true,
})

// Floor lamp whose shade glows warmly at night
function FloorLamp() {
  useFrame(() => {
    shade.emissiveIntensity = 0.15 + (1 - environment.daylight) * 1.4
  })
  return (
    <group>
      <mesh position-y={0.04}>
        <cylinderGeometry args={[0.22, 0.25, 0.08, 8]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      <mesh position-y={0.95}>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 6]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      <mesh position-y={1.85} material={shade} castShadow>
        <cylinderGeometry args={[0.2, 0.36, 0.4, 8, 1, true]} />
      </mesh>
    </group>
  )
}

// Side table with a stack of books
function SideTable() {
  const stack = [0.07, 0.06, 0.08]
  return (
    <group>
      <mesh position-y={0.5} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 10]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      <mesh position-y={0.25}>
        <cylinderGeometry args={[0.04, 0.04, 0.5, 6]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      {stack.map((height, i) => (
        <mesh
          key={i}
          position={[0, 0.525 + stack.slice(0, i).reduce((s, h) => s + h, 0) + height / 2, 0]}
          rotation-y={i * 0.35}
          castShadow
        >
          <boxGeometry args={[0.34 - i * 0.03, height, 0.25 - i * 0.02]} />
          <meshStandardMaterial color={books[i]} flatShading />
        </mesh>
      ))}
    </group>
  )
}

// A cosy reading corner: who I am, away from the desk
function ReadingCorner() {
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* above the plaza, which is drawn with a depth offset */}
      <mesh position-y={0.06} receiveShadow>
        <cylinderGeometry args={[1.5, 1.5, 0.03, 10]} />
        <meshStandardMaterial color={rug} flatShading />
      </mesh>
      <group position={[0, 0.08, -0.25]}>
        <Armchair />
      </group>
      <group position={[-0.95, 0.08, -0.45]}>
        <FloorLamp />
      </group>
      <group position={[0.95, 0.08, -0.1]}>
        <SideTable />
      </group>
      {/* a book left on the rug */}
      <mesh position={[0.45, 0.1, 0.75]} rotation-y={0.6} castShadow>
        <boxGeometry args={[0.3, 0.05, 0.22]} />
        <meshStandardMaterial color={books[3]} flatShading />
      </mesh>
      <CylinderCollider args={[0.6, 1.25]} position-y={0.6} />
    </RigidBody>
  )
}

export function CareerStation() {
  return (
    <Station id="career" labelHeight={3}>
      <ReadingCorner />
    </Station>
  )
}
