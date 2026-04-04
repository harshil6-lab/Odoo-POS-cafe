import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import KitchenStatusBadge, { KITCHEN_ORDER_STATUSES, getKitchenStatusStep } from '../components/KitchenStatusBadge';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAppState } from '../context/AppStateContext';
import { getOrderById } from '../services/orderService';

function ProgressStage({ label, active, completed }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm ${completed || active ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]' : 'border-[#374151] bg-[#111827] text-[#9CA3AF]'}`}>
        {completed ? '✓' : label[0]}
      </div>
      <span className={`truncate text-sm ${active || completed ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'}`}>{label}</span>
    </div>
  );
}

export default function TrackOrder() {
  const { lastPlacedOrder } = useAppState();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || lastPlacedOrder?.id || '';
  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [order, setOrder] = useState(lastPlacedOrder && lastPlacedOrder.id === initialOrderId ? lastPlacedOrder : null);
  const [loading, setLoading] = useState(Boolean(initialOrderId));
  const [error, setError] = useState('');

  useEffect(() => {
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      setLoading(false);
      return undefined;
    }

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
        setError(err.message || 'Unable to find that order.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    void loadOrder();

    const intervalId = window.setInterval(() => {
      void loadOrder();
    }, 5000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [searchParams]);

  const currentStep = useMemo(() => getKitchenStatusStep(order?.status), [order?.status]);
  const progressStages = KITCHEN_ORDER_STATUSES.slice(0, 4);

  const handleTrack = () => {
    const trimmed = orderIdInput.trim();
    if (!trimmed) {
      setError('Enter an order ID to track your order.');
      return;
    }

    setSearchParams({ orderId: trimmed });
  };

  return (
    <div className="bg-[#0B1220] py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-sm">
          <p className="text-sm text-[#9CA3AF]">Track order</p>
          <h1 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">Follow your kitchen progress</h1>
          <p className="mt-3 text-sm text-[#9CA3AF]">Enter your order ID and the page will refresh automatically every 5 seconds.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input value={orderIdInput} onChange={(event) => setOrderIdInput(event.target.value)} placeholder="Enter order ID" className="sm:max-w-sm" />
            <Button className="h-11 rounded-lg bg-[#F59E0B] px-5 text-sm text-black hover:brightness-110" onClick={handleTrack}>
              Track order
            </Button>
          </div>

          {error ? <p className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr),320px]">
          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Order progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-4 pt-0">
              {loading ? (
                <div className="rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-6 text-sm text-[#9CA3AF]">Refreshing the latest order status...</div>
              ) : order ? (
                <>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                      <p className="text-sm text-[#9CA3AF]">Order ID</p>
                      <p className="mt-2 text-base font-semibold text-[#F9FAFB]">{order.id}</p>
                    </div>
                    <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                      <p className="text-sm text-[#9CA3AF]">Table number</p>
                      <p className="mt-2 text-base font-semibold text-[#F9FAFB]">{order.tableId || 'Pending table'}</p>
                    </div>
                    <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                      <p className="text-sm text-[#9CA3AF]">Current status</p>
                      <div className="mt-2">
                        <KitchenStatusBadge status={order.status} />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                    <p className="text-xl font-medium text-[#F9FAFB]">Kitchen progress</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-4">
                      {progressStages.map((stage, index) => (
                        <ProgressStage
                          key={stage}
                          label={stage[0].toUpperCase() + stage.slice(1)}
                          active={currentStep === index}
                          completed={currentStep > index || order.status === 'served'}
                        />
                      ))}
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#111827]">
                      <div
                        className="h-full rounded-full bg-[#F59E0B] transition-all duration-500"
                        style={{ width: `${Math.min(100, ((order.status === 'served' ? 4 : currentStep) + 1) * 25)}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-6 text-sm text-[#9CA3AF]">
                  No order is being tracked yet. Enter an order ID from your ticket to see live status updates.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-xl font-medium text-[#F9FAFB]">Helpful actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0 text-sm text-[#9CA3AF]">
              <p>Keep this page open while your food is being prepared. Status changes refresh automatically.</p>
              <Link to="/menu" className="block">
                <Button variant="outline" className="h-11 w-full rounded-lg border border-slate-600 text-white hover:bg-slate-800">
                  Start another order
                </Button>
              </Link>
              <Link to="/reserve-table" className="block">
                <Button className="h-11 w-full rounded-lg bg-[#F59E0B] text-black hover:brightness-110">
                  Reserve another table
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}