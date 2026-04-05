import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import KitchenStatusBadge, { KITCHEN_ORDER_STATUSES } from '../components/KitchenStatusBadge';
import { supabase } from '../services/supabaseClient';

const ORDER_SELECT = `
  id,
  customer_name,
  status,
  created_at,
  order_items!order_items_order_id_fkey (
    id,
    quantity,
    notes,
    menu_item_id,
    menu_items (name, price)
  ),
  tables (table_code)
`;

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
      price: oi.menu_items?.price ?? 0,
      notes: oi.notes,
    })),
  };
}

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group orders by status
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const preparingOrders = orders.filter((o) => o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

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

  console.log('Kitchen Orders:', data);
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
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-slate-500">Loading kitchen board...</p>
        </div>
      </div>
    );
  }

  const stageEmoji = { pending: '🕐', preparing: '🔪', cooking: '🔥', ready: '✅', served: '🍽️' };
  const stageColors = {
    pending: 'border-amber-500/30 shadow-glow-amber/10',
    preparing: 'border-blue-500/30',
    cooking: 'border-orange-500/30',
    ready: 'border-emerald-500/30 shadow-glow-green/10',
    served: 'border-violet-500/30',
  };
  const stageBg = {
    pending: 'bg-amber-500/[0.04]',
    preparing: 'bg-blue-500/[0.04]',
    cooking: 'bg-orange-500/[0.04]',
    ready: 'bg-emerald-500/[0.04]',
    served: 'bg-violet-500/[0.04]',
  };

  return (
    <PageWrapper className="page-container space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white">Kitchen board</h1>
            <p className="mt-1 text-sm text-slate-400">
              Live orders from Supabase &mdash; drag through stages as you cook.
            </p>
          </div>
        </div>
        {/* Summary chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {KITCHEN_ORDER_STATUSES.map((stage) => {
            const count = orders.filter((o) => o.status === stage).length;
            return (
              <span key={stage} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                {stageEmoji[stage]} {stage[0].toUpperCase() + stage.slice(1)}
                <span className="ml-1 font-semibold text-white">{count}</span>
              </span>
            );
          })}
        </div>
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-5">
        {KITCHEN_ORDER_STATUSES.map((stage, stageIdx) => {
          const stageOrders = orders.filter((o) => o.status === stage);

          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: stageIdx * 0.06 }}
            >
              <Card className="glass-card overflow-hidden">
                <CardHeader className={`border-b border-white/[0.04] p-4 ${stageBg[stage]}`}>
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-white">
                      <span>{stageEmoji[stage]}</span>
                      {stage[0].toUpperCase() + stage.slice(1)}
                    </span>
                    <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-white/[0.08] px-2 text-xs font-medium text-slate-300">
                      {stageOrders.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-3">
                  <AnimatePresence mode="popLayout">
                    {stageOrders.length ? (
                      stageOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className={`rounded-xl border ${stageColors[stage] || 'border-white/[0.06]'} bg-white/[0.02] p-3 transition-all duration-200 hover:bg-white/[0.05]`}
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
                              className="h-8 flex-1 rounded-lg border border-white/[0.08] bg-surface px-2 text-xs text-white outline-none transition-colors focus:border-primary/40"
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
                                className="h-8 px-3 text-xs shadow-glow-red/30 transition-transform hover:scale-105"
                                onClick={() => moveToNext(order)}
                              >
                                Next →
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-6 text-center"
                      >
                        <p className="text-2xl">{stageEmoji[stage]}</p>
                        <p className="mt-2 text-xs text-slate-500">No orders</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
}