import { useRapier } from "@react-three/rapier";
import { JSX, useMemo } from "react";
import { BufferGeometry, Line } from "three";
import * as THREE from "three";

export function Trajectory({
  startPos,
  startVel,
  steps = 500,
  ...props
}: {
  startPos: THREE.Vector3;
  startVel: THREE.Vector3;
  steps?: number;
} & JSX.IntrinsicElements["line"]) {
  const {
    world: { gravity, timestep },
  } = useRapier();

  const points = useMemo(() => {
    const pts = [];
    const pos = startPos.clone();
    const vel = startVel.clone();

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
  }, [startPos, startVel, gravity, steps, timestep]);

  const geometry = useMemo(() => {
    return new BufferGeometry().setFromPoints(points);
  }, [points]);

  const material = useMemo(
    () => new THREE.LineBasicMaterial({ color: "yellow" }),
    []
  );

  return <primitive object={new Line(geometry, material)} {...props} />;
}
