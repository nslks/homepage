import { useProgress } from '@react-three/drei'
import { useState } from 'react'
import { localize, site, ui } from '../content'
import { useAppStore } from '../state/store'
import './loading.css'

const FADE_MS = 600

// Name and real loading progress; fades out once the scene has rendered
export function LoadingScreen() {
  const { progress } = useProgress()
  const ready = useAppStore((state) => state.sceneReady)
  const [gone, setGone] = useState(false)
  if (gone) return null

  const value = ready ? 100 : Math.round(progress)
  return (
    <div
      className={`loading${ready ? ' loading--done' : ''}`}
      onTransitionEnd={() => ready && setGone(true)}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
      <p className="loading__name">{site.name}</p>
      <div
        className="loading__bar"
        role="progressbar"
        aria-label={localize(ui.loading)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      >
        <div className="loading__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
