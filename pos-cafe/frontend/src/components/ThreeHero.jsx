import { Canvas } from "@react-three/fiber";
import { Float } from "@react-three/drei";

export default function ThreeHero() {
  return (
    <Canvas style={{ pointerEvents: 'none' }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[2, 5, 2]} />

      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#EF4F5F" />
        </mesh>
      </Float>

      <Float speed={1.5}>
        <mesh position={[2, 0, -2]}>
          <boxGeometry />
          <meshStandardMaterial color="#FACC15" />
        </mesh>
      </Float>
    </Canvas>
  );
}