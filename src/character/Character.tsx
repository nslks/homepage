import { useAnimations, useGLTF } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { Box3, type Group, type Mesh, type MeshStandardMaterial } from 'three'
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { modelUrl } from './models'
import { outfit } from './outfit'

export type CharacterVariant = 'male' | 'female'
export type CharacterAnimation = 'Idle' | 'Walk' | 'Run'

export const CHARACTER_HEIGHT = 1.7
const FADE_SECONDS = 0.25

type Props = {
  variant: CharacterVariant
  animation: CharacterAnimation
}

export function Character({ variant, animation }: Props) {
  const { scene, animations } = useGLTF(modelUrl(variant))
  const group = useRef<Group>(null)

  // Own copy per instance: skinned meshes need a cloned skeleton, materials get the outfit colours
  const model = useMemo(() => {
    const copy = clone(scene)
    copy.traverse((object) => {
      const mesh = object as Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      const material = (mesh.material as MeshStandardMaterial).clone()
      const color = outfit[material.name]
      if (color) material.color.set(color)
      mesh.material = material
    })
    const box = new Box3().setFromObject(copy)
    copy.scale.setScalar(CHARACTER_HEIGHT / (box.max.y - box.min.y))
    return copy
  }, [scene])

  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    const action = actions[animation]
    action?.reset().fadeIn(FADE_SECONDS).play()
    return () => {
      action?.fadeOut(FADE_SECONDS)
    }
  }, [actions, animation])

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  )
}
