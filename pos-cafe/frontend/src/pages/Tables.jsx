import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cuboid, LayoutGrid, Sparkles, TimerReset, UsersRound } from 'lucide-react';
import Floor3D from '../3d/Floor3D';
import TableCard from '../components/TableCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency, formatElapsedTime } from '../utils/helpers';

const MOCK_TABLES = [
  { id: '1', label: 'T01', status: 'available', seats: 2, orderAmount: 0, waiter: 'Aarav', elapsedMinutes: 0, size: { width: 1.4, depth: 1.4 }, position: { x: -4, z: -2.5 } },
  { id: '2', label: 'T02', status: 'occupied', seats: 4, orderAmount: 1640, waiter: 'Nisha', elapsedMinutes: 18, size: { width: 1.6, depth: 1.6 }, position: { x: -1.2, z: -2.5 } },
  { id: '3', label: 'T03', status: 'reserved', seats: 4, orderAmount: 0, waiter: 'Rohan', elapsedMinutes: 32, size: { width: 1.6, depth: 1.6 }, position: { x: 1.8, z: -2.5 } },
  { id: '4', label: 'T04', status: 'cleaning', seats: 6, orderAmount: 0, waiter: 'Maya', elapsedMinutes: 11, size: { width: 2.1, depth: 1.6 }, position: { x: 5, z: -2.5 } },
  { id: '5', label: 'T05', status: 'occupied', seats: 2, orderAmount: 780, waiter: 'Aarav', elapsedMinutes: 9, size: { width: 1.4, depth: 1.4 }, position: { x: -4, z: 1.2 } },
  { id: '6', label: 'T06', status: 'available', seats: 2, orderAmount: 0, waiter: 'Nisha', elapsedMinutes: 0, size: { width: 1.4, depth: 1.4 }, position: { x: -1.2, z: 1.2 } },
  { id: '7', label: 'T07', status: 'occupied', seats: 4, orderAmount: 2240, waiter: 'Rohan', elapsedMinutes: 24, size: { width: 1.8, depth: 1.6 }, position: { x: 2.1, z: 1.2 } },
  { id: '8', label: 'T08', status: 'reserved', seats: 8, orderAmount: 0, waiter: 'Maya', elapsedMinutes: 41, size: { width: 2.5, depth: 1.8 }, position: { x: 5.4, z: 1.2 } },
];

function SummaryTile({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center gap-3 text-slate-400">
        <Icon className="h-5 w-5 text-amber-400" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-4 font-display text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function Tables() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('2d');
  const [selectedTableId, setSelectedTableId] = useState(MOCK_TABLES[1].id);

  const selectedTable = useMemo(() => MOCK_TABLES.find((table) => table.id === selectedTableId) || MOCK_TABLES[0], [selectedTableId]);

  const summary = useMemo(() => ({
    active: MOCK_TABLES.filter((table) => table.status === 'occupied').length,
    covers: MOCK_TABLES.reduce((sum, table) => sum + table.seats, 0),
    revenue: MOCK_TABLES.reduce((sum, table) => sum + table.orderAmount, 0),
  }), []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Dining room control</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white">Tables & floor layout</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-400">Touch-friendly table control with timer visibility, waiter assignment, and instant jump into the register workflow.</p>
        </div>
        <div className="flex rounded-2xl border border-slate-800 bg-slate-900 p-1 shadow-lg">
          <Button variant={viewMode === '2d' ? 'default' : 'ghost'} className="rounded-2xl font-accent uppercase tracking-[0.18em]" onClick={() => setViewMode('2d')}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            2D layout
          </Button>
          <Button variant={viewMode === '3d' ? 'default' : 'ghost'} className="rounded-2xl font-accent uppercase tracking-[0.18em]" onClick={() => setViewMode('3d')}>
            <Cuboid className="mr-2 h-4 w-4" />
            3D layout
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <SummaryTile label="Active tables" value={summary.active} icon={Sparkles} />
        <SummaryTile label="Seat capacity" value={summary.covers} icon={UsersRound} />
        <SummaryTile label="Open order amount" value={formatCurrency(summary.revenue)} icon={TimerReset} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),360px]">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-lg">
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950 p-4 shadow-inner">
            {viewMode === '3d' ? (
              <div className="h-[680px]">
                <Floor3D tables={MOCK_TABLES} onTableClick={setSelectedTableId} selectedTableId={selectedTableId} />
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-slate-800 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:88px_88px] p-6">
                <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
                  {MOCK_TABLES.map((table) => (
                    <TableCard
                      key={table.id}
                      table={table}
                      isSelected={selectedTableId === table.id}
                      onSelect={() => setSelectedTableId(table.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Card className="h-fit sticky top-24">
          <CardHeader className="border-b border-slate-800 bg-slate-950/60">
            <CardTitle className="font-display text-3xl">{selectedTable.label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">Waiter</p>
                <p className="mt-3 text-xl font-semibold text-white">{selectedTable.waiter}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">Order timer</p>
                <p className="mt-3 text-xl font-semibold text-amber-400">{formatElapsedTime(selectedTable.elapsedMinutes)}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">Seats</p>
                <p className="mt-3 text-xl font-semibold text-white">{selectedTable.seats}</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-sm text-slate-500">Open amount</p>
                <p className="mt-3 text-xl font-semibold text-teal-300">{formatCurrency(selectedTable.orderAmount)}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p className="font-accent text-xs uppercase tracking-[0.24em] text-slate-500">Status</p>
              <p className="mt-3 text-lg font-semibold capitalize text-white">{selectedTable.status}</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">Tap into the register to add items, send notes to the kitchen, or close payment for this table.</p>
            </div>

            <Button className="h-14 w-full rounded-2xl font-accent uppercase tracking-[0.18em]" onClick={() => navigate('/admin/pos')}>
              Open register for {selectedTable.label}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}