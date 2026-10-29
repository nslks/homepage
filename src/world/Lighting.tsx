import { dayLighting } from './environment'

const SHADOW_EXTENT = 22

// Sun from the south-east, high enough for short, soft shadows
export function Lighting() {
  return (
    <>
      <hemisphereLight
        args={[
          dayLighting.hemisphereSky,
          dayLighting.hemisphereGround,
          dayLighting.hemisphereIntensity,
        ]}
      />
      <directionalLight
        position={[12, 20, 8]}
        color={dayLighting.sunColor}
        intensity={dayLighting.sunIntensity}
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
    </>
  )
}
