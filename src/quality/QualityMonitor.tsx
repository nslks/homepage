import { PerformanceMonitor } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import { useAppStore } from '../state/store'
import { qualitySettings, qualityTiers } from './tiers'

// Steps the quality tier down below 30 fps and up above 55 fps; after a few flip-flops the
// monitor settles. Also pauses rendering while the tab is hidden
export function QualityMonitor() {
  const tier = useAppStore((state) => state.quality)
  const setQuality = useAppStore((state) => state.setQuality)
  const setDpr = useThree((state) => state.setDpr)
  const setFrameloop = useThree((state) => state.setFrameloop)

  useEffect(() => {
    setDpr(Math.min(window.devicePixelRatio, qualitySettings[tier].maxDpr))
  }, [tier, setDpr])

  useEffect(() => {
    const onVisibility = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [setFrameloop])

  const step = (direction: 1 | -1) => {
    const index = qualityTiers.indexOf(useAppStore.getState().quality) + direction
    const next = qualityTiers[Math.min(qualityTiers.length - 1, Math.max(0, index))]!
    setQuality(next)
  }

  return (
    <PerformanceMonitor
      bounds={() => [30, 55]}
      flipflops={4}
      onIncline={() => step(1)}
      onDecline={() => step(-1)}
    />
  )
}
