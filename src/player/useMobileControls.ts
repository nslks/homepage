import { useSyncExternalStore } from 'react'

// Phones in portrait and landscape; updates when rotating or attaching a mouse.
const query = window.matchMedia('(max-width: 1023px) and (pointer: coarse)')
const subscribe = (notify: () => void) => {
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

export function useMobileControls() {
  return useSyncExternalStore(subscribe, () => query.matches)
}
