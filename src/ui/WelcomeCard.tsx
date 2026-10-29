import { useEffect } from 'react'
import { localize, ui } from '../content'
import { controlsMap } from '../player/controls'
import { useAppStore } from '../state/store'
import { CvLink } from './CvLink'
import './welcome-card.css'

const movementKeys = new Set(controlsMap.flatMap((control) => control.keys))

// touch screens (coarse pointer) get tap instructions instead of keys (spec §5.5)
const isTouch = (() => {
  try {
    return window.matchMedia('(pointer: coarse)').matches
  } catch {
    return false
  }
})()
const controls = isTouch
  ? [ui.controls.tapMove, ui.controls.tapOpen]
  : [ui.controls.move, ui.controls.interact]

// Shown once after the intro (spec §5.1): the page is interactive — or take the CV as PDF.
// Walking off, Esc or "Los geht's" dismisses it for good
export function WelcomeCard() {
  const visible = useAppStore((state) => state.introDone && !state.welcomeSeen)
  const dismiss = useAppStore((state) => state.dismissWelcome)

  useEffect(() => {
    if (!visible) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (movementKeys.has(event.code) || event.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [visible, dismiss])

  if (!visible) return null
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <h2 id="welcome-title" className="welcome__title">
        {localize(ui.welcome.title)}
      </h2>
      <p className="welcome__text">{localize(ui.welcome.text)}</p>
      <ul className="welcome__controls" aria-label={localize(ui.controls.title)}>
        {controls.map((line, i) => (
          <li key={i}>{localize(line)}</li>
        ))}
      </ul>
      <p className="welcome__text welcome__text--muted">{localize(ui.welcome.cvAlternative)}</p>
      <div className="welcome__actions">
        <button type="button" className="button" onClick={dismiss}>
          {localize(ui.controls.dismiss)}
        </button>
        <CvLink className="button button--secondary" />
      </div>
    </section>
  )
}
