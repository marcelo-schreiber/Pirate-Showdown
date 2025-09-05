import { useGame } from "@/hooks/useGame";
import { localToWorld } from "@/utils/localToWorld";
import { pirateOptions } from "@/utils/PirateOptions";
import { areVectorsCloseEnough } from "@/utils/vectorCompare";
import { useFrame } from "@react-three/fiber";
import { useRapier } from "@react-three/rapier";
import { JSX, useEffect, useRef } from "react";
import { BufferGeometry, Quaternion, Vector3 } from "three";
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
  steps = 200,
  startPos,
  startVel,
  color = "yellow",
  elevationDeg = 0,
  ...props
}: {
  steps?: number;
  startPos?: Vector3;
  startVel?: Vector3; // optional override of computed forward velocity
  color?: string;
  elevationDeg?: number; // additional upward pitch in degrees applied to computed forward velocity
} & JSX.IntrinsicElements["line"]) {
  const {
    world: { gravity, timestep },
  } = useRapier();

  const { joint, characterRef, shipRef } = useGame(
    useShallow((s) => ({
      joint: s.activeJoint,
      characterRef: s.characterRef,
      shipRef: s.shipRef,
    })),
  );

  // Refs for performant per-frame updates
  const lineRef = useRef<THREE.Line>(null!);
  const positionsRef = useRef<Float32Array>(new Float32Array(steps * 3));
  const geometryRef = useRef<BufferGeometry>(new BufferGeometry());

  // Reallocate buffers if steps changes
  useEffect(() => {
    positionsRef.current = new Float32Array(steps * 3);
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsRef.current, 3),
    );
  }, [steps]);

  // Initialize geometry once
  useEffect(() => {
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsRef.current, 3),
    );
  }, []);

  useFrame((state) => {
    const line = lineRef.current;
    if (!line) return;
    if (!joint || !characterRef?.current?.group || !shipRef?.current) {
      line.visible = false;
      return;
    }
    if (areVectorsCloseEnough(joint.anchor2(), pirateOptions.centerRudderX.offset)) {
      // don't show trajectory when docked at center (steering) position
      line.visible = false;
      return;
    }

    line.visible = true;

    const gravityVec = new THREE.Vector3(gravity.x, gravity.y, gravity.z);

    // Origin position
    let origin: Vector3;
    if (startPos) {
      origin = startPos.clone();
    } else {
      origin = new THREE.Vector3().copy(joint.anchor2());
      origin = localToWorld(shipRef, origin);
      // make it lower by 0.3
      origin.y -= 0.3;
    }

    // Base velocity
    let baseVel: Vector3;
    if (startVel) {
      baseVel = startVel.clone();
    } else {
      baseVel = getForward(joint.frameX1());
      baseVel = localToWorld(shipRef, baseVel)
        .sub(shipRef.current.translation())
        .normalize()
        .multiplyScalar(25); // default scalar speed

      // Apply additional elevation (pitch up) if requested
      if (elevationDeg !== 0) {
        const dir = baseVel.clone().normalize();
        const up = new THREE.Vector3(0, 1, 0);
        let axis = new THREE.Vector3().crossVectors(dir, up).normalize(); // right vector
        if (axis.lengthSq() === 0) {
          // forward is parallel to up; choose arbitrary right axis
          axis = new THREE.Vector3(1, 0, 0);
        }
        const angleRad = (elevationDeg * Math.PI) / 180;
        const q = new THREE.Quaternion().setFromAxisAngle(axis, angleRad);
        dir.applyQuaternion(q).normalize();
        baseVel = dir.multiplyScalar(baseVel.length());
      }
    }

    // Dynamic velocity variation (sawtooth pattern similar to prior console output)
    const t = state.clock.getElapsedTime();
    const magnitudeScale = 0.5 + (t % 1); // range 0.5..1.5 (adjustable)
    const dynVel = baseVel.multiplyScalar(magnitudeScale);

    // Integrate trajectory using simple Euler integration
    const pos = origin.clone();
    const vel = dynVel.clone();

    const positions = positionsRef.current;
    for (let i = 0; i < steps; i++) {
      const idx = i * 3;
      positions[idx] = pos.x;
      positions[idx + 1] = pos.y;
      positions[idx + 2] = pos.z;

      // v = v + g * dt
      vel.addScaledVector(gravityVec, timestep);
      // p = p + v * dt
      pos.addScaledVector(vel, timestep);
    }

    const attr = geometryRef.current.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    attr.needsUpdate = true;
    geometryRef.current.computeBoundingSphere();
  });

  if (!geometryRef.current) return null;

  return (
    <primitive
      object={
        (lineRef.current ||= new THREE.Line(
          geometryRef.current,
          new THREE.LineBasicMaterial({
            color,
            opacity: 0.35,
            transparent: true,
          }),
        ))
      }
      {...props}
    />
  );
}
