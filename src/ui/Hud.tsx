import { Info, Mail, Moon, Sun } from 'lucide-react'
import { contact, localize, site, ui } from '../content'
import { useAppStore } from '../state/store'
import { BrandIcon } from './BrandIcon'
import { CvLink } from './CvLink'
import './hud.css'

// LinkedIn only appears once its URL is in contact.yaml — no dead button
const linkedIn = contact.links.find((link) => link.kind === 'linkedin')

// Everything important is one click away, without walking (spec §5.2)
export function Hud() {
  const character = useAppStore((state) => state.character)
  const toggleCharacter = useAppStore((state) => state.toggleCharacter)
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const setLegalOpen = useAppStore((state) => state.setLegalOpen)
  const characterLabel = localize(
    character === 'male' ? ui.hud.characterToFemale : ui.hud.characterToMale,
  )
  const themeLabel = localize(theme === 'day' ? ui.hud.themeToNight : ui.hud.themeToDay)

  return (
    <div className="hud">
      <p className="hud__name">{site.name}</p>

      <div className="hud__toggles">
        <button
          type="button"
          className="hud__toggle"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          {theme === 'day' ? (
            <Moon size={20} aria-hidden="true" />
          ) : (
            <Sun size={20} aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className="hud__toggle"
          onClick={toggleCharacter}
          aria-label={characterLabel}
          title={characterLabel}
        >
          <span aria-hidden="true">{character === 'male' ? '♂' : '♀'}</span>
        </button>
      </div>

      <nav className="hud__bar">
        {linkedIn && (
          <a className="hud__link" href={linkedIn.url} target="_blank" rel="noopener noreferrer">
            <BrandIcon kind="linkedin" size={16} />
            <span className="hud__text">{localize(linkedIn.label)}</span>
          </a>
        )}
        <button type="button" className="hud__link" onClick={() => setOpenStation('contact')}>
          <Mail size={16} aria-hidden="true" />
          <span className="hud__text">{localize(ui.hud.contact)}</span>
        </button>
        <CvLink className="hud__link" textClassName="hud__text" />
      </nav>

      <button type="button" className="hud__legal" onClick={() => setLegalOpen(true)}>
        <Info size={18} aria-hidden="true" className="hud__icon-narrow" />
        <span className="hud__text">{localize(ui.hud.legal)}</span>
      </button>
    </div>
  )
}
