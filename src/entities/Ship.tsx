import { useGame } from "@/hooks/useGame";
import { RedXModel } from "@/models/Red X";
import { ShipModel } from "@/models/Ship";
import {
  CuboidCollider,
  HeightfieldCollider,
  type RapierRigidBody,
  RigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { useRef } from "react";
import { useShallow } from "zustand/shallow";

const ROWS = 17;
const COLS = 17;

const heights = [
  1,
  1,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  2,
  1,
  1,
  1,
  1,
  1,
  1, // 17
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2, // 17
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2, // 17
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2, // 17
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2, // 17
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2,
  2, // 17
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9, // 17
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6,
  1.6, // 17
  1.6,
  1.6,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.6,
  1.6, // 17
  1.6,
  1.6,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.6,
  1.6, // 17
  1.6,
  1.6,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.6,
  1.6, // 17
  1.6,
  1.6,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.6,
  1.6, // 17
  2.6,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  1.5,
  1.5,
  1.5,
  1.5,
  1.5,
  1.9,
  1.9,
  1.9,
  1.9,
  1.9,
  2.6, // 17
  2.53,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.53, // 17
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39, // 17
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39, // 17
  1,
  1,
  1,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  2.39,
  1,
  1,
  1, // 17
];

export function ShipEntity(props: RigidBodyProps) {
  const { setShipRef } = useGame(
    useShallow((state) => {
      return {
        setShipRef: state.setShipRef,
      };
    }),
  );
  const shipRef = useRef<RapierRigidBody>(null!);
  return (
    <>
      <RigidBody
        type="fixed"
        colliders={false}
        {...props}
        ref={(r) => {
          if (r) {
            shipRef.current = r;
            setShipRef(shipRef);
          }
        }}
      >
        {/* Floor */}
        <HeightfieldCollider
          position={[-0.5, -0.5, 0]}
          rotation={[0, 0, 0]}
          args={[ROWS - 1, COLS - 1, heights, { x: 12.5, y: 1.025, z: 4.3 }]}
        />
        {/* Cannon */}
        <CuboidCollider
          position={[-0.5, 1.6, -1.6]}
          args={[0.4, 0.4, 0.65]}
          rotation={[0, 0.52, 0]}
        />
        {/* Cannon */}
        <CuboidCollider
          position={[-0.5, 1.6, 1.6]}
          args={[0.4, 0.4, 0.65]}
          rotation={[0, -0.52, 0]}
        />
        {/* Mast */}
        <CuboidCollider
          position={[1.8, 3.83, 0]}
          args={[0.15, 2.75, 0.15]}
          rotation={[0, 0, 0]}
        />
        {/* Mast */}
        <CuboidCollider
          position={[-3, 4.3, 0]}
          args={[0.15, 2.75, 0.15]}
          rotation={[0, 0, 0]}
        />
        {/* Wall Front */}
        <CuboidCollider
          position={[-3.3, 2.0, 2]}
          args={[1.2, 0.27, 0.2]}
          rotation={[0, 0, 0]}
        />
        {/* Wall Front */}
        <CuboidCollider
          position={[-5.7, 2, 1]}
          args={[1.45, 0.27, 0.2]}
          rotation={[0.11, -0.65, -0.09]}
        />

        {/* Wall Front */}
        <CuboidCollider
          position={[-5.7, 2.1, -1]}
          args={[1.45, 0.27, 0.2]}
          rotation={[0, 0.65, -0.09]}
        />
        {/* Wall Front */}
        <CuboidCollider
          position={[-3.3, 2.0, -2]}
          args={[1.2, 0.27, 0.2]}
          rotation={[0, 0, 0]}
        />

        {/* Rudder */}
        <CuboidCollider
          position={[3.6, 2.35, 0]}
          args={[0.14, 0.5, 0.25]}
          rotation={[0, 0, 0]}
        />

        {/* Wall back */}
        <CuboidCollider
          position={[4.45, 2.4, 1.53]}
          args={[0.15, 0.32, 1.6]}
          rotation={[0.15, -1.2, 0]}
        />
        {/* Wall back */}
        <CuboidCollider
          position={[4.45, 2.4, -1.53]}
          args={[0.15, 0.32, 1.6]}
          rotation={[-0.15, 1.2, 0]}
        />
        {/* Wall back */}
        <CuboidCollider
          position={[5.8, 2.4, 0]}
          args={[0.12, 0.44, 1.15]}
          rotation={[0, 0, 0]}
        />
        {/* Front tip */}
        <CuboidCollider
          position={[-8.1, 1.85, 0]}
          args={[1.43, 0.16, 0.3]}
          rotation={[0, 0, -0.22]}
        />
        {/* Middle bump */}
        <CuboidCollider
          position={[-0.35, 1.1, 0]}
          args={[0.54, 0.05, 0.55]}
          rotation={[0, 0, 0]}
        />
        <ShipModel />
        <RedXModel position={[-0.1, 1, -0.9]} scale={30} />
        <RedXModel position={[-0.1, 1, 0.9]} scale={30} />
      </RigidBody>
    </>
  );
}
