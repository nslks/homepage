import { useEffect } from 'react'
import { localize, ui } from '../content'
import { controlsMap } from '../player/controls'
import { useAppStore } from '../state/store'
import './controls-hint.css'

const movementKeys = new Set(controlsMap.flatMap((control) => control.keys))

// touch screens (coarse pointer) get tap instructions instead of keys (spec §5.5)
const isTouch = (() => {
  try {
    return window.matchMedia('(pointer: coarse)').matches
  } catch {
    return false
  }
})()
const lines = isTouch
  ? [ui.controls.tapMove, ui.controls.tapOpen]
  : [ui.controls.move, ui.controls.interact]

// Shown once after the intro; walking off, Esc or the button dismisses it for good
export function ControlsHint() {
  const visible = useAppStore((state) => state.introDone && !state.controlsHintSeen)
  const dismiss = useAppStore((state) => state.dismissControlsHint)

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
    <section className="controls-hint" aria-labelledby="controls-hint-title">
      <h2 id="controls-hint-title" className="controls-hint__title">
        {localize(ui.controls.title)}
      </h2>
      <ul className="controls-hint__list">
        {lines.map((line, i) => (
          <li key={i}>{localize(line)}</li>
        ))}
      </ul>
      <button type="button" className="button" onClick={dismiss}>
        {localize(ui.controls.dismiss)}
      </button>
    </section>
  )
}
