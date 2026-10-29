import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { projects } from '../content'
import { playerPosition } from '../player/playerPosition'
import { useAppStore } from '../state/store'
import { fonts } from '../world/fonts'
import { stations } from '../world/layout'
import { Station } from './Station'
import { useTapTarget } from './useTapTarget'

// Open lab pavilion on the northern half of the plaza, facing south (the camera); a workbench
// with one monitor per project — up to three on the bench, projects four to six on a shelf above
const center = stations.projects
// the roof only shades the tool wall: the camera looks down steeply and must see the monitors
const PAVILION = { width: 5.2, height: 2.9, roofDepth: 1.1 }
const BACK_Z = center.z - 2.3
const BENCH = { length: 4.6, height: 0.9, depth: 0.7, z: center.z - 1.55 }
const POST_Z = BACK_Z + PAVILION.roofDepth - 0.15
const SLOT_X = [-1.4, 0, 1.4]
const DEFAULT_ACCENT = '#c8553d'

const steel = '#5c6773'
const wood = '#b98a5e'
const wall = '#e9e4dc'
const roof = '#3d405b'

const monitors = projects.entries.map((project, i) => {
  const shelf = i >= SLOT_X.length
  const x = center.x + SLOT_X[i % SLOT_X.length]!
  return {
    project,
    x,
    y: shelf ? 2.15 : BENCH.height + 0.5,
    z: shelf ? BACK_Z + 0.25 : BENCH.z - 0.15,
    shelf,
  }
})

function Monitor({
  monitor,
  index,
  near,
}: {
  monitor: (typeof monitors)[number]
  index: number
  near: boolean
}) {
  const accent = monitor.project.accent ?? DEFAULT_ACCENT
  const setOpenStation = useAppStore((state) => state.setOpenStation)
  // a tap on the screen opens exactly its project
  const tapTarget = useTapTarget(() => setOpenStation('projects', index))
  return (
    // tilted back a little towards the camera, so the names read well from above
    <group position={[monitor.x, monitor.y, monitor.z]} rotation-x={-0.28} {...tapTarget}>
      <mesh castShadow>
        <boxGeometry args={[1.15, 0.74, 0.06]} />
        <meshStandardMaterial color="#20232e" flatShading />
      </mesh>
      <mesh position-z={0.032}>
        <planeGeometry args={[1.05, 0.64]} />
        <meshStandardMaterial
          color="#11131a"
          emissive={accent}
          emissiveIntensity={near ? 0.9 : 0.35}
        />
      </mesh>
      <Text
        font={fonts.semibold}
        fontSize={0.14}
        position={[0, 0, 0.04]}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.95}
        textAlign="center"
      >
        {monitor.project.name}
      </Text>
      {!monitor.shelf && (
        <>
          <mesh position={[0, -0.44, -0.02]}>
            <boxGeometry args={[0.06, 0.16, 0.06]} />
            <meshStandardMaterial color="#20232e" flatShading />
          </mesh>
          <mesh position={[0, -0.51, 0]}>
            <boxGeometry args={[0.32, 0.03, 0.2]} />
            <meshStandardMaterial color="#20232e" flatShading />
          </mesh>
        </>
      )}
    </group>
  )
}

// Lab props on the bench: soldering station, microcontroller board, oscilloscope
function Props() {
  const top = BENCH.height
  return (
    <>
      <group position={[center.x - 2.05, top, BENCH.z + 0.05]}>
        <mesh position-y={0.08} castShadow>
          <boxGeometry args={[0.3, 0.16, 0.24]} />
          <meshStandardMaterial color="#c8553d" flatShading />
        </mesh>
        <mesh position={[0.05, 0.25, 0]} rotation-z={-0.5}>
          <cylinderGeometry args={[0.015, 0.02, 0.28, 6]} />
          <meshStandardMaterial color="#2f3145" flatShading />
        </mesh>
      </group>
      <group position={[center.x - 0.65, top + 0.012, BENCH.z + 0.22]} rotation-y={0.2}>
        <mesh>
          <boxGeometry args={[0.32, 0.02, 0.2]} />
          <meshStandardMaterial color="#2e7d4f" flatShading />
        </mesh>
        {[-0.08, 0.06].map((x) => (
          <mesh key={x} position={[x, 0.02, 0]}>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <meshStandardMaterial color="#1b1d24" flatShading />
          </mesh>
        ))}
      </group>
      <group position={[center.x + 2.05, top, BENCH.z - 0.05]}>
        <mesh position-y={0.15} castShadow>
          <boxGeometry args={[0.42, 0.3, 0.3]} />
          <meshStandardMaterial color="#aab2ba" flatShading />
        </mesh>
        <mesh position={[-0.05, 0.16, 0.152]}>
          <planeGeometry args={[0.24, 0.17]} />
          <meshStandardMaterial color="#0d2414" emissive="#39d36b" emissiveIntensity={0.6} />
        </mesh>
      </group>
    </>
  )
}

function Pavilion() {
  const postX = PAVILION.width / 2 - 0.12
  return (
    <RigidBody type="fixed" colliders={false}>
      {/* back wall with a pegboard of tools */}
      <mesh position={[center.x, PAVILION.height / 2, BACK_Z]} castShadow receiveShadow>
        <boxGeometry args={[PAVILION.width, PAVILION.height, 0.16]} />
        <meshStandardMaterial color={wall} flatShading />
      </mesh>
      <mesh position={[center.x, 1.55, BACK_Z + 0.09]}>
        <boxGeometry args={[3.4, 0.5, 0.02]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      {[-1.3, -0.7, -0.1, 0.5, 1.1].map((x, i) => (
        <mesh
          key={x}
          position={[center.x + x, 1.55, BACK_Z + 0.12]}
          rotation-z={i % 2 ? 0.4 : -0.3}
        >
          <boxGeometry args={[0.05, 0.36, 0.03]} />
          <meshStandardMaterial color={i % 2 ? steel : '#e0a63a'} flatShading />
        </mesh>
      ))}
      {/* shelf for projects four to six */}
      {monitors.some((monitor) => monitor.shelf) && (
        <mesh position={[center.x, 1.7, BACK_Z + 0.25]} castShadow>
          <boxGeometry args={[4.2, 0.06, 0.4]} />
          <meshStandardMaterial color={wood} flatShading />
        </mesh>
      )}
      {/* short canopy over the tool wall, on two posts */}
      <mesh
        position={[center.x, PAVILION.height + 0.06, BACK_Z + PAVILION.roofDepth / 2]}
        castShadow
      >
        <boxGeometry args={[PAVILION.width + 0.3, 0.12, PAVILION.roofDepth]} />
        <meshStandardMaterial color={roof} flatShading />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[center.x + side * postX, PAVILION.height / 2, POST_Z]}
          castShadow
        >
          <boxGeometry args={[0.14, PAVILION.height, 0.14]} />
          <meshStandardMaterial color={roof} flatShading />
        </mesh>
      ))}

      {/* workbench */}
      <mesh position={[center.x, BENCH.height - 0.04, BENCH.z]} castShadow receiveShadow>
        <boxGeometry args={[BENCH.length, 0.08, BENCH.depth]} />
        <meshStandardMaterial color={wood} flatShading />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}${sz}`}
            position={[
              center.x + sx * (BENCH.length / 2 - 0.1),
              (BENCH.height - 0.08) / 2,
              BENCH.z + sz * (BENCH.depth / 2 - 0.08),
            ]}
          >
            <boxGeometry args={[0.08, BENCH.height - 0.08, 0.08]} />
            <meshStandardMaterial color={steel} flatShading />
          </mesh>
        )),
      )}

      <CuboidCollider
        args={[PAVILION.width / 2, PAVILION.height / 2, 0.1]}
        position={[center.x, PAVILION.height / 2, BACK_Z]}
      />
      <CuboidCollider
        args={[BENCH.length / 2, BENCH.height / 2, BENCH.depth / 2]}
        position={[center.x, BENCH.height / 2, BENCH.z]}
      />
      {[-1, 1].map((side) => (
        <CuboidCollider
          key={side}
          args={[0.1, PAVILION.height / 2, 0.1]}
          position={[center.x + side * postX, PAVILION.height / 2, POST_Z]}
        />
      ))}
    </RigidBody>
  )
}

export function ProjectsStation() {
  const nearProject = useAppStore((state) => state.nearProject)

  // While at the station, the monitor closest to the character is the one E opens
  useFrame(() => {
    const store = useAppStore.getState()
    let closest: number | null = null
    if (store.nearStation === 'projects') {
      let best = Infinity
      monitors.forEach((monitor, i) => {
        const distance = Math.hypot(playerPosition.x - monitor.x, playerPosition.z - monitor.z)
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
      {/* above the roof */}
      <Station id="projects" labelHeight={3.9}>
        {null}
      </Station>
      <Pavilion />
      <Props />
      {monitors.map((monitor, i) => (
        <Monitor key={i} monitor={monitor} index={i} near={nearProject === i} />
      ))}
    </>
  )
}
