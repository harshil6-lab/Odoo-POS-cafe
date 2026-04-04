import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/ui/Button';

export default function ReservationsAdmin() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();

    const channel = supabase
      .channel('reservations-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tables' }, () => fetchTables())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    const { data } = await supabase.from('tables').select('*').order('table_code');
    setTables(data || []);
    setLoading(false);
  };

  const updateStatus = async (tableId, status) => {
    await supabase.from('tables').update({ status }).eq('id', tableId);
    fetchTables();
  };

  const statusColors = {
    available: 'bg-green-500/10 text-green-400 border-green-500/20',
    occupied: 'bg-red-500/10 text-red-400 border-red-500/20',
    reserved: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    cleaning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  if (loading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-text-secondary">Loading reservations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-card p-4 shadow-md">
        <h1 className="text-2xl font-semibold text-white">Reservations Admin</h1>
        <p className="mt-1 text-sm text-text-secondary">Manage table statuses and reservations. Changes sync in real-time.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((table) => (
          <div key={table.id} className="rounded-xl border border-slate-800 bg-card p-4 shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{table.table_code}</h3>
              <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusColors[table.status] || ''}`}>
                {table.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-text-secondary">{table.table_code} · {table.seats} seats</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {['available', 'reserved', 'occupied', 'cleaning'].map((status) => (
                <Button
                  key={status}
                  variant={table.status === status ? 'default' : 'outline'}
                  className={`text-xs capitalize ${table.status === status ? 'bg-primary text-white' : ''}`}
                  onClick={() => updateStatus(table.id, status)}
                  disabled={table.status === status}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
