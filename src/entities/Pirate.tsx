import Ecctrl, {
  CustomEcctrlRigidBody,
  EcctrlAnimation,
  useJoystickControls,
} from "@/libs/ecctrl/Ecctrl";
import { PirateModel } from "@/models/Pirate";
import { useGame } from "@/hooks/useGame";
import { useEffect, useRef } from "react";
import { useButtonHold } from "@/hooks/useKeyHold";
import { useShallow } from "zustand/react/shallow";
import { RapierRigidBody, useRapier } from "@react-three/rapier";
import { Vector3 } from "three";
import { localToWorld } from "@/utils/localToWorld";
import { pirateOptions } from "@/utils/PirateOptions";
import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Controls } from "@/Experience";
import { areVectorsCloseEnough } from "@/utils/vectorCompare";

export function PirateEntity() {
  const characterRef = useRef<CustomEcctrlRigidBody>(null!);
  const localCharacterRef = useRef<RapierRigidBody>(null!);
  const { rapier, world } = useRapier();

  const { debug, setCharacterRef, shipRef, joint, setJoint, resetAnimation } = useGame(
    useShallow((s) => ({
      debug: s.debug,
      setCharacterRef: s.setCharacterRef,
      shipRef: s.shipRef,
      joint: s.activeJoint,
      setJoint: s.setActiveJoint,
      resetAnimation: s.reset,
    })),
  );

  const joystickButton = useJoystickControls((s) => s.curButton3Pressed);
  const [, get] = useKeyboardControls<Controls>();

  const isHoldingE = useButtonHold("e", 500);

  const toggleJoint = () => {
    if (!localCharacterRef?.current || !shipRef?.current) return;

    const pirate = localCharacterRef.current;
    const ship = shipRef.current;

    if (joint) {
      world.removeImpulseJoint(joint, true);
      setJoint(null);
    } else {
      const rightDockWorld = localToWorld(shipRef, pirateOptions.rightX.offset);
      const leftDockWorld = localToWorld(shipRef, pirateOptions.leftX.offset);
      const centerDockWorld = localToWorld(
        shipRef,
        pirateOptions.centerRudderX.offset,
      );

      const {
        x: piratePosX,
        y: piratePosY,
        z: piratePosZ,
      } = pirate.translation();
      const pirateVec = new Vector3(piratePosX, piratePosY, piratePosZ);

      // only lock if close enough
      const distanceToRight = pirateVec.distanceTo(rightDockWorld);
      const distanceToLeft = pirateVec.distanceTo(leftDockWorld);
      const distanceToCenter = pirateVec.distanceTo(centerDockWorld);

      const smallestDistance = Math.min(
        distanceToRight,
        distanceToLeft,
        distanceToCenter,
      );
      if (smallestDistance > 1.0) {
        console.info("Too far from left and right docking points");
        return;
      }
      const { lock: closestRedXAngle, offset: closestRedXOffset } = [
        { distance: distanceToRight, ...pirateOptions.rightX },
        { distance: distanceToLeft, ...pirateOptions.leftX },
        { distance: distanceToCenter, ...pirateOptions.centerRudderX },
      ].reduce((closest, current) =>
        current.distance < closest.distance ? current : closest,
      );

      // create joint with local anchors
      const params = rapier.JointData.fixed(
        { x: 0, y: 0, z: 0 }, // pirate local anchor
        {
          x: closestRedXAngle.x,
          y: closestRedXAngle.y,
          z: closestRedXAngle.z,
          w: closestRedXAngle.w,
        }, // pirate local anchor rotation
        {
          x: closestRedXOffset.x,
          y: closestRedXOffset.y,
          z: closestRedXOffset.z,
        },
        { x: 0, y: 0, z: 0, w: 1 },
      );

      const newJoint = world.createImpulseJoint(params, pirate, ship, true);
      setJoint(newJoint);

      resetAnimation();
    }
  };

  useEffect(() => {
    if (isHoldingE || joystickButton) {
      toggleJoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHoldingE, joystickButton]);

  useFrame(() => {
    if (!shipRef?.current || !localCharacterRef?.current) return;

    const leftPressed = get().leftward;
    const rightPressed = get().rightward;
    const isOnRudder =
      joint &&
      areVectorsCloseEnough(
        pirateOptions.centerRudderX.offset,
        joint.anchor2(),
      );

    if (isOnRudder) {
      if (leftPressed && !rightPressed) {
        // turn left
        shipRef.current.setAngvel(new Vector3(0, 0.2, 0), true);
      } else if (rightPressed && !leftPressed) {
        // turn right
        shipRef.current.setAngvel(new Vector3(0, -0.2, 0), true);
      } else {
        shipRef.current.setAngvel(new Vector3(0, 0, 0), true);
      }
    } else {
      shipRef.current.setAngvel(new Vector3(0, 0, 0), true);
    }

    const forward = new Vector3(-1, 0, 0);
    forward.applyQuaternion(shipRef.current.rotation());
    forward.multiplyScalar(2);
    shipRef.current.setLinvel(forward, true);
  });

  return (
    <Ecctrl
      debug={debug}
      animated={joint == null}
      disableControl={joint !== null}
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
      maxVelLimit={2.3}
      airDragMultiplier={0.1}
      rayOriginOffset={{ x: 0, y: -0.6, z: 0 }}
      slopeUpExtraForce={0.2}
      rayLength={0.5}
      slopeRayLength={0.5}
      camCollision={true}
      controllerKeys={{
        forward: 12,
        backward: 13,
        leftward: 14,
        rightward: 15,
        jump: 0,
        action2: 1,
        action3: 2,
      }}
    >
      <EcctrlAnimation
        characterURL={pirateOptions.characterUrl}
        animationSet={pirateOptions.animationSet}
      >
        <PirateModel
          position={pirateOptions.initialPosition}
          scale={pirateOptions.scale}
        />
      </EcctrlAnimation>
    </Ecctrl>
  );
}
