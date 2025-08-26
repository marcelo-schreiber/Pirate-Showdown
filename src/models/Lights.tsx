export default function Lights() {
  return (
    <>
      <directionalLight
        castShadow
        shadow-normalBias={0.06}
        position={[20, 10, 10]}
        intensity={4}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={1.5} />
    </>
  );
}
