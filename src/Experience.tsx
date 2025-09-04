import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect } from "react";

import { Sun } from "@/models/Sun";
import { ShipEntity as Ship } from "@/entities/Ship";
import { PirateEntity } from "@/entities/Pirate";
import type { PointerEvent } from "react";
import { Environment, KeyboardControls, Loader } from "@react-three/drei";
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
import { useIsMobile } from "@/hooks/useIsMobile";
import { Trajectory } from "@/models/Parabula";
import { EcctrlJoystickControls } from "@/components/EcctrlJoystickControls";
import { Euler, Vector3 } from "three";

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["Shift"] },
  { name: "action2", keys: ["f"] },
  { name: "action3", keys: ["e"] },
];

const handleLockControls = (e: PointerEvent<HTMLDivElement>) => {
  if (e.pointerType === "mouse") {
    (e.target as HTMLElement).requestPointerLock();
  }
};

export function Experience() {
  const { debug, setDebug } = useGame(
    useShallow((s) => ({ debug: s.debug, setDebug: s.setDebug }))
  );

  const isMobile = useIsMobile();

  useEffect(() => {
    if (window.location.hash === "#debug") {
      setDebug(true);
    }
  }, [setDebug]);

  const { ToneMappingModeControl } = useControls("Tone Mapping", {
    ToneMappingModeControl: {
      value: "NEUTRAL" as keyof typeof ToneMappingMode,
      options: Object.keys(ToneMappingMode) as (keyof typeof ToneMappingMode)[],
    },
  });

  const { shipPosition, shipRotation } = useControls("Ship", {
    shipPosition: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
    },
    shipRotation: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
    },
  });

  return (
    <>
      <Canvas
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)}
        camera={{
          fov: 60,
          near: 0.1,
          far: 400,
        }}
        onPointerDown={handleLockControls}
      >
        <Suspense fallback={null}>
          <EffectComposer enabled={!isMobile}>
            <ToneMapping mode={ToneMappingMode[ToneMappingModeControl]} />
            <Vignette />
          </EffectComposer>
          <Skybox />
          <Environment
            files="/environment/env.exr"
            background={false}
            environmentIntensity={1.1}
          />
          <Perf position="top-left" minimal={!debug} />
          <Sun />
          <Physics debug={debug}>
            <KeyboardControls map={keyboardMap}>
              <PirateEntity />
            </KeyboardControls>
            <Ship
              position={
                new Vector3(shipPosition.x, shipPosition.y, shipPosition.z)
              }
              rotation={
                new Euler(shipRotation.x, shipRotation.y, shipRotation.z)
              }
            />
            <RagingSea />
            <Trajectory elevationDeg={10} />
          </Physics>
        </Suspense>
      </Canvas>
      <Loader />
      <Leva hidden={!debug} />
      <EcctrlJoystickControls />
    </>
  );
}
