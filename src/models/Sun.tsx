import { useGame } from "@/hooks/useGame";
import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export function Sun() {
  const debug = useGame((s) => s.debug);
  const lightRef = useRef<THREE.DirectionalLight>(null!);

  useHelper(debug ? lightRef : null, THREE.DirectionalLightHelper, 5, "yellow");

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      shadow-normalBias={0.06}
      intensity={5}
      shadow-mapSize={[2048, 2048]}
      shadow-camera-near={1}
      shadow-camera-far={222}
      shadow-camera-top={50}
      shadow-camera-right={50}
      shadow-camera-bottom={-28}
      shadow-camera-left={-50}
      name="followLight"
    />
  );
}
