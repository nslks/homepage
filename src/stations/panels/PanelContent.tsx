import type { StationId } from '../../world/layout'
import { CareerPanel } from './CareerPanel'
import { ContactPanel } from './ContactPanel'
import { ProjectsPanel } from './ProjectsPanel'
import { WorkPanel } from './WorkPanel'

const panels: Record<StationId, () => React.JSX.Element> = {
  career: CareerPanel,
  work: WorkPanel,
  projects: ProjectsPanel,
  contact: ContactPanel,
}

export function PanelContent({ station }: { station: StationId }) {
  const Content = panels[station]
  return <Content />
}
