import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { MeshStandardMaterial, PointLight } from 'three'
import { environment } from '../world/environment'
import { Station } from './Station'

const post = '#7a5236'
const box = '#3d405b'
const flag = '#d64933'

// A small lamp beside the box keeps contact visible even when the path-light pool moves away.
function MailboxLamp() {
  const light = useRef<PointLight>(null)
  const glass = useRef<MeshStandardMaterial>(null)

  useFrame(() => {
    const night = 1 - environment.daylight
    if (light.current) light.current.intensity = night * 5
    if (glass.current) glass.current.emissiveIntensity = 0.1 + night * 1.3
  })

  return (
    <group position={[-0.65, 0, 0.35]}>
      <mesh position-y={0.8} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      <mesh position-y={1.7}>
        <boxGeometry args={[0.2, 0.24, 0.2]} />
        <meshStandardMaterial ref={glass} color="#ffcf8a" emissive="#ffb45e" flatShading />
      </mesh>
      <mesh position-y={1.88} castShadow>
        <coneGeometry args={[0.2, 0.12, 4]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      <pointLight
        ref={light}
        position-y={1.7}
        color="#ffb45e"
        intensity={0}
        distance={4}
        decay={2}
      />
    </group>
  )
}

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
    <Station id="contact">
      <Mailbox />
      <MailboxLamp />
    </Station>
  )
}
