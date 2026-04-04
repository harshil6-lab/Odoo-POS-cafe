import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { supabase } from '../services/supabaseClient';

const statusTone = {
  available: 'border-green-500/20 bg-green-500/10 text-green-400',
  occupied: 'border-red-500/20 bg-red-500/10 text-red-400',
  reserved: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
  cleaning: 'border-blue-400/20 bg-blue-400/10 text-blue-400',
};

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTables = async () => {
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

    const { data, error } = await supabase
      .from('tables')
      .select(`
        id,
        table_code,
        status,
        seats,
        floors(name)
      `)
      .order('table_code');

    if (error) {
      console.error('Tables fetch error:', error);
      setLoading(false);
      return;
    }

    console.log('Tables loaded:', data);
    setTables(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadTables();
  }, []);

  const occupiedCount = tables.filter((t) => t.status === 'occupied').length;
  const reservedCount = tables.filter((t) => t.status === 'reserved').length;
  const availableCount = tables.filter((t) => t.status === 'available').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-xl border border-slate-800 bg-card p-6 shadow-md lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary">Floor overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Tables</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary md:text-base">
            Monitor seating, reservations, and active bills from a layout that is clean enough for fast service.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-background px-4 py-4">
            <p className="text-2xl font-semibold text-white">{availableCount}</p>
            <p className="mt-1 text-sm text-text-secondary">Available tables</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-background px-4 py-4">
            <p className="text-2xl font-semibold text-white">{occupiedCount}</p>
            <p className="mt-1 text-sm text-text-secondary">Occupied now</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-background px-4 py-4">
            <p className="text-2xl font-semibold text-white">{reservedCount}</p>
            <p className="mt-1 text-sm text-text-secondary">Upcoming reservations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-6">
        {loading ? (
          <p className="col-span-full text-center text-sm text-text-secondary">Loading tables...</p>
        ) : tables.length === 0 ? (
          <p className="col-span-full text-center text-sm text-text-secondary">No tables found in Supabase.</p>
        ) : tables.map((table) => (
          <Card key={table.id} className="overflow-hidden rounded-xl bg-card border-slate-800 shadow-md transition-shadow hover:shadow-xl">
            <CardHeader className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Floor {table.floors.name}</p>
                  <CardTitle className="mt-2 text-2xl text-white">Table {table.table_code}</CardTitle>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusTone[table.status] || ''}`}>
                  {table.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-5 pt-0">
              <div className="rounded-lg border border-slate-800 bg-background p-4">
                <div className="flex items-center justify-between text-sm text-text-secondary">
                  <span>Seats</span>
                  <span className="text-white">{table.seats}</span>
                </div>
              </div>
              <Button asChild className="w-full bg-primary text-white hover:bg-primary/90">
                <Link to={`/tables/${table.id}`}>View Details</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}