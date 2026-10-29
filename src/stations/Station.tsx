import { useFrame } from '@react-three/fiber'
import { type ReactNode, useRef } from 'react'
import type { Mesh, MeshBasicMaterial } from 'three'
import { playerPosition } from '../player/playerPosition'
import { useAppStore } from '../state/store'
import { interactionRadius, type StationId, stations } from '../world/layout'
import { StationLabel } from './StationLabel'
import { useTapTarget } from './useTapTarget'

const RING_WIDTH = 0.22

type Props = {
  id: StationId
  children: ReactNode
}

// Wraps a station model with what makes it recognisable and interactive (spec §3.3):
// a label in front of it, the range ring and the model as tap target
export function Station({ id, children }: Props) {
  const placement = stations[id]
  const radius = interactionRadius[id]
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const ring = useRef<Mesh<never, MeshBasicMaterial>>(null)
  const tapTarget = useTapTarget(() => setOpenStation(id))

  useFrame(({ clock }) => {
    const distance = Math.hypot(playerPosition.x - placement.x, playerPosition.z - placement.z)
    const store = useAppStore.getState()
    if (distance < radius && store.nearStation !== id) store.setNearStation(id)
    if (distance >= radius && store.nearStation === id) store.setNearStation(null)

    if (ring.current) {
      const inRange = store.nearStation === id
      ring.current.material.opacity = inRange ? 0.65 + Math.sin(clock.elapsedTime * 4) * 0.15 : 0.18
    }
  })

  return (
    <>
      <group position={[placement.x, 0, placement.z]}>
        <group rotation-y={placement.facing} {...tapTarget}>
          {children}
        </group>
        <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.05}>
          <ringGeometry args={[radius - RING_WIDTH, radius, 40]} />
          <meshBasicMaterial color="#fff6d8" transparent depthWrite={false} />
        </mesh>
      </group>
      <StationLabel id={id} />
    </>
  )
}
