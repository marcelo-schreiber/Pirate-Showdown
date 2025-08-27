import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function Skybox() {
  const texture = useLoader(THREE.TextureLoader, "/sky_36_2k.png");
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return <primitive attach="background" object={texture} />;
}
