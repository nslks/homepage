import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  type Points,
  type PointsMaterial,
} from 'three'
import { environment } from './environment'
import { createRandom } from './random'

const COUNT = 45

// A few glowing dots drifting over the island at night
export function Fireflies() {
  const points = useRef<Points<BufferGeometry, PointsMaterial>>(null)
  const seeds = useMemo(() => {
    const random = createRandom(21)
    return Array.from({ length: COUNT }, () => {
      const angle = random() * Math.PI * 2
      const radius = 2 + Math.sqrt(random()) * 11
      return {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        y: 0.6 + random() * 1.8,
        phase: random() * 10,
      }
    })
  }, [])
  const geometry = useMemo(() => {
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(COUNT * 3), 3))
    return g
  }, [])

  useFrame(({ clock }) => {
    if (!points.current) return
    const night = 1 - environment.daylight
    points.current.visible = night > 0.02
    if (!points.current.visible) return
    const t = clock.elapsedTime
    const position = points.current.geometry.getAttribute('position') as BufferAttribute
    seeds.forEach((seed, i) => {
      position.setXYZ(
        i,
        seed.x + Math.sin(t * 0.4 + seed.phase) * 0.8,
        seed.y + Math.sin(t * 0.9 + seed.phase * 2) * 0.3,
        seed.z + Math.cos(t * 0.3 + seed.phase) * 0.8,
      )
    })
    position.needsUpdate = true
    // each firefly pulses on its own; the overall glow fades with the night
    points.current.material.opacity = night * (0.75 + Math.sin(t * 2) * 0.25)
  })

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#d8ff6b"
        size={0.24}
        sizeAttenuation
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  )
}
