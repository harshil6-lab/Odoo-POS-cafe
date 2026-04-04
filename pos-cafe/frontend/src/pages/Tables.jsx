import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableScene from '../components/TableScene';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { getTableStatusTone } from '../utils/helpers';

function matchesFloor(table, floor) {
  const floorName = String(table.floor || '').toLowerCase();

  if (floor === 'Ground Floor') {
    return floorName.includes('ground') || String(table.id || '').startsWith('G');
  }

  return floorName.includes('first') || String(table.id || '').startsWith('F');
}

export default function Tables() {
  const navigate = useNavigate();
  const { tables } = useAppState();
  const { role } = useAuth();
  const [activeFloor, setActiveFloor] = useState('Ground Floor');

  const floorTables = useMemo(() => tables.filter((table) => matchesFloor(table, activeFloor)), [activeFloor, tables]);
  const availableCount = tables.filter((table) => table.status === 'available').length;
  const occupiedCount = tables.filter((table) => table.status === 'occupied').length;
  const reservedCount = tables.filter((table) => table.status === 'reserved').length;

  return (
    <div className="page-container space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪑</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Realtime floor overview</p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Tables</h1>
              <p className="mt-1 text-sm text-slate-400">
                Live table records from Supabase with automatic status updates.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: availableCount, label: 'Available', color: 'text-emerald-400' },
              { value: occupiedCount, label: 'Occupied', color: 'text-red-400' },
              { value: reservedCount, label: 'Reserved', color: 'text-amber-400' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr),420px]">
        <Card className="glass-card">
          <CardHeader className="p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="font-display text-lg font-semibold">Floor map</CardTitle>
              <div className="flex gap-2">
                {['Ground Floor', 'First Floor'].map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setActiveFloor(floor)}
                    className={`rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200 ${
                      activeFloor === floor
                        ? 'bg-primary text-white shadow-glow-red'
                        : 'border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-5 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {floorTables.length ? floorTables.map((table) => (
              <div key={table.dbId || table.id} className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:scale-[1.02] hover:bg-white/[0.04] hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-slate-500">{table.floor}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold text-white">{table.label}</h3>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${getTableStatusTone(table.status)}`}>
                    {table.status}
                  </span>
                </div>

                <div className="mt-3 rounded-lg border border-white/[0.04] bg-white/[0.01] p-3 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Capacity</span>
                    <span className="font-medium text-white">{table.seats}</span>
                  </div>
                  {table.note && <p className="mt-2 text-slate-500">{table.note}</p>}
                </div>

                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => {
                    const id = table.dbId || table.id;
                    if (role === 'cashier') {
                      navigate(`/billing/${id}`);
                    } else if (role === 'manager') {
                      navigate(`/tables/${id}`);
                    } else {
                      navigate(`/register/${id}`);
                    }
                  }}
                >
                  {role === 'cashier' ? 'View bill' : role === 'manager' ? 'View details' : 'Open register'}
                </Button>
              </div>
            )) : (
              <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-6 text-center text-sm text-slate-500">
                No live tables for {activeFloor}.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="p-5">
            <CardTitle className="font-display text-lg font-semibold">3D Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="relative h-[420px] overflow-hidden rounded-xl border border-white/[0.06] bg-surface">
              <TableScene tables={floorTables} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface via-surface/80 to-transparent p-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="status-dot status-dot-available" /> Available</span>
                  <span className="flex items-center gap-1.5"><span className="status-dot status-dot-occupied" /> Occupied</span>
                  <span className="flex items-center gap-1.5"><span className="status-dot status-dot-reserved" /> Reserved</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}