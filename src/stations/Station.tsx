import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { type ReactNode, useRef } from 'react'
import type { Group, Mesh, MeshBasicMaterial } from 'three'
import { localize, ui } from '../content'
import { playerPosition, useAppStore } from '../state/store'
import { interactionRadius, type StationId, stations } from '../world/layout'
import { stationMeta } from './stationMeta'
import './stations.css'

const RING_WIDTH = 0.22
const LABEL_BOB = 0.12

type Props = {
  id: StationId
  // height of the floating label above the ground
  labelHeight: number
  children: ReactNode
}

// Wraps a station model with what makes it recognisable and interactive (spec §3.3)
export function Station({ id, labelHeight, children }: Props) {
  const placement = stations[id]
  const radius = interactionRadius[id]
  const near = useAppStore((state) => state.nearStation === id)
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const ring = useRef<Mesh<never, MeshBasicMaterial>>(null)
  const label = useRef<Group>(null)
  const { icon: Icon, title } = stationMeta[id]

  useFrame(({ clock }) => {
    const distance = Math.hypot(playerPosition.x - placement.x, playerPosition.z - placement.z)
    const store = useAppStore.getState()
    if (distance < radius && store.nearStation !== id) store.setNearStation(id)
    if (distance >= radius && store.nearStation === id) store.setNearStation(null)

    const t = clock.elapsedTime + placement.x
    if (label.current) label.current.position.y = labelHeight + Math.sin(t * 1.6) * LABEL_BOB
    if (ring.current) {
      const inRange = store.nearStation === id
      ring.current.material.opacity = inRange ? 0.65 + Math.sin(t * 4) * 0.15 : 0.18
    }
  })

  return (
    <group position={[placement.x, 0, placement.z]}>
      <group rotation-y={placement.facing}>{children}</group>

      <mesh ref={ring} rotation-x={-Math.PI / 2} position-y={0.05}>
        <ringGeometry args={[radius - RING_WIDTH, radius, 40]} />
        <meshBasicMaterial color="#fff6d8" transparent depthWrite={false} />
      </mesh>

      <group ref={label} position-y={labelHeight}>
        <Html center zIndexRange={[10, 0]}>
          <div className={`station-label${near ? ' station-label--near' : ''}`}>
            {/* clickable from any distance, so nobody has to walk (spec §4.2) */}
            <button
              type="button"
              className="station-label__title"
              onClick={() => setOpenStation(id)}
            >
              <Icon size={18} aria-hidden="true" />
              {localize(title)}
            </button>
            {near && <span className="station-label__prompt">{localize(ui.prompt.interact)}</span>}
          </div>
        </Html>
      </group>
    </group>
  )
}
