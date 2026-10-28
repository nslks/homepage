import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { type Group, IcosahedronGeometry, type Mesh, type MeshStandardMaterial } from 'three'

const PUFFS = 10
const DURATION = 0.7
const geometry = new IcosahedronGeometry(0.22, 0)

// Small burst of dust; plays once and hides itself
export function DustPuff() {
  const group = useRef<Group>(null)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    if (!group.current) return
    elapsed.current += delta
    const t = Math.min(elapsed.current / DURATION, 1)
    group.current.visible = t < 1
    group.current.children.forEach((child, i) => {
      const puff = child as Mesh<IcosahedronGeometry, MeshStandardMaterial>
      const angle = (i / PUFFS) * Math.PI * 2
      const distance = 0.3 + t * 0.9
      puff.position.set(
        Math.cos(angle) * distance,
        0.2 + t * 0.6 + (i % 3) * 0.25,
        Math.sin(angle) * distance,
      )
      puff.scale.setScalar(0.6 + t * 1.2)
      puff.material.opacity = 1 - t
    })
  })

  return (
    <group ref={group}>
      {Array.from({ length: PUFFS }, (_, i) => (
        <mesh key={i} geometry={geometry}>
          <meshStandardMaterial color="#efe6d6" flatShading transparent />
        </mesh>
      ))}
    </group>
  )
}
