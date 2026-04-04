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
    <div className="bg-[#0B1220]">
      {showToast ? (
        <div className="fixed right-6 top-24 z-[60] rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 text-sm font-medium text-emerald-300 shadow-lg">
          Order placed successfully
        </div>
      ) : null}

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Card className="rounded-2xl border-slate-800 bg-slate-900 shadow-md">
          <CardHeader className="p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="text-sm text-slate-400">Order placed successfully</p>
            <CardTitle className="mt-2 text-3xl font-semibold text-slate-50">Your order is in the kitchen queue</CardTitle>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400">
              We saved your order and enabled live tracking. Keep this page open or use the track order button in the navbar.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 p-6 pt-0">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">
                Loading order confirmation...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-6 text-sm text-rose-300">
                {error}
              </div>
            ) : order ? (
              <>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Order ID</p>
                    <p className="mt-2 text-base font-semibold text-slate-50">{order.id}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Table number</p>
                    <p className="mt-2 text-base font-semibold text-slate-50">{order.tableId || 'Walk-in'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Status</p>
                    <div className="mt-2">
                      <CustomerStatusBadge status={order.status || 'pending'} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-400">Estimated prep</p>
                    <div className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-50">
                      <Clock3 className="h-4 w-4 text-amber-300" />
                      {estimatedPrepMinutes} minutes
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                  <div className="flex items-center gap-3">
                    <ReceiptText className="h-5 w-5 text-amber-300" />
                    <p className="text-lg font-medium text-slate-50">Receipt summary</p>
                  </div>
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

                  <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Subtotal</span>
                      <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                      <span>Tax</span>
                      <span>{formatCurrency(totals.taxAmount)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                      <span>Service</span>
                      <span>{formatCurrency(totals.serviceCharge)}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-slate-50">
                      <span>Total</span>
                      <span className="text-amber-300">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Link to={`/order-status/${order.id}`}>
                    <Button className="rounded-xl px-5 py-2 font-medium bg-[#F59E0B] text-black hover:brightness-110">
                      Track live status
                    </Button>
                  </Link>
                  <Link to="/menu">
                    <Button variant="outline" className="rounded-xl px-5 py-2 font-medium border-slate-700 bg-slate-950 text-white hover:bg-slate-800">
                      Back to menu
                    </Button>
                  </Link>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}