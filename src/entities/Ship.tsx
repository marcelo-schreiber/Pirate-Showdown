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
import { shipOptions } from "@/utils/shipOptions";
import { useFrame } from "@react-three/fiber";

export function ShipEntity(props: RigidBodyProps) {
  const { setShipRef, setHasGoBackWarning } = useGame(
    useShallow((state) => {
      return {
        setShipRef: state.setShipRef,
        setHasGoBackWarning: state.setHasGoBackWarning,
      };
    }),
  );

  const shipRef = useRef<RapierRigidBody>(null!);

  useFrame(() => {
    const ship = shipRef.current;
    if (!ship) return;

    const shipPosition = ship.translation();

    if (Math.abs(shipPosition.x) > 50 || Math.abs(shipPosition.z) > 50) {
      setHasGoBackWarning(true);
    } else {
      setHasGoBackWarning(false);
    }
  });

  return (
    <>
      <RigidBody
        type="dynamic"
        gravityScale={0}
        enabledRotations={[false, true, false]}
        enabledTranslations={[true, false, true]}
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
          args={[
            shipOptions.heightFieldOptions.rows - 1,
            shipOptions.heightFieldOptions.cols - 1,
            shipOptions.heightFieldOptions.heights,
            shipOptions.heightFieldOptions.scale,
          ]}
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
          position={[-5.7, 2.1, 1]}
          args={[1.45, 0.27, 0.2]}
          rotation={[0, -0.65, -0.09]}
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
        {/* Under rudder */}
        <CuboidCollider
          position={[3.7, 1.0, 0]}
          args={[0.55, 0.95, 0.55]}
          rotation={[0, 0, 0]}
        />

        {/* Rudder */}
        <CuboidCollider
          position={[3.5, 1.9, 0]}
          args={[0.3, 1, 0.25]}
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
        <RedXModel
          position={shipOptions.redX.leftCannon.offset}
          scale={shipOptions.redX.leftCannon.scale}
        />
        <RedXModel
          position={shipOptions.redX.rightCannon.offset}
          scale={shipOptions.redX.rightCannon.scale}
        />
        <RedXModel
          position={shipOptions.redX.centerRudder.offset}
          scale={shipOptions.redX.centerRudder.scale}
        />
      </RigidBody>
    </>
  );
}
