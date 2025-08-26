export default function Lights() {
  return (
    <>
      <directionalLight
        intensity={1.7}
        castShadow
        shadow-bias={-0.0004}
        position={[-10, 10, 10]}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={1} />
    </>
  );
}
