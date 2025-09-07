import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { Mesh } from "three";

export function RedXModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8AHsQOzgqDhpobYl0476JGMmPXkKgEauxjNnB",
  );

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        geometry={(nodes.UI_Red_X as Mesh).geometry}
        material={materials.Atlas}
      />
    </group>
  );
}

useGLTF.preload(
  "https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8AHsQOzgqDhpobYl0476JGMmPXkKgEauxjNnB",
);
