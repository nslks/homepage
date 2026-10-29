import { useKeyboardControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import {
  CapsuleCollider,
  type RapierCollider,
  type RapierRigidBody,
  RigidBody,
  useRapier,
} from '@react-three/rapier'
import { useEffect, useMemo, useRef, useState } from 'react'
import { type Group, Vector3 } from 'three'
import { Character, type CharacterAnimation } from '../character/Character'
import { DustPuff } from '../character/DustPuff'
import { useAppStore } from '../state/store'
import { playerPosition } from './playerPosition'
import { spawn } from '../world/layout'
import { autopilot, stopAutopilot } from './autopilot'
import type { Control } from './controls'
import { joystick } from './joystick'

// always at running pace; there is no separate walk (owner feedback, #74)
const SPEED = 7
const TURN_SPEED = 12
const CAPSULE_RADIUS = 0.35
const CAPSULE_HALF_HEIGHT = 0.5
const CENTER_Y = CAPSULE_HALF_HEIGHT + CAPSULE_RADIUS
// a waypoint counts as reached within this distance
const WAYPOINT_RADIUS = 0.25
// following stops when the character is blocked this long (e.g. by something the grid missed)
const STUCK_SECONDS = 0.8

const input = new Vector3()
const movement = new Vector3()
const cameraForward = new Vector3()
const cameraRight = new Vector3()
const up = new Vector3(0, 1, 0)

export function Player() {
  const body = useRef<RapierRigidBody>(null)
  const collider = useRef<RapierCollider>(null)
  const model = useRef<Group>(null)
  const [, getKeys] = useKeyboardControls<Control>()
  const [animation, setAnimation] = useState<CharacterAnimation>('Idle')
  const { world } = useRapier()
  const variant = useAppStore((state) => state.character)
  // a fresh puff plays on every swap, but not on the first render
  const [swaps, setSwaps] = useState(0)
  const [shownVariant, setShownVariant] = useState(variant)
  if (variant !== shownVariant) {
    setShownVariant(variant)
    setSwaps((n) => n + 1)
  }

  // Kinematic controller: slides along colliders instead of stopping dead at them
  const controller = useMemo(() => {
    const c = world.createCharacterController(0.02)
    c.setSlideEnabled(true)
    return c
  }, [world])
  useEffect(() => () => world.removeCharacterController(controller), [world, controller])

  useFrame(({ camera }, delta) => {
    if (!body.current || !collider.current || !model.current) return
    const dt = Math.min(delta, 0.05)
    const keys = getKeys()
    const { openStation, legalOpen, introDone } = useAppStore.getState()
    const locked = openStation !== null || legalOpen || !introDone

    input.set(0, 0, 0)
    if (!locked) {
      input.z = Number(keys.back) - Number(keys.forward) + joystick.y
      input.x = Number(keys.right) - Number(keys.left) + joystick.x
    }

    // camera-relative: W moves "up on screen"
    camera.getWorldDirection(cameraForward)
    cameraForward.y = 0
    cameraForward.normalize()
    cameraRight.crossVectors(cameraForward, up)
    movement.copy(cameraRight).multiplyScalar(input.x).addScaledVector(cameraForward, -input.z)

    const steering = movement.lengthSq() > 0
    // Manual steering takes over from a tapped path; panels, modals and the intro cancel it.
    if (steering || locked) stopAutopilot()
    if (steering) movement.normalize().multiplyScalar(SPEED * dt)

    const position = body.current.translation()
    let intended = 0
    if (!steering) {
      // follow the tapped path waypoint by waypoint
      while (autopilot.waypoints.length) {
        const waypoint = autopilot.waypoints[0]!
        const dx = waypoint.x - position.x
        const dz = waypoint.z - position.z
        const distance = Math.hypot(dx, dz)
        if (distance < WAYPOINT_RADIUS) {
          autopilot.waypoints.shift()
          continue
        }
        intended = Math.min(SPEED * dt, distance)
        movement.set(dx / distance, 0, dz / distance).multiplyScalar(intended)
        break
      }
      if (!autopilot.waypoints.length && autopilot.target) stopAutopilot()
    }

    const moving = movement.lengthSq() > 0

    controller.computeColliderMovement(collider.current, movement)
    const corrected = controller.computedMovement()
    if (intended > 0) {
      const progress = Math.hypot(corrected.x, corrected.z)
      autopilot.stuckFor = progress < intended * 0.3 ? autopilot.stuckFor + dt : 0
      if (autopilot.stuckFor > STUCK_SECONDS) stopAutopilot()
    }
    const next = { x: position.x + corrected.x, y: CENTER_Y, z: position.z + corrected.z }
    body.current.setNextKinematicTranslation(next)
    playerPosition.set(next.x, 0, next.z)

    if (moving) {
      const target = Math.atan2(movement.x, movement.z)
      const current = model.current.rotation.y
      const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current))
      model.current.rotation.y = current + diff * Math.min(1, TURN_SPEED * dt)
    }

    const nextAnimation: CharacterAnimation = moving ? 'Run' : 'Idle'
    if (nextAnimation !== animation) setAnimation(nextAnimation)
  })

  return (
    <RigidBody
      ref={body}
      type="kinematicPosition"
      colliders={false}
      position={[spawn.x, CENTER_Y, spawn.z]}
      enabledRotations={[false, false, false]}
    >
      <CapsuleCollider ref={collider} args={[CAPSULE_HALF_HEIGHT, CAPSULE_RADIUS]} />
      <group ref={model} position-y={-CENTER_Y} rotation-y={Math.PI}>
        <Character key={variant} variant={variant} animation={animation} />
      </group>
      {swaps > 0 && (
        <group key={swaps} position-y={-CENTER_Y}>
          <DustPuff />
        </group>
      )}
    </RigidBody>
  )
}
