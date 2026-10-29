import { Box, Mail } from 'lucide-react'
import { contact, localize, site, ui } from '../content'
import { useAppStore } from '../state/store'
import { BrandIcon } from './BrandIcon'
import { CvLink } from './CvLink'
import './unsupported-notice.css'

// Browsers without WebGL 2 get a plain card instead of the 3D world — no 3D code or assets load
export function UnsupportedNotice() {
  const setLegalOpen = useAppStore((state) => state.setLegalOpen)
  return (
    <main className="notice">
      <div className="notice__card">
        <Box size={28} aria-hidden="true" className="notice__icon" />
        <h1 className="notice__title">{localize(ui.unsupportedNotice.title)}</h1>
        <p className="notice__name">
          {site.name} · {localize(site.title)}
        </p>
        <p className="notice__text">{localize(ui.unsupportedNotice.text)}</p>
        <ul className="notice__links">
          {contact.links.map((link) => {
            const external = !link.url.startsWith('mailto:')
            return (
              <li key={link.url}>
                <a
                  className="button"
                  href={link.url}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  {link.kind === 'email' ? (
                    <Mail size={16} aria-hidden="true" />
                  ) : (
                    <BrandIcon kind={link.kind} size={16} />
                  )}
                  {localize(link.label)}
                </a>
              </li>
            )
          })}
          <li>
            <CvLink />
          </li>
        </ul>
      </div>
      <button type="button" className="notice__legal" onClick={() => setLegalOpen(true)}>
        {localize(ui.hud.legal)}
      </button>
    </main>
  )
}
