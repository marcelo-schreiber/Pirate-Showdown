import { RapierRigidBody } from "@react-three/rapier";
import { RefObject } from "react";
import { Quaternion, Vector3 } from "three";

export function localToWorld(
  shipRef: RefObject<RapierRigidBody>,
  localOffset: Vector3,
) {
  if (!shipRef.current) return new Vector3();

  const pos = shipRef.current.translation(); // world pos
  const rot = shipRef.current.rotation(); // quaternion

  const quat = new Quaternion(rot.x, rot.y, rot.z, rot.w);

  // world position = shipPos + shipRot * localOffset
  return localOffset
    .clone()
    .applyQuaternion(quat)
    .add(new Vector3(pos.x, pos.y, pos.z));
}
