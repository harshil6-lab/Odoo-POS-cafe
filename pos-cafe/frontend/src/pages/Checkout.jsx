import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRazorpay } from 'react-razorpay';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { downloadTicketPDF } from '../utils/generateTicketPDF';
import { generateOrderPDF } from '../utils/generateOrderPDF';
import { sendOrderEmail } from '../utils/sendOrderEmail';
import { formatCurrency } from '../utils/helpers';
import { supabase } from '../services/supabaseClient';

const paymentMethods = [
  { id: 'cash', title: 'Cash', detail: 'Pay directly at the counter.' },
  { id: 'card', title: 'Card', detail: 'Card payment collected by cashier.' },
  { id: 'upi', title: 'UPI QR', detail: 'Scan the QR code and complete payment instantly.' },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart, customerDetails, setCustomerDetails, selectedTableId, totals } = useAppState();
  const { Razorpay } = useRazorpay();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [customerEmail, setCustomerEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const paymentLabel = useMemo(() => paymentMethods.find((item) => item.id === paymentMethod)?.title || 'Cash', [paymentMethod]);

  // Auto-set guest name for QR customer flow
  useEffect(() => {
    if (sessionStorage.getItem('table_code') && !customerDetails.name) {
      setCustomerDetails({ name: 'Guest' });
    }
  }, [customerDetails.name, setCustomerDetails]);

  const submitOrder = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Step 1: Resolve table UUID from the table name stored in session (e.g. "T1")
      const { data: tableRecord, error: tableError } = await supabase
        .from('tables')
        .select('id')
        .eq('table_code', selectedTableId)
        .maybeSingle();

      if (tableError) throw new Error(tableError.message);
      if (!tableRecord) throw new Error('Table not found — please scan the QR code again.');

      const finalCustomerName = customerDetails.name?.trim() || 'Guest';

      // Step 2: Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxAmount    = parseFloat((subtotal * 0.08).toFixed(2));
      const serviceCharge = parseFloat((subtotal * 0.02).toFixed(2));
      const totalAmount  = parseFloat((subtotal + taxAmount + serviceCharge).toFixed(2));

      // Step 3: Insert order with correct table_id (UUID)
      const paymentMethodMap = { cash: 'cash', card: 'card', upi: 'upi_qr' };
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          table_id: tableRecord.id,
          customer_name: finalCustomerName,
          payment_method: paymentMethodMap[paymentMethod] ?? 'cash',
          payment_status: 'pending',
          status: 'pending',
          tax: taxAmount,
          service_charge: serviceCharge,
          total: totalAmount,
        })
        .select()
        .maybeSingle();

      if (orderError) throw new Error(orderError.message);
      if (!newOrder) throw new Error('Order creation failed — ensure RLS allows inserts for this role.');

      // Step 4: Insert order items
      const { error: itemsError } = await supabase.from('order_items').insert(
        cartItems.map((item) => ({
          order_id: newOrder.id,
          menu_item_id: item.id,
          quantity: item.quantity,
          price: item.price,
          unit_price: item.price,
          line_total: parseFloat((item.price * item.quantity).toFixed(2)),
          notes: item.preferences?.join(', ') || null,
        })),
      );

      if (itemsError) throw new Error(itemsError.message);

      // Step 5: Mark table occupied
      await supabase.from('tables').update({ status: 'occupied' }).eq('id', tableRecord.id);

      // Step 6: Build receipt object and generate PDFs
      const completedOrder = {
        id: newOrder.id,
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          preferences: item.preferences ?? [],
        })),
        tableId: selectedTableId,
        customer: { name: finalCustomerName, phone: customerDetails.phone },
        customerEmail,
        subtotal,
        taxAmount,
        serviceCharge,
        total: totalAmount,
        paymentMethod: paymentLabel,
        estimatedPrepMinutes: Math.max(12, cartItems.length * 6),
        ticketGeneratedAt: new Date().toISOString(),
      };

      downloadTicketPDF(completedOrder);
      generateOrderPDF(completedOrder);
      sendOrderEmail(completedOrder, customerEmail).catch(() => {});

      sessionStorage.setItem('last_order_id', newOrder.id);
      clearCart();
      navigate(`/order-success/${newOrder.id}`, {
        replace: true,
        state: { order: completedOrder, showToast: true },
      });
    } catch (err) {
      setError(err.message || 'Unable to place the order.');
    } finally {
      setSubmitting(false);
    }
  };

  // Razorpay online payment handler for UPI / Card
  const handleOnlinePayment = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Resolve table
      const { data: tableRecord, error: tableError } = await supabase
        .from('tables')
        .select('id')
        .eq('table_code', selectedTableId)
        .maybeSingle();

      if (tableError) throw new Error(tableError.message);
      if (!tableRecord) throw new Error('Table not found — please scan the QR code again.');

      const finalCustomerName = customerDetails.name?.trim() || 'Guest';
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const taxAmount = parseFloat((subtotal * 0.08).toFixed(2));
      const serviceCharge = parseFloat((subtotal * 0.02).toFixed(2));
      const totalAmount = parseFloat((subtotal + taxAmount + serviceCharge).toFixed(2));

      // Create Razorpay order via backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const orderRes = await fetch(`${backendUrl}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount }),
      });

      if (!orderRes.ok) {
        const errBody = await orderRes.json().catch(() => ({}));
        throw new Error(errBody.error || `Payment server error (${orderRes.status})`);
      }

      const razorpayOrder = await orderRes.json();

      const paymentMethodMap = { cash: 'cash', card: 'card', upi: 'upi_qr' };

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency || 'INR',
        order_id: razorpayOrder.id,
        name: 'Restaurant POS',
        description: `Table ${selectedTableId} · ${cartItems.length} items`,
        prefill: {
          name: finalCustomerName,
          email: customerEmail || undefined,
          contact: customerDetails.phone || undefined,
        },
        theme: { color: '#E11D48' },
        handler: async (response) => {
          try {
            // Insert order as PAID
            const { data: newOrder, error: orderError } = await supabase
              .from('orders')
              .insert({
                table_id: tableRecord.id,
                customer_name: finalCustomerName,
                payment_method: paymentMethodMap[paymentMethod] ?? 'upi_qr',
                payment_status: 'paid',
                status: 'pending',
                tax: taxAmount,
                service_charge: serviceCharge,
                total: totalAmount,
              })
              .select()
              .maybeSingle();

            if (orderError) throw new Error(orderError.message);
            if (!newOrder) throw new Error('Order creation failed.');

            // Insert order items
            const { error: itemsError } = await supabase.from('order_items').insert(
              cartItems.map((item) => ({
                order_id: newOrder.id,
                menu_item_id: item.id,
                quantity: item.quantity,
                price: item.price,
                unit_price: item.price,
                line_total: parseFloat((item.price * item.quantity).toFixed(2)),
                notes: item.preferences?.join(', ') || null,
              })),
            );

            if (itemsError) throw new Error(itemsError.message);

            // Mark table occupied
            await supabase.from('tables').update({ status: 'occupied' }).eq('id', tableRecord.id);

            // Generate receipts
            const completedOrder = {
              id: newOrder.id,
              items: cartItems.map((item) => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                preferences: item.preferences ?? [],
              })),
              tableId: selectedTableId,
              customer: { name: finalCustomerName, phone: customerDetails.phone },
              customerEmail,
              subtotal,
              taxAmount,
              serviceCharge,
              total: totalAmount,
              paymentMethod: paymentLabel,
              paymentId: response.razorpay_payment_id,
              estimatedPrepMinutes: Math.max(12, cartItems.length * 6),
              ticketGeneratedAt: new Date().toISOString(),
            };

            downloadTicketPDF(completedOrder);
            generateOrderPDF(completedOrder);
            sendOrderEmail(completedOrder, customerEmail).catch(() => {});

            sessionStorage.setItem('last_order_id', newOrder.id);
            clearCart();
            navigate(`/order-success/${newOrder.id}`, {
              replace: true,
              state: { order: completedOrder, showToast: true },
            });
          } catch (err) {
            setError(err.message || 'Payment succeeded but order creation failed.');
          } finally {
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
          },
        },
      };

      const rzp = new Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setError(resp.error?.description || 'Payment failed. Please try again.');
        setSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Unable to start payment.');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="glass-card">
          <div className="border-b border-white/[0.06] p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <h1 className="font-display text-2xl font-bold text-white">Checkout</h1>
            </div>
          </div>
          <div className="space-y-5 p-6">
            <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Table number</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedTableId ? `Table ${selectedTableId}` : 'No table selected'}</p>
              <p className="mt-3 text-[11px] uppercase tracking-wider text-slate-500">Customer name</p>
              <p className="mt-1 text-sm font-medium text-white">{customerDetails.name || 'Guest'}</p>
              {customerDetails.phone ? <p className="mt-0.5 text-xs text-slate-400">{customerDetails.phone}</p> : null}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
              <label className="grid gap-1.5 text-xs text-slate-400">
                Email for receipt (optional)
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="customer@email.com"
                  className="h-10 rounded-xl border border-white/[0.08] bg-card px-4 text-sm text-white placeholder:text-slate-600 focus:border-primary/50 focus:outline-none"
                />
              </label>
              <p className="mt-1.5 text-[11px] text-slate-500">We will email your order receipt and PDF to this address.</p>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-surface p-5">
              <h2 className="text-sm font-medium text-white">Payment methods</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id)}
                    className={`rounded-xl border p-4 text-left transition-all duration-200 ${paymentMethod === method.id ? 'border-primary/30 bg-primary/10 text-white ring-1 ring-primary/20' : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04] hover:text-white'}`}
                  >
                    <p className="text-sm font-medium">{method.title}</p>
                    <p className="mt-2 text-[11px] text-slate-500">{method.detail}</p>
                  </button>
                ))}
              </div>
            </div>

            {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

            <div className="flex justify-end gap-2">
              <Link to="/menu">
                <Button variant="outline" size="sm">Back to menu</Button>
              </Link>
              <Button
                size="sm"
                disabled={submitting || !cartItems.length || !selectedTableId}
                onClick={() => {
                  if (paymentMethod === 'cash') {
                    void submitOrder();
                  } else {
                    void handleOnlinePayment();
                  }
                }}
              >
                {submitting ? 'Processing...' : paymentMethod === 'cash' ? 'Place order' : 'Pay & place order'}
              </Button>
            </div>
          </div>
        </div>

        <div className="glass-card">
          <div className="border-b border-white/[0.06] p-5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🧁</span>
              <h2 className="font-display text-lg font-bold text-white">Order summary</h2>
            </div>
          </div>
          <div className="space-y-3 p-5">
            {cartItems.length ? cartItems.map((item) => (
              <div key={item.lineId} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.name}</p>
                    {item.preferences?.length ? <p className="mt-0.5 text-[11px] text-slate-500">{item.preferences.join(' • ')}</p> : null}
                  </div>
                  <p className="text-xs text-slate-400">x{item.quantity}</p>
                </div>
                <p className="mt-1.5 text-xs text-accent">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            )) : <p className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-4 text-sm text-slate-500">Your cart is empty.</p>}

            <div className="rounded-xl border border-white/[0.06] bg-surface p-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Tax</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Service</span>
                <span>{formatCurrency(totals.serviceCharge)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2 text-sm font-semibold text-white">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}