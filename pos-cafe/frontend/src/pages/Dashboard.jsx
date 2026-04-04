import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../services/orderService';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../utils/helpers';

const emptySummary = {
  totalRevenue: 0,
  activeTables: 0,
  liveOrders: 0,
  productsCount: 0,
  recentOrders: [],
};

function Dashboard() {
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true);

      try {
        const data = await fetchDashboardSummary();
        setSummary(data);
        setError('');
      } catch (err) {
        setError(err.message ?? 'Unable to load dashboard.');
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  const metricCards = [
    { label: 'Revenue captured', value: formatCurrency(summary.totalRevenue) },
    { label: 'Occupied tables', value: summary.activeTables },
    { label: 'Live kitchen tickets', value: summary.liveOrders },
    { label: 'Products in catalog', value: summary.productsCount },
  ];

  return (
    <div className="space-y-6">
      <section className="panel overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Overview</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-950">Realtime restaurant command center</h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Monitor sales, dining room occupancy, and kitchen throughput from one dashboard backed by Supabase tables and live subscriptions.
            </p>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 text-white">
            <p className="text-sm text-slate-300">System status</p>
            <p className="mt-3 text-2xl font-bold">{loading ? 'Syncing data...' : 'Operational'}</p>
            <p className="mt-2 text-sm text-slate-400">Auth, database, and realtime channels are wired through Supabase.</p>
          </div>
        </div>
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <div key={card.label} className="panel p-5">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '--' : card.value}</p>
          </div>
        ))}
      </section>

      <section className="panel p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Recent flow</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">Recent orders</h3>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Table</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 text-slate-700">
                  <td className="py-4 font-semibold">#{order.order_number}</td>
                  <td className="py-4">{order.table?.name || 'Walk-in'}</td>
                  <td className="py-4">
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                  </td>
                  <td className="py-4">{formatCurrency(order.total_amount)}</td>
                  <td className="py-4">{formatDateTime(order.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && !summary.recentOrders.length ? (
            <p className="py-8 text-sm text-slate-500">No orders yet. Create one from the POS Terminal.</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;