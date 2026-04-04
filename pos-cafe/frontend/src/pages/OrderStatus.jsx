import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getOrderById } from '../services/orderService';
import { formatCurrency } from '../utils/helpers';

function getCustomerStatusMeta(status) {
  const normalized = String(status || 'pending').toLowerCase();
  const mappedStatus = normalized === 'cooking' ? 'preparing' : normalized;
  const meta = {
    pending: { label: 'Pending', tone: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300', step: 0 },
    preparing: { label: 'Preparing', tone: 'border-sky-500/20 bg-sky-500/10 text-sky-300', step: 1 },
    ready: { label: 'Ready', tone: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300', step: 2 },
    served: { label: 'Served', tone: 'border-violet-500/20 bg-violet-500/10 text-violet-300', step: 3 },
  };

  return meta[mappedStatus] || meta.pending;
}

const CUSTOMER_STAGES = ['Pending', 'Preparing', 'Ready', 'Served'];

export default function OrderStatus() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
      return undefined;
    }

    sessionStorage.setItem('last_order_id', orderId);
    let active = true;

    const loadOrder = async () => {
      try {
        const nextOrder = await getOrderById(orderId);

        if (!active) {
          return;
        }

        setOrder(nextOrder);
        setError('');
      } catch (err) {
        if (!active) {
          return;
        }

        setOrder(null);
        setError(err.message || 'Unable to load that order.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadOrder();
    const intervalId = window.setInterval(() => {
      void loadOrder();
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [orderId]);

  const statusMeta = useMemo(() => getCustomerStatusMeta(order?.status), [order?.status]);

  return (
    <div className="bg-background">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="space-y-5">
          <div className="glass-card">
            <div className="border-b border-white/[0.06] p-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📡</span>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-500">Live order status</p>
                  <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Track your order</h1>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                This page refreshes automatically every 5 seconds.
              </p>
            </div>
            <div className="space-y-5 p-6">
              {loading ? (
                <div className="rounded-xl border border-white/[0.06] bg-surface p-5 text-sm text-slate-400">
                  Refreshing your latest order status...
                </div>
              ) : error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
                  {error}
                </div>
              ) : order ? (
                <>
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500">Order ID</p>
                      <p className="mt-1 text-sm font-semibold text-white">{order.id}</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500">Table number</p>
                      <p className="mt-1 text-sm font-semibold text-white">{order.tableId || 'Walk-in'}</p>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-wider text-slate-500">Current status</p>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusMeta.tone}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
                    <p className="text-sm font-medium text-white">Kitchen progress</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                      {CUSTOMER_STAGES.map((stage, index) => {
                        const active = statusMeta.step === index;
                        const completed = statusMeta.step > index;

                        return (
                          <div key={stage} className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${completed || active ? statusMeta.tone : 'border-white/[0.06] bg-surface text-slate-600'}`}>
                              {completed ? '✓' : stage[0]}
                            </div>
                            <span className={`truncate text-xs ${completed || active ? 'text-white' : 'text-slate-600'}`}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface">
                      <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${((statusMeta.step + 1) / CUSTOMER_STAGES.length) * 100}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr),300px]">
                    <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
                      <p className="text-sm font-medium text-white">Order summary</p>
                      <div className="mt-4 space-y-2">
                        {order.items?.length ? order.items.map((item) => (
                          <div key={`${order.id}-${item.id}-${item.name}`} className="flex items-start justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                            <div>
                              <p className="text-sm font-medium text-white">{item.name}</p>
                              {item.preferences?.length ? <p className="mt-0.5 text-[11px] text-slate-500">{item.preferences.join(' • ')}</p> : null}
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-slate-400">x{item.quantity}</p>
                              <p className="mt-0.5 text-xs font-medium text-accent">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        )) : <p className="text-sm text-slate-500">No item details available.</p>}
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
                      <p className="text-sm font-medium text-white">Helpful actions</p>
                      <p className="mt-2 text-xs text-slate-500">
                        Keep this page open while your food is prepared. Status updates automatically.
                      </p>
                      <div className="mt-4 space-y-2">
                        <Link to="/menu" className="block">
                          <Button variant="outline" size="sm" className="w-full">Back to menu</Button>
                        </Link>
                        <Link to="/reserve-table" className="block">
                          <Button size="sm" className="w-full">Reserve another table</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}