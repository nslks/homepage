import { useFrame } from '@react-three/fiber'
import { useAppStore } from './state/store'

// Rendered inside the Suspense boundary: its first frame means everything has loaded
export function SceneReady() {
  useFrame(() => {
    const { sceneReady, setSceneReady } = useAppStore.getState()
    if (!sceneReady) setSceneReady()
  })
  return null
}
