import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useState } from "react";
import { EcctrlJoystick } from "@/libs/ecctrl/Ecctrl";

import { Sun } from "@/models/Sun";
import { ShipEntity as Ship } from "@/entities/Ship";
import { PirateEntity } from "@/entities/Pirate";
import type { PointerEvent } from "react";
import {
  Environment,
  Float,
  KeyboardControls,
  Loader,
} from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/hooks/useGame";
import { Skybox } from "@/models/SkyBox";
import { RagingSea } from "@/models/Sea";
import { Leva, useControls } from "leva";
import {
  EffectComposer,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useShallow } from "zustand/react/shallow";

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

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action1", keys: ["1"] },
  { name: "action2", keys: ["2"] },
  { name: "action3", keys: ["3"] },
  { name: "action4", keys: ["KeyF"] },
];

const handleLockControls = (e: PointerEvent<HTMLDivElement>) => {
  if (e.pointerType === "mouse") {
    (e.target as HTMLElement).requestPointerLock();
  }
};

export function Experience() {
  const { debug, setDebug } = useGame(
    useShallow((s) => ({ debug: s.debug, setDebug: s.setDebug })),
  );

  useEffect(() => {
    if (window.location.hash === "#debug") {
      setDebug(true);
    }
  }, [setDebug]);

  const { speed, rotation, floatIntensity } = useControls("Float", {
    speed: { value: 5.1, min: 0, max: 10 },
    rotation: { value: 0.09, min: 0, max: 1 },
    floatIntensity: { value: 0.38, min: 0, max: 1 },
  });

  const { ToneMappingModeControl } = useControls("Tone Mapping", {
    ToneMappingModeControl: {
      value: "NEUTRAL",
      options: Object.keys(ToneMappingMode),
    },
  });

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 60,
          near: 0.1,
          far: 400,
        }}
        onPointerDown={handleLockControls}
      >
        <Suspense fallback={null}>
          <EffectComposer>
            <ToneMapping
              mode={
                ToneMappingMode[
                  ToneMappingModeControl as keyof typeof ToneMappingMode
                ]
              }
            />
            <Vignette />
          </EffectComposer>
          <Skybox />
          <Environment
            files="/environment/env.exr"
            background={false}
            environmentIntensity={1.06}
          />
          <Perf position="top-left" minimal={!debug} />
          <Sun />
          <Physics debug={debug}>
            <Float
              speed={speed}
              rotationIntensity={rotation}
              floatIntensity={floatIntensity}
            >
              <KeyboardControls map={keyboardMap}>
                <PirateEntity />
              </KeyboardControls>
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
