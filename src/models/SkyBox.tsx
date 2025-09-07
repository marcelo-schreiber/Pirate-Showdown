import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

export function Skybox() {
  const texture = useLoader(
    THREE.TextureLoader,
    "https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8FulSjqXNxe9nRoJ3MIf2qWEyV86CAY0wBmO4",
  );
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  return <primitive attach="background" object={texture} />;
}
