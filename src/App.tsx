import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense } from "react";
import Ecctrl, { EcctrlAnimation, EcctrlJoystick } from "ecctrl";

import Lights from "./Lights";
import Map from "./Map";
import PirateCaptain from "./CharacterModel";

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

const characterURL = "./Pirate Captain-transformed.glb";

const animationSet = {
  idle: "CharacterArmature|CharacterArmature|CharacterArmature|Idle|CharacterArmature|Idle",
  walk: "CharacterArmature|CharacterArmature|CharacterArmature|Walk|CharacterArmature|Walk",
  run: "CharacterArmature|CharacterArmature|CharacterArmature|Run|CharacterArmature|Run",
  jump: "CharacterArmature|CharacterArmature|CharacterArmature|Jump|CharacterArmature|Jump",
  jumpIdle:
    "CharacterArmature|CharacterArmature|CharacterArmature|Jump_Idle|CharacterArmature",
  jumpLand:
    "CharacterArmature|CharacterArmature|CharacterArmature|Jump_Land|CharacterArmature",
  fall: "CharacterArmature|CharacterArmature|CharacterArmature|Duck|CharacterArmature|Duck", // This is for falling from high sky
  action1:
    "CharacterArmature|CharacterArmature|CharacterArmature|Sword|CharacterArmature|Swo",
  action2:
    "CharacterArmature|CharacterArmature|CharacterArmature|Death|CharacterArmature|Dea",
  action3:
    "CharacterArmature|CharacterArmature|CharacterArmature|HitReact|CharacterArmature|",
  action4:
    "CharacterArmature|CharacterArmature|CharacterArmature|Wave|CharacterArmature|Wave",
};

export default function App() {
  return (
    <>
      <EcctrlJoystick buttonNumber={5} />
      <Canvas
        shadows
        onPointerDown={(e) => {
          if (e.pointerType === "mouse") {
            (e.target as HTMLElement).requestPointerLock();
          }
        }}
      >
        <Perf position="top-left" minimal />
        {/* <Environment background files="/night.hdr" /> */}
        <Lights />
        <Suspense fallback={null}>
          <Physics timeStep="vary" debug>
            <KeyboardControls map={keyboardMap}>
              <Ecctrl debug animated>
                <EcctrlAnimation
                  characterURL={characterURL}
                  animationSet={animationSet}
                >
                  <PirateCaptain position={[0, -0.9, 0]} />
                </EcctrlAnimation>
              </Ecctrl>
            </KeyboardControls>
            <Map />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}
