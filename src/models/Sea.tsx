import { Plane, shaderMaterial } from "@react-three/drei";
import { extend, ThreeElements, useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

import vertexShader from "../shaders/vertexShaders.vert";
import fragmentShader from "../shaders/fragmentShaders.frag";
import { RigidBody } from "@react-three/rapier";
import { useGame } from "@/hooks/useGame";

const RagingSeaMaterial = shaderMaterial(
  {
    uTime: 1,
    uBigWavesElevation: 0.8,
    uBigWavesFrequency: [0.2, 0.7],
    uBigWavesSpeed: 0.75,
    uSurfaceColor: new THREE.Color("#c1e4fe"),
    uDepthColor: new THREE.Color("#0066b3"),
    uColorOffset: 0.08,
    uColorMultiplier: 1.4,
    uSmallWavesElevation: 0.15,
    uSmallWavesFrequency: 3,
    uSmallWavesSpeed: 0.2,
    uSmallIterations: 4,
  },
  vertexShader,
  fragmentShader,
);
RagingSeaMaterial.key = `$${Math.random()}`;
extend({ RagingSeaMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    ragingSeaMaterial: unknown & {
      ref?: React.Ref<unknown>;
      key: string;
      uTime?: number;
      uBigWavesElevation: number;
      uBigWavesFrequency: [number, number];
      uBigWavesSpeed: number;
      uSurfaceColor: THREE.Color | string;
      uDepthColor: THREE.Color | string;
      uColorOffset: number;
      uColorMultiplier: number;
      uSmallWavesElevation: number;
      uSmallWavesFrequency: number;
      uSmallWavesSpeed: number;
      uSmallIterations: number;
    };
  }
}

export function RagingSea() {
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
    "Ocean colors": folder({
      surfaceColor: "#27aace",
      depthColor: "#26a0c2",
      colorOffset: 0.08,
      colorMultiplier: 1.4,
    }),
    "Big waves": folder({
      bigWavesElevation: 0.55,
      bigWavesFrequency: [0.16, 0.7],
      bigWaveSpeed: 0.75,
    }),
    "Small waves": folder({
      smallWavesElevation: 0.2,
      smallWavesFrequency: 3,
      smallWavesSpeed: 0.2,
      smallIterations: 4,
    }),
  });
  const closeShaderRef = useRef<ThreeElements["ragingSeaMaterial"]>(null!);
  const farShaderRef = useRef<ThreeElements["ragingSeaMaterial"]>(null!);

  useFrame((_, delta) => {
    if (animate) {
      if (closeShaderRef.current && closeShaderRef.current.uTime) {
        closeShaderRef.current.uTime += delta;
      }
      if (farShaderRef.current && farShaderRef.current.uTime) {
        farShaderRef.current.uTime += delta;
      }
    }
  });

  const { characterRef } = useGame();

  return (
    <>
      <RigidBody
        onCollisionEnter={() => {
          if (characterRef) {
            characterRef.group?.setTranslation({ x: 0, y: 2, z: 0 }, true);
          }
        }}
        type="fixed"
        colliders="cuboid"
        position-y={-0.67}
        rotation-x={-Math.PI / 2}
      >
        <Plane args={[100, 100, 55, 55]} receiveShadow>
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
      </RigidBody>
      <Plane
        args={[300, 300, 28, 28]}
        receiveShadow
        position-y={-1.8}
        rotation-x={-Math.PI / 2}
      >
        <ragingSeaMaterial
          key={RagingSeaMaterial.key}
          ref={farShaderRef}
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
  );
}
