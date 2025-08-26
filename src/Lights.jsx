export default function Lights() {
  return (
    <>
      <directionalLight
        intensity={1.7}
        color={'#FFFFED'}
        castShadow
        shadow-bias={-0.0004}
        position={[-20, 20, 20]}
        shadow-camera-top={20}
        shadow-camera-right={20}
        shadow-camera-bottom={-20}
        shadow-camera-left={-20}
      />
      <ambientLight intensity={1.2} />
    </>
  )
}
