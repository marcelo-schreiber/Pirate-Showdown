import { useControls, folder } from "leva";
import ShipModel from "../models/Ship";
import {
  HeightfieldCollider,
  RigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { type FolderInput } from "leva/dist/declarations/src/types";

const ROWS = 16;
const COLS = 16;

function makeInitialMatrix(rows: number, cols: number, base: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => base)
  );
}

export default function ShipEntity(props: RigidBodyProps) {
  // matrix base values
  const initialMatrix = makeInitialMatrix(ROWS, COLS, 2);

  // build leva controls dynamically
  const matrixControls: Record<string, FolderInput<unknown>> = {};
  initialMatrix.forEach((row, r) => {
    matrixControls[`row${r}`] = folder(
      row.reduce((acc, val, c) => {
        // acc[`h${r}_${c}`] = { value: val, min: 0, max: 5, step: 0.1 };
        Object.assign(acc, {
          [`h${r}_${c}`]: { value: val, min: 0, max: 5, step: 0.1 },
        });
        return acc;
      }, {})
    );
  });

  const matrix = useControls("Heightfield", matrixControls);

  const controls = useControls("Transform", {
    position: { value: [0.5, 0, 0], step: 0.1 },
    rotation: { value: [0, 0, 0], step: 0.1 },
    scale: { value: [12.4, 1, 4.3], step: 0.1 },
  });

  // flatten matrix values for collider
  const heightData = Object.values(matrix);

  return (
    <RigidBody type="fixed" colliders={false} {...props}>
      <HeightfieldCollider
        position={controls.position}
        rotation={controls.rotation}
        args={[
          ROWS - 1,
          COLS - 1,
          heightData as unknown as number[],
          { x: controls.scale[0], y: controls.scale[1], z: controls.scale[2] },
        ]}
      />
      <ShipModel />
    </RigidBody>
  );
}
