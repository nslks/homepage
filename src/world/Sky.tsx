import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { BackSide, Color, type Mesh, ShaderMaterial } from 'three'
import { currentLighting, dayLighting } from './environment'

// Large inverted sphere with a vertical gradient; centred on the camera so it never clips
export function Sky() {
  const sphere = useRef<Mesh>(null)
  const material = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        uniforms: {
          top: { value: new Color(dayLighting.skyTop) },
          horizon: { value: new Color(dayLighting.skyHorizon) },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDirection;
          void main() {
            vDirection = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 top;
          uniform vec3 horizon;
          varying vec3 vDirection;
          void main() {
            gl_FragColor = vec4(mix(horizon, top, smoothstep(-0.25, 0.55, vDirection.y)), 1.0);
            #include <colorspace_fragment>
          }`,
      }),
    [],
  )

  useFrame(({ camera }) => {
    sphere.current?.position.copy(camera.position)
    material.uniforms.top!.value.copy(currentLighting.skyTop)
    material.uniforms.horizon!.value.copy(currentLighting.skyHorizon)
  })

  return (
    <mesh ref={sphere} material={material} renderOrder={-1} frustumCulled={false} scale={300}>
      <sphereGeometry args={[1, 32, 16]} />
    </mesh>
  )
}
