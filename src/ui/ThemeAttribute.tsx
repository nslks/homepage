import { useEffect } from 'react'
import { useAppStore } from '../state/store'

// Mirrors the mode onto <html data-theme> so all HTML UI picks its colour tokens
export function ThemeAttribute() {
  const theme = useAppStore((state) => state.theme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])
  return null
}
