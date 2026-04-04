import { useMemo, useState } from 'react';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { updateOrderStatus } from '../services/orderService';
import { formatCurrency, formatDateTime, getStatusBadgeClass } from '../utils/helpers';

const filters = ['all', 'pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];

function Orders() {
  const { orders, loading, error } = useRealtimeOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState('');

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'all') {
      return orders;
    }

    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);

    try {
      await updateOrderStatus(orderId, status);
    } finally {
      setUpdatingId('');
    }
  };

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Orders</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Service queue</h2>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                statusFilter === filter ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
      {loading ? <p className="panel p-6 text-sm text-slate-500">Loading orders...</p> : null}

      <section className="space-y-4">
        {filteredOrders.map((order) => (
          <article key={order.id} className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-950">#{order.order_number}</h3>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>{order.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {order.table?.name || 'Walk-in'} • {order.cashier?.full_name || order.cashier?.email || 'Unassigned'}
                </p>
              </div>

              <div className="text-right text-sm text-slate-500">
                <p>{formatDateTime(order.created_at)}</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{formatCurrency(order.total_amount)}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr,220px]">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{item.product?.name}</p>
                    <p className="mt-1">Quantity: {item.quantity}</p>
                    <p className="mt-1">Line total: {formatCurrency(item.line_total)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className="btn-primary w-full"
                  onClick={() => handleStatusChange(order.id, 'completed')}
                  disabled={updatingId === order.id}
                >
                  Mark completed
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full"
                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                  disabled={updatingId === order.id}
                >
                  Cancel order
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {!loading && !filteredOrders.length ? (
        <div className="panel p-8 text-center text-sm text-slate-500">No orders match the selected filter.</div>
      ) : null}
    </div>
  );
}

export default Orders;