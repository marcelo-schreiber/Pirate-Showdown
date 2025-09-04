import { useGame } from "@/hooks/useGame";
import { localToWorld } from "@/utils/localToWorld";
import { useRapier } from "@react-three/rapier";
import { JSX, useMemo } from "react";
import { BufferGeometry, Line, Quaternion } from "three";
import * as THREE from "three";
import { useShallow } from "zustand/react/shallow";

const getForward = (rotation: {
  x: number;
  y: number;
  z: number;
  w: number;
}) => {
  // start with "forward" in local space (z-forward in three.js)
  const forward = new THREE.Vector3(0, 0, -1);

  // swap y and w
  const swapped = {
    x: rotation.x,
    y: rotation.w,
    z: rotation.z,
    w: rotation.y,
  };

  // create quaternion from rotation
  const quat = new Quaternion(swapped.x, swapped.y, swapped.z, swapped.w);

  // apply quaternion to forward vector
  forward.applyQuaternion(quat);

  return forward.normalize();
};

export function Trajectory({
  steps = 100,
  startVel,
  ...props
}: {
  startVel: number;
  steps?: number;
} & JSX.IntrinsicElements["line"]) {
  const {
    world: { gravity, timestep },
  } = useRapier();

  const { joint, characterRef, shipRef } = useGame(
    useShallow((s) => ({
      joint: s.activeJoint,
      characterRef: s.characterRef,
      shipRef: s.shipRef,
    }))
  );

  const points = useMemo(() => {
    if (!joint) return [];
    if (!characterRef?.current?.group) return [];

    const pts = [];
    let pos = new THREE.Vector3().copy(joint.anchor2());
    pos = localToWorld(shipRef!, pos);

    let vel = getForward(joint.frameX1());
    vel = localToWorld(shipRef!, vel).sub(shipRef!.current!.translation()).normalize().multiplyScalar(startVel);

    for (let i = 0; i < steps; i++) {
      pts.push(pos.clone());

      // Euler integration
      vel.addScaledVector(
        new THREE.Vector3(gravity.x, gravity.y, gravity.z),
        timestep
      );
      pos.addScaledVector(vel, timestep);
    }
    return pts;
  }, [joint, characterRef, shipRef, startVel, steps, gravity.x, gravity.y, gravity.z, timestep]);

  const geometry = useMemo(() => {
    return new BufferGeometry().setFromPoints(points);
  }, [points]);

  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: "yellow" }),
    []
  );

  if (!joint) return null;

  return <primitive object={new Line(geometry, material)} {...props} />;
}
