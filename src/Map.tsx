import { RigidBody, RigidBodyProps } from "@react-three/rapier";

export default function Map(props: RigidBodyProps) {
  return (
    <RigidBody type="fixed" colliders="trimesh" ccd {...props}>
      <mesh>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </RigidBody>
  );
}
