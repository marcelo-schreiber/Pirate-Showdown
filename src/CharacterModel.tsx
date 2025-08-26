import * as THREE from "three";
import { JSX, useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null!);
  const { nodes, materials } = useGLTF("/Pirate Captain-transformed.glb");

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode" userData={{ name: "RootNode" }}>
          <group
            name="CharacterArmature"
            userData={{ name: "CharacterArmature" }}
          >
            <primitive object={nodes.Root} />
          </group>
          <skinnedMesh
            name="Captain_Barbarossa_"
            geometry={(nodes.Captain_Barbarossa_ as THREE.SkinnedMesh).geometry}
            material={materials.AtlasMaterial}
            skeleton={(nodes.Captain_Barbarossa_ as THREE.SkinnedMesh).skeleton}
            userData={{ name: "Captain_Barbarossa " }}
          />
          <skinnedMesh
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

useGLTF.preload("/Pirate Captain-transformed.glb");
