import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { controlsMap } from './player/controls'
import { Scene } from './Scene'
import { ControlsHint } from './ui/ControlsHint'
import { DebugBadge } from './ui/DebugBadge'
import { Hud } from './ui/Hud'
import { IntroSkip } from './ui/IntroSkip'
import { LoadingScreen } from './ui/LoadingScreen'
import { StationPanel } from './ui/StationPanel'
import { usePreventCanvasGestures } from './ui/usePreventCanvasGestures'

// Everything 3D: loaded only on desktop (spec §7), as its own chunk
export default function Experience() {
  usePreventCanvasGestures()
  return (
    <KeyboardControls map={controlsMap}>
      <Canvas shadows="soft" dpr={[1, 1.5]} camera={{ fov: 40, far: 1000 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Hud />
      <StationPanel />
      <LoadingScreen />
      <IntroSkip />
      <ControlsHint />
      <DebugBadge />
    </KeyboardControls>
  )
}
