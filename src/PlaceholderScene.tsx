import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

// Walking-skeleton scene; replaced by the island in M1
export function PlaceholderScene() {
  const gem = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (gem.current) gem.current.rotation.y += delta * 0.6
  })

  return (
    <>
      <color attach="background" args={['#bfe3f5']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={1.6} castShadow />

      <mesh ref={gem} position={[0, 1.2, 0]} castShadow>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#f2a65a" flatShading />
      </mesh>

      <mesh position={[0, -0.25, 0]} receiveShadow>
        <cylinderGeometry args={[3, 2.2, 0.5, 7]} />
        <meshStandardMaterial color="#7cc06b" flatShading />
      </mesh>
    </>
  )
}
