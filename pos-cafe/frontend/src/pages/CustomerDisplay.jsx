import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { formatCurrency } from '../utils/helpers';

function CustomerDisplay() {
  const { orders } = useRealtimeOrders({ statuses: ['ready', 'served'] });

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white sm:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-brand-300">Customer display</p>
            <h1 className="mt-4 text-5xl font-bold">Orders ready for pickup</h1>
          </div>
          <p className="text-lg text-slate-300">Live from Supabase Realtime</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.3em] text-brand-300">{order.status}</p>
              <h2 className="mt-4 text-6xl font-black">#{order.order_number}</h2>
              <p className="mt-4 text-lg text-slate-300">{order.customer_name || order.table?.name || 'Guest'}</p>
              <p className="mt-2 text-sm text-slate-400">{order.items?.length || 0} items</p>
              <p className="mt-6 text-xl font-semibold text-white">{formatCurrency(order.total_amount)}</p>
            </article>
          ))}
        </section>

        {!orders.length ? <p className="text-xl text-slate-400">No completed kitchen tickets yet.</p> : null}
      </div>
    </div>
  );
}

export default CustomerDisplay;