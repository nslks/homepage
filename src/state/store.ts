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
  // index into projects.yaml of the door closest to the character, while at the projects station
  nearProject: number | null
  setNearProject: (project: number | null) => void
  character: CharacterVariant
  toggleCharacter: () => void
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export type Theme = 'day' | 'night'

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

function systemTheme(): Theme {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
  } catch {
    return 'day'
  }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      openStation: null,
      setOpenStation: (openStation) => set({ openStation }),
      nearStation: null,
      setNearStation: (nearStation) => set({ nearStation }),
      nearProject: null,
      setNearProject: (nearProject) => set({ nearProject }),
      character: 'male',
      toggleCharacter: () =>
        set((state) => ({ character: state.character === 'male' ? 'female' : 'male' })),
      // without a stored choice, the system preference decides (spec §3.4)
      theme: systemTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'day' ? 'night' : 'day' })),
    }),
    {
      name: 'homepage-preferences',
      storage: createJSONStorage(() => safeLocalStorage),
      // only explicit user preferences are stored (ADR 0004)
      partialize: ({ character, theme }) => ({ character, theme }),
    },
  ),
)

// Updated every frame by the player; read by camera and stations without re-rendering React
export const playerPosition = new Vector3()
