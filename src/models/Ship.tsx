import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useRef, type JSX } from "react";
import type { Mesh } from "three";
import { useThree } from "@react-three/fiber";
import { useNeedleProgressive } from "@needle-tools/gltf-progressive";

export function ShipModel(props: JSX.IntrinsicElements["group"]) {
  const { gl } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const { nodes, materials } = useGLTF("/models/Ship.glb", false, false, (loader) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    useNeedleProgressive(loader as any, gl as any);
  });
  materials.Atlas.side = THREE.DoubleSide;

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={meshRef}
        receiveShadow
        castShadow
        geometry={(nodes.Ship_Large as Mesh).geometry}
        material={materials.Atlas}
        scale={100}
      ></mesh>
    </group>
  );
}

// useGLTF.preload("/models/Ship.glb");
