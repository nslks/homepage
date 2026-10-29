import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { Station } from './Station'

const post = '#7a5236'
const box = '#3d405b'
const flag = '#d64933'

// Classic rounded mailbox with a raised flag — unmistakably "write to me".
// Turned sideways so the camera sees its profile: rounded top and flag
function Mailbox() {
  return (
    <RigidBody type="fixed" colliders={false} rotation-y={-Math.PI / 2}>
      <mesh position-y={0.55} castShadow>
        <boxGeometry args={[0.14, 1.1, 0.14]} />
        <meshStandardMaterial color={post} flatShading />
      </mesh>
      <group position-y={1.25}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.32, 0.8]} />
          <meshStandardMaterial color={box} flatShading />
        </mesh>
        <mesh position-y={0.16} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.8, 8, 1, false, -Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color={box} flatShading />
        </mesh>
        {/* flag on the side, raised */}
        <mesh position={[0.28, 0.25, -0.15]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.06]} />
          <meshStandardMaterial color={flag} flatShading />
        </mesh>
        <mesh position={[0.28, 0.43, -0.03]} castShadow>
          <boxGeometry args={[0.04, 0.16, 0.22]} />
          <meshStandardMaterial color={flag} flatShading />
        </mesh>
      </group>
      <CylinderCollider args={[0.7, 0.4]} position-y={0.7} />
    </RigidBody>
  )
}

export function ContactStation() {
  return (
    <Station id="contact" labelHeight={2.4}>
      <Mailbox />
    </Station>
  )
}
