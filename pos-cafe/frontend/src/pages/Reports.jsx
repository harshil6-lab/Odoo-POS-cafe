import { useEffect, useMemo, useState } from 'react';
import { fetchOrders, fetchPayments } from '../services/orderService';
import { formatCurrency } from '../utils/helpers';

function Reports() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);

      try {
        const [orderData, paymentData] = await Promise.all([fetchOrders({ limit: 500 }), fetchPayments(500)]);
        setOrders(orderData);
        setPayments(paymentData);
        setError('');
      } catch (err) {
        setError(err.message ?? 'Unable to load reports.');
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, []);

  const summary = useMemo(() => {
    const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
    const averageOrder = orders.length ? revenue / orders.length : 0;
    const paymentMix = payments.reduce((sum, payment) => {
      sum[payment.method] = (sum[payment.method] ?? 0) + Number(payment.amount ?? 0);
      return sum;
    }, {});

    const productMix = orders.reduce((sum, order) => {
      order.items?.forEach((item) => {
        const name = item.product?.name || 'Unknown item';
        sum[name] = (sum[name] ?? 0) + Number(item.quantity ?? 0);
      });
      return sum;
    }, {});

    const topProducts = Object.entries(productMix)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((left, right) => right.quantity - left.quantity)
      .slice(0, 5);

    return {
      revenue,
      averageOrder,
      totalOrders: orders.length,
      paymentMix,
      topProducts,
    };
  }, [orders, payments]);

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Business intelligence</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">Revenue and trend summary</h2>
      </section>

      {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Total revenue</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '--' : formatCurrency(summary.revenue)}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Orders processed</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '--' : summary.totalOrders}</p>
        </div>
        <div className="panel p-5">
          <p className="text-sm text-slate-500">Average order value</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">{loading ? '--' : formatCurrency(summary.averageOrder)}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="panel p-6">
          <h3 className="text-xl font-bold text-slate-950">Payment mix</h3>
          <div className="mt-5 space-y-3">
            {Object.entries(summary.paymentMix).map(([method, amount]) => (
              <div key={method} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold uppercase">{method}</span>
                <span>{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="text-xl font-bold text-slate-950">Top selling items</h3>
          <div className="mt-5 space-y-3">
            {summary.topProducts.map((product) => (
              <div key={product.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold">{product.name}</span>
                <span>{product.quantity} sold</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reports;