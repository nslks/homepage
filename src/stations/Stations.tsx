import { CareerStation } from './CareerStation'
import { ContactStation } from './ContactStation'
import { ProjectsStation } from './ProjectsStation'
import { WorkStation } from './WorkStation'

export function Stations() {
  return (
    <>
      <CareerStation />
      <WorkStation />
      <ProjectsStation />
      <ContactStation />
    </>
  )
}
