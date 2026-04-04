import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { formatCurrency } from '../utils/helpers';

function MetricCard({ label, value, helper }) {
  return (
    <div className="metric-card">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{helper}</p>
    </div>
  );
}

export default function Reports() {
  const { catalogItems, liveOrders, reservations, tables } = useAppState();

  const liveOrderValue = useMemo(() => liveOrders.reduce((sum, order) => sum + Number(order.total || 0), 0), [liveOrders]);
  const paymentMix = useMemo(() => {
    const counts = liveOrders.reduce((acc, order) => {
      const key = order.paymentMethod || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [liveOrders]);
  const topSelling = useMemo(() => {
    const counts = liveOrders.reduce((acc, order) => {
      order.items.forEach((item) => {
        acc[item.name] = (acc[item.name] || 0) + Number(item.quantity || 0);
      });
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }, [liveOrders]);
  const statusBreakdown = useMemo(() => {
    return ['available', 'occupied', 'reserved', 'cleaning'].map((status) => ({
      status,
      count: tables.filter((table) => table.status === status).length,
    }));
  }, [tables]);

  return (
    <div className="page-container space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">Reports dashboard</p>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Restaurant analytics</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Metrics derived from live tables, reservations, menu catalog, and active orders.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard label="Live order value" value={formatCurrency(liveOrderValue)} helper="Current active kitchen and billing workload." />
        <MetricCard label="Open reservations" value={reservations.length} helper="Upcoming reservations currently tracked in the system." />
        <MetricCard label="Catalog items" value={catalogItems.length} helper="Active menu items available to staff and customer ordering." />
        <MetricCard label="Leading payment mode" value={paymentMix[0]?.[0] || 'N/A'} helper="Based on current live orders." />
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr,1.05fr]">
        <div className="glass-card">
          <div className="border-b border-white/[0.06] p-5">
            <h2 className="font-display text-lg font-bold text-white">Table status breakdown</h2>
          </div>
          <div className="space-y-2 p-5">
            {statusBreakdown.map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-sm font-medium capitalize text-white">{item.status}</p>
                <p className="text-lg font-bold text-accent">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="border-b border-white/[0.06] p-5">
            <h2 className="font-display text-lg font-bold text-white">Top selling live items</h2>
          </div>
          <div className="space-y-2 p-5">
            {topSelling.length ? topSelling.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Rank #{index + 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg font-bold text-accent">{item.sold}</p>
                  <p className="text-[11px] text-slate-500">units sold</p>
                </div>
              </div>
            )) : (
              <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-5 text-sm text-slate-500">
                No live order items available yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="border-b border-white/[0.06] p-5">
          <h2 className="font-display text-lg font-bold text-white">Current payment mix</h2>
        </div>
        <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-4">
          {paymentMix.length ? paymentMix.map(([name, count]) => (
            <div key={name} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[11px] text-slate-500">{name}</p>
              <p className="mt-1 text-xl font-bold text-white">{count}</p>
              <p className="mt-0.5 text-[11px] text-slate-500">live orders</p>
            </div>
          )) : (
            <div className="md:col-span-2 xl:col-span-4 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-5 text-sm text-slate-500">
              Payment analytics appear once live orders are present.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}