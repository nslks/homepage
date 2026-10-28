import { localize, ui } from '../content'
import { useAppStore } from '../state/store'
import './hud.css'

export function Hud() {
  const character = useAppStore((state) => state.character)
  const toggleCharacter = useAppStore((state) => state.toggleCharacter)
  const label = localize(character === 'male' ? ui.hud.characterToFemale : ui.hud.characterToMale)

  return (
    <div className="hud">
      <div className="hud__toggles">
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
    </div>
  )
}
