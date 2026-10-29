import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { projects } from '../content'
import { useAppStore } from '../state/store'
import { playerPosition } from '../player/playerPosition'
import { fonts } from '../world/fonts'
import { stations } from '../world/layout'
import { Station } from './Station'

const ARC_RADIUS = 3
// Houses on an arc along the northern edge of the plaza, doors facing its centre — so every door
// faces the camera in the south, and the path entering from the west stays free
const ARC_CENTER = (-75 * Math.PI) / 180
const ARC_SPREAD = (130 * Math.PI) / 180
const HOUSE = { width: 1.3, height: 1.4, depth: 1.1 }
const DEFAULT_DOOR = '#c8553d'
const wall = '#f3ece1'
const roof = '#8a5a3b'

const center = stations.projects
const houses = projects.entries.map((project, i) => {
  const count = projects.entries.length
  const angle =
    count === 1 ? ARC_CENTER : ARC_CENTER - ARC_SPREAD / 2 + (ARC_SPREAD * i) / (count - 1)
  const x = center.x + Math.cos(angle) * ARC_RADIUS
  const z = center.z + Math.sin(angle) * ARC_RADIUS
  return {
    project,
    x,
    z,
    rotationY: Math.atan2(center.x - x, center.z - z),
    door: {
      x: center.x + Math.cos(angle) * (ARC_RADIUS - HOUSE.depth / 2),
      z: center.z + Math.sin(angle) * (ARC_RADIUS - HOUSE.depth / 2),
    },
  }
})

function House({ house, near }: { house: (typeof houses)[number]; near: boolean }) {
  const doorColor = house.project.doorColor ?? DEFAULT_DOOR
  const front = HOUSE.depth / 2 + 0.01
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[house.x, 0, house.z]}
      rotation-y={house.rotationY}
    >
      <mesh position-y={HOUSE.height / 2} castShadow receiveShadow>
        <boxGeometry args={[HOUSE.width, HOUSE.height, HOUSE.depth]} />
        <meshStandardMaterial color={wall} flatShading />
      </mesh>
      {/* gable roof: a four-sided cone turned to sit flush on the walls */}
      <mesh
        position-y={HOUSE.height + 0.42}
        rotation-y={Math.PI / 4}
        scale={[1, 1, 0.85]}
        castShadow
      >
        <coneGeometry args={[HOUSE.width * 0.78, 0.85, 4]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
      <mesh position={[0, 0.5, front]}>
        <boxGeometry args={[0.5, 1, 0.05]} />
        <meshStandardMaterial
          color={doorColor}
          emissive={doorColor}
          emissiveIntensity={near ? 0.6 : 0}
          flatShading
        />
      </mesh>
      <mesh position={[0.14, 0.5, front + 0.04]}>
        <sphereGeometry args={[0.035, 6, 4]} />
        <meshStandardMaterial color="#f2d16b" />
      </mesh>
      <Text
        font={fonts.semibold}
        fontSize={0.17}
        position={[0, 1.18, front]}
        color="#3d405b"
        anchorX="center"
        anchorY="middle"
        maxWidth={HOUSE.width - 0.1}
      >
        {house.project.name}
      </Text>
      <CuboidCollider
        args={[HOUSE.width / 2, HOUSE.height / 2, HOUSE.depth / 2]}
        position-y={HOUSE.height / 2}
      />
    </RigidBody>
  )
}

export function ProjectsStation() {
  const nearProject = useAppStore((state) => state.nearProject)

  // While at the station, the door closest to the character is the one E opens
  useFrame(() => {
    const store = useAppStore.getState()
    let closest: number | null = null
    if (store.nearStation === 'projects') {
      let best = Infinity
      houses.forEach((house, i) => {
        const distance = Math.hypot(
          playerPosition.x - house.door.x,
          playerPosition.z - house.door.z,
        )
        if (distance < best) {
          best = distance
          closest = i
        }
      })
    }
    if (closest !== store.nearProject) store.setNearProject(closest)
  })

  return (
    <>
      <Station id="projects" labelHeight={3.4}>
        {null}
      </Station>
      {houses.map((house, i) => (
        <House key={i} house={house} near={nearProject === i} />
      ))}
    </>
  )
}
