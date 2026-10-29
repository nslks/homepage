import { lazy, Suspense } from 'react'
import { DesktopNotice } from './ui/DesktopNotice'
import { LegalModal } from './ui/LegalModal'
import { LoadingShell } from './ui/LoadingShell'
import { ThemeAttribute } from './ui/ThemeAttribute'

const Experience = lazy(() => import('./Experience'))

// Spec §7: the MVP targets desktop browsers with mouse and keyboard
const isDesktop = (() => {
  try {
    return window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches
  } catch {
    return true
  }
})()

export function App() {
  return (
    <>
      {isDesktop ? (
        <Suspense fallback={<LoadingShell progress={0} />}>
          <Experience />
        </Suspense>
      ) : (
        <DesktopNotice />
      )}
      <LegalModal />
      <ThemeAttribute />
    </>
  )
}
