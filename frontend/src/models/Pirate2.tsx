import * as THREE from "three";
import { Suspense, type JSX, useRef } from "react";
import { useGLTF } from "@react-three/drei";

useGLTF.preload(
  "https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8TlXuurxHvafUoi1JNVtuXFqyDWlMdG8crsPz"
);

export function PirateModel(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null!);
  const { nodes, materials } = useGLTF(
    "https://lb6qttqwri.ufs.sh/f/brR5phe6Ssb8TlXuurxHvafUoi1JNVtuXFqyDWlMdG8crsPz"
  );

  materials.AtlasMaterial.side = THREE.DoubleSide;

  // iterate thorugh materials to remove metalness
  Object.values(materials).forEach((material) => {
    if (material instanceof THREE.MeshStandardMaterial) {
      material.roughness = 0.9;
    }
  });

  return (
    <Suspense fallback={<capsuleGeometry args={[0.3, 0.7]} />}>
      <group ref={group} {...props} dispose={null}>
        <group name="Root_Scene">
          <primitive object={nodes.Root} />
          <skinnedMesh
            name="Henry002"
            geometry={(nodes.Henry002 as THREE.SkinnedMesh).geometry}
            material={materials.AtlasMaterial}
            skeleton={(nodes.Henry002 as THREE.SkinnedMesh).skeleton}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={100}
          />
        </group>
      </group>
    </Suspense>
  );
}
