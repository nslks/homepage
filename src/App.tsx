import { lazy, Suspense } from 'react'
import { UnsupportedNotice } from './ui/UnsupportedNotice'
import { LegalModal } from './ui/LegalModal'
import { LoadingShell } from './ui/LoadingShell'
import { ThemeAttribute } from './ui/ThemeAttribute'

const Experience = lazy(() => import('./Experience'))

// Every device gets the island (spec §5.5); only browsers without WebGL 2 get the plain card
const supportsWebGL2 = (() => {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null
  } catch {
    return false
  }
})()

export function App() {
  return (
    <>
      {supportsWebGL2 ? (
        <Suspense fallback={<LoadingShell progress={0} />}>
          <Experience />
        </Suspense>
      ) : (
        <UnsupportedNotice />
      )}
      <LegalModal />
      <ThemeAttribute />
    </>
  )
}
