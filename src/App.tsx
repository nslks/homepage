import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './Scene'

export function App() {
  return (
    <Canvas shadows camera={{ position: [0, 24, 34], fov: 40 }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}
