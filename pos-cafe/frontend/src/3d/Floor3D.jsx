import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Grid } from '@react-three/drei'
import TableModel from './TableModel'
import SceneLights from './SceneLights'

export default function Floor3D({ tables, onTableClick, selectedTableId }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-slate-800 bg-slate-950 shadow-inner">
      <div className="absolute left-4 top-4 z-10 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1.5 font-accent text-xs font-semibold uppercase tracking-[0.24em] text-slate-300 backdrop-blur">
        3D View Interactive
      </div>
      <Canvas camera={{ position: [0, 8, 10], fov: 50 }} shadows>
        <SceneLights />
        
        {/* Floor Grid */}
        <Grid 
          renderOrder={-1} 
          position={[0, 0, 0]} 
          infiniteGrid 
          fadeDistance={30} 
          fadeStrength={5}
          cellColor="#1e293b" 
          sectionColor="#334155" 
        />
        
        {tables.map(table => (
          <TableModel 
            key={table.id}
            table={table}
            isSelected={selectedTableId === table.id}
            onClick={() => onTableClick(table.id)}
          />
        ))}

        <OrbitControls 
          makeDefault
          minPolarAngle={0} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={2} 
          maxDistance={25}
        />
      </Canvas>
    </div>
  )
}
