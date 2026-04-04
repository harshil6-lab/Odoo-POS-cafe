import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

const FoodItem = ({ position, geometry, color }) => (
  <Float speed={2} rotationIntensity={1} floatIntensity={2}>
    <mesh position={position}>
      {geometry}
      <meshStandardMaterial color={color} />
    </mesh>
  </Float>
);

export default function FloatingFood() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5] }}
      dpr={[1, 1.5]}
      frameloop="always"
      gl={{ antialias: false, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} />
      <FoodItem position={[-2, 1, 0]} geometry={<boxGeometry />} color="#EF4F5F" />
      <FoodItem position={[2, -1, -1]} geometry={<sphereGeometry args={[0.8, 32, 32]} />} color="#FACC15" />
      <FoodItem position={[-1, -2, 1]} geometry={<coneGeometry args={[0.8, 1.5, 32]} />} color="#34D399" />
      <FoodItem position={[1.5, 2, -0.5]} geometry={<torusGeometry args={[0.6, 0.2, 16, 100]} />} color="#A78BFA" />
    </Canvas>
  );
}