import { Physics } from '@react-three/rapier'
import { FollowCamera } from './player/FollowCamera'
import { NavigationBuilder } from './navigation/NavigationBuilder'
import { GroundClick } from './player/GroundClick'
import { Player } from './player/Player'
import { QualityMonitor } from './quality/QualityMonitor'
import { TargetMarker } from './player/TargetMarker'
import { SceneReady } from './SceneReady'
import { useAppStore } from './state/store'
import { playerPosition } from './player/playerPosition'
import { Stations } from './stations/Stations'
import { Decor } from './world/Decor'
import { environment } from './world/environment'
import { findPath } from './navigation/grid'
import { navigation } from './navigation/navigation'
import { autopilot, walkTo } from './player/autopilot'
import { Fireflies } from './world/Fireflies'
import { Island } from './world/Island'
import { Lanterns } from './world/Lanterns'
import { Lighting } from './world/Lighting'
import { Paths } from './world/Paths'
import { Pond } from './world/Pond'
import { Sky } from './world/Sky'

// Append ?debug to the URL to render physics colliders
const debug = new URLSearchParams(window.location.search).has('debug')
// exposes live state for manual and automated checks in debug mode
if (debug)
  Object.assign(window, {
    __homepage: {
      playerPosition,
      store: useAppStore,
      environment,
      navigation,
      findPath,
      autopilot,
      walkTo,
    },
  })

export function Scene() {
  return (
    <>
      <Sky />
      <Lighting />

      <Physics debug={debug}>
        <Island />
        <Paths />
        <Pond />
        <Decor />
        <Lanterns />
        <Player />
        <Stations />
        <NavigationBuilder />
        <GroundClick />
        <TargetMarker />
      </Physics>

      <Fireflies />
      <FollowCamera />
      <SceneReady />
      <QualityMonitor />
    </>
  )
}
