import { useFrame } from '@react-three/fiber'
import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { DoubleSide, MeshStandardMaterial } from 'three'
import { environment } from '../world/environment'
import { createRandom } from '../world/random'
import { Station } from './Station'

// A cosy reading corner in front of a bookshelf: who I am, away from the desk.
// Local coordinates, +z faces the camera; shown larger than life so the details read
const SCALE = 1.25
const wood = '#a8764c'
const woodDark = '#7a5236'
const fabric = '#2a9d8f'
const fabricDark = '#21867a'
const cushion = '#f4a261'
const throwColor = '#e9c46a'
const bookColors = [
  '#c8553d',
  '#3d405b',
  '#e0a63a',
  '#5fae55',
  '#3d7ac8',
  '#8a5a3b',
  '#e76f51',
  '#264653',
]

// glows at night; module level so the frame loop may change it (hook values are immutable)
const shade = new MeshStandardMaterial({
  color: '#fff1d6',
  emissive: '#ffb45e',
  emissiveIntensity: 0,
  side: DoubleSide,
  flatShading: true,
})

const SHELF = { width: 1.8, height: 1.9, depth: 0.38, z: -1.05 }
const SHELF_LEVELS = [0.08, 0.68, 1.28]

type Book = { x: number; y: number; width: number; height: number; color: string; lean: number }

// Books per shelf level: varied widths, heights and colours, a few leaning (deterministic)
const books: Book[] = (() => {
  const random = createRandom(41)
  return SHELF_LEVELS.flatMap((level, row) => {
    const items: Book[] = []
    let x = -SHELF.width / 2 + 0.1
    const end = SHELF.width / 2 - (row === 2 ? 0.55 : 0.12)
    while (x < end) {
      const width = 0.05 + random() * 0.05
      const height = 0.34 + random() * 0.18
      const lean = random() < 0.12 ? 0.25 : 0
      const color = bookColors[Math.floor(random() * bookColors.length)]!
      items.push({ x: x + width / 2, y: level + height / 2, width, height, color, lean })
      x += width + (lean ? 0.06 : 0.008)
    }
    return items
  })
})()

function Bookshelf() {
  const side = SHELF.width / 2 - 0.03
  return (
    <group position-z={SHELF.z}>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * side, SHELF.height / 2, 0]} castShadow>
          <boxGeometry args={[0.06, SHELF.height, SHELF.depth]} />
          <meshStandardMaterial color={woodDark} flatShading />
        </mesh>
      ))}
      <mesh position={[0, SHELF.height / 2, -SHELF.depth / 2 + 0.02]}>
        <boxGeometry args={[SHELF.width, SHELF.height, 0.04]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      {[...SHELF_LEVELS, SHELF.height - 0.03].map((y) => (
        <mesh key={y} position={[0, y - 0.03, 0]} castShadow receiveShadow>
          <boxGeometry args={[SHELF.width, 0.05, SHELF.depth]} />
          <meshStandardMaterial color={woodDark} flatShading />
        </mesh>
      ))}
      {books.map((book, i) => (
        <mesh key={i} position={[book.x, book.y, 0.02]} rotation-z={-book.lean}>
          <boxGeometry args={[book.width, book.height, SHELF.depth - 0.1]} />
          <meshStandardMaterial color={book.color} flatShading />
        </mesh>
      ))}
      {/* top shelf, right: a small plant and a picture frame */}
      <group position={[SHELF.width / 2 - 0.3, SHELF_LEVELS[2]!, 0]}>
        <mesh position-y={0.08}>
          <cylinderGeometry args={[0.08, 0.06, 0.16, 8]} />
          <meshStandardMaterial color="#e9e4dc" flatShading />
        </mesh>
        <mesh position-y={0.24} scale={[1.2, 1, 1.2]}>
          <icosahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#5fae55" flatShading />
        </mesh>
      </group>
      <mesh position={[SHELF.width / 2 - 0.12, SHELF_LEVELS[2]! + 0.16, -0.05]} rotation-y={-0.3}>
        <boxGeometry args={[0.16, 0.22, 0.03]} />
        <meshStandardMaterial color="#e0a63a" flatShading />
      </mesh>
    </group>
  )
}

// Chunky armchair facing the camera: rounded arm rolls, seat cushion, two pillows, a throw
function Armchair() {
  return (
    <group position={[0, 0, -0.1]}>
      <mesh position-y={0.32} castShadow>
        <boxGeometry args={[1.05, 0.34, 0.9]} />
        <meshStandardMaterial color={fabricDark} flatShading />
      </mesh>
      <mesh position={[0, 0.53, 0.05]} castShadow>
        <boxGeometry args={[0.78, 0.12, 0.78]} />
        <meshStandardMaterial color={fabric} flatShading />
      </mesh>
      <mesh position={[0, 0.88, -0.36]} castShadow>
        <boxGeometry args={[1.05, 0.78, 0.22]} />
        <meshStandardMaterial color={fabricDark} flatShading />
      </mesh>
      <mesh position={[0, 1.27, -0.36]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.11, 0.11, 1.05, 10]} />
        <meshStandardMaterial color={fabricDark} flatShading />
      </mesh>
      {[-1, 1].map((side) => (
        <group key={side} position-x={side * 0.47}>
          <mesh position-y={0.58}>
            <boxGeometry args={[0.16, 0.18, 0.86]} />
            <meshStandardMaterial color={fabricDark} flatShading />
          </mesh>
          <mesh position-y={0.7} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.1, 0.1, 0.86, 10]} />
            <meshStandardMaterial color={fabric} flatShading />
          </mesh>
        </group>
      ))}
      {/* pillows */}
      <mesh position={[-0.2, 0.78, -0.18]} rotation={[-0.25, 0.25, 0.1]} castShadow>
        <boxGeometry args={[0.36, 0.34, 0.12]} />
        <meshStandardMaterial color={cushion} flatShading />
      </mesh>
      <mesh position={[0.22, 0.76, -0.2]} rotation={[-0.25, -0.2, -0.08]} castShadow>
        <boxGeometry args={[0.32, 0.3, 0.12]} />
        <meshStandardMaterial color={throwColor} flatShading />
      </mesh>
      {/* throw blanket over the right arm */}
      <mesh position={[0.5, 0.62, 0.12]} rotation-z={-0.15} castShadow>
        <boxGeometry args={[0.26, 0.42, 0.5]} />
        <meshStandardMaterial color={cushion} flatShading />
      </mesh>
      {[-0.42, 0.42].flatMap((x) =>
        [-0.35, 0.35].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.07, z]}>
            <cylinderGeometry args={[0.035, 0.025, 0.14, 6]} />
            <meshStandardMaterial color={woodDark} flatShading />
          </mesh>
        )),
      )}
    </group>
  )
}

// Arc lamp: a pole and a curved arm, the shade hangs above the armchair
function ArcLamp() {
  useFrame(() => {
    shade.emissiveIntensity = 0.12 + (1 - environment.daylight) * 1.5
  })
  return (
    // beside the bookshelf (not in it), the shade hangs over the armchair
    <group position={[-1.3, 0, -0.25]}>
      <mesh position-y={0.04}>
        <cylinderGeometry args={[0.2, 0.22, 0.08, 10]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      <mesh position-y={1.05}>
        <cylinderGeometry args={[0.03, 0.03, 2, 6]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      {/* half circle from the pole top over to the shade, which hangs from its end */}
      <mesh position={[0.45, 2.05, 0]}>
        <torusGeometry args={[0.45, 0.025, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#2f3145" flatShading />
      </mesh>
      <mesh position={[0.9, 1.92, 0]} material={shade} castShadow>
        <sphereGeometry args={[0.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  )
}

function SideTable() {
  return (
    <group position={[0.9, 0, 0.15]}>
      <mesh position-y={0.52} castShadow>
        <cylinderGeometry args={[0.26, 0.26, 0.05, 12]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      <mesh position-y={0.26}>
        <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
        <meshStandardMaterial color={woodDark} flatShading />
      </mesh>
      <mesh position-y={0.03}>
        <cylinderGeometry args={[0.16, 0.18, 0.05, 10]} />
        <meshStandardMaterial color={woodDark} flatShading />
      </mesh>
      {/* mug with handle */}
      <mesh position={[-0.08, 0.6, 0.05]}>
        <cylinderGeometry args={[0.045, 0.04, 0.1, 10]} />
        <meshStandardMaterial color="#e76f51" flatShading />
      </mesh>
      <mesh position={[-0.03, 0.6, 0.05]} rotation-y={Math.PI / 2}>
        <torusGeometry args={[0.025, 0.008, 6, 10]} />
        <meshStandardMaterial color="#e76f51" flatShading />
      </mesh>
      {/* open book */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0.08 + side * 0.055, 0.56, -0.06]} rotation-z={side * -0.12}>
          <boxGeometry args={[0.11, 0.012, 0.15]} />
          <meshStandardMaterial color="#f7f3ea" flatShading />
        </mesh>
      ))}
    </group>
  )
}

function FloorPlant() {
  const leaves = [
    { y: 0.7, rx: 0.2, rz: 0.3, s: 0.22 },
    { y: 0.85, rx: -0.3, rz: -0.2, s: 0.2 },
    { y: 1.0, rx: 0.1, rz: 0.1, s: 0.18 },
  ]
  return (
    <group position={[1.05, 0, -0.8]}>
      <mesh position-y={0.2} castShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.4, 10]} />
        <meshStandardMaterial color="#e9e4dc" flatShading />
      </mesh>
      {leaves.map((leaf, i) => (
        <mesh
          key={i}
          position-y={leaf.y}
          rotation={[leaf.rx, i, leaf.rz]}
          scale={[1, 1.6, 1]}
          castShadow
        >
          <icosahedronGeometry args={[leaf.s, 0]} />
          <meshStandardMaterial color={i === 1 ? '#3f8a48' : '#4f9a4a'} flatShading />
        </mesh>
      ))}
    </group>
  )
}

function ReadingCorner() {
  return (
    <group scale={SCALE}>
      {/* two-tone round rug, above the plaza which is drawn with a depth offset */}
      <mesh position-y={0.06} receiveShadow>
        <cylinderGeometry args={[1.45, 1.45, 0.03, 28]} />
        <meshStandardMaterial color={throwColor} flatShading />
      </mesh>
      <mesh position-y={0.08} receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.02, 28]} />
        <meshStandardMaterial color="#e76f51" flatShading />
      </mesh>
      <group position-y={0.09}>
        <Bookshelf />
        <Armchair />
        <ArcLamp />
        <SideTable />
        <FloorPlant />
        {/* a book left on the rug */}
        <mesh position={[-0.45, 0.02, 0.7]} rotation-y={0.5} castShadow>
          <boxGeometry args={[0.28, 0.05, 0.2]} />
          <meshStandardMaterial color="#264653" flatShading />
        </mesh>
      </group>
    </group>
  )
}

// colliders are sized directly instead of inheriting the group scale
const S = (v: number) => v * SCALE

export function CareerStation() {
  return (
    <Station id="career">
      <RigidBody type="fixed" colliders={false}>
        <ReadingCorner />
        <CuboidCollider
          args={[S(SHELF.width / 2), S(SHELF.height / 2), S(SHELF.depth / 2)]}
          position={[0, S(SHELF.height / 2), S(SHELF.z)]}
        />
        <CylinderCollider args={[S(0.6), S(0.65)]} position={[0, S(0.6), S(-0.1)]} />
        <CylinderCollider args={[S(0.4), S(0.28)]} position={[S(0.9), S(0.4), S(0.15)]} />
        <CylinderCollider args={[S(0.6), S(0.2)]} position={[S(1.05), S(0.6), S(-0.8)]} />
        <CylinderCollider args={[S(1), S(0.22)]} position={[S(-1.3), S(1), S(-0.25)]} />
      </RigidBody>
    </Station>
  )
}
