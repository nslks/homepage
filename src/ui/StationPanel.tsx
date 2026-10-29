import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { localize, ui } from '../content'
import { useAppStore } from '../state/store'
import { PanelContent } from '../stations/panels/PanelContent'
import { stationMeta } from '../stations/stationMeta'
import { useStationKeys } from '../stations/useStationKeys'
import './panel.css'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Keeps Tab / Shift+Tab cycling inside the dialog instead of escaping to the browser UI
function trapTab(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return
  const focusable = [...event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)]
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (!first || !last) return
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

// Native modal dialog: closes on Esc and restores focus to where it was
export function StationPanel() {
  const openStation = useAppStore((state) => state.openStation)
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const dialog = useRef<HTMLDialogElement>(null)
  useStationKeys()

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (openStation && !element.open) element.showModal()
    if (!openStation && element.open) element.close()
  }, [openStation])

  const meta = openStation ? stationMeta[openStation] : null

  return (
    <dialog
      ref={dialog}
      className="panel"
      aria-labelledby="panel-title"
      onClose={() => setOpenStation(null)}
      onKeyDown={trapTab}
      onClick={(event) => {
        // a click on the backdrop lands on the dialog element itself
        if (event.target === dialog.current) setOpenStation(null)
      }}
    >
      {meta && (
        <>
          <header className="panel__header">
            <h2 id="panel-title" className="panel__title">
              <meta.icon size={22} aria-hidden="true" />
              {localize(meta.title)}
            </h2>
            <button
              type="button"
              className="panel__close"
              onClick={() => setOpenStation(null)}
              aria-label={localize(ui.panel.close)}
              title={localize(ui.panel.close)}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <div className="panel__body">
            <PanelContent station={openStation!} />
          </div>
        </>
      )}
    </dialog>
  )
}
