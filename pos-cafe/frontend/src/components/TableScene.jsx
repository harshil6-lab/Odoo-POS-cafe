import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

function getStatusColor(status) {
  const tones = {
    available: '#34d399',
    occupied: '#f87171',
    reserved: '#facc15',
    cleaning: '#94a3b8',
  };

  return tones[String(status || '').toLowerCase()] || tones.available;
}

function TableBlock({ index, table }) {
  const ref = useRef(null);
  const x = (index % 3) * 1.8 - 1.8;
  const z = Math.floor(index / 3) * 1.6 - 1.6;
  const color = getStatusColor(table.status);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }

    const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.18;
    ref.current.material.emissiveIntensity = pulse;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4 + index) * 0.12;
  });

  return (
    <mesh ref={ref} position={[x, 0, z]} castShadow receiveShadow>
      <boxGeometry args={[1.05, 0.28, 1.05]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.35} />
    </mesh>
  );
}

function SceneContent({ tables }) {
  const safeTables = useMemo(() => tables.slice(0, 9), [tables]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.32, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {safeTables.map((table, index) => (
        <TableBlock key={table.dbId || table.id || index} index={index} table={table} />
      ))}
    </>
  );
}

export default function TableScene({ tables = [] }) {
  return (
    <Canvas camera={{ position: [0, 4.5, 5.8], fov: 42 }} style={{ pointerEvents: 'none' }} shadows>
      <SceneContent tables={tables} />
    </Canvas>
  );
}