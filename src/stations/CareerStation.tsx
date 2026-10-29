import { Text } from '@react-three/drei'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { career, localize } from '../content'
import { fonts } from '../world/fonts'
import { crossing, PATH_WIDTH, stations } from '../world/layout'
import { Station } from './Station'

const wood = '#9c6b45'
const woodDark = '#7a5236'
const stone = '#b7b0a6'

// Signpost: a post with boards pointing in different directions — reads as "journey"
function Signpost() {
  const boards = [
    { y: 2.1, angle: 0.5, color: '#e07a5f' },
    { y: 1.65, angle: -0.6, color: wood },
    { y: 1.2, angle: 0.15, color: wood },
  ]
  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh position-y={1.25} castShadow>
        <cylinderGeometry args={[0.1, 0.12, 2.5, 6]} />
        <meshStandardMaterial color={woodDark} flatShading />
      </mesh>
      {boards.map((board, i) => (
        <group key={i} position-y={board.y} rotation-y={board.angle}>
          <mesh position-x={0.45} castShadow>
            <boxGeometry args={[1, 0.3, 0.08]} />
            <meshStandardMaterial color={board.color} flatShading />
          </mesh>
          <mesh position-x={1.03} rotation={[Math.PI / 2, 0, -Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.21, 0.21, 0.08, 3]} />
            <meshStandardMaterial color={board.color} flatShading />
          </mesh>
        </group>
      ))}
      <CylinderCollider args={[1.2, 0.3]} position-y={1.2} />
    </RigidBody>
  )
}

// A stone only has room for one number: the first year of the period
const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? period

// One milestone stone per career entry along the path, oldest closest to the station
function Milestones() {
  const from = crossing.x - 2.6
  const to = stations.career.x + 3
  const entries = career.entries
  const side = -(PATH_WIDTH / 2 + 0.6)

  return (
    <>
      {entries.map((entry, i) => {
        const x = entries.length === 1 ? from : from + ((to - from) * i) / (entries.length - 1)
        return (
          <RigidBody key={i} type="fixed" colliders={false} position={[x, 0, side]}>
            <mesh position-y={0.4} castShadow receiveShadow>
              <boxGeometry args={[0.7, 0.8, 0.35]} />
              <meshStandardMaterial color={stone} flatShading />
            </mesh>
            <mesh position-y={0.85} rotation-z={Math.PI / 4} castShadow>
              <boxGeometry args={[0.495, 0.495, 0.35]} />
              <meshStandardMaterial color={stone} flatShading />
            </mesh>
            <Text
              font={fonts.semibold}
              fontSize={0.22}
              position={[0, 0.5, 0.18]}
              color="#3d405b"
              anchorX="center"
              anchorY="middle"
            >
              {startYear(localize(entry.period))}
            </Text>
            <CuboidCollider args={[0.35, 0.6, 0.18]} position-y={0.6} />
          </RigidBody>
        )
      })}
    </>
  )
}

export function CareerStation() {
  return (
    <>
      <Station id="career" labelHeight={3.2}>
        <Signpost />
      </Station>
      <Milestones />
    </>
  )
}
