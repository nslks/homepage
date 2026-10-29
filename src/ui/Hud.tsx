import { Moon, Sun } from 'lucide-react'
import { localize, ui } from '../content'
import { useAppStore } from '../state/store'
import './hud.css'

export function Hud() {
  const character = useAppStore((state) => state.character)
  const toggleCharacter = useAppStore((state) => state.toggleCharacter)
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  const label = localize(character === 'male' ? ui.hud.characterToFemale : ui.hud.characterToMale)
  const theme = useAppStore((state) => state.theme)
  const toggleTheme = useAppStore((state) => state.toggleTheme)
  const themeLabel = localize(theme === 'day' ? ui.hud.themeToNight : ui.hud.themeToDay)

  return (
    <div className="hud">
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
          aria-label={label}
          title={label}
        >
          <span aria-hidden="true">{character === 'male' ? '♂' : '♀'}</span>
        </button>
      </div>
      {/* the full bottom bar (LinkedIn, legal) follows with #34 */}
      <nav className="hud__bar">
        <button type="button" className="hud__link" onClick={() => setOpenStation('contact')}>
          {localize(ui.hud.contact)}
        </button>
      </nav>
    </div>
  )
}
