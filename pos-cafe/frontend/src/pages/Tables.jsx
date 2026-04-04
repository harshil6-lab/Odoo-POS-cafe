import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableCard from '../components/TableCard';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { fetchTables } from '../services/orderService';

function Tables() {
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { orders } = useRealtimeOrders({ statuses: ['pending', 'preparing', 'ready', 'served'] });

  useEffect(() => {
    const loadTables = async () => {
      setLoading(true);

      try {
        const data = await fetchTables();
        setTables(data);
        setError('');
      } catch (err) {
        setError(err.message ?? 'Unable to load tables.');
      } finally {
        setLoading(false);
      }
    };

    loadTables();
  }, []);

  const activeOrdersByTable = useMemo(() => {
    const map = new Map();

    orders.forEach((order) => {
      if (order.table?.id && !map.has(order.table.id)) {
        map.set(order.table.id, order);
      }
    });

    return map;
  }, [orders]);

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Floor plan</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-950">Dining room layout</h2>
          </div>
          <button type="button" className="btn-primary" onClick={() => navigate('/pos')}>
            Open POS terminal
          </button>
        </div>

        {error ? <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            activeOrder={activeOrdersByTable.get(table.id)}
            onSelect={() => navigate('/pos')}
          />
        ))}
      </section>

      {!loading && !tables.length ? (
        <div className="panel p-8 text-center text-sm text-slate-500">Add dining tables in Supabase to visualize the floor plan.</div>
      ) : null}
    </div>
  );
}

export default Tables;