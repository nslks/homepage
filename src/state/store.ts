import { Vector3 } from 'three'
import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { CharacterVariant } from '../character/Character'
import type { StationId } from '../world/layout'

type AppState = {
  // the station whose panel is open; movement is locked while set
  openStation: StationId | null
  setOpenStation: (station: StationId | null) => void
  // the station the character currently stands next to
  nearStation: StationId | null
  setNearStation: (station: StationId | null) => void
  character: CharacterVariant
  toggleCharacter: () => void
}

// localStorage can be unavailable (private mode, blocked site data); preferences then just don't persist
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch {
      // ignore
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      // ignore
    }
  },
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      openStation: null,
      setOpenStation: (openStation) => set({ openStation }),
      nearStation: null,
      setNearStation: (nearStation) => set({ nearStation }),
      character: 'male',
      toggleCharacter: () =>
        set((state) => ({ character: state.character === 'male' ? 'female' : 'male' })),
    }),
    {
      name: 'homepage-preferences',
      storage: createJSONStorage(() => safeLocalStorage),
      // only explicit user preferences are stored (ADR 0004)
      partialize: ({ character }) => ({ character }),
    },
  ),
)

// Updated every frame by the player; read by camera and stations without re-rendering React
export const playerPosition = new Vector3()
