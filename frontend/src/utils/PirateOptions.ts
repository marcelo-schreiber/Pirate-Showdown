import { MathUtils, Quaternion, Vector3 } from "three";
import { shipOptions } from "./shipOptions";

export const pirateOptions = Object.freeze({
  animationSet: {
    idle: "CharacterArmature|CharacterArmature|CharacterArmature|Idle|CharacterArmature|Idle",
    walk: "CharacterArmature|CharacterArmature|CharacterArmature|Walk|CharacterArmature|Walk",
    run: "CharacterArmature|CharacterArmature|CharacterArmature|Run|CharacterArmature|Run",
    jump: "CharacterArmature|CharacterArmature|CharacterArmature|Jump|CharacterArmature|Jump",
    jumpIdle:
      "CharacterArmature|CharacterArmature|CharacterArmature|Jump_Idle|CharacterArmature",
    jumpLand:
      "CharacterArmature|CharacterArmature|CharacterArmature|Jump_Land|CharacterArmature",
    fall: "CharacterArmature|CharacterArmature|CharacterArmature|Duck|CharacterArmature|Duck", // This is for falling from high sky
    action2:
      "CharacterArmature|CharacterArmature|CharacterArmature|Sword|CharacterArmature|Swo",
    action3:
      "CharacterArmature|CharacterArmature|CharacterArmature|Idle|CharacterArmature|Idle",
  },
  characterUrl:
    "https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8Uppgjf3t7LsKWgHdT8qJcIZrNeozMGjCyP5Y",

  scale: 0.85,
  initialPosition: new Vector3(0, -0.89, 0),

  leftX: {
    lock: new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      MathUtils.degToRad(180 - 35),
    ),
    offset: shipOptions.redX.leftCannon.offset
      .clone()
      .add(new Vector3(0.03, 0.89, 0)), // 0.8 is character height
  },
  rightX: {
    lock: new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      MathUtils.degToRad(35),
    ),
    offset: shipOptions.redX.rightCannon.offset
      .clone()
      .add(new Vector3(0.03, 0.89, 0)), // 0.8 is character height
  },
  centerRudderX: {
    lock: new Quaternion().setFromAxisAngle(
      new Vector3(0, 1, 0),
      MathUtils.degToRad(90),
    ),
    offset: shipOptions.redX.centerRudder.offset
      .clone()
      .add(new Vector3(0, 0.89, 0)), // 0.8 is character height
  },
});
