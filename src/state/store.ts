import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { CharacterVariant } from '../character/Character'
import type { QualityTier } from '../quality/tiers'
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
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  // true once the scene (models, physics) has rendered its first frame
  sceneReady: boolean
  setSceneReady: () => void
  // the camera flight after loading; movement is locked until it is done or skipped
  introDone: boolean
  finishIntro: () => void
  // the welcome card is shown on every visit (owner feedback: it seemed to never appear)
  welcomeSeen: boolean
  dismissWelcome: () => void
  // Impressum / Datenschutz modal; movement is locked while it is open
  legalOpen: boolean
  setLegalOpen: (open: boolean) => void
  // adaptive rendering quality, decided at runtime from the frame rate (not persisted)
  quality: QualityTier
  setQuality: (quality: QualityTier) => void
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
      character: 'male',
      toggleCharacter: () =>
        set((state) => ({ character: state.character === 'male' ? 'female' : 'male' })),
      // without a stored choice, the system preference decides (spec §3.4)
      theme: systemTheme(),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'day' ? 'night' : 'day' })),
      sceneReady: false,
      setSceneReady: () => set({ sceneReady: true }),
      introDone: false,
      finishIntro: () => set({ introDone: true }),
      welcomeSeen: false,
      dismissWelcome: () => set({ welcomeSeen: true }),
      legalOpen: false,
      setLegalOpen: (legalOpen) => set({ legalOpen }),
      quality: 'medium',
      setQuality: (quality) => set({ quality }),
    }),
    {
      name: 'homepage-preferences',
      storage: createJSONStorage(() => safeLocalStorage),
      // only explicit user preferences are stored (ADR 0004)
      partialize: ({ character, theme }) => ({ character, theme }),
      // only these two come back from storage — older visits also stored e.g. `welcomeSeen`,
      // which would otherwise keep the welcome card hidden for good
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<AppState>
        return {
          ...current,
          ...(stored.character && { character: stored.character }),
          ...(stored.theme && { theme: stored.theme }),
        }
      },
    },
  ),
)
