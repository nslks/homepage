import type { ThreeEvent } from '@react-three/fiber'
import { useEffect } from 'react'
import { useAppStore } from '../state/store'

// pointer travel (px) above which a press counts as a drag, not a tap
const TAP_TOLERANCE = 10

// Pointer handlers that make a 3D model a tap/click target; the tap does not reach the ground
// behind it (which would start walking), and the cursor shows a hand on hover
export function useTapTarget(onTap: () => void) {
  useEffect(() => () => void (document.body.style.cursor = ''), [])
  return {
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation()
      if (event.delta > TAP_TOLERANCE) return
      const { openStation, legalOpen, introDone } = useAppStore.getState()
      if (openStation || legalOpen || !introDone) return
      onTap()
    },
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = ''
    },
  }
}
