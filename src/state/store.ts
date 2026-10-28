import { Vector3 } from 'three'
import { create } from 'zustand'
import type { StationId } from '../world/layout'

type AppState = {
  // the station whose panel is open; movement is locked while set
  openStation: StationId | null
  setOpenStation: (station: StationId | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  openStation: null,
  setOpenStation: (openStation) => set({ openStation }),
}))

// Updated every frame by the player; read by camera and stations without re-rendering React
export const playerPosition = new Vector3()
