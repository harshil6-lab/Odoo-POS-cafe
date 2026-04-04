import { useCallback, useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import KitchenStatusBadge, { KITCHEN_ORDER_STATUSES } from '../components/KitchenStatusBadge';
import { supabase } from '../services/supabaseClient';

const ORDER_SELECT = '*, order_items(*, menu_items(name)), tables(table_code)';

function mapOrder(raw) {
  return {
    id: raw.id,
    tableCode: raw.tables?.table_code ?? 'N/A',
    customerName: raw.customer_name ?? 'Guest',
    status: String(raw.status || 'pending').toLowerCase(),
    createdAt: raw.created_at,
    items: (raw.order_items ?? []).map((oi) => ({
      id: oi.id,
      name: oi.menu_items?.name ?? 'Item',
      quantity: oi.quantity,
    })),
  };
}

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_SELECT)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Kitchen fetch error:', error);
      setLoading(false);
      return;
    }

    console.log('Kitchen orders:', data);
    setOrders((data ?? []).map(mapOrder));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('kitchen-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const updateStatus = async (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)),
    );

    const { error } = await supabase
      .from('orders')
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Status update error:', error);
      fetchOrders();
    }
  };

  const moveToNext = (order) => {
    const idx = KITCHEN_ORDER_STATUSES.indexOf(order.status);
    if (idx < KITCHEN_ORDER_STATUSES.length - 1) {
      updateStatus(order.id, KITCHEN_ORDER_STATUSES[idx + 1]);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-slate-500">Loading kitchen board...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container space-y-8">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Kitchen board</h1>
            <p className="mt-1 text-sm text-slate-400">
              Live orders from Supabase. Update status as you prepare each order.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {KITCHEN_ORDER_STATUSES.map((stage, stageIdx) => {
          const stageOrders = orders.filter((o) => o.status === stage);
          const stageColors = {
            pending: 'border-amber-500/20',
            preparing: 'border-blue-500/20',
            cooking: 'border-orange-500/20',
            ready: 'border-emerald-500/20',
            served: 'border-violet-500/20',
          };

          return (
            <Card key={stage} className="glass-card overflow-hidden">
              <CardHeader className="border-b border-white/[0.04] p-4">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">
                    {stage[0].toUpperCase() + stage.slice(1)}
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.06] text-xs text-slate-400">
                    {stageOrders.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                {stageOrders.length ? (
                  stageOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`rounded-xl border ${stageColors[stage] || 'border-white/[0.06]'} bg-white/[0.02] p-3 transition-all duration-200 hover:bg-white/[0.04]`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-white">
                            Table {order.tableCode}
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {order.customerName} · {String(order.id).slice(0, 8)}
                          </p>
                        </div>
                        <KitchenStatusBadge status={order.status} />
                      </div>

                      <div className="mt-3 space-y-0.5 text-xs text-slate-400">
                        {order.items.map((item) => (
                          <p key={item.id}>
                            <span className="font-medium text-slate-300">{item.quantity}x</span> {item.name}
                          </p>
                        ))}
                      </div>

                      <div className="mt-3 flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="h-8 flex-1 rounded-lg border border-white/[0.08] bg-surface px-2 text-xs text-white outline-none"
                        >
                          {KITCHEN_ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>

                        {stageIdx < KITCHEN_ORDER_STATUSES.length - 1 && (
                          <Button
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => moveToNext(order)}
                          >
                            Next →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-4 text-center text-xs text-slate-500">
                    No orders
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}