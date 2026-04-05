import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRazorpay } from 'react-razorpay';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { confirmPayment } from '../services/orderService';
import { updateTableStatus } from '../services/tableService';
import { supabase } from '../services/supabaseClient';
import { downloadTicketPDF } from '../utils/generateTicketPDF';
import { formatCurrency } from '../utils/helpers';

const BILL_SELECT = `
  id,
  table_id,
  customer_name,
  status,
  payment_status,
  payment_method,
  tax,
  service_charge,
  total,
  created_at,
  order_items(
    id,
    quantity,
    price,
    unit_price,
    line_total,
    menu_items(name)
  ),
  tables(
    id,
    table_code
  )
`;

function mapBillOrder(raw) {
  return {
    id: raw.id,
    tableId: raw.tables?.table_code ?? null,
    tableDbId: raw.tables?.id ?? raw.table_id,
    customer: { name: raw.customer_name || 'Guest' },
    status: raw.status,
    paymentStatus: raw.payment_status,
    paymentMethod: raw.payment_method,
    tax: Number(raw.tax) || 0,
    serviceCharge: Number(raw.service_charge) || 0,
    total: Number(raw.total) || 0,
    createdAt: raw.created_at,
    items: (raw.order_items ?? []).map((item) => ({
      id: item.id,
      name: item.menu_items?.name ?? 'Menu item',
      quantity: Number(item.quantity),
      price: Number(item.unit_price ?? item.price ?? 0),
      lineTotal: Number(item.line_total) || 0,
    })),
  };
}

export default function Billing() {
  const { tableId: routeTableId } = useParams();
  const navigate = useNavigate();
  const { Razorpay } = useRazorpay();
  const { role } = useAuth();
  const { liveOrders, refreshOrders } = useAppState();
  const [directOrders, setDirectOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const modeLabel = role === 'waiter' ? 'Quick Payment' : 'Billing Mode';
  // When accessed via /billing/:tableId, fetch directly from Supabase
  const loadTableBills = useCallback(async () => {
    if (!routeTableId) return;
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(BILL_SELECT)
        .eq('table_id', routeTableId)
        .eq('payment_status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setDirectOrders((data ?? []).map(mapBillOrder));
    } catch (err) {
      setError(err.message || 'Unable to load bills for this table.');
      setDirectOrders([]);
    } finally {
      setLoading(false);
    }
  }, [routeTableId]);

  useEffect(() => {
    if (routeTableId) {
      void loadTableBills();
    } else {
      void refreshOrders();
    }
  }, [routeTableId, loadTableBills, refreshOrders]);

  // Use direct query results for table-specific billing, shared state for general billing
  const filteredOrders = useMemo(() => {
    if (routeTableId) return directOrders;
    return liveOrders.filter((order) => order.paymentStatus === 'pending');
  }, [routeTableId, directOrders, liveOrders]);

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

      if (routeTableId) {
        // Small delay so user sees the success message, then redirect
        setTimeout(() => navigate('/tables'), 1200);
      } else {
        await refreshOrders();
      }
    } catch (err) {
      setError(err.message || 'Unable to confirm the payment.');
    } finally {
      setBusy(false);
    }
  };

  const handleRazorpayPayment = async (method) => {
    if (!selectedOrder) return;

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const orderRes = await fetch(`${backendUrl}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedOrder.total }),
      });

      if (!orderRes.ok) {
        const errBody = await orderRes.json().catch(() => ({}));
        throw new Error(errBody.error || `Payment server error (${orderRes.status})`);
      }

      const razorpayOrder = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        order_id: razorpayOrder.id,
        name: 'Restaurant POS',
        description: `Order ${String(selectedOrder.id).slice(0, 8)} · Table ${selectedOrder.tableId}`,
        prefill: { name: selectedOrder.customer.name },
        theme: { color: '#E11D48' },
        handler: async (response) => {
          try {
            const paymentMethodMap = { card: 'card', upi: 'upi_qr' };
            await supabase
              .from('orders')
              .update({
                payment_status: 'paid',
                payment_method: paymentMethodMap[method] ?? method,
                status: 'served',
              })
              .eq('id', selectedOrder.id);

            if (selectedOrder.tableDbId) {
              await updateTableStatus(selectedOrder.tableDbId, 'available');
            }

            handleDownload({ ...selectedOrder, paymentMethod: method, paymentId: response.razorpay_payment_id });
            setMessage(`${method.toUpperCase()} payment confirmed for order ${String(selectedOrder.id).slice(0, 8)}. Table released.`);

            if (routeTableId) {
              setTimeout(() => navigate('/tables'), 1200);
            } else {
              await refreshOrders();
            }
          } catch (err) {
            setError(err.message || 'Payment succeeded but order update failed.');
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setError(resp.error?.description || 'Payment failed. Please try again.');
        setBusy(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Unable to start payment.');
      setBusy(false);
    }
  };

  return (
    <PageWrapper className="page-container space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">💳</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{modeLabel}</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Billing</h1>
            <p className="mt-1 text-sm text-slate-400">
              Review live orders, confirm payment, generate invoices, and release the table.
            </p>
          </div>
        </div>
      </motion.div>

      {message ? <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p> : null}
      {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[360px,minmax(0,1fr)]">
        {/* Pending payments */}
        <Card className="glass-card">
          <CardHeader className="p-5">
            <CardTitle className="font-display text-lg font-semibold">
              {routeTableId ? 'Table bill' : 'Pending payments'}
            </CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              {loading ? 'Loading...' : `${filteredOrders.length} order${filteredOrders.length !== 1 ? 's' : ''} awaiting payment`}
            </p>
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
            )) : <p className="text-sm text-slate-500">{routeTableId ? 'No pending bill for this table.' : 'No pending orders.'}</p>}
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

                <div className="rounded-xl border border-primary/20 bg-primary/[0.06] p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-300">Grand total</span>
                    <span className="font-display text-2xl font-bold text-white">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="outline" onClick={() => handleDownload(selectedOrder)}>Download invoice</Button>
                  <Button
                    variant="outline"
                    disabled={busy || selectedOrder.paymentStatus === 'paid'}
                    onClick={() => void handleRazorpayPayment('card')}
                  >
                    {busy ? 'Processing...' : 'Pay with Card'}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={busy || selectedOrder.paymentStatus === 'paid'}
                    onClick={() => void handleRazorpayPayment('upi')}
                  >
                    {busy ? 'Processing...' : 'Pay with UPI'}
                  </Button>
                  <Button disabled={busy || selectedOrder.paymentStatus === 'paid'} onClick={() => void handleConfirmPayment()}>
                    {busy ? 'Confirming...' : selectedOrder.paymentStatus === 'paid' ? 'Already paid' : 'Confirm cash'}
                  </Button>
                </div>
              </>
            ) : <p className="text-sm text-slate-500">Select an order to review its invoice details.</p>}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}