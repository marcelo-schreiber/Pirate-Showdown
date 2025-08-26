
import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export default function Model(props) {
  const group = useRef()
  const { nodes, materials } = useGLTF('/Pirate Captain-transformed.glb')

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode" userData={{ name: 'RootNode' }}>
          <group
            name="CharacterArmature"
            userData={{ name: 'CharacterArmature' }}>
            <primitive object={nodes.Root} />
          </group>
          <skinnedMesh
            name="Captain_Barbarossa_"
            geometry={nodes.Captain_Barbarossa_.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Captain_Barbarossa_.skeleton}
            userData={{ name: 'Captain_Barbarossa ' }}
          />
          <skinnedMesh
            name="Ernest"
            geometry={nodes.Ernest.geometry}
            material={materials.AtlasMaterial}
            skeleton={nodes.Ernest.skeleton}
            position={[0.6339, 0.9204, -0.3849]}
            userData={{ name: 'Ernest' }}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/Pirate Captain-transformed.glb')