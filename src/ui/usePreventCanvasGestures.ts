import { useEffect } from 'react'

// iOS Safari ignores `touch-action` for pinch gestures; its proprietary gesture events need
// to be cancelled — but only when they start on the 3D canvas
export function usePreventCanvasGestures() {
  useEffect(() => {
    const onGesture = (event: Event) => {
      if (event.target instanceof HTMLCanvasElement) event.preventDefault()
    }
    document.addEventListener('gesturestart', onGesture)
    document.addEventListener('gesturechange', onGesture)
    return () => {
      document.removeEventListener('gesturestart', onGesture)
      document.removeEventListener('gesturechange', onGesture)
    }
  }, [])
}
