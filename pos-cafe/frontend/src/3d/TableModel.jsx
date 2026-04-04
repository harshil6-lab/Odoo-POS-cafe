import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export default function TableModel({ table, isSelected, onClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  // Status colors matching our theme
  const statusColors = {
    available: '#2dd4bf', // teal-400
    occupied: '#f59e0b', // amber-500
    reserved: '#64748b', // slate-500
    cleaning: '#ef4444' // red-500
  }
  
  const color = isSelected ? '#ffffff' : statusColors[table.status] || '#64748b'
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.1
    } else if (meshRef.current) {
      meshRef.current.position.y = 0.5
    }
  })

  return (
    <group position={[table.position.x, 0, table.position.z]}>
      {/* Table Body */}
      <mesh 
        ref={meshRef}
        position={[0, 0.5, 0]} 
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[table.size.width, 0.2, table.size.depth]} />
        <meshStandardMaterial 
          color={color} 
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          roughness={0.2} 
          metalness={0.1}
        />
      </mesh>
      
      {/* Table Leg */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 0.4, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.8, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color={isSelected ? '#000000' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor={isSelected ? '#ffffff' : '#000000'}
      >
        {table.label}
      </Text>
    </group>
  )
}
