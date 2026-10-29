import { useGLTF } from '@react-three/drei'
import type { CharacterVariant } from './Character'

export const modelUrl = (variant: CharacterVariant) =>
  `${import.meta.env.BASE_URL}models/character-${variant}.glb`

export const preloadCharacter = (variant: CharacterVariant) => useGLTF.preload(modelUrl(variant))
