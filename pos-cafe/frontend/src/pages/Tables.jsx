import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableScene from '../components/TableScene';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
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
  const [activeFloor, setActiveFloor] = useState('Ground Floor');

  const floorTables = useMemo(() => tables.filter((table) => matchesFloor(table, activeFloor)), [activeFloor, tables]);
  const availableCount = tables.filter((table) => table.status === 'available').length;
  const occupiedCount = tables.filter((table) => table.status === 'occupied').length;
  const reservedCount = tables.filter((table) => table.status === 'reserved').length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-md">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">Realtime floor overview</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Tables</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              Live table records are loaded from Supabase and update automatically when service status changes.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
              <p className="text-2xl font-semibold text-white">{availableCount}</p>
              <p className="mt-1 text-sm text-slate-400">Available</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
              <p className="text-2xl font-semibold text-white">{occupiedCount}</p>
              <p className="mt-1 text-sm text-slate-400">Occupied</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-4">
              <p className="text-2xl font-semibold text-white">{reservedCount}</p>
              <p className="mt-1 text-sm text-slate-400">Reserved</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr),420px]">
        <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
          <CardHeader className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="text-2xl font-semibold text-white">Two-floor table map</CardTitle>
              <div className="flex flex-wrap gap-2">
                {['Ground Floor', 'First Floor'].map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => setActiveFloor(floor)}
                    className={`rounded-xl px-5 py-2 font-medium transition ${activeFloor === floor ? 'bg-[#EF4F5F] text-white' : 'border border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800'}`}
                  >
                    {floor}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {floorTables.length ? floorTables.map((table) => (
              <div key={table.dbId || table.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{table.floor}</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{table.label}</h3>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getTableStatusTone(table.status)}`}>
                    {table.status}
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Capacity</span>
                    <span className="text-white">{table.seats}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-400">{table.note}</p>
                </div>

                <Button
                  className="mt-5 w-full rounded-xl bg-[#EF4F5F] px-5 py-2 font-medium text-white hover:bg-[#d93f4f]"
                  onClick={() => navigate(`/register?table=${table.id}`)}
                >
                  Open register
                </Button>
              </div>
            )) : (
              <div className="md:col-span-2 xl:col-span-3 rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
                No live tables were returned for {activeFloor}.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-semibold text-white">3D floor preview</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="relative h-[420px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <TableScene tables={floorTables} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4">
                <p className="text-sm text-slate-300">Green: available, red: occupied, yellow: reserved.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}