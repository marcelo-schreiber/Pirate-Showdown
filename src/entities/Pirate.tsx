import { useKeyboardControls } from "@react-three/drei";
import Ecctrl, {
  CustomEcctrlRigidBody,
  EcctrlAnimation,
} from "@/libs/ecctrl/Ecctrl";
import { PirateModel } from "@/models/Pirate";
import { useGame } from "@/hooks/useGame";
import { useEffect, useRef } from "react";
import { useKeyHold } from "@/hooks/useKeyHold";

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterRef]);

  const FPressed = useKeyboardControls((state) => state.action4);

  useKeyHold(FPressed, 1.5, () => {
    console.log("F key held for more than 1.5 seconds (only once per hold)");
  });

  return (
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
      <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
        <PirateModel position={[0, -0.74, 0]} scale={0.85} />
      </EcctrlAnimation>
    </Ecctrl>
  );
}
