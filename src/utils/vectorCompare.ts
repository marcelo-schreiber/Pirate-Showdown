import { Vector3 } from "three";

type Vector3Like =
  | {
      x: number;
      y: number;
      z: number;
    }
  | Vector3;

export function almostEqual(a: number, b: number, eps = 1e-6) {
  return Math.abs(a - b) < eps;
}

export function areVectorsCloseEnough(
  o1: Vector3Like,
  o2: Vector3Like,
  eps = 1e-6,
) {
  return (
    almostEqual(o1.x, o2.x, eps) &&
    almostEqual(o1.y, o2.y, eps) &&
    almostEqual(o1.z, o2.z, eps)
  );
}

import { Quaternion } from "three";

export function quaternionsAlmostEqual(
  a: Quaternion,
  b: Quaternion,
  epsilon = 1e-6,
): boolean {
  return (
    almostEqual(a.x, b.x, epsilon) &&
    almostEqual(a.y, b.y, epsilon) &&
    almostEqual(a.z, b.z, epsilon) &&
    almostEqual(a.w, b.w, epsilon)
  );
}
