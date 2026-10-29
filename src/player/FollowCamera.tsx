import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { MathUtils, type PerspectiveCamera, Vector3 } from 'three'
import { useAppStore } from '../state/store'
import { playerPosition } from './playerPosition'
import { spawn } from '../world/layout'
import { useMobileControls } from './useMobileControls'

// Elevated, isometric-like view from the south; the angle never changes, only the position follows
const CAMERA_OFFSET = new Vector3(0, 14.5, 13)
const LOOK_AT_HEIGHT = 0.8
// Higher = snappier; frame-rate independent exponential smoothing
const FOLLOW_SHARPNESS = 4

// Intro (spec §5.1): from high above the island down to the character in under 2 s
const INTRO_START = new Vector3(-10, 34, 30)
const INTRO_LOOK = new Vector3(0, -2, 0)
const INTRO_SECONDS = 1.8
// lets the loading screen fade out before the flight starts
const INTRO_DELAY = 0.4
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Keep a local view on phones: the former 17 m framing made the character and stations tiny.
const DESKTOP_FOV = 40
const PORTRAIT_FOV = 50
const MIN_VISIBLE_WIDTH = 17
const MOBILE_VISIBLE_WIDTH = 10
const MOBILE_DISTANCE = 0.75
// in portrait the view leans north: the character sits lower and more island shows above it
const PORTRAIT_LEAD = 3.5
const offset = new Vector3()
let lead = 0

function fitToAspect(camera: PerspectiveCamera, mobile: boolean) {
  const portraitness = MathUtils.clamp((1.3 - camera.aspect) / 0.7, 0, 1)
  lead = portraitness * (mobile ? 2 : PORTRAIT_LEAD)
  const fov = MathUtils.lerp(DESKTOP_FOV, PORTRAIT_FOV, portraitness)
  if (Math.abs(camera.fov - fov) > 0.01) {
    camera.fov = fov
    camera.updateProjectionMatrix()
  }
  const baseScale = mobile ? MOBILE_DISTANCE : 1
  const baseDistance = CAMERA_OFFSET.length() * baseScale
  const visibleWidth = 2 * baseDistance * Math.tan(MathUtils.degToRad(fov / 2)) * camera.aspect
  const scale = Math.max(1, (mobile ? MOBILE_VISIBLE_WIDTH : MIN_VISIBLE_WIDTH) / visibleWidth)
  return offset.copy(CAMERA_OFFSET).multiplyScalar(baseScale * scale)
}

const target = new Vector3()
const desired = new Vector3()
const followPosition = new Vector3()
const look = new Vector3()

export function FollowCamera() {
  const mobile = useMobileControls()
  const camera = useThree((state) => state.camera)
  const introTime = useRef(-INTRO_DELAY)

  useLayoutEffect(() => {
    target.set(spawn.x, LOOK_AT_HEIGHT, spawn.z)
    if (useAppStore.getState().introDone) {
      camera.position.copy(target).add(fitToAspect(camera as PerspectiveCamera, mobile))
      camera.lookAt(target)
    } else {
      camera.position.copy(INTRO_START)
      camera.lookAt(INTRO_LOOK)
    }
  }, [camera, mobile])

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-FOLLOW_SHARPNESS * delta)
    target.lerp(desired.set(playerPosition.x, LOOK_AT_HEIGHT, playerPosition.z - lead), t)
    // recomputed every frame, so rotating the device adapts immediately
    followPosition.copy(target).add(fitToAspect(camera as PerspectiveCamera, mobile))

    const { sceneReady, introDone, finishIntro } = useAppStore.getState()
    if (!introDone) {
      introTime.current += sceneReady ? Math.min(delta, 0.05) : 0
      const progress = Math.min(Math.max(introTime.current / INTRO_SECONDS, 0), 1)
      const eased = easeInOutCubic(progress)
      camera.position.lerpVectors(INTRO_START, followPosition, eased)
      camera.lookAt(look.lerpVectors(INTRO_LOOK, target, eased))
      if (progress >= 1) finishIntro()
      return
    }

    camera.position.copy(followPosition)
    camera.lookAt(target)
    // negative priority: runs before the station labels project themselves with this camera,
    // otherwise they lag one frame behind (visible after jumps such as skipping the intro)
  }, -1)

  return null
}
