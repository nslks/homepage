import { useAppStore } from '../state/store'

const debug = new URLSearchParams(window.location.search).has('debug')

// ?debug: shows the current adaptive quality tier
export function DebugBadge() {
  const quality = useAppStore((state) => state.quality)
  if (!debug) return null
  return (
    <p
      className="debug-badge"
      style={{
        position: 'fixed',
        left: '50%',
        top: 8,
        zIndex: 30,
        margin: 0,
        padding: '2px 8px',
        transform: 'translateX(-50%)',
        borderRadius: 6,
        background: 'rgb(0 0 0 / 0.6)',
        color: '#fff',
        font: '12px monospace',
        pointerEvents: 'none',
      }}
    >
      quality: {quality}
    </p>
  )
}
