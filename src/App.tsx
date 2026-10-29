import { KeyboardControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { controlsMap } from './player/controls'
import { Scene } from './Scene'
import { ControlsHint } from './ui/ControlsHint'
import { Hud } from './ui/Hud'
import { LegalModal } from './ui/LegalModal'
import { IntroSkip } from './ui/IntroSkip'
import { LoadingScreen } from './ui/LoadingScreen'
import { StationPanel } from './ui/StationPanel'
import { ThemeAttribute } from './ui/ThemeAttribute'

export function App() {
  return (
    <KeyboardControls map={controlsMap}>
      <Canvas shadows="soft" camera={{ fov: 40, far: 1000 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <Hud />
      <StationPanel />
      <LegalModal />
      <ThemeAttribute />
      <LoadingScreen />
      <IntroSkip />
      <ControlsHint />
    </KeyboardControls>
  )
}
