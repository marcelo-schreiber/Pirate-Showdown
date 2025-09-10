import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGame } from "@/hooks/useGame";
import { useShallow } from "zustand/shallow";
import { useRef } from "react";

// Computes 2D screen-space direction to world center and stores angle in global state
export const CenterArrowComputer = () => {
  const { setCenterDirAngleDeg } = useGame(
    useShallow((s) => ({
      setCenterDirAngleDeg: s.setCenterDirAngleDeg,
    })),
  );
  const { camera } = useThree();
  const center = new THREE.Vector3(0, 0, 0);
  const camPos = new THREE.Vector3();
  const invCamQuat = new THREE.Quaternion();
  const vWorld = new THREE.Vector3();
  const vCam = new THREE.Vector3();
  const lastAngleRef = useRef(0);

  useFrame(() => {
    // Vector from camera to world center, in camera space
    camera.getWorldPosition(camPos);
    invCamQuat.copy(camera.quaternion).invert();
    vWorld.copy(center).sub(camPos);
    vCam.copy(vWorld).applyQuaternion(invCamQuat);

    // Compute angle in camera space and add 180° if behind camera (z>0)
    const angleRad = Math.atan2(-vCam.y, vCam.x); // x right, y down
    const angleDeg = ((angleRad * 180) / Math.PI + 360) % 360;
    // Only update when it actually changes to avoid extra renders
    if (Math.abs(angleDeg - lastAngleRef.current) > 0.05) {
      lastAngleRef.current = angleDeg;
      setCenterDirAngleDeg(angleDeg);
    }
  });

  return null;
};

export default CenterArrowComputer;
