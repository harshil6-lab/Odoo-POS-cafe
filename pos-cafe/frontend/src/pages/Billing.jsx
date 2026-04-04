import { useEffect, useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import KitchenStatusBadge from '../components/KitchenStatusBadge';
import { useAppState } from '../context/AppStateContext';
import { downloadTicketPDF } from '../utils/generateTicketPDF';
import { formatCurrency } from '../utils/helpers';

const FILTERS = ['all', 'pending', 'preparing', 'cooking', 'ready'];

export default function Billing() {
  const { liveOrders, refreshOrders, syncKitchenTicketStatus } = useAppState();
  const [filter, setFilter] = useState('all');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const filteredOrders = useMemo(
    () => (filter === 'all' ? liveOrders.filter((order) => order.status !== 'served') : liveOrders.filter((order) => order.status === filter)),
    [filter, liveOrders],
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
      const updatedOrder = await syncKitchenTicketStatus(selectedOrder.id, 'served');
      handleDownload(updatedOrder);
      setMessage(`Payment confirmed for order ${updatedOrder.id}. Invoice downloaded and table released.`);
      await refreshOrders();
      setSelectedOrderId(updatedOrder.id);
    } catch (err) {
      setError(err.message || 'Unable to confirm the payment.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
        <p className="text-sm text-slate-400">Cashier workspace</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">Billing</h1>
        <p className="mt-3 text-sm text-slate-400">
          Review live orders, confirm payment, generate invoices, and release the table when billing is complete.
        </p>
      </div>

      {message ? <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[360px,minmax(0,1fr)]">
        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="space-y-4 p-4">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Pending payments</CardTitle>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    filter === status
                      ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]'
                      : 'border-[#374151] bg-[#0B1220] text-[#F9FAFB] hover:bg-[#111827]'
                  }`}
                >
                  {status === 'all' ? 'All' : status}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            {filteredOrders.length ? filteredOrders.map((order) => (
              <button
                key={order.id}
                type="button"
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedOrderId === order.id ? 'border-[#F59E0B] bg-[#1F2937]' : 'border-[#374151] bg-[#0B1220] hover:bg-[#111827]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium text-[#F9FAFB]">{order.id}</p>
                    <p className="mt-2 text-sm text-slate-400">Table {order.tableId} · {order.customer.name}</p>
                  </div>
                  <KitchenStatusBadge status={order.status} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-400">
                  <span>{order.items.length} items · {formatCurrency(order.total)}</span>
                  <span className="rounded-full border border-[#374151] bg-[#111827] px-3 py-1 text-sm text-[#F9FAFB]">{order.paymentMethod}</span>
                </div>
              </button>
            )) : <p className="text-sm text-slate-400">No orders match this filter.</p>}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Invoice details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 pt-0">
            {selectedOrder ? (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                    <p className="text-sm text-slate-400">Order ID</p>
                    <p className="mt-2 text-base font-medium text-[#F9FAFB]">{selectedOrder.id}</p>
                  </div>
                  <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                    <p className="text-sm text-slate-400">Payment method</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="rounded-full border border-[#374151] bg-[#111827] px-3 py-1 text-sm text-[#F9FAFB]">{selectedOrder.paymentMethod}</span>
                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">Invoice ready</span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                    <p className="text-sm text-slate-400">Customer</p>
                    <p className="mt-2 text-base font-medium text-[#F9FAFB]">{selectedOrder.customer.name}</p>
                  </div>
                  <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                    <p className="text-sm text-slate-400">Table</p>
                    <p className="mt-2 text-base font-medium text-[#F9FAFB]">{selectedOrder.tableId}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-medium text-[#F9FAFB]">{item.name}</p>
                          {item.preferences?.length ? <p className="mt-1 text-sm text-slate-400">{item.preferences.join(' • ')}</p> : null}
                        </div>
                        <p className="text-sm text-slate-400">x{item.quantity}</p>
                      </div>
                      <p className="mt-3 text-sm text-[#F59E0B]">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Grand total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => handleDownload(selectedOrder)}>
                    Download invoice
                  </Button>
                  <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" disabled={busy || selectedOrder.status === 'served'} onClick={() => void handleConfirmPayment()}>
                    {busy ? 'Confirming...' : selectedOrder.status === 'served' ? 'Already paid' : 'Confirm payment'}
                  </Button>
                </div>
              </>
            ) : <p className="text-sm text-slate-400">Select an order to review its invoice details.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}