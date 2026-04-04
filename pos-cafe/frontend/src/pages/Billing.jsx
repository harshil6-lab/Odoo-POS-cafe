import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { confirmPayment } from '../services/orderService';
import { updateTableStatus } from '../services/tableService';
import { downloadTicketPDF } from '../utils/generateTicketPDF';
import { formatCurrency } from '../utils/helpers';

export default function Billing() {
  const { liveOrders, refreshOrders } = useAppState();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  // Cashier only sees cash orders with pending payment
  const filteredOrders = useMemo(
    () => liveOrders.filter((order) => order.paymentStatus === 'pending' && order.paymentMethod === 'cash'),
    [liveOrders],
  );

  useEffect(() => {
    if (!filteredOrders.length) {
      setSelectedOrderId(null);
      return;
    }

    if (!filteredOrders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  const selectedOrder = filteredOrders.find((order) => order.id === selectedOrderId) || null;

  const handleDownload = (order) => {
    downloadTicketPDF(
      {
        ...order,
        subtotal: order.total,
        total: order.total,
        paymentMethod: order.paymentMethod,
        ticketGeneratedAt: new Date().toISOString(),
      },
      {
        title: 'Cafe POS Invoice',
        filename: `invoice-${order.id}.pdf`,
        footerAction: 'Payment confirmed by cashier.',
      },
    );
  };

  const handleConfirmPayment = async () => {
    if (!selectedOrder) {
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const updatedOrder = await confirmPayment(selectedOrder.id);

      // Release table
      if (updatedOrder.tableDbId) {
        await updateTableStatus(updatedOrder.tableDbId, 'available');
      }

      handleDownload(updatedOrder);
      setMessage(`Payment confirmed for order ${String(updatedOrder.id).slice(0, 8)}. Invoice downloaded and table released.`);
      await refreshOrders();
    } catch (err) {
      setError(err.message || 'Unable to confirm the payment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-container space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Cashier workspace</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Billing</h1>
            <p className="mt-1 text-sm text-slate-400">
              Review live orders, confirm payment, generate invoices, and release the table.
            </p>
          </div>
        </div>
      </div>

      {message ? <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[360px,minmax(0,1fr)]">
        {/* Pending payments */}
        <Card className="glass-card">
          <CardHeader className="p-5">
            <CardTitle className="font-display text-lg font-semibold">Pending cash payments</CardTitle>
            <p className="mt-1 text-xs text-slate-500">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} awaiting payment</p>
          </CardHeader>
          <CardContent className="space-y-2 p-5 pt-0">
            {filteredOrders.length ? filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-xl border p-3 text-left transition-all duration-200 ${
                  selectedOrderId === order.id
                    ? 'border-primary/30 bg-primary/[0.06] ring-1 ring-primary/20'
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-white">{String(order.id).slice(0, 8)}</p>
                    <p className="mt-1 text-xs text-slate-500">Table {order.tableId} · {order.customer.name}</p>
                  </div>
                  <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-[11px] font-medium text-yellow-300">Pending</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{order.items.length} items · {formatCurrency(order.total)}</span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400">{order.paymentMethod}</span>
                </div>
              </button>
            )) : <p className="text-sm text-slate-500">No orders match this filter.</p>}
          </CardContent>
        </Card>

        {/* Invoice details */}
        <Card className="glass-card">
          <CardHeader className="p-5">
            <CardTitle className="font-display text-lg font-semibold">🧾 Invoice details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-5 pt-0">
            {selectedOrder ? (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { label: 'Order ID', value: String(selectedOrder.id).slice(0, 12) },
                    { label: 'Payment', value: selectedOrder.paymentMethod || 'Not set', badge: selectedOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending' },
                    { label: 'Customer', value: selectedOrder.customer.name },
                    { label: 'Table', value: selectedOrder.tableId },
                  ].map((field) => (
                    <div key={field.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[11px] text-slate-500">{field.label}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{field.value}</p>
                        {field.badge && <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">{field.badge}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        {item.preferences?.length ? <p className="mt-0.5 text-[11px] text-slate-500">{item.preferences.join(' · ')}</p> : null}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">×{item.quantity}</p>
                        <p className="text-sm font-medium text-accent">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Grand total</span>
                    <span className="text-lg font-bold text-white">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="outline" onClick={() => handleDownload(selectedOrder)}>Download invoice</Button>
                  <Button disabled={busy || selectedOrder.paymentStatus === 'paid'} onClick={() => void handleConfirmPayment()}>
                    {busy ? 'Confirming...' : selectedOrder.paymentStatus === 'paid' ? 'Already paid' : 'Confirm payment'}
                  </Button>
                </div>
              </>
            ) : <p className="text-sm text-slate-500">Select an order to review its invoice details.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}