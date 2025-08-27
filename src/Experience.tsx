import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useState } from "react";
import { EcctrlJoystick } from "ecctrl";

import Lights from "@/models/Lights";
import Ship from "@/entities/Ship";
import PirateEntity from "@/entities/Pirate";
import type { PointerEvent } from "react";
import { Loader, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import useGame from "@/hooks/useGame";
import Skybox from "@/models/SkyBox";
import RagingSea from "./models/Sea";

const EcctrlJoystickControls = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    // Check if using a touch control device, show/hide joystick
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
      setIsTouchScreen(true);
    } else {
      setIsTouchScreen(false);
    }
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

export default function Experience() {
  const { debug, setDebug } = useGame();

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
          {debug && <Perf position="top-left" minimal />}
          {/* <Environment background files="/night.hdr" /> */}
          <Lights />
          <Physics debug={debug}>
            <PirateEntity />
            <Ship />
          </Physics>
          <RagingSea />
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
