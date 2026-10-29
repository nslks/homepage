import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { playerPosition, useAppStore } from '../state/store'
import { spawn } from '../world/layout'

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

const target = new Vector3()
const desired = new Vector3()
const followPosition = new Vector3()
const look = new Vector3()

export function FollowCamera() {
  const camera = useThree((state) => state.camera)
  const introTime = useRef(-INTRO_DELAY)

  useLayoutEffect(() => {
    target.set(spawn.x, LOOK_AT_HEIGHT, spawn.z)
    if (useAppStore.getState().introDone) {
      camera.position.copy(target).add(CAMERA_OFFSET)
      camera.lookAt(target)
    } else {
      camera.position.copy(INTRO_START)
      camera.lookAt(INTRO_LOOK)
    }
  }, [camera])

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-FOLLOW_SHARPNESS * delta)
    target.lerp(desired.set(playerPosition.x, LOOK_AT_HEIGHT, playerPosition.z), t)
    followPosition.copy(target).add(CAMERA_OFFSET)

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
  })

  return null
}
