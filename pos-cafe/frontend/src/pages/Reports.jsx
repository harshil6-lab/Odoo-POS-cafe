import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { formatCurrency } from '../utils/helpers';

function MetricCard({ label, value, helper }) {
  return (
    <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-4 font-display text-4xl font-semibold text-white">{value}</p>
        <p className="mt-3 text-sm text-slate-400">{helper}</p>
      </CardContent>
    </Card>
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
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <div>
        <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Reports dashboard</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Restaurant analytics</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          These metrics are derived from the live tables, reservations, menu catalog, and active orders already loaded from Supabase-backed services.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard label="Live order value" value={formatCurrency(liveOrderValue)} helper="Current active kitchen and billing workload." />
        <MetricCard label="Open reservations" value={reservations.length} helper="Upcoming reservations currently tracked in the system." />
        <MetricCard label="Catalog items" value={catalogItems.length} helper="Active menu items available to staff and customer ordering." />
        <MetricCard label="Leading payment mode" value={paymentMix[0]?.[0] || 'N/A'} helper="Based on current live orders." />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Table status breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {statusBreakdown.map((item) => (
              <div key={item.status} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-base font-medium capitalize text-white">{item.status}</p>
                <p className="text-2xl font-semibold text-amber-300">{item.count}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
          <CardHeader>
            <CardTitle className="font-display text-3xl">Top selling live items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {topSelling.length ? topSelling.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-white">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-400">Rank #{index + 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-semibold text-amber-400">{item.sold}</p>
                  <p className="mt-2 text-sm text-slate-400">units sold</p>
                </div>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">
                No live order items are available yet. Place orders to populate sales insights.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
        <CardHeader>
          <CardTitle className="font-display text-3xl">Current payment mix</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2 xl:grid-cols-4">
          {paymentMix.length ? paymentMix.map(([name, count]) => (
            <div key={name} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm text-slate-400">{name}</p>
              <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
              <p className="mt-1 text-sm text-slate-400">live orders</p>
            </div>
          )) : (
            <div className="md:col-span-2 xl:col-span-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/70 p-6 text-sm text-slate-400">
              Payment analytics appear once live orders are present.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}