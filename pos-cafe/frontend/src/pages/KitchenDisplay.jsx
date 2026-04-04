import { useState } from 'react';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { updateOrderStatus } from '../services/orderService';
import { formatDateTime, formatCurrency, getStatusBadgeClass } from '../utils/helpers';

const nextStatusMap = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'served',
};

function KitchenDisplay() {
  const { orders, loading, error } = useRealtimeOrders({ statuses: ['pending', 'preparing', 'ready'] });
  const [updatingId, setUpdatingId] = useState('');

  const handleProgress = async (order) => {
    const nextStatus = nextStatusMap[order.status];

    if (!nextStatus) {
      return;
    }

    setUpdatingId(order.id);

    try {
      await updateOrderStatus(order.id, nextStatus);
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Realtime kitchen</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Active tickets</h2>
        <p className="mt-2 text-sm text-slate-500">This screen updates when the Orders table changes in Supabase realtime.</p>
      </section>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {loading ? <p className="panel p-6 text-sm text-slate-500">Loading kitchen tickets...</p> : null}

      <section className="grid gap-4 xl:grid-cols-3">
        {orders.map((order) => (
          <article key={order.id} className="panel p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{order.table?.name || 'Counter'}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">#{order.order_number}</h3>
              </div>
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
            </div>

            <div className="mt-5 space-y-3">
              {order.items?.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-slate-900">{item.product?.name}</p>
                    <p className="text-sm font-semibold text-brand-700">x{item.quantity}</p>
                  </div>
                  {item.notes ? <p className="mt-2 text-sm text-slate-500">{item.notes}</p> : null}
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
              <span>{formatDateTime(order.created_at)}</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>

            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={() => handleProgress(order)}
              disabled={!nextStatusMap[order.status] || updatingId === order.id}
            >
              {updatingId === order.id ? 'Updating...' : `Mark as ${nextStatusMap[order.status] || 'done'}`}
            </button>
          </article>
        ))}
      </section>

      {!loading && !orders.length ? (
        <div className="panel p-8 text-center text-sm text-slate-500">No live kitchen orders. New tickets will appear here automatically.</div>
      ) : null}
    </div>
  );
}

export default KitchenDisplay;