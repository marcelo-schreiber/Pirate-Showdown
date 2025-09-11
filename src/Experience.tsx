import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Perf } from "r3f-perf";
import { Suspense, useEffect, useState } from "react";

import { Sun } from "@/models/Sun";
import { ShipEntity as Ship } from "@/entities/Ship";
import { PirateEntity } from "@/entities/Pirate";
import type { PointerEvent } from "react";
import {
  AdaptiveDpr,
  Environment,
  KeyboardControls,
  Loader,
  Preload,
  useDetectGPU,
} from "@react-three/drei";
import { useGame } from "@/hooks/useGame";
import { RagingSea } from "@/models/Sea";
import { Leva, useControls } from "leva";
import {
  EffectComposer,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useShallow } from "zustand/react/shallow";
import { Trajectory } from "@/models/Parabula";
import { EcctrlJoystickControls } from "@/components/hud/EcctrlJoystickControls";
import { GoBackWarning } from "@/components/hud/GoBackWarning";
import { CenterArrowComputer } from "@/components/hud/CenterArrowComputer";
import { Euler } from "three";

export enum Controls {
  forward = "forward",
  backward = "backward",
  leftward = "leftward",
  rightward = "rightward",
  jump = "jump",
  run = "run",
  action2 = "action2",
  action3 = "action3",
}

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
    useShallow((s) => ({ debug: s.debug, setDebug: s.setDebug })),
  );
  const GPUTier = useDetectGPU();

  const [pausedPhysics, setPausedPhysics] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPausedPhysics(false);
    }, 750);

    return () => clearTimeout(timeout);
  }, []);

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

  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 55,
          near: 0.1,
          far: 400,
        }}
        onPointerDown={handleLockControls}
      >
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <Preload all />
          <EffectComposer
            enabled={GPUTier.tier !== 0 && GPUTier.isMobile === false}
          >
            <ToneMapping mode={ToneMappingMode[ToneMappingModeControl]} />
            <Vignette />
          </EffectComposer>
          <Environment
            files="https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8FulSjqXNxe9nRoJ3MIf2qWEyV86CAY0wBmO4?.ext=.jpg"
            background="only"
            backgroundRotation={new Euler(0, 2.5, 0, "XYZ")}
          />
          <Environment
            files="https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8Dy8Xgmr3WBtdLC1pe0TUoNgRH7ZSO2rxKJ5i?ext=.exr"
            background={false}
            environmentIntensity={1.6}
          />
          <Perf position="top-left" minimal={!debug} />
          <Sun />
          <Physics debug={debug} timeStep="vary" paused={pausedPhysics}>
            <KeyboardControls map={keyboardMap}>
              <PirateEntity />
            </KeyboardControls>
            <Ship />
            <RagingSea />
            <Trajectory elevationDeg={10} />
          </Physics>
          <CenterArrowComputer />
        </Suspense>
      </Canvas>
      <Loader />
      <Leva hidden={!debug} />
      <GoBackWarning />
      <EcctrlJoystickControls />
    </>
  );
}
