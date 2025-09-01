import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { Mesh } from "three";

export function RedXModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Red X.glb");

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

useGLTF.preload("/models/Red X.glb");
