import { Code, Link, Mail, Monitor } from 'lucide-react'
import { contact, localize, site, ui } from '../content'
import { useAppStore } from '../state/store'
import './desktop-notice.css'

const icons = { github: Code, linkedin: Link, email: Mail }

// Phones and tablets get a plain card instead of the 3D world — no 3D code or assets load
export function DesktopNotice() {
  const setLegalOpen = useAppStore((state) => state.setLegalOpen)
  return (
    <main className="notice">
      <div className="notice__card">
        <Monitor size={28} aria-hidden="true" className="notice__icon" />
        <h1 className="notice__title">{localize(ui.desktopNotice.title)}</h1>
        <p className="notice__name">
          {site.name} · {localize(site.title)}
        </p>
        <p className="notice__text">{localize(ui.desktopNotice.text)}</p>
        <ul className="notice__links">
          {contact.links.map((link) => {
            const Icon = icons[link.kind]
            const external = !link.url.startsWith('mailto:')
            return (
              <li key={link.url}>
                <a
                  className="button"
                  href={link.url}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <Icon size={16} aria-hidden="true" />
                  {localize(link.label)}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      <button type="button" className="notice__legal" onClick={() => setLegalOpen(true)}>
        {localize(ui.hud.legal)}
      </button>
    </main>
  )
}
