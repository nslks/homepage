import { localize, site, ui } from '../content'
import './loading.css'

type Props = {
  progress: number
  done?: boolean
  onFaded?: () => void
}

// Name and progress bar; pure, so it can show before the 3D code has even loaded
export function LoadingShell({ progress, done = false, onFaded }: Props) {
  return (
    <div className={`loading${done ? ' loading--done' : ''}`} onTransitionEnd={onFaded}>
      <p className="loading__name">{site.name}</p>
      <div
        className="loading__bar"
        role="progressbar"
        aria-label={localize(ui.loading)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div className="loading__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
