import { useEffect } from 'react'
import { localize, ui } from '../content'
import { useAppStore } from '../state/store'
import './intro.css'

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

// Any key or click skips the intro flight; reduced motion skips it entirely
export function IntroSkip() {
  const ready = useAppStore((state) => state.sceneReady)
  const introDone = useAppStore((state) => state.introDone)
  const finishIntro = useAppStore((state) => state.finishIntro)

  useEffect(() => {
    if (introDone) return
    if (prefersReducedMotion()) {
      finishIntro()
      return
    }
    if (!ready) return
    window.addEventListener('keydown', finishIntro)
    window.addEventListener('pointerdown', finishIntro)
    return () => {
      window.removeEventListener('keydown', finishIntro)
      window.removeEventListener('pointerdown', finishIntro)
    }
  }, [ready, introDone, finishIntro])

  if (!ready || introDone) return null
  return <p className="intro-skip">{localize(ui.intro.skip)}</p>
}
