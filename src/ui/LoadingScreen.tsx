import { useProgress } from '@react-three/drei'
import { useState } from 'react'
import { useAppStore } from '../state/store'
import { LoadingShell } from './LoadingShell'

// Real loading progress; fades out once the scene has rendered its first frame
export function LoadingScreen() {
  const { progress } = useProgress()
  const ready = useAppStore((state) => state.sceneReady)
  const [gone, setGone] = useState(false)
  if (gone) return null
  return (
    <LoadingShell
      progress={ready ? 100 : Math.round(progress)}
      done={ready}
      onFaded={() => ready && setGone(true)}
    />
  )
}
