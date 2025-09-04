import * as THREE from "three";
import { JSX, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useNeedleProgressive } from "@needle-tools/gltf-progressive";
import { useThree } from "@react-three/fiber";

export function PirateModel(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null!);
  const { gl } = useThree();
  const { nodes, materials } = useGLTF("/models/Pirate Captain.glb", false, false, (loader) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-explicit-any
    useNeedleProgressive(loader as any, gl as any);
  });

  materials.AtlasMaterial.side = THREE.DoubleSide;

  // iterate thorugh materials to remove metalness
  Object.values(materials).forEach((material) => {
    if (material instanceof THREE.MeshStandardMaterial) {
      material.roughness = 0.9;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode" userData={{ name: "RootNode" }}>
          <group
            name="CharacterArmature"
            userData={{ name: "CharacterArmature" }}
          >
            <mesh>
              <primitive object={nodes.Root} />
            </mesh>
          </group>
          <skinnedMesh
            castShadow
            receiveShadow
            name="Captain_Barbarossa_"
            geometry={(nodes.Captain_Barbarossa_ as THREE.SkinnedMesh).geometry}
            material={materials.AtlasMaterial}
            skeleton={(nodes.Captain_Barbarossa_ as THREE.SkinnedMesh).skeleton}
            userData={{ name: "Captain_Barbarossa " }}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            name="Ernest"
            geometry={(nodes.Ernest as THREE.SkinnedMesh).geometry}
            material={materials.AtlasMaterial}
            skeleton={(nodes.Ernest as THREE.SkinnedMesh).skeleton}
            position={[0.6339, 0.9204, -0.3849]}
            userData={{ name: "Ernest" }}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/Pirate Captain.glb");
