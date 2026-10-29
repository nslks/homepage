import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { DoubleSide } from 'three'
import { Station } from './Station'

// One collected station for all projects (it scales with any number): a desk setup next to a
// maker bench. Local coordinates, +z faces the camera
const wood = '#b98a5e'
const woodDark = '#8a6240'
const steel = '#5c6773'
const dark = '#20232e'
const black = '#14161d'

// furniture is shown 35 % larger than life, so the details read from the follow camera
const SCALE = 1.35
const DESK = { x: -1.15, z: -1, width: 1.7, depth: 0.78, height: 0.76 }
const BENCH = { x: 1.25, z: -1, width: 1.6, depth: 0.85, height: 0.9 }

function Legs({
  width,
  depth,
  height,
  color,
}: {
  width: number
  depth: number
  height: number
  color: string
}) {
  return (
    <>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}${sz}`}
            position={[sx * (width / 2 - 0.06), height / 2, sz * (depth / 2 - 0.06)]}
          >
            <boxGeometry args={[0.06, height, 0.06]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
        )),
      )}
    </>
  )
}

// Curved monitor: a slice of a cylinder, concave towards the chair, glowing screen inside
function CurvedMonitor() {
  const radius = 1.3
  const arc = 0.78
  const height = 0.46
  return (
    <group position={[0, DESK.height + 0.42, -0.22 + radius]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 24, 1, true, Math.PI - arc / 2, arc]} />
        <meshStandardMaterial
          color="#0e1626"
          emissive="#3d7ac8"
          emissiveIntensity={0.55}
          side={DoubleSide}
        />
      </mesh>
      <mesh>
        <cylinderGeometry
          args={[
            radius + 0.03,
            radius + 0.03,
            height + 0.05,
            24,
            1,
            true,
            Math.PI - arc / 2 - 0.02,
            arc + 0.04,
          ]}
        />
        <meshStandardMaterial color={dark} side={DoubleSide} flatShading />
      </mesh>
      {/* stand */}
      <mesh position={[0, -0.3, -radius - 0.05]}>
        <boxGeometry args={[0.06, 0.2, 0.05]} />
        <meshStandardMaterial color={dark} flatShading />
      </mesh>
      <mesh position={[0, -0.41, -radius + 0.02]}>
        <boxGeometry args={[0.36, 0.02, 0.22]} />
        <meshStandardMaterial color={dark} flatShading />
      </mesh>
    </group>
  )
}

// Office chair: five-star base, seat, backrest — turned towards the desk
function OfficeChair() {
  return (
    <group position={[0, 0, 0.12]} rotation-y={Math.PI + 0.25}>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 5) * Math.PI * 2) * 0.2,
            0.05,
            Math.cos((i / 5) * Math.PI * 2) * 0.2,
          ]}
          rotation-y={(i / 5) * Math.PI * 2}
        >
          <boxGeometry args={[0.05, 0.04, 0.4]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
      ))}
      <mesh position-y={0.27}>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 6]} />
        <meshStandardMaterial color={steel} flatShading />
      </mesh>
      <mesh position-y={0.5} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.48]} />
        <meshStandardMaterial color="#c8553d" flatShading />
      </mesh>
      <mesh position={[0, 0.85, -0.22]} rotation-x={-0.12} castShadow>
        <boxGeometry args={[0.46, 0.6, 0.07]} />
        <meshStandardMaterial color="#c8553d" flatShading />
      </mesh>
    </group>
  )
}

function DeskSetup() {
  const top = DESK.height
  return (
    <group position={[DESK.x, 0, DESK.z]}>
      <mesh position-y={top - 0.025} castShadow receiveShadow>
        <boxGeometry args={[DESK.width, 0.05, DESK.depth]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      <Legs width={DESK.width} depth={DESK.depth} height={top - 0.05} color={dark} />
      <CurvedMonitor />
      {/* keyboard and mouse */}
      <mesh position={[0, top + 0.012, 0.14]}>
        <boxGeometry args={[0.5, 0.025, 0.15]} />
        <meshStandardMaterial color={dark} flatShading />
      </mesh>
      <mesh position={[0.36, top + 0.015, 0.16]}>
        <boxGeometry args={[0.06, 0.03, 0.1]} />
        <meshStandardMaterial color={dark} flatShading />
      </mesh>
      {/* desk lamp */}
      <group position={[-0.68, top, -0.15]}>
        <mesh position-y={0.015}>
          <cylinderGeometry args={[0.08, 0.09, 0.03, 8]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
        <mesh position={[0.06, 0.2, 0]} rotation-z={-0.35}>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
        <mesh position={[0.17, 0.38, 0.02]} rotation-z={1.1}>
          <coneGeometry args={[0.08, 0.14, 8, 1, true]} />
          <meshStandardMaterial
            color="#e0a63a"
            emissive="#ffcf7a"
            emissiveIntensity={0.35}
            side={DoubleSide}
            flatShading
          />
        </mesh>
      </group>
      {/* mug and plant */}
      <mesh position={[0.62, top + 0.06, -0.05]}>
        <cylinderGeometry args={[0.045, 0.04, 0.11, 10]} />
        <meshStandardMaterial color="#f3ece1" flatShading />
      </mesh>
      <group position={[0.7, top, -0.25]}>
        <mesh position-y={0.06}>
          <cylinderGeometry args={[0.07, 0.055, 0.12, 8]} />
          <meshStandardMaterial color="#c8553d" flatShading />
        </mesh>
        <mesh position-y={0.2} scale={[1, 1.3, 1]}>
          <icosahedronGeometry args={[0.1, 0]} />
          <meshStandardMaterial color="#4f9a4a" flatShading />
        </mesh>
      </group>
      <group position={[0, 0, 0.6]}>
        <OfficeChair />
      </group>
    </group>
  )
}

// Maker bench: soldering station, helping hands, Arduino, breadboard, multimeter, parts box, pegboard
function MakerBench() {
  const top = BENCH.height
  const wires = ['#d64933', '#3d7ac8', '#e0a63a', '#2e7d4f']
  return (
    <group position={[BENCH.x, 0, BENCH.z]}>
      <mesh position-y={top - 0.03} castShadow receiveShadow>
        <boxGeometry args={[BENCH.width, 0.06, BENCH.depth]} />
        <meshStandardMaterial color={woodDark} flatShading />
      </mesh>
      {/* green work mat */}
      <mesh position-y={top + 0.002}>
        <boxGeometry args={[BENCH.width - 0.1, 0.004, BENCH.depth - 0.1]} />
        <meshStandardMaterial color="#2a6f4e" flatShading />
      </mesh>
      <Legs width={BENCH.width} depth={BENCH.depth} height={top - 0.06} color={steel} />
      {/* pegboard with tools */}
      <mesh position={[0, top + 0.55, -BENCH.depth / 2 + 0.02]} castShadow>
        <boxGeometry args={[BENCH.width, 0.9, 0.04]} />
        <meshStandardMaterial color="#d9c6a5" flatShading />
      </mesh>
      {[-0.55, -0.3, 0, 0.3, 0.55].map((x, i) => (
        <mesh
          key={x}
          position={[x, top + 0.6, -BENCH.depth / 2 + 0.06]}
          rotation-z={i % 2 ? 0.35 : -0.25}
        >
          <boxGeometry args={[0.04, i === 2 ? 0.4 : 0.3, 0.03]} />
          <meshStandardMaterial color={i % 2 ? steel : '#d64933'} flatShading />
        </mesh>
      ))}
      {/* soldering station with the iron resting in its stand */}
      <group position={[-0.55, top, -0.12]}>
        <mesh position-y={0.06} castShadow>
          <boxGeometry args={[0.24, 0.12, 0.2]} />
          <meshStandardMaterial color="#d64933" flatShading />
        </mesh>
        <mesh position={[0, 0.07, 0.101]}>
          <planeGeometry args={[0.12, 0.05]} />
          <meshStandardMaterial color="#111111" emissive="#ff6a3d" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.22, 0.09, 0]} rotation-z={0.6}>
          <cylinderGeometry args={[0.035, 0.02, 0.16, 8, 1, true]} />
          <meshStandardMaterial color={steel} side={DoubleSide} flatShading />
        </mesh>
        <mesh position={[0.28, 0.14, 0]} rotation-z={0.6}>
          <cylinderGeometry args={[0.012, 0.018, 0.26, 6]} />
          <meshStandardMaterial color="#2b2d42" flatShading />
        </mesh>
      </group>
      {/* solder spool */}
      <mesh position={[-0.28, top + 0.04, 0.2]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.04, 0.02, 6, 12]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.4} flatShading />
      </mesh>
      {/* helping hands with magnifier */}
      <group position={[0.02, top, -0.1]}>
        <mesh position-y={0.015}>
          <boxGeometry args={[0.16, 0.03, 0.1]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
        <mesh position-y={0.12}>
          <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
          <meshStandardMaterial color={steel} flatShading />
        </mesh>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 0.07, 0.2, 0.02]} rotation-z={side * 0.9}>
            <cylinderGeometry args={[0.006, 0.006, 0.14, 6]} />
            <meshStandardMaterial color="#d64933" flatShading />
          </mesh>
        ))}
        <mesh position={[0, 0.26, 0.03]} rotation-x={-0.4}>
          <cylinderGeometry args={[0.05, 0.05, 0.01, 12]} />
          <meshStandardMaterial color="#9cc7e0" transparent opacity={0.6} />
        </mesh>
      </group>
      {/* Arduino board: blue PCB, USB port, chip, header rows */}
      <group position={[0.25, top + 0.012, 0.18]} rotation-y={-0.25}>
        <mesh>
          <boxGeometry args={[0.27, 0.016, 0.2]} />
          <meshStandardMaterial color="#1c6fa8" flatShading />
        </mesh>
        <mesh position={[-0.13, 0.02, 0.05]}>
          <boxGeometry args={[0.05, 0.035, 0.05]} />
          <meshStandardMaterial color="#c9c9c9" metalness={0.5} flatShading />
        </mesh>
        <mesh position={[0.04, 0.015, 0.03]}>
          <boxGeometry args={[0.1, 0.012, 0.03]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
        {[-0.085, 0.085].map((z) => (
          <mesh key={z} position={[0.03, 0.02, z]}>
            <boxGeometry args={[0.18, 0.02, 0.015]} />
            <meshStandardMaterial color={black} flatShading />
          </mesh>
        ))}
      </group>
      {/* breadboard with jumper wires and a lit LED */}
      <group position={[0.38, top, -0.12]}>
        <mesh position-y={0.014}>
          <boxGeometry args={[0.3, 0.025, 0.12]} />
          <meshStandardMaterial color="#f3f1ea" flatShading />
        </mesh>
        {wires.map((color, i) => (
          <mesh key={color} position={[-0.1 + i * 0.065, 0.045, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.03, 0.005, 4, 10, Math.PI]} />
            <meshStandardMaterial color={color} flatShading />
          </mesh>
        ))}
        <mesh position={[0.11, 0.045, 0.03]}>
          <sphereGeometry args={[0.014, 8, 6]} />
          <meshStandardMaterial color="#ff3b30" emissive="#ff3b30" emissiveIntensity={1.2} />
        </mesh>
      </group>
      {/* multimeter */}
      <group position={[0.66, top, 0.15]} rotation-y={-0.4}>
        <mesh position-y={0.022} castShadow>
          <boxGeometry args={[0.12, 0.04, 0.2]} />
          <meshStandardMaterial color="#e0a63a" flatShading />
        </mesh>
        <mesh position={[0, 0.044, -0.05]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[0.08, 0.05]} />
          <meshStandardMaterial color="#1b2a1b" emissive="#7cff9b" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 0.047, 0.04]}>
          <cylinderGeometry args={[0.025, 0.025, 0.01, 10]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
      </group>
      {/* parts organiser */}
      <group position={[0.62, top, -0.22]}>
        <mesh position-y={0.09} castShadow>
          <boxGeometry args={[0.24, 0.18, 0.14]} />
          <meshStandardMaterial color="#3d405b" flatShading />
        </mesh>
        {[0, 1, 2].flatMap((row) =>
          [0, 1, 2].map((col) => (
            <mesh
              key={`${row}${col}`}
              position={[-0.075 + col * 0.075, 0.035 + row * 0.055, 0.072]}
            >
              <boxGeometry args={[0.06, 0.04, 0.01]} />
              <meshStandardMaterial color={wires[(row + col) % wires.length]} flatShading />
            </mesh>
          )),
        )}
      </group>
      {/* stool */}
      <group position={[0, 0, 0.62]}>
        <mesh position-y={0.62}>
          <cylinderGeometry args={[0.18, 0.18, 0.05, 10]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
        <mesh position-y={0.31}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          <meshStandardMaterial color={steel} flatShading />
        </mesh>
        <mesh position-y={0.02}>
          <cylinderGeometry args={[0.16, 0.18, 0.04, 10]} />
          <meshStandardMaterial color={black} flatShading />
        </mesh>
      </group>
    </group>
  )
}

// colliders are sized directly instead of inheriting the group scale
const S = (v: number) => v * SCALE

function Workspace() {
  return (
    <RigidBody type="fixed" colliders={false}>
      <group scale={SCALE}>
        <DeskSetup />
        <MakerBench />
      </group>
      <CuboidCollider
        args={[S(DESK.width / 2), S(DESK.height / 2), S(DESK.depth / 2)]}
        position={[S(DESK.x), S(DESK.height / 2), S(DESK.z)]}
      />
      <CylinderCollider args={[S(0.5), S(0.32)]} position={[S(DESK.x), S(0.5), S(DESK.z + 0.72)]} />
      <CuboidCollider
        args={[S(BENCH.width / 2), S((BENCH.height + 0.9) / 2), S(BENCH.depth / 2)]}
        position={[S(BENCH.x), S((BENCH.height + 0.9) / 2), S(BENCH.z)]}
      />
      <CylinderCollider
        args={[S(0.35), S(0.2)]}
        position={[S(BENCH.x), S(0.35), S(BENCH.z + 0.62)]}
      />
    </RigidBody>
  )
}

export function ProjectsStation() {
  return (
    <Station id="projects">
      <Workspace />
    </Station>
  )
}
