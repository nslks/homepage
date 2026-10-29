import type { StationId } from '../../world/layout'
import { CareerPanel } from './CareerPanel'
import { ProjectsPanel } from './ProjectsPanel'
import { WorkPanel } from './WorkPanel'

// Filled station by station (#24–#26, #53)
const panels: Partial<Record<StationId, () => React.JSX.Element>> = {
  career: CareerPanel,
  work: WorkPanel,
  projects: ProjectsPanel,
}

export function PanelContent({ station }: { station: StationId }) {
  const Content = panels[station]
  return Content ? <Content /> : null
}
