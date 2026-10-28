import { useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import { Vector3 } from 'three'
import { playerPosition } from '../state/store'
import { spawn } from '../world/layout'

// Elevated, isometric-like view from the south; the angle never changes, only the position follows
const CAMERA_OFFSET = new Vector3(0, 14.5, 13)
const LOOK_AT_HEIGHT = 0.8
// Higher = snappier; frame-rate independent exponential smoothing
const FOLLOW_SHARPNESS = 4

const target = new Vector3()
const desired = new Vector3()

export function FollowCamera() {
  const camera = useThree((state) => state.camera)

  useLayoutEffect(() => {
    target.set(spawn.x, LOOK_AT_HEIGHT, spawn.z)
    camera.position.copy(target).add(CAMERA_OFFSET)
    camera.lookAt(target)
  }, [camera])

  useFrame((_, delta) => {
    const t = 1 - Math.exp(-FOLLOW_SHARPNESS * delta)
    target.lerp(desired.set(playerPosition.x, LOOK_AT_HEIGHT, playerPosition.z), t)
    camera.position.copy(target).add(CAMERA_OFFSET)
    camera.lookAt(target)
  })

  return null
}
