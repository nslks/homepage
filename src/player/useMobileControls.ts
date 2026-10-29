import { useSyncExternalStore } from 'react'

// Follow the mobile layout, including narrow browser previews and phone landscape.
const query = window.matchMedia('(max-width: 1023px)')
const subscribe = (notify: () => void) => {
  query.addEventListener('change', notify)
  return () => query.removeEventListener('change', notify)
}

export function useMobileControls() {
  return useSyncExternalStore(subscribe, () => query.matches)
}
