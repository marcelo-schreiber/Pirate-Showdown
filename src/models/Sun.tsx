import useGame from "@/hooks/useGame";
import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export default function Sun() {
  const { debug } = useGame();
  const dirLightRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(debug ? dirLightRef : null, THREE.DirectionalLightHelper, 5, "red");

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        castShadow
        shadow-normalBias={0.06}
        position={[-45, 35, 12]}
        intensity={6.2}
        shadow-mapSize={[1024, 1024]}
        color={new THREE.Color("#faf8de")}
      />
    </>
  );
}
