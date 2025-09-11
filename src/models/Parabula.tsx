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
  color = "lightgrey",
  elevationDeg = 0,
  stripWidth = 0.4,
  ...props
}: {
  steps?: number;
  startPos?: Vector3;
  startVel?: Vector3; // optional override of computed forward velocity
  color?: string;
  elevationDeg?: number; // additional upward pitch in degrees applied to computed forward velocity
  stripWidth?: number; // width of the parabolic strip
} & JSX.IntrinsicElements["mesh"]) {
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
  const meshRef = useRef<THREE.Mesh>(null!);
  const positionsRef = useRef<Float32Array>(new Float32Array(steps * 2 * 3)); // 2 vertices per step for strip
  const indicesRef = useRef<Uint16Array>(new Uint16Array((steps - 1) * 6)); // 2 triangles per segment
  const geometryRef = useRef<BufferGeometry>(new BufferGeometry());

  // Reallocate buffers if steps changes
  useEffect(() => {
    positionsRef.current = new Float32Array(steps * 2 * 3);
    indicesRef.current = new Uint16Array((steps - 1) * 6);
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsRef.current, 3),
    );
    geometryRef.current.setIndex(
      new THREE.BufferAttribute(indicesRef.current, 1),
    );

    // Set up indices for triangle strip
    const indices = indicesRef.current;
    for (let i = 0; i < steps - 1; i++) {
      const baseIndex = i * 6;
      const vertIndex = i * 2;

      // First triangle
      indices[baseIndex] = vertIndex;
      indices[baseIndex + 1] = vertIndex + 1;
      indices[baseIndex + 2] = vertIndex + 2;

      // Second triangle
      indices[baseIndex + 3] = vertIndex + 1;
      indices[baseIndex + 4] = vertIndex + 3;
      indices[baseIndex + 5] = vertIndex + 2;
    }
  }, [steps]);

  // Initialize geometry once
  useEffect(() => {
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsRef.current, 3),
    );
    geometryRef.current.setIndex(
      new THREE.BufferAttribute(indicesRef.current, 1),
    );
  }, []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (!joint || !characterRef?.current?.group || !shipRef?.current) {
      mesh.visible = false;
      return;
    }
    if (
      areVectorsCloseEnough(joint.anchor2(), pirateOptions.centerRudderX.offset)
    ) {
      // don't show trajectory when docked at center (steering) position
      mesh.visible = false;
      return;
    }

    mesh.visible = true;

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

    // Calculate right vector for strip width
    const forward = dynVel.clone().normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(forward, up).normalize();

    // Integrate trajectory using simple Euler integration
    const pos = origin.clone();
    const vel = dynVel.clone();

    const positions = positionsRef.current;
    for (let i = 0; i < steps; i++) {
      // Calculate positions for both sides of the strip
      const leftPos = pos.clone().addScaledVector(right, -stripWidth / 2);
      const rightPos = pos.clone().addScaledVector(right, stripWidth / 2);

      // Left vertex
      const leftIdx = i * 6; // 2 vertices * 3 components per step
      positions[leftIdx] = leftPos.x;
      positions[leftIdx + 1] = leftPos.y;
      positions[leftIdx + 2] = leftPos.z;

      // Right vertex
      const rightIdx = leftIdx + 3;
      positions[rightIdx] = rightPos.x;
      positions[rightIdx + 1] = rightPos.y;
      positions[rightIdx + 2] = rightPos.z;

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
        (meshRef.current ||= new THREE.Mesh(
          geometryRef.current,
          new THREE.MeshBasicMaterial({
            color,
            opacity: 0.35,
            transparent: true,
            side: THREE.DoubleSide,
          }),
        ))
      }
      {...props}
    />
  );
}
