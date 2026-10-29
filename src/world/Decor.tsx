import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useLayoutEffect, useRef } from 'react'
import {
  type BufferGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  Euler,
  IcosahedronGeometry,
  type InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Vector3,
} from 'three'
import { bushes, clouds, rocks, trees } from './decorPlacement'
import { palette } from './palette'
import { createRandom } from './random'

// Decor is many small meshes of a few kinds: one instanced draw call per kind (#38)
const trunkGeometry = new CylinderGeometry(0.14, 0.2, 1, 6)
const pineGeometry = new ConeGeometry(1, 1.6, 7)
const roundGeometry = new IcosahedronGeometry(1, 0)
const rockGeometry = new DodecahedronGeometry(1, 0)
const puffGeometry = new IcosahedronGeometry(1, 1)

const material = (color: string) => new MeshStandardMaterial({ color, flatShading: true })
const trunkMaterial = material(palette.trunk)
// white base, tinted per instance with one of the leaf colours
const leafMaterial = material('#ffffff')
const bushMaterial = material(palette.bush)
const stoneMaterial = material(palette.stone)
const cloudMaterial = material(palette.cloud)

const position = new Vector3()
const quaternion = new Quaternion()
const scale = new Vector3()
const euler = new Euler()
const compose = (
  [x, y, z]: [number, number, number],
  [rx, ry, rz]: [number, number, number],
  [sx, sy, sz]: [number, number, number],
  target = new Matrix4(),
) =>
  target.compose(
    position.set(x, y, z),
    quaternion.setFromEuler(euler.set(rx, ry, rz)),
    scale.set(sx, sy, sz),
  )

type Props = {
  geometry: BufferGeometry
  material: MeshStandardMaterial
  matrices: Matrix4[]
  colors?: string[]
  receiveShadow?: boolean
  meshRef?: (mesh: InstancedMesh | null) => void
}

function Instances({ geometry, material, matrices, colors, receiveShadow, meshRef }: Props) {
  const mesh = useRef<InstancedMesh>(null)
  useLayoutEffect(() => {
    const instanced = mesh.current
    if (!instanced) return
    matrices.forEach((matrix, i) => instanced.setMatrixAt(i, matrix))
    colors?.forEach((color, i) => instanced.setColorAt(i, new Color(color)))
    instanced.instanceMatrix.needsUpdate = true
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
  }, [matrices, colors])
  return (
    <instancedMesh
      ref={(instanced) => {
        mesh.current = instanced
        meshRef?.(instanced)
      }}
      args={[geometry, material, matrices.length]}
      castShadow
      receiveShadow={receiveShadow}
      frustumCulled={false}
    />
  )
}

const pines = trees.filter((tree) => tree.kind === 'pine')
const roundTrees = trees.filter((tree) => tree.kind === 'round')
const one: [number, number, number] = [1, 1, 1]

const trunkMatrices = trees.map((tree) =>
  compose([tree.x, 0.5 * tree.scale, tree.z], [0, 0, 0], [tree.scale, tree.scale, tree.scale]),
)
const rockMatrices = rocks.map((rock) =>
  compose(
    [rock.x, rock.scale * 0.35, rock.z],
    [0.3, rock.rotation, 0.2],
    [rock.scale, rock.scale * 0.7, rock.scale],
  ),
)
const bushMatrices = bushes.flatMap((bush) => [
  compose([bush.x, 0.5 * bush.scale, bush.z], [0, 0, 0], [bush.scale, bush.scale, bush.scale]),
  compose(
    [bush.x + 0.6 * bush.scale, 0.35 * bush.scale, bush.z + 0.2 * bush.scale],
    [0, 0, 0],
    [0.7 * bush.scale, 0.7 * bush.scale, 0.7 * bush.scale],
  ),
])
const leafColor = (tree: (typeof trees)[number]) => palette.leaves[tree.leaves]!

// crown parts relative to the crown pivot at the trunk top; they sway together
const pineLower = compose([0, 0.6, 0], [0, 0, 0], one)
const pineUpper = compose([0, 1.4, 0], [0, 0, 0], [0.72, 0.72, 0.72])
const roundCrown = compose([0, 0.9, 0], [0, 0, 0], [1.1, 1.1, 1.1])
const pivot = (tree: (typeof trees)[number]) =>
  compose([tree.x, tree.scale, tree.z], [0, 0, 0], [tree.scale, tree.scale, tree.scale])

const cloudPuffs = clouds.flatMap((cloud, c) => {
  const random = createRandom(Math.floor(cloud.angle * 1000))
  return Array.from({ length: cloud.puffs }, (_, i) => {
    const s = 0.9 + random() * 0.7
    const local = compose(
      [(i - (cloud.puffs - 1) / 2) * 1.3, random() * 0.5, (random() - 0.5) * 1.2],
      [0, 0, 0],
      [s * 1.2, s * 0.8, s],
    )
    return { cloud: c, local }
  })
})

const sway = new Matrix4()
const swayed = new Matrix4()
const orbit = new Matrix4()

export function Decor() {
  const crownMeshes = useRef<{
    lower: InstancedMesh | null
    upper: InstancedMesh | null
    round: InstancedMesh | null
    clouds: InstancedMesh | null
  }>({
    lower: null,
    upper: null,
    round: null,
    clouds: null,
  })

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { lower, upper, round, clouds: puffs } = crownMeshes.current

    // Gentle wind: each crown sways with its own phase around the trunk top
    const update = (
      mesh: InstancedMesh | null,
      list: typeof trees,
      part: Matrix4,
      index: number,
    ) => {
      const tree = list[index]!
      compose(
        [0, 0, 0],
        [Math.sin(t * 0.8 + tree.phase * 1.7) * 0.03, 0, Math.sin(t * 1.1 + tree.phase) * 0.04],
        one,
        sway,
      )
      mesh?.setMatrixAt(index, swayed.multiplyMatrices(pivot(tree), sway).multiply(part))
    }
    pines.forEach((_, i) => {
      update(lower, pines, pineLower, i)
      update(upper, pines, pineUpper, i)
    })
    roundTrees.forEach((_, i) => update(round, roundTrees, roundCrown, i))
    for (const mesh of [lower, upper, round]) if (mesh) mesh.instanceMatrix.needsUpdate = true

    // clouds orbit the island slowly
    if (puffs) {
      cloudPuffs.forEach(({ cloud: c, local }, i) => {
        const cloud = clouds[c]!
        compose([0, 0, 0], [0, cloud.angle + t * cloud.speed, 0], one, orbit)
        orbit.multiply(compose([cloud.radius, cloud.y, 0], [0, Math.PI / 2, 0], one, sway))
        puffs.setMatrixAt(i, orbit.multiply(local))
      })
      puffs.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <Instances geometry={trunkGeometry} material={trunkMaterial} matrices={trunkMatrices} />
      <Instances
        geometry={pineGeometry}
        material={leafMaterial}
        matrices={pines.map((tree) => pivot(tree).multiply(pineLower))}
        colors={pines.map(leafColor)}
        meshRef={(mesh) => (crownMeshes.current.lower = mesh)}
      />
      <Instances
        geometry={pineGeometry}
        material={leafMaterial}
        matrices={pines.map((tree) => pivot(tree).multiply(pineUpper))}
        colors={pines.map(leafColor)}
        meshRef={(mesh) => (crownMeshes.current.upper = mesh)}
      />
      <Instances
        geometry={roundGeometry}
        material={leafMaterial}
        matrices={roundTrees.map((tree) => pivot(tree).multiply(roundCrown))}
        colors={roundTrees.map(leafColor)}
        meshRef={(mesh) => (crownMeshes.current.round = mesh)}
      />
      <Instances
        geometry={rockGeometry}
        material={stoneMaterial}
        matrices={rockMatrices}
        receiveShadow
      />
      <Instances geometry={roundGeometry} material={bushMaterial} matrices={bushMatrices} />
      <Instances
        geometry={puffGeometry}
        material={cloudMaterial}
        matrices={cloudPuffs.map(({ local }) => local)}
        meshRef={(mesh) => (crownMeshes.current.clouds = mesh)}
      />

      {/* colliders unchanged from the per-mesh version */}
      <RigidBody type="fixed" colliders={false}>
        {trees.map((tree, i) => (
          <CylinderCollider key={i} args={[1, 0.3 * tree.scale]} position={[tree.x, 1, tree.z]} />
        ))}
        {rocks.map((rock, i) => (
          <CylinderCollider
            key={i}
            args={[0.5, rock.scale * 0.85]}
            position={[rock.x, 0.5, rock.z]}
          />
        ))}
        {bushes.map((bush, i) => (
          <group key={i} position={[bush.x, 0, bush.z]} scale={bush.scale}>
            <CylinderCollider args={[0.5, 0.9]} position={[0.2, 0.5, 0]} />
          </group>
        ))}
      </RigidBody>
    </>
  )
}
