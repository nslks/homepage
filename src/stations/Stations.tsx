import { CareerStation } from './CareerStation'
import { ProjectsStation } from './ProjectsStation'
import { Station } from './Station'
import { WelcomeSign } from './WelcomeSign'
import { WorkStation } from './WorkStation'

// Placeholder pedestals; each station gets its own model in its story (#23–#26, #53)
function Placeholder({ height = 1 }: { height?: number }) {
  return (
    <mesh position-y={height / 2} castShadow>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial color="#c9c2b8" flatShading />
    </mesh>
  )
}

export function Stations() {
  return (
    <>
      <WelcomeSign />
      <CareerStation />
      <WorkStation />
      <ProjectsStation />
      <Station id="contact" labelHeight={2.2}>
        <Placeholder height={0.8} />
      </Station>
    </>
  )
}
