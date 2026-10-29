import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { Station } from './Station'

const BODY = { width: 3.4, height: 2.8, depth: 2.4 }
const wall = '#eee8df'
const trim = '#3d405b'
const glass = '#9cc7e0'
const accent = '#e07a5f'

// Two-storey office: rows of windows and a flat roof read as "workplace"
function Office() {
  const windowColumns = [-1.1, -0.37, 0.37, 1.1]
  const front = BODY.depth / 2 + 0.01
  return (
    <RigidBody type="fixed" colliders={false} position-z={-0.9}>
      <mesh position-y={BODY.height / 2} castShadow receiveShadow>
        <boxGeometry args={[BODY.width, BODY.height, BODY.depth]} />
        <meshStandardMaterial color={wall} flatShading />
      </mesh>
      <mesh position-y={BODY.height + 0.08} castShadow>
        <boxGeometry args={[BODY.width + 0.3, 0.16, BODY.depth + 0.3]} />
        <meshStandardMaterial color={trim} flatShading />
      </mesh>

      {/* upper floor: full row of windows */}
      {windowColumns.map((x) => (
        <mesh key={x} position={[x, 2.05, front]}>
          <boxGeometry args={[0.5, 0.55, 0.04]} />
          <meshStandardMaterial color={glass} flatShading />
        </mesh>
      ))}
      {/* ground floor: windows left and right of the entrance */}
      {[windowColumns[0]!, windowColumns[3]!].map((x) => (
        <mesh key={x} position={[x, 0.95, front]}>
          <boxGeometry args={[0.5, 0.55, 0.04]} />
          <meshStandardMaterial color={glass} flatShading />
        </mesh>
      ))}

      <mesh position={[0, 0.6, front]}>
        <boxGeometry args={[0.8, 1.2, 0.05]} />
        <meshStandardMaterial color={trim} flatShading />
      </mesh>
      <mesh position={[0, 1.35, front + 0.25]} castShadow>
        <boxGeometry args={[1.3, 0.08, 0.55]} />
        <meshStandardMaterial color={accent} flatShading />
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
    <Station id="work" labelHeight={3.9}>
      <Office />
    </Station>
  )
}
