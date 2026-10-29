import { Physics } from '@react-three/rapier'
import { FollowCamera } from './player/FollowCamera'
import { Player } from './player/Player'
import { playerPosition, useAppStore } from './state/store'
import { Stations } from './stations/Stations'
import { Decor } from './world/Decor'
import { Island } from './world/Island'
import { Lighting } from './world/Lighting'
import { Paths } from './world/Paths'
import { Sky } from './world/Sky'

// Append ?debug to the URL to render physics colliders
const debug = new URLSearchParams(window.location.search).has('debug')
// exposes live state for manual and automated checks in debug mode
if (debug) Object.assign(window, { __homepage: { playerPosition, store: useAppStore } })

export function Scene() {
  return (
    <>
      <Sky />
      <Lighting />

      <Physics debug={debug}>
        <Island />
        <Paths />
        <Decor />
        <Player />
        <Stations />
      </Physics>

      <FollowCamera />
    </>
  )
}
