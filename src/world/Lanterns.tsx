import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { MeshStandardMaterial, PointLight } from 'three'
import { qualitySettings } from '../quality/tiers'
import { useAppStore } from '../state/store'
import { environment } from './environment'
import { playerPosition } from '../player/playerPosition'
import { lanterns } from './layout'

const GLOW = '#ffb45e'
const LIGHT_INTENSITY = 9

// how often (frames) the light pool is reassigned to the closest lanterns
const REASSIGN_EVERY = 10
const LIGHT_HEIGHT = 1.8

// Warm lanterns along the paths; they switch on as daylight fades. Every lantern's glass glows,
// but only a small pool of real point lights (per quality tier) exists — it follows the character
// and sits at the lanterns closest to it, so wherever one walks is well lit at little cost
export function Lanterns() {
  const lights = useRef<(PointLight | null)[]>([])
  const lightCount = useAppStore((state) =>
    Math.min(lanterns.length, qualitySettings[state.quality].lanternLights),
  )
  const glass = useRef<(MeshStandardMaterial | null)[]>([])
  const frame = useRef(0)

  useFrame(() => {
    const night = 1 - environment.daylight
    if (frame.current++ % REASSIGN_EVERY === 0) {
      const closest = lanterns
        .map((lantern, i) => ({
          i,
          d: (lantern.x - playerPosition.x) ** 2 + (lantern.z - playerPosition.z) ** 2,
        }))
        .sort((a, b) => a.d - b.d)
      lights.current.forEach((light, slot) => {
        const lantern = lanterns[closest[slot]?.i ?? 0]!
        light?.position.set(lantern.x, LIGHT_HEIGHT, lantern.z)
      })
    }
    lights.current.forEach((light) => light && (light.intensity = night * LIGHT_INTENSITY))
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
          <CylinderCollider args={[0.9, 0.12]} position-y={0.9} />
        </group>
      ))}
      {Array.from({ length: lightCount }, (_, slot) => (
        <pointLight
          key={slot}
          ref={(light) => {
            lights.current[slot] = light
          }}
          color={GLOW}
          intensity={0}
          distance={7}
          decay={2}
        />
      ))}
    </RigidBody>
  )
}
