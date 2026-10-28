import { useFrame } from '@react-three/fiber'
import { CylinderCollider, RigidBody } from '@react-three/rapier'
import { useRef } from 'react'
import {
  ConeGeometry,
  CylinderGeometry,
  DodecahedronGeometry,
  type Group,
  IcosahedronGeometry,
  MeshStandardMaterial,
} from 'three'
import { bushes, type Cloud, clouds, rocks, type Tree, trees } from './decorPlacement'
import { palette } from './palette'
import { createRandom } from './random'

// Shared geometries and materials: decor is many small meshes of a few kinds
const trunkGeometry = new CylinderGeometry(0.14, 0.2, 1, 6)
const pineGeometry = new ConeGeometry(1, 1.6, 7)
const roundGeometry = new IcosahedronGeometry(1, 0)
const rockGeometry = new DodecahedronGeometry(1, 0)
const puffGeometry = new IcosahedronGeometry(1, 1)

const material = (color: string) => new MeshStandardMaterial({ color, flatShading: true })
const trunkMaterial = material(palette.trunk)
const leafMaterials = palette.leaves.map(material)
const bushMaterial = material(palette.bush)
const stoneMaterial = material(palette.stone)
const cloudMaterial = new MeshStandardMaterial({ color: palette.cloud, flatShading: true })

function TreeModel({ tree, crownRef }: { tree: Tree; crownRef: (group: Group | null) => void }) {
  const leaves = leafMaterials[tree.leaves]!
  return (
    <group position={[tree.x, 0, tree.z]} scale={tree.scale}>
      <mesh geometry={trunkGeometry} material={trunkMaterial} position-y={0.5} castShadow />
      {/* the crown pivots at the trunk top so it sways like in wind */}
      <group ref={crownRef} position-y={1}>
        {tree.kind === 'pine' ? (
          <>
            <mesh geometry={pineGeometry} material={leaves} position-y={0.6} castShadow />
            <mesh
              geometry={pineGeometry}
              material={leaves}
              position-y={1.4}
              scale={0.72}
              castShadow
            />
          </>
        ) : (
          <mesh
            geometry={roundGeometry}
            material={leaves}
            position-y={0.9}
            scale={1.1}
            castShadow
          />
        )}
      </group>
    </group>
  )
}

function CloudModel({ cloud }: { cloud: Cloud }) {
  const orbit = useRef<Group>(null)
  const random = createRandom(Math.floor(cloud.angle * 1000))
  const puffs = Array.from({ length: cloud.puffs }, (_, i) => ({
    x: (i - (cloud.puffs - 1) / 2) * 1.3,
    y: random() * 0.5,
    z: (random() - 0.5) * 1.2,
    scale: 0.9 + random() * 0.7,
  }))

  useFrame((_, delta) => {
    if (orbit.current) orbit.current.rotation.y += cloud.speed * delta
  })

  return (
    <group ref={orbit} rotation-y={cloud.angle}>
      <group position={[cloud.radius, cloud.y, 0]} rotation-y={Math.PI / 2}>
        {puffs.map((puff, i) => (
          <mesh
            key={i}
            geometry={puffGeometry}
            material={cloudMaterial}
            position={[puff.x, puff.y, puff.z]}
            scale={[puff.scale * 1.2, puff.scale * 0.8, puff.scale]}
          />
        ))}
      </group>
    </group>
  )
}

export function Decor() {
  const crowns = useRef<(Group | null)[]>([])

  // Gentle wind: each crown sways with its own phase
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    crowns.current.forEach((crown, i) => {
      if (!crown) return
      const phase = trees[i]!.phase
      crown.rotation.z = Math.sin(t * 1.1 + phase) * 0.04
      crown.rotation.x = Math.sin(t * 0.8 + phase * 1.7) * 0.03
    })
  })

  return (
    <>
      <RigidBody type="fixed" colliders={false}>
        {trees.map((tree, i) => (
          <group key={i}>
            <TreeModel tree={tree} crownRef={(group) => (crowns.current[i] = group)} />
            <CylinderCollider args={[1, 0.3 * tree.scale]} position={[tree.x, 1, tree.z]} />
          </group>
        ))}
        {rocks.map((rock, i) => (
          <group key={i}>
            <mesh
              geometry={rockGeometry}
              material={stoneMaterial}
              position={[rock.x, rock.scale * 0.35, rock.z]}
              rotation={[0.3, rock.rotation, 0.2]}
              scale={[rock.scale, rock.scale * 0.7, rock.scale]}
              castShadow
              receiveShadow
            />
            <CylinderCollider args={[0.5, rock.scale * 0.85]} position={[rock.x, 0.5, rock.z]} />
          </group>
        ))}
        {bushes.map((bush, i) => (
          <group key={i} position={[bush.x, 0, bush.z]} scale={bush.scale}>
            <mesh
              geometry={roundGeometry}
              material={bushMaterial}
              position={[0, 0.5, 0]}
              castShadow
            />
            <mesh
              geometry={roundGeometry}
              material={bushMaterial}
              position={[0.6, 0.35, 0.2]}
              scale={0.7}
              castShadow
            />
            <CylinderCollider args={[0.5, 0.9]} position={[0.2, 0.5, 0]} />
          </group>
        ))}
      </RigidBody>

      {clouds.map((cloud, i) => (
        <CloudModel key={i} cloud={cloud} />
      ))}
    </>
  )
}
