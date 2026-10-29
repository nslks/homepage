import { Physics } from '@react-three/rapier'
import { FollowCamera } from './player/FollowCamera'
import { Player } from './player/Player'
import { SceneReady } from './SceneReady'
import { useAppStore } from './state/store'
import { playerPosition } from './player/playerPosition'
import { Stations } from './stations/Stations'
import { Decor } from './world/Decor'
import { environment } from './world/environment'
import { Fireflies } from './world/Fireflies'
import { Island } from './world/Island'
import { Lanterns } from './world/Lanterns'
import { Lighting } from './world/Lighting'
import { Paths } from './world/Paths'
import { Sky } from './world/Sky'

// Append ?debug to the URL to render physics colliders
const debug = new URLSearchParams(window.location.search).has('debug')
// exposes live state for manual and automated checks in debug mode
if (debug)
  Object.assign(window, { __homepage: { playerPosition, store: useAppStore, environment } })

export function Scene() {
  return (
    <>
      <Sky />
      <Lighting />

      <Physics debug={debug}>
        <Island />
        <Paths />
        <Decor />
        <Lanterns />
        <Player />
        <Stations />
      </Physics>

      <Fireflies />
      <FollowCamera />
      <SceneReady />
    </>
  )
}
