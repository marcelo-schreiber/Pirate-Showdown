import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { Mesh } from "three";

export function ShipModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/models/Ship.glb");
  materials.Atlas.side = THREE.DoubleSide;

  return (
    <group {...props} dispose={null}>
      <mesh
        receiveShadow
        castShadow
        geometry={(nodes.Ship_Large as Mesh).geometry}
        material={materials.Atlas}
        scale={100}
      ></mesh>
    </group>
  );
}

useGLTF.preload("/models/Ship.glb");
