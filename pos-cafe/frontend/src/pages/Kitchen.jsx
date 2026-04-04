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
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-400">
        Loading kitchen board...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Kitchen board</h1>
        <p className="mt-3 text-sm text-slate-400">
          Live orders from Supabase. Update status as you prepare each order.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {KITCHEN_ORDER_STATUSES.map((stage, stageIdx) => {
          const stageOrders = orders.filter((o) => o.status === stage);

          return (
            <Card key={stage} className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">
                  {stage[0].toUpperCase() + stage.slice(1)}
                  <span className="ml-2 text-base font-normal text-slate-400">({stageOrders.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-0">
                {stageOrders.length ? (
                  stageOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-medium text-[#F9FAFB]">
                            Table {order.tableCode}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Order: {String(order.id).slice(0, 8)}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {order.customerName}
                          </p>
                        </div>
                        <KitchenStatusBadge status={order.status} />
                      </div>

                      <div className="mt-4 space-y-1 text-sm text-slate-300">
                        {order.items.map((item) => (
                          <p key={item.id}>
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="h-9 flex-1 rounded-lg border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB]"
                        >
                          {KITCHEN_ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s[0].toUpperCase() + s.slice(1)}
                            </option>
                          ))}
                        </select>

                        {stageIdx < KITCHEN_ORDER_STATUSES.length - 1 && (
                          <Button
                            className="h-9 rounded-lg px-4 text-sm"
                            onClick={() => moveToNext(order)}
                          >
                            Next →
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-4 text-sm text-slate-400">
                    No orders in this stage.
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