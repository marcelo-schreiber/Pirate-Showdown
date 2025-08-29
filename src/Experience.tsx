import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useState } from "react";
import { EcctrlJoystick } from "@/libs/ecctrl/src/Ecctrl";

import { Sun } from "@/models/Sun";
import { ShipEntity as Ship } from "@/entities/Ship";
import { PirateEntity } from "@/entities/Pirate";
import type { PointerEvent } from "react";
import { Environment, Loader } from "@react-three/drei";
import * as THREE from "three";
import { useDebug } from "@/hooks/useDebug";
import { Skybox } from "@/models/SkyBox";
import { RagingSea } from "@/models/Sea";
import { Leva } from "leva";

const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    const isUsingTouchScreen = "ontouchstart" in window || navigator.maxTouchPoints > 0;
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

export function Experience() {
  const { debug, setDebug } = useDebug();

  useEffect(() => {
    // if url has hash debug
    if (window.location.hash === "#debug") {
      setDebug(true);
    }
  }, [setDebug]);

  const handleLockControls = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") {
      (e.target as HTMLElement).requestPointerLock();
    }
  };

  return (
    <>
      <EcctrlJoystickControls />
      <Canvas
        shadows
        camera={{
          fov: 65,
          near: 0.1,
          far: 1000,
        }}
        onPointerDown={handleLockControls}
      >
        <Suspense fallback={null}>
          <Skybox />
          {/* <Environment files="/environment/env.exr" background={false} environmentIntensity={0.2}/> */}
          {debug && <Perf position="top-left" />}
          <Sun />
          <Physics>
            <PirateEntity />
            <Ship />
            <RagingSea />
          </Physics>
        </Suspense>
      </Canvas>
      <Loader />
      <Leva hidden={!debug} />
    </>
  );
}
