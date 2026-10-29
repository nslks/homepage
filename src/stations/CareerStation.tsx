import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { Station } from './Station'

const wood = '#9c6b45'
const woodDark = '#7a5236'

// Signpost: a post with boards pointing in different directions — marks the place to learn who I am
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

export function CareerStation() {
  return (
    <Station id="career" labelHeight={3.2}>
      <Signpost />
    </Station>
  )
}
