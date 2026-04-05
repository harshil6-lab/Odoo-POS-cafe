import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, CookingPot, Sparkles } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { supabase } from '../services/supabaseClient';

export default function CustomerDisplay() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Derive stage from order status
  const stage = (!order || ['pending', 'preparing', 'cooking'].includes(order.status)) ? 'preparing' : 'ready';

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, menu_items(name)), tables!orders_table_id_fkey(table_code)')
        .eq('id', orderId)
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setOrder({
          id: data.order_number || data.id?.slice(0, 8),
          table: data.tables?.table_code || 'Unknown',
          status: data.status,
          items: (data.order_items || []).map((oi) => ({
            name: oi.menu_items?.name || 'Item',
            quantity: Number(oi.quantity),
            price: Number(oi.unit_price),
          })),
          subtotal: Number(data.subtotal || 0),
          tax: Number(data.tax_amount || 0),
          total: Number(data.total_amount || 0),
        });
      }
      setLoading(false);
    };

    fetchOrder();

    // Realtime subscription for order updates
    const channel = supabase
      .channel(`customer-display-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => {
        if (payload.new) {
          setOrder((prev) => prev ? { ...prev, status: payload.new.status } : prev);
        }
      })
      .subscribe();

    // Also poll every 5 seconds as fallback
    const interval = setInterval(fetchOrder, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-lg text-slate-400">Loading order display...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Customer Display</h1>
          <p className="mt-4 text-lg text-slate-400">No order ID provided. Append an order ID to the URL.</p>
          <p className="mt-2 text-sm text-slate-500">Example: /admin/customer-display/order-id-here</p>
        </div>
      </div>
    );
  }

  const ORDER = order;

  return (
    <div className="grid min-h-screen bg-slate-950 text-white lg:grid-cols-[1.2fr,0.8fr]">
      <div className="flex flex-col justify-center border-b border-white/[0.06] bg-[radial-gradient(circle_at_top,_rgba(239,79,95,0.12),_transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.96),rgba(2,6,23,1))] p-10 lg:border-b-0 lg:border-r lg:p-16">
        <div className="max-w-3xl">
          <p className="font-accent text-xs uppercase tracking-[0.3em] text-slate-500">Customer display</p>
          <h1 className="mt-6 font-display text-6xl font-semibold leading-none">{stage === 'ready' ? 'Your order is ready' : 'Your order is being prepared'}</h1>
          <p className="mt-6 max-w-2xl text-xl leading-9 text-slate-400">Large-format display for dine-in guests with clear order summary and motion states for service updates.</p>
        </div>

        <div className="mt-14 flex items-center gap-8">
          {stage === 'preparing' ? (
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
              <div className="absolute inset-0 animate-ping rounded-full border border-primary/30" />
              <CookingPot className="h-16 w-16 animate-pulse text-primary" />
            </div>
          ) : (
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-teal-400/20 bg-teal-400/10">
              <div className="absolute inset-0 animate-pulse rounded-full border border-teal-400/30" />
              <CheckCircle2 className="h-16 w-16 animate-bounce text-teal-300" />
            </div>
          )}

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 shadow-lg">
            <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Status</p>
            <p className={`mt-4 font-display text-4xl font-semibold ${stage === 'ready' ? 'text-teal-300' : 'text-primary'}`}>
              {stage === 'ready' ? 'Pickup / Serve now' : 'Barista & kitchen in progress'}
            </p>
            <p className="mt-4 text-lg leading-8 text-slate-400">
              {stage === 'ready'
                ? 'Please proceed to the cashier counter or wait for your server.'
                : 'Your items are in the queue. We will update this screen automatically.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-slate-900 p-10 lg:p-12">
        <div className="rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Order summary</p>
              <h2 className="mt-3 font-display text-4xl font-semibold text-white">#{ORDER.id}</h2>
            </div>
            <div className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 font-accent text-xs uppercase tracking-[0.24em] text-slate-300">
              {ORDER.table}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {ORDER.items.map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-white">{item.quantity}x {item.name}</p>
                  <p className="mt-2 text-sm text-slate-400">Prepared fresh for dine-in service</p>
                </div>
                <p className="text-2xl font-semibold text-amber-400">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3 border-t border-slate-800 pt-6 text-lg text-slate-400">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(ORDER.subtotal)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(ORDER.tax)}</span></div>
            <div className="flex justify-between pt-4 font-display text-4xl font-semibold text-white"><span>Total</span><span className="text-amber-400">{formatCurrency(ORDER.total)}</span></div>
          </div>
        </div>

        <div className="mt-6 rounded-[2rem] border border-slate-800 bg-slate-950/70 p-8 shadow-lg">
          <div className="flex items-start gap-4">
            <Sparkles className="mt-1 h-6 w-6 text-teal-300" />
            <div>
              <p className="font-display text-3xl font-semibold text-white">{stage === 'ready' ? 'Order ready' : 'Preparing your order'}</p>
              <p className="mt-3 text-base leading-8 text-slate-400">This display updates in realtime as your order progresses through the kitchen. Status changes are reflected automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}