import { X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { localize, site, ui } from '../content'
import { useAppStore } from '../state/store'
import './panel.css'
import { RichText } from './RichText'
import { trapTab } from './trapTab'
import { useSwipeToClose } from './useSwipeToClose'

type Tab = 'impressum' | 'datenschutz'
const tabs: Tab[] = ['impressum', 'datenschutz']

// Impressum and Datenschutz in one modal with two tabs (spec §5.4)
export function LegalModal() {
  const open = useAppStore((state) => state.legalOpen)
  const setOpen = useAppStore((state) => state.setLegalOpen)
  const [tab, setTab] = useState<Tab>('impressum')
  const dialog = useRef<HTMLDialogElement>(null)
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    impressum: null,
    datenschutz: null,
  })
  useSwipeToClose(
    dialog,
    useCallback(() => setOpen(false), [setOpen]),
  )

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
  }, [open])

  // arrow keys move between tabs, as for any tablist
  const onTabKey = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    const next = tabs[(tabs.indexOf(tab) + 1) % tabs.length]!
    setTab(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <dialog
      ref={dialog}
      className="panel"
      aria-label={localize(ui.hud.legal)}
      onClose={() => setOpen(false)}
      onKeyDown={trapTab}
      onClick={(event) => event.target === dialog.current && setOpen(false)}
    >
      {open && (
        <>
          <div className="panel__grip" aria-hidden="true" />
          <header className="panel__header">
            <div className="tabs" role="tablist" onKeyDown={onTabKey}>
              {tabs.map((id) => (
                <button
                  key={id}
                  ref={(element) => {
                    tabRefs.current[id] = element
                  }}
                  type="button"
                  role="tab"
                  id={`legal-tab-${id}`}
                  aria-selected={tab === id}
                  aria-controls={`legal-panel-${id}`}
                  tabIndex={tab === id ? 0 : -1}
                  className="tabs__tab"
                  onClick={() => setTab(id)}
                >
                  {localize(ui.legal[id])}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="panel__close"
              onClick={() => setOpen(false)}
              aria-label={localize(ui.panel.close)}
              title={localize(ui.panel.close)}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>
          <div
            className="panel__body rich"
            role="tabpanel"
            id={`legal-panel-${tab}`}
            aria-labelledby={`legal-tab-${tab}`}
          >
            <RichText text={localize(site.legal[tab])} />
          </div>
        </>
      )}
    </dialog>
  )
}
