import { type RefObject, useEffect } from 'react'

// how far (px) a sheet must be pulled down to close
const CLOSE_DISTANCE = 90

// Bottom sheets (narrow screens): pulling the sheet down closes it — but only while its content is
// scrolled to the top, so normal scrolling never closes it by accident
export function useSwipeToClose(ref: RefObject<HTMLElement | null>, onClose: () => void) {
  useEffect(() => {
    const element = ref.current
    if (!element) return
    let startY: number | null = null
    let offset = 0

    const onStart = (event: TouchEvent) => {
      startY = element.scrollTop <= 0 ? event.touches[0]!.clientY : null
      offset = 0
    }
    const onMove = (event: TouchEvent) => {
      if (startY === null) return
      offset = event.touches[0]!.clientY - startY
      if (offset <= 0) {
        element.style.transform = ''
        return
      }
      event.preventDefault()
      element.style.transition = 'none'
      element.style.transform = `translateY(${offset}px)`
    }
    const onEnd = () => {
      if (startY === null) return
      element.style.transition = ''
      element.style.transform = ''
      if (offset > CLOSE_DISTANCE) onClose()
      startY = null
    }

    element.addEventListener('touchstart', onStart, { passive: true })
    element.addEventListener('touchmove', onMove, { passive: false })
    element.addEventListener('touchend', onEnd)
    element.addEventListener('touchcancel', onEnd)
    return () => {
      element.removeEventListener('touchstart', onStart)
      element.removeEventListener('touchmove', onMove)
      element.removeEventListener('touchend', onEnd)
      element.removeEventListener('touchcancel', onEnd)
    }
  }, [ref, onClose])
}
