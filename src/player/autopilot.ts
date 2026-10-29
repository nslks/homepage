import { findPath } from '../navigation/grid'
import { navigation } from '../navigation/navigation'
import { useAppStore } from '../state/store'
import type { Point } from '../world/layout'
import { playerPosition } from './playerPosition'

// Path the character follows after a tap or click; read and advanced by the Player each frame
export const autopilot = {
  waypoints: [] as Point[],
  target: null as Point | null,
  // seconds the character has barely moved while following the path
  stuckFor: 0,
}

export function stopAutopilot() {
  autopilot.waypoints = []
  autopilot.target = null
  autopilot.stuckFor = 0
}

export function walkTo(to: Point) {
  const grid = navigation.grid
  if (!grid) return
  const path = findPath(grid, { x: playerPosition.x, z: playerPosition.z }, to)
  if (!path || path.waypoints.length === 0) return stopAutopilot()
  autopilot.waypoints = path.waypoints
  autopilot.target = path.target
  autopilot.stuckFor = 0
  // walking by tap shows the visitor knows how to move
  useAppStore.getState().dismissWelcome()
}
