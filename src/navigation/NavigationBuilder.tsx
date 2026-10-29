import { useFrame } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import { useMemo, useRef, useState } from 'react'
import { BufferAttribute, BufferGeometry } from 'three'
import { BOUNDARY_INSET, islandRadiusAt } from '../world/layout'
import { centerOf, createGrid, type NavGrid } from './grid'
import { navigation } from './navigation'

const debug = new URLSearchParams(window.location.search).has('debug')
// a ball the size of the character (capsule radius + margin), held above the ground
const PROBE_RADIUS = 0.45
const PROBE_HEIGHT = 0.6
// colliders are registered in the broad phase during the first physics steps
const SCAN_AFTER_FRAMES = 3

// Scans the physics world once into a walkable grid: obstacles come from the real colliders,
// so the grid always matches what blocks the character
export function NavigationBuilder() {
  const { world, rapier } = useRapier()
  const frames = useRef(0)
  const [grid, setGrid] = useState<NavGrid | null>(null)

  useFrame(() => {
    if (navigation.grid || ++frames.current < SCAN_AFTER_FRAMES) return
    const probe = new rapier.Ball(PROBE_RADIUS)
    const rotation = { x: 0, y: 0, z: 0, w: 1 }
    navigation.grid = createGrid((p) => {
      const radius = Math.hypot(p.x, p.z)
      if (radius > islandRadiusAt(p) - BOUNDARY_INSET) return false
      // the player itself is the only kinematic body and must not count as an obstacle
      return (
        world.intersectionWithShape(
          { x: p.x, y: PROBE_HEIGHT, z: p.z },
          rotation,
          probe,
          rapier.QueryFilterFlags.EXCLUDE_KINEMATIC,
        ) === null
      )
    })
    if (debug) setGrid(navigation.grid)
  })

  return debug && grid ? <GridDebug grid={grid} /> : null
}

// ?debug: walkable cells as small dots on the ground
function GridDebug({ grid }: { grid: NavGrid }) {
  const geometry = useMemo(() => {
    const points: number[] = []
    for (let j = 0; j < grid.cells; j++) {
      for (let i = 0; i < grid.cells; i++) {
        if (!grid.walkable[j * grid.cells + i]) continue
        const c = centerOf(i, j)
        points.push(c.x, 0.06, c.z)
      }
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(new Float32Array(points), 3))
    return g
  }, [grid])
  return (
    <points geometry={geometry}>
      <pointsMaterial color="#00c853" size={0.12} />
    </points>
  )
}
