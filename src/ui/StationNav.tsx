import { localize } from '../content'
import { useAppStore } from '../state/store'
import { stationMeta } from '../stations/stationMeta'
import type { StationId } from '../world/layout'
import './station-nav.css'

const order: StationId[] = ['career', 'work', 'projects', 'contact']

// Keyboard and screen-reader access to every station without walking; hidden until focused
export function StationNav() {
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  return (
    <nav className="station-nav" aria-label="Stationen">
      {order.map((id) => {
        const { icon: Icon, title } = stationMeta[id]
        return (
          <button
            key={id}
            type="button"
            className="station-nav__item"
            onClick={() => setOpenStation(id)}
          >
            <Icon size={16} aria-hidden="true" />
            {localize(title)}
          </button>
        )
      })}
    </nav>
  )
}
