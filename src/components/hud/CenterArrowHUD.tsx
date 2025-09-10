import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { useGame } from "@/hooks/useGame";
import { useShallow } from "zustand/shallow";
import { Model as AnchorModel } from "@/models/Anchor";

// 3D anchor HUD: sits in front of the camera and rotates toward world center
export const CenterArrowHUD = () => {
  const group = useRef<THREE.Group>(null!);
  const anchor = useRef<THREE.Group>(null!);
  const camDir = useRef(new THREE.Vector3());
  const camPos = useRef(new THREE.Vector3());

  const { hasGoBackWarning, shipRef } = useGame(
    useShallow((s) => ({ hasGoBackWarning: s.hasGoBackWarning, shipRef: s.shipRef })),
  );

  const { camera } = useThree();

  useFrame(() => {
    const hud = group.current;
    if (!hud) return;

    // Toggle visibility
    hud.visible = !!hasGoBackWarning;
    if (!hasGoBackWarning) return;

    // Place HUD in front of camera
    camera.getWorldPosition(camPos.current);
    camera.getWorldDirection(camDir.current);
    const dist = 1.8; // meters in front of camera
    hud.position.copy(camPos.current).add(camDir.current.multiplyScalar(dist));
    // Slight vertical offset for aesthetics
    hud.position.y -= 0.15;
    // Face the camera
    hud.quaternion.copy(camera.quaternion);

    // Compute direction to world center in camera space
    const ship = shipRef?.current;
    if (!ship) return;
    const p = ship.translation();
    const vWorld = new THREE.Vector3(-p.x, -p.y, -p.z); // center (0,0,0) - ship

    // Transform world direction into camera local space using inverse rotation
    const invCamQuat = camera.quaternion.clone().invert();
    const vCam = vWorld.clone().normalize().applyQuaternion(invCamQuat);

    // Rotate anchor within the screen plane (z axis) for yaw
    const yaw2D = Math.atan2(vCam.x, -vCam.z);
    hud.rotation.z = yaw2D;

    // Optional: slight tilt for pitch (up/down) on the anchor mesh itself
    const pitch2D = Math.atan2(vCam.y, -vCam.z);
    if (anchor.current) {
      anchor.current.rotation.x = THREE.MathUtils.clamp(pitch2D, -0.6, 0.6);
    }
  });

  return (
    <group ref={group} visible={false} renderOrder={10}>
      {/* Backing ring to make it pop; transparent piratey bronze */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.22, 48]} />
        <meshBasicMaterial color="#6b4d1b" transparent opacity={0.35} />
      </mesh>
      {/* Anchor */}
      <group ref={anchor} position={[0, 0, 0.01]}>
        <AnchorModel />
      </group>
    </group>
  );
};

export default CenterArrowHUD;
