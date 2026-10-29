import { useFrame, useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { preloadCharacter } from './character/models'
import { useAppStore } from './state/store'

const debug = new URLSearchParams(window.location.search).has('debug')

// Rendered inside the Suspense boundary: its first frame means everything has loaded
export function SceneReady() {
  const gl = useThree((state) => state.gl)
  const camera = useThree((state) => state.camera)
  const scene = useThree((state) => state.scene)
  // debug mode: expose renderer statistics and the camera for performance checks and tests
  useEffect(() => {
    if (debug) Object.assign(window, { __renderer: gl, __camera: camera, __scene: scene })
  }, [gl, camera, scene])

  useFrame(() => {
    const { sceneReady, setSceneReady, character } = useAppStore.getState()
    if (sceneReady) return
    setSceneReady()
    // the other variant loads in the background, so the ♂/♀ swap is still instant (#38)
    preloadCharacter(character === 'male' ? 'female' : 'male')
  })
  return null
}
