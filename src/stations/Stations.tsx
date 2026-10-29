import { CareerStation } from './CareerStation'
import { ContactStation } from './ContactStation'
import { ProjectsStation } from './ProjectsStation'
import { WelcomeSign } from './WelcomeSign'
import { WorkStation } from './WorkStation'

export function Stations() {
  return (
    <>
      <WelcomeSign />
      <CareerStation />
      <WorkStation />
      <ProjectsStation />
      <ContactStation />
    </>
  )
}
