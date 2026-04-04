export default function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.45} color="#f8fafc" />
      <hemisphereLight intensity={0.35} groundColor="#020617" color="#f8fafc" />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048}
        color="#ffedd5" // warm white
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#94a3b8" />
      <spotLight position={[0, 12, 0]} angle={0.45} penumbra={0.7} intensity={1.4} color="#f59e0b" castShadow />
    </>
  )
}
