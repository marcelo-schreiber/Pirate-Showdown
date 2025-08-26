import { KeyboardControls } from "@react-three/drei";
import Ecctrl, { EcctrlAnimation } from "ecctrl";
import PirateModel from "@/models/Pirate";
import useGame from "@/hooks/useGame";

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

export default function PirateEntity() {
  const { debug } = useGame();
  return (
    <KeyboardControls map={keyboardMap}>
      <Ecctrl debug={debug} animated position={[0, 3, 0]}>
        <EcctrlAnimation
          characterURL={characterURL}
          animationSet={animationSet}
        >
          <PirateModel position={[0, -0.9, 0]} scale={0.88} />
        </EcctrlAnimation>
      </Ecctrl>
    </KeyboardControls>
  );
}
