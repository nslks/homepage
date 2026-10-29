import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh, MeshBasicMaterial } from 'three'
import { autopilot } from './autopilot'

// Pulsing ring where the character is heading after a tap or click
export function TargetMarker() {
  const ring = useRef<Mesh<never, MeshBasicMaterial>>(null)

  useFrame(({ clock }) => {
    const mesh = ring.current
    if (!mesh) return
    const target = autopilot.target
    mesh.visible = target !== null
    if (!target) return
    const pulse = 0.5 + 0.5 * Math.sin(clock.elapsedTime * 6)
    mesh.position.set(target.x, 0.06, target.z)
    mesh.scale.setScalar(0.85 + pulse * 0.25)
    mesh.material.opacity = 0.55 + pulse * 0.35
  })

  return (
    <mesh ref={ring} rotation-x={-Math.PI / 2} visible={false}>
      <ringGeometry args={[0.32, 0.45, 32]} />
      <meshBasicMaterial color="#e07a5f" transparent depthWrite={false} />
    </mesh>
  )
}
