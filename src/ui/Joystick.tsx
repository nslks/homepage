import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { localize, ui } from '../content'
import { stopAutopilot } from '../player/autopilot'
import { joystick, resetJoystick } from '../player/joystick'
import { useMobileControls } from '../player/useMobileControls'
import { useAppStore } from '../state/store'
import './joystick.css'

const TRAVEL = 26
const DEAD_ZONE = 7

function Thumbstick() {
  const pointer = useRef<number | null>(null)
  const [thumb, setThumb] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  function reset() {
    pointer.current = null
    resetJoystick()
    setThumb({ x: 0, y: 0 })
    setActive(false)
  }

  useEffect(() => {
    const onHidden = () => {
      if (document.hidden) reset()
    }
    window.addEventListener('blur', reset)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      resetJoystick()
      window.removeEventListener('blur', reset)
      document.removeEventListener('visibilitychange', onHidden)
    }
  }, [])

  function steer(event: PointerEvent<HTMLDivElement>) {
    if (pointer.current !== event.pointerId) return
    const rect = event.currentTarget.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    const distance = Math.hypot(dx, dy)
    const scale = distance > TRAVEL ? TRAVEL / distance : 1
    setThumb({ x: dx * scale, y: dy * scale })
    const moving = distance > DEAD_ZONE
    joystick.x = moving ? dx / distance : 0
    joystick.y = moving ? dy / distance : 0
    if (moving) stopAutopilot()
  }

  return (
    <div
      className={`joystick${active ? ' joystick--active' : ''}`}
      role="group"
      aria-label={localize(ui.controls.joystickMove)}
      onPointerDown={(event) => {
        if (pointer.current !== null || event.button !== 0) return
        event.preventDefault()
        pointer.current = event.pointerId
        event.currentTarget.setPointerCapture(event.pointerId)
        setActive(true)
        steer(event)
      }}
      onPointerMove={steer}
      onPointerUp={(event) => pointer.current === event.pointerId && reset()}
      onPointerCancel={(event) => pointer.current === event.pointerId && reset()}
      onLostPointerCapture={(event) => pointer.current === event.pointerId && reset()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span
        className="joystick__thumb"
        aria-hidden="true"
        style={{ transform: `translate(${thumb.x}px, ${thumb.y}px)` }}
      />
    </div>
  )
}

export function Joystick() {
  const mobile = useMobileControls()
  const available = useAppStore(
    (state) =>
      state.sceneReady &&
      state.introDone &&
      state.welcomeSeen &&
      !state.openStation &&
      !state.legalOpen,
  )
  return mobile && available ? <Thumbstick /> : null
}
