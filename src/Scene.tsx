import { OrbitControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Player } from './player/Player'
import { playerPosition, useAppStore } from './state/store'
import { palette } from './world/palette'
import { Decor } from './world/Decor'
import { Island } from './world/Island'
import { Paths } from './world/Paths'

// Append ?debug to the URL to render physics colliders
const debug = new URLSearchParams(window.location.search).has('debug')
// exposes live state for manual and automated checks in debug mode
if (debug) Object.assign(window, { __homepage: { playerPosition, store: useAppStore } })

export function Scene() {
  return (
    <>
      <color attach="background" args={[palette.sky]} />
      <hemisphereLight args={['#ffffff', '#c9b293', 1.1]} />
      <directionalLight
        position={[12, 20, 8]}
        intensity={1.8}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
      />

      <Physics debug={debug}>
        <Island />
        <Paths />
        <Decor />
        <Player />
      </Physics>

      {/* temporary free camera until the follow camera (#19) lands */}
      <OrbitControls target={[0, -1, 0]} maxDistance={70} />
    </>
  )
}
