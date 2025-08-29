import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { camListenerTargetType } from "../Ecctrl";

export const useFollowCam = function ({
  disableFollowCam = false,
  disableFollowCamPos = null,
  disableFollowCamTarget = null,
  camInitDis = -5,
  camMaxDis = -7,
  camMinDis = -0.7,
  camUpLimit = 1.5, // in rad
  camLowLimit = -1.3, // in rad
  camInitDir = { x: 0, y: 0 }, // in rad
  camMoveSpeed = 1,
  camZoomSpeed = 1,
  camCollisionOffset = 0.7, // percentage
  camCollisionSpeedMult = 4,
  camListenerTarget = "domElement",
}: UseFollowCamProps = {}) {
  const { scene, camera, gl } = useThree();
  // const { rapier, world } = useRapier();

  const isMouseDown = useRef(false);
  const previousTouch1 = useRef<Touch | null>(null);
  const previousTouch2 = useRef<Touch | null>(null);

  const originZDis = useRef<number>(camInitDis ?? -5);
  const pivot = useMemo(() => new THREE.Object3D(), []);
  const followCam = useMemo(() => {
    const origin = new THREE.Object3D();
    origin.position.set(
      0,
      originZDis.current * Math.sin(-camInitDir.x),
      originZDis.current * Math.cos(-camInitDir.x),
    );
    return origin;
  }, [camInitDir.x]);

  /** Camera collison detect setups */
  const smallestDistance = useRef<number | null>(null);
  const cameraDistance = useRef<number | null>(null);
  const intersects = useRef<THREE.Intersection[]>(null);

  // let intersectObjects: THREE.Object3D[] = [];
  const intersectObjects = useRef<THREE.Object3D[]>([]);
  const cameraRayDir = useMemo(() => new THREE.Vector3(), []);
  const cameraRayOrigin = useMemo(() => new THREE.Vector3(), []);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);
  const camLerpingPoint = useMemo(() => new THREE.Vector3(), []);
  const camRayCast = new THREE.Raycaster(
    cameraRayOrigin,
    cameraRayDir,
    0,
    -camMaxDis,
  );
  // Rapier ray setup (optional)
  // const rayCast = new rapier.Ray(cameraRayOrigin, cameraRayDir);
  // let rayLength = null;
  // let rayHit = null;

  // Mouse move event
  const onDocumentMouseMove = useCallback(
    (e: MouseEvent) => {
      if (document.pointerLockElement || isMouseDown.current) {
        pivot.rotation.y -= e.movementX * 0.002 * camMoveSpeed;
        const vy = followCam.rotation.x + e.movementY * 0.002 * camMoveSpeed;

        cameraDistance.current = followCam.position.length();

        if (vy >= camLowLimit && vy <= camUpLimit) {
          followCam.rotation.x = vy;
          followCam.position.y = -cameraDistance.current * Math.sin(-vy);
          followCam.position.z = -cameraDistance.current * Math.cos(-vy);
        }
      }
      return false;
    },
    [
      camLowLimit,
      camMoveSpeed,
      camUpLimit,
      followCam.position,
      followCam.rotation,
      pivot.rotation,
    ],
  );

  // Mouse scroll event
  const onDocumentMouseWheel = useCallback(
    (e: Event) => {
      const vz =
        originZDis.current - (e as WheelEvent).deltaY * 0.002 * camZoomSpeed;
      const vy = followCam.rotation.x;

      if (vz >= camMaxDis && vz <= camMinDis) {
        originZDis.current = vz;
        followCam.position.z = originZDis.current * Math.cos(-vy);
        followCam.position.y = originZDis.current * Math.sin(-vy);
      }
      return false;
    },
    [
      camMaxDis,
      camMinDis,
      camZoomSpeed,
      followCam.position,
      followCam.rotation.x,
    ],
  );

  /**
   * Touch events
   */
  // Touch end event
  const onTouchEnd = useCallback(() => {
    previousTouch1.current = null;
    previousTouch2.current = null;
  }, []);

  // Touch move event
  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      // prevent swipe to navigate gesture
      e.preventDefault();
      e.stopImmediatePropagation();

      const touch1 = e.targetTouches[0];
      const touch2 = e.targetTouches[1];

      // One finger touch to rotate camera
      if (previousTouch1.current && !previousTouch2.current) {
        const touch1MovementX = touch1.pageX - previousTouch1.current.pageX;
        const touch1MovementY = touch1.pageY - previousTouch1.current.pageY;

        pivot.rotation.y -= touch1MovementX * 0.005 * camMoveSpeed;
        const vy =
          followCam.rotation.x + touch1MovementY * 0.005 * camMoveSpeed;

        cameraDistance.current = followCam.position.length();

        if (vy >= camLowLimit && vy <= camUpLimit) {
          followCam.rotation.x = vy;
          followCam.position.y = -cameraDistance.current * Math.sin(-vy);
          followCam.position.z = -cameraDistance.current * Math.cos(-vy);
        }
      }

      // Two fingers touch to zoom in/out camera
      if (previousTouch1.current && previousTouch2.current) {
        const prePinchDis = Math.hypot(
          previousTouch1.current.pageX - previousTouch2.current.pageX,
          previousTouch1.current.pageY - previousTouch2.current.pageY,
        );
        const pinchDis = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY,
        );

        const vz =
          originZDis.current - (prePinchDis - pinchDis) * 0.01 * camZoomSpeed;
        const vy = followCam.rotation.x;

        if (vz >= camMaxDis && vz <= camMinDis) {
          originZDis.current = vz;
          followCam.position.z = originZDis.current * Math.cos(-vy);
          followCam.position.y = originZDis.current * Math.sin(-vy);
        }
      }

      previousTouch1.current = touch1;
      previousTouch2.current = touch2;
    },
    [
      camLowLimit,
      camMaxDis,
      camMinDis,
      camMoveSpeed,
      camUpLimit,
      camZoomSpeed,
      followCam.position,
      followCam.rotation,
      pivot.rotation,
    ],
  );

  /**
   * Gamepad second joystick event
   */
  const joystickCamMove = (movementX: number, movementY: number) => {
    pivot.rotation.y -= movementX * 0.005 * camMoveSpeed * 5;
    const vy = followCam.rotation.x + movementY * 0.005 * camMoveSpeed * 5;

    cameraDistance.current = followCam.position.length();

    if (vy >= camLowLimit && vy <= camUpLimit) {
      followCam.rotation.x = vy;
      followCam.position.y = -cameraDistance.current * Math.sin(-vy);
      followCam.position.z = -cameraDistance.current * Math.cos(vy);
    }
  };

  /**
   * Custom traverse function
   */
  // Prepare intersect objects for camera collision
  const customTraverseAdd = useCallback((object: THREE.Object3D) => {
    // Chekc if the object's userData camExcludeCollision is true
    if (object.userData && object.userData.camExcludeCollision === true) {
      return;
    }

    // Check if the object is a Mesh, and is visible
    if ((object as THREE.Mesh).isMesh && (object as THREE.Mesh).visible) {
      intersectObjects.current.push(object);
    }

    // Recursively traverse child objects
    object.children.forEach((child) => {
      customTraverseAdd(child); // Continue the traversal for all child objects
    });
  }, []);

  // Remove intersect objects from camera collision array
  const customTraverseRemove = useCallback((object: THREE.Object3D) => {
    intersectObjects.current = intersectObjects.current.filter(
      (item) => item.uuid !== object.uuid, // Keep all items except the one to remove
    );

    // Recursively traverse child objects
    object.children.forEach((child) => {
      customTraverseRemove(child); // Continue the traversal for all child objects
    });
  }, []);

  /**
   * Camera collision detection function
   */
  const cameraCollisionDetect = (delta: number) => {
    // Update collision detect ray origin and pointing direction
    // Which is from pivot point to camera position
    cameraRayOrigin.copy(pivot.position);
    camera.getWorldPosition(cameraPosition);
    cameraRayDir.subVectors(cameraPosition, pivot.position);
    // rayLength = cameraRayDir.length();

    // casting ray hit, if object in between character and camera,
    // change the smallestDistance.current to the ray hit toi
    // otherwise the smallestDistance.current is same as camera original position (originZDis)
    intersects.current = camRayCast.intersectObjects(intersectObjects.current);
    if (
      intersects.current.length &&
      intersects.current[0].distance <= -originZDis.current
    ) {
      smallestDistance.current = Math.min(
        -intersects.current[0].distance * camCollisionOffset,
        camMinDis,
      );
    } else {
      smallestDistance.current = originZDis.current;
    }

    // Rapier ray hit setup (optional)
    // rayHit = world.castRay(rayCast, rayLength + 1, true, null, null, character);
    // if (rayHit && rayHit.toi && rayHit.toi > originZDis) {
    //   smallestDistance.current = -rayHit.toi + 0.5;
    // } else if (rayHit == null) {
    //   smallestDistance.current = originZDis;
    // }

    // Update camera next lerping position, and lerp the camera
    camLerpingPoint.set(
      followCam.position.x,
      smallestDistance.current * Math.sin(-followCam.rotation.x),
      smallestDistance.current * Math.cos(-followCam.rotation.x),
    );

    followCam.position.lerp(
      camLerpingPoint,
      1 - Math.exp(-camCollisionSpeedMult * delta),
    ); // delta * 2 for rapier ray setup
  };

  useEffect(() => {
    // Initialize camera facing direction
    pivot.rotation.y = camInitDir.y;
    followCam.rotation.x = camInitDir.x;

    // Prepare for camera ray intersect objects
    scene.children.forEach((child) => customTraverseAdd(child));

    // Prepare for followCam and pivot point
    pivot.add(followCam);
    scene.add(pivot);

    if (camListenerTarget === "domElement") {
      gl.domElement.addEventListener("mousedown", () => {
        isMouseDown.current = true;
      });
      gl.domElement.addEventListener("mouseup", () => {
        isMouseDown.current = false;
      });
      gl.domElement.addEventListener("mousemove", onDocumentMouseMove);
      gl.domElement.addEventListener("mousewheel", onDocumentMouseWheel);
      // Touch event
      gl.domElement.addEventListener("touchend", onTouchEnd);
      gl.domElement.addEventListener("touchmove", onTouchMove, {
        passive: false,
      });
    } else if (camListenerTarget === "document") {
      document.addEventListener("mousedown", () => {
        isMouseDown.current = true;
      });
      document.addEventListener("mouseup", () => {
        isMouseDown.current = false;
      });
      document.addEventListener("mousemove", onDocumentMouseMove);
      document.addEventListener("mousewheel", onDocumentMouseWheel);
      // Touch event
      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchmove", onTouchMove, { passive: false });
    }

    return () => {
      if (camListenerTarget === "domElement") {
        gl.domElement.removeEventListener("mousedown", () => {
          isMouseDown.current = true;
        });
        gl.domElement.removeEventListener("mouseup", () => {
          isMouseDown.current = false;
        });
        gl.domElement.removeEventListener("mousemove", onDocumentMouseMove);
        gl.domElement.removeEventListener("mousewheel", onDocumentMouseWheel);
        // Touch event
        gl.domElement.removeEventListener("touchend", onTouchEnd);
        gl.domElement.removeEventListener("touchmove", onTouchMove);
      } else if (camListenerTarget === "document") {
        document.removeEventListener("mousedown", () => {
          isMouseDown.current = true;
        });
        document.removeEventListener("mouseup", () => {
          isMouseDown.current = false;
        });
        document.removeEventListener("mousemove", onDocumentMouseMove);
        document.removeEventListener("mousewheel", onDocumentMouseWheel);
        // Touch event
        document.removeEventListener("touchend", onTouchEnd);
        document.removeEventListener("touchmove", onTouchMove);
      }
    };
  }, [
    camInitDir.x,
    camInitDir.y,
    camListenerTarget,
    customTraverseAdd,
    followCam,
    gl.domElement,
    onDocumentMouseMove,
    onDocumentMouseWheel,
    onTouchEnd,
    onTouchMove,
    pivot,
    scene,
  ]);

  // If followCam is disabled set to disableFollowCamPos, target to disableFollowCamTarget
  useEffect(() => {
    if (disableFollowCam) {
      if (disableFollowCamPos)
        camera.position.set(
          disableFollowCamPos.x,
          disableFollowCamPos.y,
          disableFollowCamPos.z,
        );
      if (disableFollowCamTarget)
        camera.lookAt(
          new THREE.Vector3(
            disableFollowCamTarget.x,
            disableFollowCamTarget.y,
            disableFollowCamTarget.z,
          ),
        );
    }
  }, [camera, disableFollowCam, disableFollowCamPos, disableFollowCamTarget]);

  // Handle scene add/remove objects events
  useEffect(() => {
    const onObjectAdded = (e: { child: THREE.Object3D }) =>
      customTraverseAdd(e.child);
    const onObjectRemoved = (e: { child: THREE.Object3D }) =>
      customTraverseRemove(e.child);
    scene.addEventListener("childadded", onObjectAdded);
    scene.addEventListener("childremoved", onObjectRemoved);
    return () => {
      scene.removeEventListener("childadded", onObjectAdded);
      scene.removeEventListener("childremoved", onObjectRemoved);
    };
  }, [customTraverseAdd, customTraverseRemove, scene]);

  return { pivot, followCam, cameraCollisionDetect, joystickCamMove };
};

export type UseFollowCamProps = {
  disableFollowCam?: boolean;
  disableFollowCamPos?: { x: number; y: number; z: number } | null;
  disableFollowCamTarget?: { x: number; y: number; z: number } | null;
  camInitDis?: number;
  camMaxDis?: number;
  camMinDis?: number;
  camUpLimit?: number;
  camLowLimit?: number;
  camInitDir?: { x: number; y: number };
  camMoveSpeed?: number;
  camZoomSpeed?: number;
  camCollisionOffset?: number;
  camCollisionSpeedMult?: number;
  camListenerTarget?: camListenerTargetType;
};
