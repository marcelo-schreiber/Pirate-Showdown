import { KeyboardControls } from "@react-three/drei";
import Ecctrl, {
  CustomEcctrlRigidBody,
  EcctrlAnimation,
} from "@/libs/ecctrl/src/Ecctrl";
import { PirateModel } from "@/models/Pirate";
import { useGame } from "@/hooks/useGame";
import { useEffect, useRef } from "react";

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

const characterURL = "./models/Pirate Captain.glb";

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

export function PirateEntity() {
  const { debug, setCharacterRef } = useGame();
  const characterRef = useRef<CustomEcctrlRigidBody>(null!);

  useEffect(() => {
    setCharacterRef(characterRef.current);
  }, [characterRef, setCharacterRef]);

  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl
        debug={debug}
        animated
        position={[0, 3, 0]}
        ref={characterRef}
        followLight={false}
        floatingDis={0.2}
        jumpVel={3.25}
        rayOriginOffset={{ x: 0, y: -0.6, z: 0 }}
        slopeUpExtraForce={0.2}
        rayLength={0.5}
        slopeRayLength={0.5}
      >
        <EcctrlAnimation
          characterURL={characterURL}
          animationSet={animationSet}
        >
          <PirateModel position={[0, -0.74, 0]} scale={0.85} />
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
}
