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
import { playerPosition, useAppStore } from '../state/store'
import { spawn } from '../world/layout'
import type { Control } from './controls'

const WALK_SPEED = 3.2
const RUN_SPEED = 6
const TURN_SPEED = 12
const CAPSULE_RADIUS = 0.35
const CAPSULE_HALF_HEIGHT = 0.5
const CENTER_Y = CAPSULE_HALF_HEIGHT + CAPSULE_RADIUS

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
    const locked = useAppStore.getState().openStation !== null

    input.set(0, 0, 0)
    if (!locked) {
      input.z = Number(keys.back) - Number(keys.forward)
      input.x = Number(keys.right) - Number(keys.left)
    }

    // camera-relative: W moves "up on screen"
    camera.getWorldDirection(cameraForward)
    cameraForward.y = 0
    cameraForward.normalize()
    cameraRight.crossVectors(cameraForward, up)
    movement.copy(cameraRight).multiplyScalar(input.x).addScaledVector(cameraForward, -input.z)

    const moving = movement.lengthSq() > 0
    const running = moving && keys.run
    if (moving) movement.normalize().multiplyScalar((running ? RUN_SPEED : WALK_SPEED) * dt)

    controller.computeColliderMovement(collider.current, movement)
    const corrected = controller.computedMovement()
    const position = body.current.translation()
    const next = { x: position.x + corrected.x, y: CENTER_Y, z: position.z + corrected.z }
    body.current.setNextKinematicTranslation(next)
    playerPosition.set(next.x, 0, next.z)

    if (moving) {
      const target = Math.atan2(movement.x, movement.z)
      const current = model.current.rotation.y
      const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current))
      model.current.rotation.y = current + diff * Math.min(1, TURN_SPEED * dt)
    }

    const nextAnimation: CharacterAnimation = running ? 'Run' : moving ? 'Walk' : 'Idle'
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
        <Character variant="male" animation={animation} />
      </group>
    </RigidBody>
  )
}
