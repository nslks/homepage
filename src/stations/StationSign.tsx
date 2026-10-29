import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import type { Group } from 'three'
import { localize, ui } from '../content'
import { useAppStore } from '../state/store'
import { fonts } from '../world/fonts'
import { type StationId, stationSigns } from '../world/layout'
import { stationMeta } from './stationMeta'
import { useTapTarget } from './useTapTarget'

// sized for the steep follow camera: about 30 cm letters, tilted back towards the viewer
const BOARD = { width: 2.3, height: 0.64, y: 1.15, tilt: -0.45 }
const post = '#6e4b33'
const board = '#5a3e2b'

// touch screens get "Antippen" instead of a key
const isTouch = (() => {
  try {
    return window.matchMedia('(pointer: coarse)').matches
  } catch {
    return false
  }
})()

// Small wooden sign in front of a station (spec §3.3): what it is, and — in range — how to open it.
// The text is unlit, so it stays legible at night
export function StationSign({ id }: { id: StationId }) {
  const place = stationSigns[id]
  const near = useAppStore((state) => state.nearStation === id)
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const tapTarget = useTapTarget(() => setOpenStation(id))
  const sway = useRef<Group>(null)

  // a gentle wobble sets the sign apart from decor
  useFrame(({ clock }) => {
    if (sway.current) sway.current.rotation.z = Math.sin(clock.elapsedTime * 1.3 + place.x) * 0.025
  })

  return (
    <group position={[place.x, 0, place.z]}>
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.6, 0.15]} position-y={0.6} />
      </RigidBody>
      <mesh position-y={BOARD.y / 2} castShadow>
        <boxGeometry args={[0.12, BOARD.y, 0.12]} />
        <meshStandardMaterial color={post} flatShading />
      </mesh>
      <group
        ref={sway}
        position-y={BOARD.y}
        rotation-x={BOARD.tilt}
        scale={near ? 1.06 : 1}
        {...tapTarget}
      >
        <mesh castShadow>
          <boxGeometry args={[BOARD.width, BOARD.height, 0.1]} />
          <meshStandardMaterial color={board} flatShading />
        </mesh>
        <mesh position-z={-0.01}>
          <boxGeometry args={[BOARD.width + 0.1, BOARD.height + 0.1, 0.07]} />
          <meshStandardMaterial color={near ? '#e07a5f' : post} flatShading />
        </mesh>
        <Text
          font={fonts.bold}
          fontSize={0.3}
          position-z={0.055}
          color="#fff3e0"
          anchorX="center"
          anchorY="middle"
          maxWidth={BOARD.width - 0.1}
        >
          {localize(stationMeta[id].title)}
        </Text>
        {near && (
          <group position-y={-BOARD.height / 2 - 0.27}>
            <mesh>
              <boxGeometry args={[1.3, 0.36, 0.06]} />
              <meshStandardMaterial color="#2b2d42" flatShading />
            </mesh>
            <Text
              font={fonts.semibold}
              fontSize={0.19}
              position-z={0.035}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
            >
              {localize(isTouch ? ui.prompt.tap : ui.prompt.interact)}
            </Text>
          </group>
        )}
      </group>
    </group>
  )
}
