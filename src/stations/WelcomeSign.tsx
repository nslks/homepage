import { Text } from '@react-three/drei'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { localize, site } from '../content'
import { fonts } from '../world/fonts'
import { welcomeSign } from '../world/layout'

const BOARD = { width: 4.2, height: 1.7, depth: 0.16, y: 1.9 }
const wood = '#9c6b45'
const woodDark = '#7a5236'

// Large sign at spawn: who this page belongs to, readable in the first camera view
export function WelcomeSign() {
  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={[welcomeSign.x, 0, welcomeSign.z]}
      rotation-y={welcomeSign.facing}
    >
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (BOARD.width / 2 - 0.35), 1.3, -0.05]} castShadow>
          <boxGeometry args={[0.18, 2.6, 0.18]} />
          <meshStandardMaterial color={woodDark} flatShading />
        </mesh>
      ))}
      <mesh position-y={BOARD.y} castShadow receiveShadow>
        <boxGeometry args={[BOARD.width, BOARD.height, BOARD.depth]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>

      <group position={[0, BOARD.y, BOARD.depth / 2 + 0.01]}>
        <Text
          font={fonts.bold}
          fontSize={0.48}
          position-y={0.28}
          color="#fff8ec"
          anchorX="center"
          anchorY="middle"
          maxWidth={BOARD.width - 0.4}
        >
          {site.name}
        </Text>
        <Text
          font={fonts.semibold}
          fontSize={0.26}
          position-y={-0.3}
          color="#f6dfb8"
          anchorX="center"
          anchorY="middle"
          maxWidth={BOARD.width - 0.4}
        >
          {localize(site.title)}
        </Text>
      </group>

      <CuboidCollider args={[BOARD.width / 2 - 0.2, 1.3, 0.15]} position-y={1.3} />
    </RigidBody>
  )
}
