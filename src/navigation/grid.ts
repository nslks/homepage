import type { Point } from '../world/layout'

// Walkable grid over the island; built once from the physics colliders (see NavigationBuilder)
export const CELL_SIZE = 0.5
export const GRID_EXTENT = 17

export type NavGrid = {
  cells: number
  walkable: Uint8Array
}

export function createGrid(isWalkable: (p: Point) => boolean): NavGrid {
  const cells = Math.ceil((GRID_EXTENT * 2) / CELL_SIZE)
  const walkable = new Uint8Array(cells * cells)
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) walkable[j * cells + i] = isWalkable(centerOf(i, j)) ? 1 : 0
  }
  return { cells, walkable }
}

export const centerOf = (i: number, j: number): Point => ({
  x: -GRID_EXTENT + (i + 0.5) * CELL_SIZE,
  z: -GRID_EXTENT + (j + 0.5) * CELL_SIZE,
})

const clampCell = (grid: NavGrid, v: number) =>
  Math.min(grid.cells - 1, Math.max(0, Math.floor((v + GRID_EXTENT) / CELL_SIZE)))
const indexOf = (grid: NavGrid, p: Point) =>
  clampCell(grid, p.z) * grid.cells + clampCell(grid, p.x)
const isOpen = (grid: NavGrid, i: number, j: number) =>
  i >= 0 && j >= 0 && i < grid.cells && j < grid.cells && grid.walkable[j * grid.cells + i] === 1

export function isWalkableAt(grid: NavGrid, p: Point) {
  const index = indexOf(grid, p)
  return grid.walkable[index] === 1
}

// Nearest walkable cell to a point (breadth-first search over the grid)
function nearestWalkable(grid: NavGrid, start: number): number | null {
  if (grid.walkable[start]) return start
  const seen = new Uint8Array(grid.walkable.length)
  const queue = [start]
  seen[start] = 1
  for (let head = 0; head < queue.length; head++) {
    const index = queue[head]!
    if (grid.walkable[index]) return index
    const i = index % grid.cells
    const j = (index - i) / grid.cells
    for (const [di, dj] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const ni = i + di
      const nj = j + dj
      if (ni < 0 || nj < 0 || ni >= grid.cells || nj >= grid.cells) continue
      const next = nj * grid.cells + ni
      if (!seen[next]) {
        seen[next] = 1
        queue.push(next)
      }
    }
  }
  return null
}

// Every cell reachable from `start`, as a mask
function reachableFrom(grid: NavGrid, start: number): Uint8Array {
  const reached = new Uint8Array(grid.walkable.length)
  const stack = [start]
  reached[start] = 1
  while (stack.length) {
    const index = stack.pop()!
    const i = index % grid.cells
    const j = (index - i) / grid.cells
    for (const [di, dj] of NEIGHBOURS) {
      if (!canStep(grid, i, j, di, dj)) continue
      const next = (j + dj) * grid.cells + i + di
      if (!reached[next]) {
        reached[next] = 1
        stack.push(next)
      }
    }
  }
  return reached
}

const NEIGHBOURS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const

// Diagonal steps must not cut corners of blocked cells
const canStep = (grid: NavGrid, i: number, j: number, di: number, dj: number) =>
  isOpen(grid, i + di, j + dj) &&
  (di === 0 || dj === 0 || (isOpen(grid, i + di, j) && isOpen(grid, i, j + dj)))

// Minimal binary heap keyed by f-score
class Heap {
  private items: number[] = []
  constructor(private score: Float64Array) {}
  get size() {
    return this.items.length
  }
  push(item: number) {
    const items = this.items
    items.push(item)
    for (let n = items.length - 1; n > 0;) {
      const parent = (n - 1) >> 1
      if (this.score[items[parent]!]! <= this.score[items[n]!]!) break
      ;[items[parent], items[n]] = [items[n]!, items[parent]!]
      n = parent
    }
  }
  pop(): number {
    const items = this.items
    const top = items[0]!
    const last = items.pop()!
    if (items.length) {
      items[0] = last
      for (let n = 0; ;) {
        const l = n * 2 + 1
        const r = l + 1
        let smallest = n
        if (l < items.length && this.score[items[l]!]! < this.score[items[smallest]!]!) smallest = l
        if (r < items.length && this.score[items[r]!]! < this.score[items[smallest]!]!) smallest = r
        if (smallest === n) break
        ;[items[smallest], items[n]] = [items[n]!, items[smallest]!]
        n = smallest
      }
    }
    return top
  }
}

function aStar(grid: NavGrid, start: number, goal: number): number[] | null {
  const total = grid.walkable.length
  const g = new Float64Array(total).fill(Infinity)
  const f = new Float64Array(total).fill(Infinity)
  const from = new Int32Array(total).fill(-1)
  const closed = new Uint8Array(total)
  const gi = goal % grid.cells
  const gj = (goal - gi) / grid.cells
  const heuristic = (index: number) => {
    const dx = Math.abs((index % grid.cells) - gi)
    const dz = Math.abs(Math.floor(index / grid.cells) - gj)
    return Math.max(dx, dz) + (Math.SQRT2 - 1) * Math.min(dx, dz)
  }
  const open = new Heap(f)
  g[start] = 0
  f[start] = heuristic(start)
  open.push(start)
  while (open.size) {
    const current = open.pop()
    if (current === goal) {
      const path = [current]
      while (from[path[0]!]! !== -1) path.unshift(from[path[0]!]!)
      return path
    }
    if (closed[current]) continue
    closed[current] = 1
    const i = current % grid.cells
    const j = (current - i) / grid.cells
    for (const [di, dj] of NEIGHBOURS) {
      if (!canStep(grid, i, j, di, dj)) continue
      const next = (j + dj) * grid.cells + i + di
      const cost = g[current]! + (di !== 0 && dj !== 0 ? Math.SQRT2 : 1)
      if (cost < g[next]!) {
        g[next] = cost
        f[next] = cost + heuristic(next)
        from[next] = current
        open.push(next)
      }
    }
  }
  return null
}

// Straight segment stays on walkable cells (sampled at a quarter cell)
function lineOfSight(grid: NavGrid, a: Point, b: Point) {
  const steps = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / (CELL_SIZE / 4))
  for (let s = 1; s < steps; s++) {
    const t = s / steps
    if (!isWalkableAt(grid, { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t })) return false
  }
  return true
}

// Drops waypoints that are visible from an earlier one, so the character walks straight lines
function smooth(grid: NavGrid, points: Point[]): Point[] {
  const result = [points[0]!]
  let anchor = 0
  while (anchor < points.length - 1) {
    let next = points.length - 1
    while (next > anchor + 1 && !lineOfSight(grid, points[anchor]!, points[next]!)) next--
    result.push(points[next]!)
    anchor = next
  }
  return result
}

export type PathResult = { waypoints: Point[]; target: Point; reachedTarget: boolean }

// Path from `from` to `to`; an unreachable target resolves to the nearest reachable point.
// Waypoints exclude the start position
export function findPath(grid: NavGrid, from: Point, to: Point): PathResult | null {
  const start = nearestWalkable(grid, indexOf(grid, from))
  if (start === null) return null
  const reachable = reachableFrom(grid, start)
  let goal = indexOf(grid, to)
  const reachedTarget = reachable[goal] === 1
  if (!reachedTarget) {
    let best = Infinity
    for (let index = 0; index < reachable.length; index++) {
      if (!reachable[index]) continue
      const c = centerOf(index % grid.cells, Math.floor(index / grid.cells))
      // closest to the target; on (near) ties prefer the side facing the character, e.g. the
      // entrance of a building instead of its back
      const d = Math.hypot(c.x - to.x, c.z - to.z) + 0.1 * Math.hypot(c.x - from.x, c.z - from.z)
      if (d < best) {
        best = d
        goal = index
      }
    }
  }
  const cells = aStar(grid, start, goal)
  if (!cells) return null
  const target = reachedTarget ? to : centerOf(goal % grid.cells, Math.floor(goal / grid.cells))
  const points = [
    from,
    ...cells.slice(1, -1).map((c) => centerOf(c % grid.cells, Math.floor(c / grid.cells))),
    target,
  ]
  return { waypoints: smooth(grid, points).slice(1), target, reachedTarget }
}
