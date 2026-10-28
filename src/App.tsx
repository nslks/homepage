import { Canvas } from '@react-three/fiber'
import { PlaceholderScene } from './PlaceholderScene'

export function App() {
  return (
    <Canvas shadows camera={{ position: [6, 6, 6], fov: 45 }}>
      <PlaceholderScene />
    </Canvas>
  )
}
