import { Link, Mail, Moon, Sun } from 'lucide-react'
import { contact, localize, site, ui } from '../content'
import { useAppStore } from '../state/store'
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
            <Link size={16} aria-hidden="true" />
            {localize(linkedIn.label)}
          </a>
        )}
        <button type="button" className="hud__link" onClick={() => setOpenStation('contact')}>
          <Mail size={16} aria-hidden="true" />
          {localize(ui.hud.contact)}
        </button>
      </nav>

      <button type="button" className="hud__legal" onClick={() => setLegalOpen(true)}>
        {localize(ui.hud.legal)}
      </button>
    </div>
  )
}
