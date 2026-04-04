import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { getTableStatusTone } from '../utils/helpers';

export default function FloorLayout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { groundFloorTables, firstFloorTables, reserveTable } = useAppState();
  const [floor, setFloor] = useState('Ground floor');
  const [selectedTable, setSelectedTable] = useState(null);
  const [form, setForm] = useState({ name: '', guests: '2', date: '2026-04-05', time: '19:30' });

  const tables = useMemo(() => (floor === 'Ground floor' ? groundFloorTables : firstFloorTables), [firstFloorTables, floor, groundFloorTables]);

  const handleTableClick = (table) => {
    if (isAuthenticated) {
      navigate(`/register?table=${table.id}`);
      return;
    }

    if (table.status === 'available') {
      setSelectedTable(table);
    }
  };

  return (
    <div className="bg-[#0B1220] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">Floor layout</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">
                {isAuthenticated ? 'Waiter mode is active. Tap any table to open the register.' : 'Customer mode is active. Tap any available table to open the reservation form.'}
              </p>
            </div>
            <div className="rounded-full border border-[#374151] bg-[#1F2937] px-4 py-2 text-sm font-medium text-slate-300">
              {isAuthenticated ? 'Waiter mode' : 'Customer mode'}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {['Ground floor', 'First floor'].map((level) => (
              <button key={level} type="button" onClick={() => setFloor(level)} className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${floor === level ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]' : 'border-[#374151] bg-[#1F2937] text-[#F9FAFB] hover:bg-[#111827]'}`}>
                {level}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tables.map((table) => (
              <button key={table.id} type="button" onClick={() => handleTableClick(table)} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium text-[#F9FAFB]">{table.id}</p>
                    <p className="mt-2 text-sm text-slate-400">{table.floor}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] ${getTableStatusTone(table.status)}`}>
                    {table.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-400">{table.seats} seats · {table.note}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTable ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-[#F9FAFB]">Reserve {selectedTable.id}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">Save a mock reservation for this table on the selected floor.</p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Name
                <input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Guests
                <input value={form.guests} onChange={(event) => setForm((current) => ({ ...current, guests: event.target.value }))} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Date
                <input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-300">
                Time
                <input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]" />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => setSelectedTable(null)}>
                Cancel
              </Button>
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" onClick={() => { reserveTable({ tableId: selectedTable.id, ...form }); setSelectedTable(null); }}>
                Reserve table
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}