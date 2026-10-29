import { Color } from 'three'

// 1 = full day, 0 = full night. Written by the day/night driver, read every frame by lights,
// sky and night effects without re-rendering React
export const environment = { daylight: 1 }

export type LightingPreset = {
  skyTop: string
  skyHorizon: string
  hemisphereSky: string
  hemisphereGround: string
  hemisphereIntensity: number
  sunColor: string
  sunIntensity: number
  moonColor: string
  moonIntensity: number
}

// Spec §3.4: warm pastels by day
export const dayLighting: LightingPreset = {
  skyTop: '#8ec9ec',
  skyHorizon: '#e4f3fb',
  hemisphereSky: '#fff6e8',
  hemisphereGround: '#c9b293',
  hemisphereIntensity: 1.05,
  sunColor: '#fff1d6',
  sunIntensity: 2,
  moonColor: '#9db4ff',
  moonIntensity: 0,
}

// cool blue-violet by night; the warm lanterns provide the contrast
export const nightLighting: LightingPreset = {
  skyTop: '#151b3d',
  skyHorizon: '#262c5c',
  hemisphereSky: '#5b67b3',
  hemisphereGround: '#2b2744',
  hemisphereIntensity: 0.5,
  sunColor: '#ff9f6b',
  sunIntensity: 0,
  moonColor: '#9db4ff',
  moonIntensity: 0.9,
}

export type Lighting = {
  skyTop: Color
  skyHorizon: Color
  hemisphereSky: Color
  hemisphereGround: Color
  hemisphereIntensity: number
  sunColor: Color
  sunIntensity: number
  moonColor: Color
  moonIntensity: number
}

const colorKeys = [
  'skyTop',
  'skyHorizon',
  'hemisphereSky',
  'hemisphereGround',
  'sunColor',
  'moonColor',
] as const
const scratch = new Color()

// Blends night → day; writes into `out` to avoid per-frame allocations
export function lightingAt(daylight: number, out: Lighting): Lighting {
  for (const key of colorKeys)
    out[key].set(nightLighting[key]).lerp(scratch.set(dayLighting[key]), daylight)
  const lerp = (a: number, b: number) => a + (b - a) * daylight
  out.hemisphereIntensity = lerp(nightLighting.hemisphereIntensity, dayLighting.hemisphereIntensity)
  out.sunIntensity = lerp(nightLighting.sunIntensity, dayLighting.sunIntensity)
  out.moonIntensity = lerp(nightLighting.moonIntensity, dayLighting.moonIntensity)
  return out
}

export const createLighting = (): Lighting => ({
  skyTop: new Color(),
  skyHorizon: new Color(),
  hemisphereSky: new Color(),
  hemisphereGround: new Color(),
  hemisphereIntensity: 0,
  sunColor: new Color(),
  sunIntensity: 0,
  moonColor: new Color(),
  moonIntensity: 0,
})

// shared per-frame result, computed once by <Lighting> and read by <Sky>
export const currentLighting = lightingAt(1, createLighting())
