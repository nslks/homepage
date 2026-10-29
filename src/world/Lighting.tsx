import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { DirectionalLight, HemisphereLight } from 'three'
import { useAppStore } from '../state/store'
import { currentLighting, environment, lightingAt } from './environment'

const SHADOW_EXTENT = 22
const LIGHT_DISTANCE = 24
// horizontal directions of sun (south-east) and moon (north-west)
const SUN_AZIMUTH = Math.atan2(8, 12)
const MOON_AZIMUTH = Math.atan2(-12, -10)

function place(light: DirectionalLight, azimuth: number, elevation: number) {
  const horizontal = Math.cos(elevation) * LIGHT_DISTANCE
  light.position.set(
    Math.cos(azimuth) * horizontal,
    Math.sin(elevation) * LIGHT_DISTANCE,
    Math.sin(azimuth) * horizontal,
  )
}

export function Lighting() {
  const hemisphere = useRef<HemisphereLight>(null)
  const sun = useRef<DirectionalLight>(null)
  const moon = useRef<DirectionalLight>(null)
  useFrame(() => {
    // until the animated transition (#30) lands, the theme switches the light instantly
    environment.daylight = useAppStore.getState().theme === 'day' ? 1 : 0
    const t = environment.daylight
    const lighting = lightingAt(t, currentLighting)
    if (hemisphere.current) {
      hemisphere.current.color.copy(lighting.hemisphereSky)
      hemisphere.current.groundColor.copy(lighting.hemisphereGround)
      hemisphere.current.intensity = lighting.hemisphereIntensity
    }
    // the sun sinks below the horizon as night falls, the moon rises
    if (sun.current) {
      place(sun.current, SUN_AZIMUTH, -0.15 + t * 1.1)
      sun.current.color.copy(lighting.sunColor)
      sun.current.intensity = lighting.sunIntensity
    }
    if (moon.current) {
      place(moon.current, MOON_AZIMUTH, -0.15 + (1 - t) * 1.05)
      moon.current.color.copy(lighting.moonColor)
      moon.current.intensity = lighting.moonIntensity
    }
  })

  return (
    <>
      <hemisphereLight ref={hemisphere} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
        shadow-radius={4}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
      />
      {/* moonlight without shadows: a second shadow map is not worth it at night */}
      <directionalLight ref={moon} />
    </>
  )
}
