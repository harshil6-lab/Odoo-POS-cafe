import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableGrid from '../components/TableGrid';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';

export default function FloorLayout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { tables, reserveTable, setSelectedTableId } = useAppState();
  const [selectedTable, setSelectedTable] = useState(null);
  const [form, setForm] = useState({ name: '', guests: '2', date: '2026-04-05', time: '19:30' });
  const [error, setError] = useState('');

  const handleTableClick = (table) => {
    if (isAuthenticated) {
      setSelectedTableId(table.id);
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
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">Table floor overview</h1>
              <p className="mt-3 text-sm text-[#9CA3AF]">
                {isAuthenticated
                  ? 'Waiters can open a table directly into the register and update live table flow.'
                  : 'Customers can browse all 24 tables and reserve an available one without logging in.'}
              </p>
            </div>
            <div className="rounded-full border border-[#374151] bg-[#0B1220] px-4 py-2 text-sm text-[#F9FAFB]">
              {isAuthenticated ? 'Staff workspace' : 'Customer reservation mode'}
            </div>
          </div>

          {error ? <p className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

          <div className="mt-8">
            <TableGrid
              tables={tables}
              actionLabel={isAuthenticated ? 'Open register' : 'Reserve this table'}
              emptyMessage="No table records were returned from Supabase."
              onSelect={handleTableClick}
            />
          </div>
        </div>
      </div>

      {selectedTable ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-[#F9FAFB]">Reserve {selectedTable.id}</h2>
            <p className="mt-3 text-sm text-[#9CA3AF]">Save a live reservation to Supabase for this table.</p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm text-[#F9FAFB]">
                Name
                <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm text-[#F9FAFB]">
                Guests
                <Input value={form.guests} onChange={(event) => setForm((current) => ({ ...current, guests: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm text-[#F9FAFB]">
                Date
                <Input type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} />
              </label>
              <label className="grid gap-2 text-sm text-[#F9FAFB]">
                Time
                <Input type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => setSelectedTable(null)}>
                Cancel
              </Button>
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" onClick={async () => {
                try {
                  await reserveTable({ tableId: selectedTable.id, ...form });
                  setError('');
                  setSelectedTable(null);
                } catch (err) {
                  setError(err.message || 'Unable to save the reservation.');
                }
              }}>
                Reserve table
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}