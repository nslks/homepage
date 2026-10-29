import { useEffect } from 'react'
import { localize, site, ui } from '../content'
import { controlsMap } from '../player/controls'
import { useMobileControls } from '../player/useMobileControls'
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

// Shown once, as soon as the island has loaded (spec §5.1): who this is, that the page is
// interactive — or take the CV as PDF. Walking off, Esc, the backdrop or "Los geht's" dismiss it
export function WelcomeCard() {
  const mobile = useMobileControls()
  const controls = mobile
    ? [ui.controls.joystickMove, ui.controls.tapMove, ui.controls.tapOpen]
    : isTouch
      ? [ui.controls.tapMove, ui.controls.tapOpen]
      : [ui.controls.move, ui.controls.interact]
  const visible = useAppStore((state) => state.sceneReady && !state.welcomeSeen)
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
    <div
      className="welcome-backdrop"
      onClick={(event) => event.target === event.currentTarget && dismiss()}
    >
      <section className="welcome" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <h2 id="welcome-title" className="welcome__title">
          {localize(ui.welcome.title)}
        </h2>
        <p className="welcome__name">
          {site.name} · {localize(site.title)}
        </p>
        <p className="welcome__text">{localize(ui.welcome.text)}</p>
        <ul className="welcome__controls" aria-label={localize(ui.controls.title)}>
          {controls.map((line, i) => (
            <li key={i}>{localize(line)}</li>
          ))}
        </ul>
        <p className="welcome__text welcome__text--muted">{localize(ui.welcome.cvAlternative)}</p>
        <div className="welcome__actions">
          {/* focused first, so keyboard users can start right away */}
          <button type="button" className="button button--large" onClick={dismiss} autoFocus>
            {localize(ui.controls.dismiss)}
          </button>
          <CvLink className="button button--large button--secondary" />
        </div>
      </section>
    </div>
  )
}
