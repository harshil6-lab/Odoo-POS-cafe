import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Clock3, ReceiptText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getOrderById } from '../services/orderService';
import { calculateOrderTotals, formatCurrency } from '../utils/helpers';

function CustomerStatusBadge({ status }) {
  const normalized = String(status || 'pending').toLowerCase();
  const mappedStatus = normalized === 'cooking' ? 'preparing' : normalized;
  const styles = {
    pending: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300',
    preparing: 'border-sky-500/20 bg-sky-500/10 text-sky-300',
    ready: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    served: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
  };
  const label = mappedStatus ? `${mappedStatus[0].toUpperCase()}${mappedStatus.slice(1)}` : 'Pending';

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${styles[mappedStatus] || styles.pending}`}>
      {label}
    </span>
  );
}

export default function OrderSuccess() {
  const location = useLocation();
  const { orderId } = useParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(Boolean(location.state?.showToast));

  useEffect(() => {
    if (!showToast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showToast]);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing.');
      setLoading(false);
      return;
    }

    if (order?.id === orderId) {
      sessionStorage.setItem('last_order_id', orderId);
      return;
    }

    let active = true;

    const loadOrder = async () => {
      try {
        const nextOrder = await getOrderById(orderId);

        if (!active) {
          return;
        }

        setOrder(nextOrder);
        sessionStorage.setItem('last_order_id', nextOrder.id);
        setError('');
      } catch (err) {
        if (!active) {
          return;
        }

        setError(err.message || 'Unable to load that order.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void loadOrder();

    return () => {
      active = false;
    };
  }, [order?.id, orderId]);

  const totals = useMemo(() => {
    if (!order) {
      return calculateOrderTotals([]);
    }

    return {
      subtotal: Number(order.subtotal ?? calculateOrderTotals(order.items).subtotal),
      taxAmount: Number(order.taxAmount ?? calculateOrderTotals(order.items).taxAmount),
      serviceCharge: Number(order.serviceCharge ?? calculateOrderTotals(order.items).serviceCharge),
      total: Number(order.total ?? calculateOrderTotals(order.items).total),
    };
  }, [order]);

  const estimatedPrepMinutes = order?.estimatedPrepMinutes || Math.max(12, (order?.items?.length || 1) * 6);

  return (
    <div className="bg-background">
      {showToast ? (
        <div className="fixed right-6 top-24 z-[60] rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300 shadow-lg animate-slide-in-right">
          Order placed successfully
        </div>
      ) : null}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="glass-card">
          <div className="border-b border-white/[0.06] p-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="mt-3 text-xs text-slate-500">Order placed successfully</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Your order is in the kitchen queue</h1>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
              We saved your order and enabled live tracking. Keep this page open or use the track order button.
            </p>
          </div>

          <div className="space-y-5 p-6">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
                Loading order confirmation...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-sm text-rose-300">
                {error}
              </div>
            ) : order ? (
              <>
                <div className="grid gap-3 md:grid-cols-4">
                  <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Order ID</p>
                    <p className="mt-1 text-sm font-semibold text-white">{order.id}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Table number</p>
                    <p className="mt-1 text-sm font-semibold text-white">{order.tableId || 'Walk-in'}</p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Status</p>
                    <div className="mt-1">
                      <CustomerStatusBadge status={order.status || 'pending'} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">Estimated prep</p>
                    <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-white">
                      <Clock3 className="h-4 w-4 text-accent" />
                      {estimatedPrepMinutes} minutes
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
                  <div className="flex items-center gap-2">
                    <ReceiptText className="h-4 w-4 text-accent" />
                    <p className="text-sm font-medium text-white">Receipt summary</p>
                  </div>
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

                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Tax</span>
                      <span>{formatCurrency(totals.taxAmount)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Service</span>
                      <span>{formatCurrency(totals.serviceCharge)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2 text-sm font-semibold text-white">
                      <span>Total</span>
                      <span className="text-accent">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  <Link to={`/order-status/${order.id}`}>
                    <Button size="sm">Track live status</Button>
                  </Link>
                  <Link to="/menu">
                    <Button variant="outline" size="sm">Back to menu</Button>
                  </Link>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}