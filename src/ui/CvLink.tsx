import { FileDown } from 'lucide-react'
import { localize, ui } from '../content'
import { cvFileName, cvUrl } from './cv'

type Props = {
  className?: string
  // hides the text visually (narrow HUD); it stays the accessible name
  textClassName?: string
}

// "Lebenslauf (PDF)" — renders nothing when no CV is shipped
export function CvLink({ className = 'button', textClassName }: Props) {
  if (!cvUrl) return null
  return (
    <a className={className} href={cvUrl} download={cvFileName} target="_blank" rel="noopener">
      <FileDown size={16} aria-hidden="true" />
      <span className={textClassName}>{localize(ui.cv.download)}</span>
    </a>
  )
}

// Closing line of a panel: where to get the complete CV
export function CvHint() {
  if (!cvUrl) return null
  return (
    <aside className="cv-hint">
      <p className="cv-hint__text">{localize(ui.panel.cvHint)}</p>
      <CvLink />
    </aside>
  )
}
