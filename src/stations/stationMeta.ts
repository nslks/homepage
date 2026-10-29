import { Briefcase, DoorOpen, type LucideIcon, Mail, UserRound } from 'lucide-react'
import { ui } from '../content'
import type { Localized } from '../content/schema'
import type { StationId } from '../world/layout'

export const stationMeta: Record<StationId, { icon: LucideIcon; title: Localized }> = {
  career: { icon: UserRound, title: ui.stations.career },
  work: { icon: Briefcase, title: ui.stations.work },
  projects: { icon: DoorOpen, title: ui.stations.projects },
  contact: { icon: Mail, title: ui.stations.contact },
}
