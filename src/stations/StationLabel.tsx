import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { localize, ui } from '../content'
import { useAppStore } from '../state/store'
import { type StationId, stationSigns } from '../world/layout'
import { stationMeta } from './stationMeta'
import './stations.css'

// eye level, in front of the station: visible as soon as its plaza is, however tall the model is
const LABEL_HEIGHT = 1.6
const LABEL_BOB = 0.08

// touch screens get "Antippen" instead of a key
const isTouch = (() => {
  try {
    return window.matchMedia('(pointer: coarse)').matches
  } catch {
    return false
  }
})()

// Crisp HTML label of a station (spec §3.3): icon + title as a button, prompt in range
export function StationLabel({ id }: { id: StationId }) {
  const anchor = stationSigns[id]
  const near = useAppStore((state) => state.nearStation === id)
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const label = useRef<Group>(null)
  const { icon: Icon, title } = stationMeta[id]

  useFrame(({ clock }) => {
    if (label.current)
      label.current.position.y =
        LABEL_HEIGHT + Math.sin(clock.elapsedTime * 1.6 + anchor.x) * LABEL_BOB
  })

  return (
    <group ref={label} position={[anchor.x, LABEL_HEIGHT, anchor.z]}>
      <Html center zIndexRange={[10, 0]}>
        <div className={`station-label${near ? ' station-label--near' : ''}`}>
          {/* clickable from any distance, so nobody has to walk (spec §4.2) */}
          <button type="button" className="station-label__title" onClick={() => setOpenStation(id)}>
            <Icon size={18} aria-hidden="true" />
            {localize(title)}
          </button>
          {near && (
            <span className="station-label__prompt">
              {localize(isTouch ? ui.prompt.tap : ui.prompt.interact)}
            </span>
          )}
        </div>
      </Html>
    </group>
  )
}
