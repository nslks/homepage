import type { NavGrid } from './grid'

// The walkable grid, available once the physics world has been scanned
export const navigation: { grid: NavGrid | null } = { grid: null }
