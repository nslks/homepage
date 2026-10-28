import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { controlsMap } from './player/controls'
import { Scene } from './Scene'

export function App() {
  return (
    <KeyboardControls map={controlsMap}>
      <Canvas shadows camera={{ fov: 40 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}
