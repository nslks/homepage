import { useEffect } from 'react'
import { useAppStore } from '../state/store'

// E / Enter opens the station in range; Enter is left to a focused button or link
export function useStationKeys() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'KeyE' && event.key !== 'Enter') return
      if (event.repeat) return
      const focused = document.activeElement
      const focusOnControl = focused?.matches('button, a, input, textarea, select') ?? false
      if (event.key === 'Enter' && focusOnControl) return
      const { nearStation, openStation, setOpenStation } = useAppStore.getState()
      if (nearStation && !openStation) {
        event.preventDefault()
        setOpenStation(nearStation)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
