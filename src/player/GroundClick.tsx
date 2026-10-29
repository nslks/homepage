import type { ThreeEvent } from '@react-three/fiber'
import { useAppStore } from '../state/store'
import { walkTo } from './autopilot'

// pointer travel (px) above which a press counts as a drag, not a tap
const TAP_TOLERANCE = 10

// Invisible disc over the island: a tap or click on the ground walks the character there.
// Objects in front (trees, buildings) don't block it — the path ends next to them
export function GroundClick() {
  const onClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > TAP_TOLERANCE) return
    const { openStation, legalOpen, introDone } = useAppStore.getState()
    if (openStation || legalOpen || !introDone) return
    walkTo({ x: event.point.x, z: event.point.z })
  }

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.02} onClick={onClick}>
      <circleGeometry args={[18, 32]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}
