import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import * as THREE from "three";

export function Sun() {
  const lightRef = useRef<THREE.DirectionalLight>(null!);
  const helperRef = useRef<THREE.CameraHelper>(null!);

  // Controls
  const {
    intensity,
    posX,
    posY,
    posZ,
    camLeft,
    camRight,
    camTop,
    camBottom,
    camNear,
    camFar,
    mapSize,
    bias,
    normalBias,
    showHelper,
  } = useControls("Sun Light", {
    intensity: { value: 6.2, min: 0, max: 10, step: 0.1 },
    posX: { value: -150, min: -200, max: 200, step: 1 },
    posY: { value: 100, min: 0, max: 200, step: 1 },
    posZ: { value: 0, min: -200, max: 200, step: 1 },
    camLeft: { value: -50, min: -300, max: 0, step: 1 },
    camRight: { value: 50, min: 0, max: 300, step: 1 },
    camTop: { value: 80, min: 0, max: 300, step: 1 },
    camBottom: { value: -28, min: -300, max: 0, step: 1 },
    camNear: { value: 140, min: 0.1, max: 400, step: 0.1 },
    camFar: { value: 222, min: 50, max: 1000, step: 1 },
    mapSize: { value: 8192, options: [512, 1024, 2048, 4096] },
    bias: { value: -0.01, min: -0.01, max: 0.01, step: 0.0001 },
    normalBias: { value: -0.01, min: 0, max: 1, step: 0.01 },
    showHelper: false,
  });

  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.target.position.set(0, 0, 0);
      lightRef.current.parent?.add(lightRef.current.target);

      helperRef.current = new THREE.CameraHelper(
        lightRef.current.shadow.camera,
      );
      lightRef.current.parent?.add(helperRef.current);
    }
  }, []);

  useEffect(() => {
    if (lightRef.current && helperRef.current) {
      const cam = lightRef.current.shadow.camera as THREE.OrthographicCamera;
      cam.left = camLeft;
      cam.right = camRight;
      cam.top = camTop;
      cam.bottom = camBottom;
      cam.near = camNear;
      cam.far = camFar;
      cam.updateProjectionMatrix();

      helperRef.current.update(); // <-- this is the key
    }
  }, [camLeft, camRight, camTop, camBottom, camNear, camFar]);

  useFrame(() => {
    if (helperRef.current) {
      helperRef.current.visible = showHelper;
      helperRef.current.update();
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      intensity={intensity}
      position={[posX, posY, posZ]}
      shadow-mapSize={[mapSize, mapSize]}
      shadow-bias={bias}
      shadow-normalBias={normalBias}
      shadow-camera-left={camLeft}
      shadow-camera-right={camRight}
      shadow-camera-top={camTop}
      shadow-camera-bottom={camBottom}
      shadow-camera-near={camNear}
      shadow-camera-far={camFar}
    />
  );
}
