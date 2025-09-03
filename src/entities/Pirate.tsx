import Ecctrl, {
  CustomEcctrlRigidBody,
  EcctrlAnimation,
  useJoystickControls,
} from "@/libs/ecctrl/Ecctrl";
import { PirateModel } from "@/models/Pirate";
import { useGame } from "@/hooks/useGame";
import { RefObject, useEffect, useRef, useState } from "react";
import { useButtonHold } from "@/hooks/useKeyHold";
import { useShallow } from "zustand/react/shallow";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import type { ImpulseJoint } from "@dimforge/rapier3d-compat";
import { Quaternion, Vector3 } from "three";

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

function localToWorld(
  shipRef: RefObject<RapierRigidBody>,
  localOffset: Vector3,
) {
  if (!shipRef.current) return new Vector3();

  const pos = shipRef.current.translation(); // world pos
  const rot = shipRef.current.rotation(); // quaternion

  const quat = new Quaternion(rot.x, rot.y, rot.z, rot.w);

  // world position = shipPos + shipRot * localOffset
  return localOffset
    .clone()
    .applyQuaternion(quat)
    .add(new Vector3(pos.x, pos.y, pos.z));
}

export function PirateEntity() {
  const characterRef = useRef<CustomEcctrlRigidBody>(null!);
  const localCharacterRef = useRef<RapierRigidBody>(null!);
  const { rapier, world } = useRapier();
  const [joint, setJoint] = useState<ImpulseJoint | null>(null);

  const { debug, setCharacterRef, shipRef } = useGame(
    useShallow((s) => ({
      debug: s.debug,
      setCharacterRef: s.setCharacterRef,
      shipRef: s.shipRef,
    })),
  );

  const joystickButton = useJoystickControls(
    useShallow((s) => s.curButton5Pressed),
  );
  const isHoldingE = useButtonHold("e", 500);

  const toggleJoint = () => {
    if (!localCharacterRef?.current || !shipRef?.current) return;

    const pirate = localCharacterRef.current;
    const ship = shipRef.current;

    if (joint) {
      world.removeImpulseJoint(joint, true);
      setJoint(null);
    } else {
      // pick world lock position (e.g. pirate's current pos)
      const rightRedXOffset = new Vector3(-0.1, 1.801, -0.7);
      const leftRedXOffset = new Vector3(0.1, 1.801, 0.7);

      const leftRedXAngle = 3;
      const rightRedXAngle = 0.3;

      const rightDockWorld = localToWorld(shipRef, rightRedXOffset);
      const leftDockWorld = localToWorld(shipRef, leftRedXOffset);

      const piratePos = pirate.translation();
      const pirateVec = new Vector3(piratePos.x, piratePos.y, piratePos.z);

      // only lock if close enough
      if (pirateVec.distanceTo(rightDockWorld) > 1.0 && pirateVec.distanceTo(leftDockWorld) > 1.0) {
        console.info("Too far from left and right docking points");
        return;
      }

      const isRightClosest = pirateVec.distanceTo(rightDockWorld) < pirateVec.distanceTo(leftDockWorld);

      const closestRedXOffset = isRightClosest ? rightRedXOffset : leftRedXOffset;
      const closestRedXAngle = isRightClosest ? rightRedXAngle : leftRedXAngle;

      // create joint with local anchors
      const params = rapier.JointData.fixed(
        { x: 0, y: 0, z: 0 }, // pirate local anchor
        { x: 0, y: 1, z: 0, w: closestRedXAngle },
        { x: closestRedXOffset.x, y: closestRedXOffset.y, z: closestRedXOffset.z },
        { x: 0, y: 0, z: 0, w: 1 },
      );

      const newJoint = world.createImpulseJoint(params, pirate, ship, true);
      setJoint(newJoint);
    }
  };

  useEffect(() => {
    if (isHoldingE || joystickButton) {
      toggleJoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHoldingE, joystickButton]);

  return (
    <Ecctrl
      debug={debug}
      animated={joint == null}
      position={[0, 3, 0]}
      ref={(r) => {
        if (r) {
          characterRef.current = r;
          localCharacterRef.current = r.group!;
          setCharacterRef(characterRef);
        }
      }}
      followLight={false}
      floatingDis={0.2}
      jumpVel={3.25}
      rayOriginOffset={{ x: 0, y: -0.6, z: 0 }}
      slopeUpExtraForce={0.2}
      rayLength={0.5}
      slopeRayLength={0.5}
      camCollision={true}
    >
      <EcctrlAnimation characterURL={characterURL} animationSet={animationSet}>
        <PirateModel
          position={[0, -0.74, 0]}
          scale={0.85}
          onClick={toggleJoint}
        />
      </EcctrlAnimation>
    </Ecctrl>
  );
}
