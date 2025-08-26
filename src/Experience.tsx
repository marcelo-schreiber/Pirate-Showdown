import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useState } from "react";
import { EcctrlJoystick } from "ecctrl";

import Lights from "./models/Lights";
import Ship from "./entities/Ship";
import PirateEntity from "./entities/Pirate";
import type { PointerEvent } from "react";
import { Loader } from "@react-three/drei";

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
  return <>{isTouchScreen && <EcctrlJoystick buttonNumber={5} />}</>;
};

export default function Experience() {
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
          <Perf position="top-left" minimal />
          {/* <Environment background files="/night.hdr" /> */}
          <Lights />
          <Physics debug>
            <PirateEntity />
            <Ship />
          </Physics>
        </Suspense>
      </Canvas>
      <Loader />
    </>
  );
}
