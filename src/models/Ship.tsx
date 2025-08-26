import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { Mesh } from "three";

export default function ShipModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/Ship-transformed.glb");
  materials.Atlas.side = THREE.DoubleSide;
  return (
    <group {...props} dispose={null}>
      <mesh
        receiveShadow
        geometry={(nodes.Ship_Large as Mesh).geometry}
        material={materials.Atlas}
        scale={100}
      />
    </group>
  );
}

useGLTF.preload("/Ship-transformed.glb");
