import { useMemo } from 'react';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { formatCurrency } from '../utils/helpers';

function Customers() {
  const { orders, loading } = useRealtimeOrders({ limit: 200 });

  const customers = useMemo(() => {
    const map = new Map();

    orders.forEach((order) => {
      if (!order.customer_name) {
        return;
      }

      const current = map.get(order.customer_name) ?? {
        name: order.customer_name,
        visits: 0,
        spend: 0,
      };

      current.visits += 1;
      current.spend += Number(order.total_amount ?? 0);
      map.set(order.customer_name, current);
    });

    return [...map.values()].sort((left, right) => right.spend - left.spend);
  }, [orders]);

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Customer insight</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Returning guests</h2>
        <p className="mt-2 text-sm text-slate-500">This screen derives guest activity from order history. Add a dedicated CRM table later if the hackathon scope grows.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {customers.map((customer) => (
          <article key={customer.name} className="panel p-5">
            <h3 className="text-xl font-bold text-slate-950">{customer.name}</h3>
            <p className="mt-4 text-sm text-slate-500">Visits</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">{customer.visits}</p>
            <p className="mt-4 text-sm text-slate-500">Lifetime spend</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{formatCurrency(customer.spend)}</p>
          </article>
        ))}
      </section>

      {!loading && !customers.length ? (
        <div className="panel p-8 text-center text-sm text-slate-500">Guest names will appear here once orders are placed with a customer name.</div>
      ) : null}
    </div>
  );
}

export default Customers;