// Lighting presets (spec §3.4); the night preset and blending follow with #29
export type LightingPreset = {
  skyTop: string
  skyHorizon: string
  hemisphereSky: string
  hemisphereGround: string
  hemisphereIntensity: number
  sunColor: string
  sunIntensity: number
}

// warm pastels by day
export const dayLighting: LightingPreset = {
  skyTop: '#8ec9ec',
  skyHorizon: '#e4f3fb',
  hemisphereSky: '#fff6e8',
  hemisphereGround: '#c9b293',
  hemisphereIntensity: 1.05,
  sunColor: '#fff1d6',
  sunIntensity: 2,
}
