import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { JSX } from "react";
import type { Mesh } from "three";
import { useControls } from "leva";

export function ShipModel(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/Ship-transformed.glb");
  materials.Atlas.side = THREE.DoubleSide;

  const shadowControls = useControls("Shadow", {
    color: "#ff0000",
    opacity: 1,
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Ship_Large as Mesh).geometry}
        scale={100}
      >
        <shadowMaterial attach="material" color={shadowControls.color} opacity={shadowControls.opacity} />
      </mesh>
            <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Ship_Large as Mesh).geometry}
        material={materials.Atlas}
        scale={100}
      >
      </mesh>
    </group>
  );
}

useGLTF.preload("/Ship-transformed.glb");
