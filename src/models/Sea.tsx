import { Plane, shaderMaterial } from "@react-three/drei";
import { extend, ThreeElements, useFrame } from "@react-three/fiber";
import { folder, useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

import vertexShader from "@/shaders/vertexShaders.vert";
import fragmentShader from "@/shaders/fragmentShaders.glsl";
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
    uDepthColor: new THREE.Color("#33a7c7"),
    uColorOffset: 0.08,
    uColorMultiplier: 1.1,
    uSmallWavesElevation: 0.15,
    uSmallWavesFrequency: 3,
    uSmallWavesSpeed: 0.2,
    uSmallIterations: 4,
    uMetalness: 0.55,
    uRoughness: 0.25,
    uLightDirection: new THREE.Vector3(-1.5, 1, 0),
    uReflectionColor: new THREE.Color("#eef6f8"),
  },
  vertexShader,
  fragmentShader
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
      uMetalness: number;
      uRoughness: number;
      uLightDirection: THREE.Vector3;
      uReflectionColor: THREE.Color | string;
    };
  }
}

export function RagingSea() {
  const { characterRef, shipRef } = useGame(
    useShallow((s) => ({ characterRef: s.characterRef, shipRef: s.shipRef }))
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
    metalness,
    roughness,
    reflectionColor,
  } = useControls({
    Water: folder({
      Ocean: folder({
        surfaceColor: "#99e5e1",
        depthColor: "#33a7c7",
        colorOffset: 0.08,
        colorMultiplier: 1.1,
        animate: true,
      }),
      Reflection: folder({
        metalness: { value: 0.55, min: 0, max: 1, step: 0.01 },
        roughness: { value: 0.25, min: 0, max: 1, step: 0.01 },
        reflectionColor: "#eef6f8",
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
        <Plane args={[100, 100, 55, 55]} castShadow receiveShadow>
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
            uMetalness={metalness}
            uRoughness={roughness}
            uLightDirection={new THREE.Vector3(1, 1, 0.5)}
            uReflectionColor={reflectionColor}
          />
        </Plane>
      </RigidBody>
      {/* make a rigidbody cube around the close sea */}
      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, -5, -50]}
        rotation-x={-Math.PI / 2}
      >
        <CuboidCollider args={[50, 5, 50]} />
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={false}
        position={[0, -5, 50]}
        rotation-x={-Math.PI / 2}
      >
        <CuboidCollider args={[50, 5, 50]} />
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={false}
        position={[50, -5, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <CuboidCollider args={[50, 5, 50]} />
      </RigidBody>

      <RigidBody
        type="fixed"
        colliders={false}
        position={[-50, -5, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      >
        <CuboidCollider args={[50, 5, 50]} />
      </RigidBody>

      {/* far sea */}
      <Plane
        args={[1000, 1000, 55, 55]}
        position={[0, -0.1, -200]}
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
          uMetalness={metalness}
          uRoughness={roughness}
          uLightDirection={new THREE.Vector3(1, 1, 0.5)}
          uReflectionColor={reflectionColor}
        />
      </Plane>

      {/* fog */}

    </>
  );
}
