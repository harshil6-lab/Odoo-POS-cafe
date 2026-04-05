import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { supabase } from '../services/supabaseClient';
import { updateTableStatus } from '../services/tableService';
import { formatCurrency } from '../utils/helpers';

const ORDER_SELECT = `
  id,
  customer_name,
  status,
  payment_status,
  payment_method,
  tax,
  service_charge,
  total,
  created_at,
  order_items!order_items_order_id_fkey(
    id,
    quantity,
    price,
    unit_price,
    line_total,
    menu_items(name)
  )
`;

function mapOrder(raw) {
  return {
    id: raw.id,
    customer: raw.customer_name || 'Guest',
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

const STATUS_OPTIONS = ['pending', 'preparing', 'cooking', 'ready', 'served', 'cancelled'];

export default function TableDetail() {
  const { tableId } = useParams();
  const navigate = useNavigate();
  const [table, setTable] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [tableRes, ordersRes] = await Promise.all([
        supabase.from('tables').select('id, table_code, seats, status').eq('id', tableId).maybeSingle(),
        supabase
          .from('orders')
          .select(ORDER_SELECT)
          .eq('table_id', tableId)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      if (tableRes.error) throw tableRes.error;
      if (ordersRes.error) throw ordersRes.error;

      setTable(tableRes.data);
      setOrders((ordersRes.data ?? []).map(mapOrder));
    } catch (err) {
      setError(err.message || 'Failed to load table data.');
    } finally {
      setLoading(false);
    }
  }, [tableId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleChangeOrderStatus = async (orderId, newStatus) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const update = { status: newStatus };
      if (newStatus === 'cancelled') update.payment_status = 'cancelled';
      if (newStatus === 'served') update.payment_status = 'paid';

      const { error: updateError } = await supabase.from('orders').update(update).eq('id', orderId);
      if (updateError) throw updateError;

      setMessage(`Order status updated to ${newStatus}.`);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update order.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    await handleChangeOrderStatus(orderId, 'cancelled');
  };

  const handleChangeTableStatus = async (newStatus) => {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await updateTableStatus(tableId, newStatus);
      setMessage(`Table status changed to ${newStatus}.`);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to update table.');
    } finally {
      setBusy(false);
    }
  };

  const statusColor = (s) => {
    const map = {
      pending: 'text-yellow-300 border-yellow-500/20 bg-yellow-500/10',
      preparing: 'text-blue-300 border-blue-500/20 bg-blue-500/10',
      cooking: 'text-orange-300 border-orange-500/20 bg-orange-500/10',
      ready: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
      served: 'text-green-300 border-green-500/20 bg-green-500/10',
      cancelled: 'text-red-300 border-red-500/20 bg-red-500/10',
      paid: 'text-emerald-300 border-emerald-500/20 bg-emerald-500/10',
    };
    return map[s] || 'text-slate-300 border-white/10 bg-white/5';
  };

  if (loading) {
    return (
      <div className="page-container flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
        Loading table details...
      </div>
    );
  }

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪑</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Manager view</p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">
                Table {table?.table_code || tableId}
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                {table?.seats} seats · Status: <span className="font-medium text-white">{table?.status}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['available', 'occupied', 'reserved', 'cleaning'].map((s) => (
              <Button
                key={s}
                size="sm"
                variant={table?.status === s ? 'default' : 'outline'}
                disabled={busy || table?.status === s}
                onClick={() => handleChangeTableStatus(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
            <Button size="sm" variant="outline" onClick={() => navigate('/tables')}>
              ← Back to tables
            </Button>
          </div>
        </div>
      </div>

      {message && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{message}</p>}
      {error && <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      {/* Orders */}
      {orders.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-8 text-center text-sm text-slate-500">
            No orders found for this table.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {orders.map((order) => (
            <Card key={order.id} className="glass-card">
              <CardHeader className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-base font-semibold">
                      Order {String(order.id).slice(0, 8)}
                    </CardTitle>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.customer} · {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-5 pt-0">
                {/* Items list */}
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-3 py-2 text-sm">
                      <span className="text-slate-300">{item.name} × {item.quantity}</span>
                      <span className="font-medium text-white">{formatCurrency(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: 'Tax', value: formatCurrency(order.tax) },
                    { label: 'Service', value: formatCurrency(order.serviceCharge) },
                    { label: 'Total', value: formatCurrency(order.total) },
                  ].map((f) => (
                    <div key={f.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                      <p className="text-[10px] text-slate-500">{f.label}</p>
                      <p className="text-sm font-semibold text-white">{f.value}</p>
                    </div>
                  ))}
                </div>

                {/* Payment info */}
                <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs">
                  <span className="text-slate-500">Payment method</span>
                  <span className="font-medium text-white">{order.paymentMethod || 'Not set'}</span>
                </div>

                {/* Actions */}
                {order.status !== 'cancelled' && order.status !== 'served' && (
                  <div className="flex flex-wrap gap-2">
                    <select
                      className="h-9 rounded-lg border border-white/[0.08] bg-surface px-3 text-xs text-white focus:border-primary/50 focus:outline-none"
                      defaultValue={order.status}
                      disabled={busy}
                      onChange={(e) => handleChangeOrderStatus(order.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                      disabled={busy}
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel order
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
