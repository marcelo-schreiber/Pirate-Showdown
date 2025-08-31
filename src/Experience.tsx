import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useState } from "react";
import { EcctrlJoystick } from "@/libs/ecctrl/Ecctrl";

import { Sun } from "@/models/Sun";
import { ShipEntity as Ship } from "@/entities/Ship";
import { PirateEntity } from "@/entities/Pirate";
import type { PointerEvent } from "react";
import { Environment, Float, Loader } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/hooks/useGame";
import { Skybox } from "@/models/SkyBox";
import { RagingSea } from "@/models/Sea";
import { Leva, useControls } from "leva";

const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    const isUsingTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    setIsTouchScreen(isUsingTouchScreen);
  }, []);

  return (
    <>
      {isTouchScreen && (
        <EcctrlJoystick
          buttonNumber={5}
          joystickBaseProps={{
            receiveShadow: true,
            material: new THREE.MeshStandardMaterial({ color: "grey" }),
          }}
        />
      )}
    </>
  );
};

const handleLockControls = (e: PointerEvent<HTMLDivElement>) => {
  if (e.pointerType === "mouse") {
    (e.target as HTMLElement).requestPointerLock();
  }
};

export function Experience() {
  const { debug, setDebug } = useGame();

  useEffect(() => {
    // if url has hash debug
    if (window.location.hash === "#debug") {
      setDebug(true);
    }
  }, [setDebug]);

  const {
    speed,
    rotation,
    floatIntensity
  } = useControls("Float", {
    speed: { value: 4.2, min: 0, max: 10 },
    rotation: { value: 0.11, min: 0, max: 1 },
    floatIntensity: { value: 0.4, min: 0, max: 1 },
  })

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 47,
          near: 0.1,
          far: 400,
        }}
        onPointerDown={handleLockControls}
      >
        <Suspense fallback={null}>
          <Skybox />
          <Environment files="/environment/env.exr" background={false} environmentIntensity={1.06}/>
          {debug && <Perf position="top-left" />}
          <Sun />
          <Physics debug={debug} timeStep="vary">
            <Float speed={speed} rotationIntensity={rotation} floatIntensity={floatIntensity}>
              <PirateEntity />
              <Ship />
            </Float>
            <RagingSea />
          </Physics>
        </Suspense>
      </Canvas>
      <Loader />
      <Leva hidden={!debug} />
      <EcctrlJoystickControls />
    </>
  );
}
