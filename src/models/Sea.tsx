import { Plane, shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { folder, useControls } from 'leva'
import  { useRef } from 'react'
import * as THREE from 'three'

import vertexShader from "../shaders/vertexShaders.vert"
import fragmentShader from "../shaders/fragmentShaders.frag"

const RagingSeaMaterial = shaderMaterial(
  {
    uTime: 1,
    uBigWavesElevation: 0.8,
    uBigWavesFrequency: [0.2, 0.7],
    uBigWavesSpeed: 0.75,
    uSurfaceColor: new THREE.Color('#c1e4fe'),
    uDepthColor: new THREE.Color('#0066b3'),
    uColorOffset: 0.08,
    uColorMultiplier: 1.4,
    uSmallWavesElevation: 0.15,
    uSmallWavesFrequency: 3,
    uSmallWavesSpeed: 0.2,
    uSmallIterations: 4,
  },
  vertexShader,
  fragmentShader,
)
RagingSeaMaterial.key = `$${Math.random()}`
extend({ RagingSeaMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    ragingSeaMaterial: unknown
  }
}

export default function RagingSea() {
  const {
    animate,
    bigWavesElevation,
    bigWavesFrequency,
    bigWaveSpeed,
    surfaceColor,
    depthColor,
    colorOffset,
    colorMultiplier,
    smallWavesElevation,
    smallWavesFrequency,
    smallWavesSpeed,
    smallIterations,
  } = useControls({
    animate: true,
    colors: folder({ surfaceColor: '#c1e4fe', depthColor: '#0066b3', colorOffset: 0.08, colorMultiplier: 1.4 }),
    bigWaves: folder({ bigWavesElevation: 0.8, bigWavesFrequency: [0.2, 0.7], bigWaveSpeed: 0.75 }),
    smallWaves: folder({ smallWavesElevation: 0.15, smallWavesFrequency: 3, smallWavesSpeed: 0.2, smallIterations: 4 }),
  })
  const closeShaderRef = useRef<any>(null!)
  useFrame((_, delta) => {if (animate) {
    closeShaderRef.current.uTime += delta
  }})
  return (
    <>
    <Plane  args={[100, 100, 60, 60]} receiveShadow rotation-x={-Math.PI / 2}>
      <ragingSeaMaterial
        key={RagingSeaMaterial.key}
        ref={closeShaderRef}
        uBigWavesElevation={bigWavesElevation}
        uBigWavesFrequency={bigWavesFrequency}
        uBigWavesSpeed={bigWaveSpeed}
        uSurfaceColor={surfaceColor}
        uDepthColor={depthColor}
        uColorOffset={colorOffset}
        uColorMultiplier={colorMultiplier}
        uSmallWavesElevation={smallWavesElevation}
        uSmallWavesFrequency={smallWavesFrequency}
        uSmallWavesSpeed={smallWavesSpeed}
        uSmallIterations={smallIterations}
      />
    </Plane>
    </>
  )
}

