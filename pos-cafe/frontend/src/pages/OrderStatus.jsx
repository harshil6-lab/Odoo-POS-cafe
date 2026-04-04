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
    <div className="bg-[#0B1220]">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="space-y-6">
          <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
            <CardHeader className="p-6">
              <p className="text-sm text-slate-400">Live order status</p>
              <CardTitle className="mt-2 text-3xl font-semibold text-slate-50">Track your order</CardTitle>
              <p className="mt-3 text-sm text-slate-400">
                This page refreshes automatically every 5 seconds using the current order status from the existing order service.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 p-6 pt-0">
              {loading ? (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
                  Refreshing your latest order status...
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-300">
                  {error}
                </div>
              ) : order ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <p className="text-sm text-slate-400">Order ID</p>
                      <p className="mt-2 text-base font-semibold text-slate-50">{order.id}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <p className="text-sm text-slate-400">Table number</p>
                      <p className="mt-2 text-base font-semibold text-slate-50">{order.tableId || 'Walk-in'}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                      <p className="text-sm text-slate-400">Current status</p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusMeta.tone}`}>
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                    <p className="text-lg font-medium text-slate-50">Kitchen progress</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                      {CUSTOMER_STAGES.map((stage, index) => {
                        const active = statusMeta.step === index;
                        const completed = statusMeta.step > index;

                        return (
                          <div key={stage} className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${completed || active ? statusMeta.tone : 'border-slate-700 bg-slate-950 text-slate-500'}`}>
                              {completed ? '✓' : stage[0]}
                            </div>
                            <span className={`truncate text-sm ${completed || active ? 'text-slate-100' : 'text-slate-500'}`}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${((statusMeta.step + 1) / CUSTOMER_STAGES.length) * 100}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                      <p className="text-lg font-medium text-slate-50">Order summary</p>
                      <div className="mt-5 space-y-3">
                        {order.items?.length ? order.items.map((item) => (
                          <div key={`${order.id}-${item.id}-${item.name}`} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                            <div>
                              <p className="text-sm font-medium text-slate-100">{item.name}</p>
                              {item.preferences?.length ? <p className="mt-1 text-xs text-slate-400">{item.preferences.join(' • ')}</p> : null}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-slate-300">x{item.quantity}</p>
                              <p className="mt-1 text-sm font-medium text-amber-300">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        )) : <p className="text-sm text-slate-400">No item details are available for this order.</p>}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                      <p className="text-lg font-medium text-slate-50">Helpful actions</p>
                      <p className="mt-3 text-sm text-slate-400">
                        Keep this page open while your food is being prepared. When the kitchen updates the order, this page reflects the change automatically.
                      </p>
                      <div className="mt-5 space-y-3">
                        <Link to="/menu" className="block">
                          <Button variant="outline" className="w-full rounded-xl px-5 py-2 font-medium border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                            Back to menu
                          </Button>
                        </Link>
                        <Link to="/reserve-table" className="block">
                          <Button className="w-full rounded-xl px-5 py-2 font-medium bg-[#F59E0B] text-black hover:brightness-110">
                            Reserve another table
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}