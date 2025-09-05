import { Plane, shaderMaterial } from "@react-three/drei";
import { extend, ThreeElements, useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

import vertexShader from "@/shaders/vertexShaders.vert";
import fragmentShader from "@/shaders/fragmentShaders.frag";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useGame } from "@/hooks/useGame";
import { useShallow } from "zustand/react/shallow";

const RagingSeaMaterial = shaderMaterial(
  {
    uTime: 1,
    uBigWavesElevation: 0.8,
    uBigWavesFrequency: [0.2, 0.7],
    uBigWavesSpeed: 0.75,
    uSurfaceColor: new THREE.Color("#99e5e1"),
    uDepthColor: new THREE.Color("#26a0c2"),
    uColorOffset: 0.08,
    uColorMultiplier: 1.1,
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
  const { characterRef, shipRef } = useGame(
    useShallow((s) => ({ characterRef: s.characterRef, shipRef: s.shipRef })),
  );
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
    Ocean: folder({
      surfaceColor: "#99e5e1",
      depthColor: "#26a0c2",
      colorOffset: 0.08,
      colorMultiplier: 1.1,
      animate: true,
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

  return (
    <>
      <RigidBody type="fixed" colliders={false} rotation-x={-Math.PI / 2}>
        <CuboidCollider
          args={[50, 50, 50]}
          position={[0, 0, -50.1]}
          sensor
          onIntersectionEnter={() => {
            if (characterRef.current) {
              const targetPos = shipRef.current?.translation() || {
                x: 0,
                y: 0,
                z: 0,
              };
              targetPos.y += 2; // slightly above
              characterRef.current.group?.setTranslation(targetPos, true);
            }
          }}
        />
        <Plane args={[100, 100, 55, 55]}>
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
      <Plane args={[300, 300, 28, 28]} rotation-x={-Math.PI / 2}>
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
