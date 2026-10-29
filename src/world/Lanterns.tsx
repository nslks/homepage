import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { MeshStandardMaterial, PointLight } from 'three'
import { qualitySettings } from '../quality/tiers'
import { useAppStore } from '../state/store'
import { environment } from './environment'
import { lanterns } from './layout'

const GLOW = '#ffb45e'
const LIGHT_INTENSITY = 9

// Warm lanterns along the paths; they switch on as daylight fades
export function Lanterns() {
  const lights = useRef<(PointLight | null)[]>([])
  // lower tiers keep the glowing glass everywhere but real lights only on the first lanterns
  const lightCount = useAppStore((state) => qualitySettings[state.quality].lanternLights)
  const glass = useRef<(MeshStandardMaterial | null)[]>([])

  useFrame(() => {
    const night = 1 - environment.daylight
    lights.current
      .slice(0, lightCount)
      .forEach((light) => light && (light.intensity = night * LIGHT_INTENSITY))
    glass.current.forEach(
      (material) => material && (material.emissiveIntensity = 0.1 + night * 1.3),
    )
  })

  return (
    <RigidBody type="fixed" colliders={false}>
      {lanterns.map((lantern, i) => (
        <group key={i} position={[lantern.x, 0, lantern.z]}>
          <mesh position-y={0.85} castShadow>
            <cylinderGeometry args={[0.05, 0.07, 1.7, 6]} />
            <meshStandardMaterial color="#2f3145" flatShading />
          </mesh>
          <mesh position-y={1.82}>
            <boxGeometry args={[0.26, 0.3, 0.26]} />
            <meshStandardMaterial
              ref={(material) => {
                glass.current[i] = material
              }}
              color="#ffcf8a"
              emissive={GLOW}
              flatShading
            />
          </mesh>
          <mesh position-y={2.03} castShadow>
            <coneGeometry args={[0.24, 0.16, 4]} />
            <meshStandardMaterial color="#2f3145" flatShading />
          </mesh>
          {i < lightCount && (
            <pointLight
              ref={(light) => {
                lights.current[i] = light
              }}
              position-y={1.8}
              color={GLOW}
              intensity={0}
              distance={7}
              decay={2}
            />
          )}
          <CylinderCollider args={[0.9, 0.15]} position-y={0.9} />
        </group>
      ))}
    </RigidBody>
  )
}
