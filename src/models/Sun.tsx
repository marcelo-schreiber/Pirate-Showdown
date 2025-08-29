import { useDebug } from "@/hooks/useDebug";
import { useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { useRef } from "react";
import * as THREE from "three";

export function Sun() {
  const { debug } = useDebug();
  const dirLightRef = useRef<THREE.DirectionalLight>(null!);
  useHelper(debug ? dirLightRef : null, THREE.DirectionalLightHelper, 5, "red");
  const {
    directionalIntensity,
    directionalColor,
    environmentIntensity,
    environmentColor
  } = useControls("Sun", {
    directionalIntensity: { value: 6.2, min: 0, max: 10, step: 0.1 },
    directionalColor: "#faf8de",
    environmentIntensity: { value: 1, min: 0, max: 2, step: 0.1 },
    environmentColor: "#ffffff"
  });

  return (
    <>
      <directionalLight
        ref={dirLightRef}
        castShadow
        shadow-normalBias={0.06}
        position={[-45, 35, 12]}
        intensity={directionalIntensity}
        shadow-mapSize={[1024, 1024]}
        color={new THREE.Color(directionalColor)}
      />
      <ambientLight intensity={environmentIntensity} color={new THREE.Color(environmentColor)} />
    </>
  );
}
