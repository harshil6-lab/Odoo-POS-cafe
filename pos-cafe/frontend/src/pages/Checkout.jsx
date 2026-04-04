import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { formatCurrency } from '../utils/helpers';

const paymentMethods = [
  { id: 'cash', title: 'Cash', detail: 'Pay at counter' },
  { id: 'card', title: 'Card / Digital', detail: 'Payment terminal at cashier' },
  { id: 'upi', title: 'UPI QR', detail: 'Scan the QR and complete payment' },
];

export default function Checkout() {
  const { cartItems, customerDetails, selectedTableId, totals, placeOrder } = useAppState();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState(null);
  const [error, setError] = useState('');

  const paymentLabel = useMemo(() => paymentMethods.find((item) => item.id === paymentMethod)?.title || 'Cash', [paymentMethod]);

  const submitOrder = () => {
    try {
      const order = placeOrder(paymentLabel);
      setSuccessOrder(order);
      setError('');
      setShowUpiModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (successOrder) {
    return (
      <div className="bg-[#0B1220] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-semibold text-[#F9FAFB]">Order placed successfully</h1>
              <p className="mt-4 text-sm leading-7 text-slate-400">Your order {successOrder.id} for table {successOrder.tableId} has been added to the mock kitchen workflow.</p>
              <div className="mt-8 flex justify-center gap-3">
                <Link to="/menu">
                  <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]">Back to menu</Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]">Open dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1220] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Checkout</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6 pt-0">
            <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm">
              <p className="text-sm text-slate-400">Table</p>
              <p className="mt-2 text-base font-medium text-[#F9FAFB]">{selectedTableId ? `Table ${selectedTableId}` : 'No table selected'}</p>
              <p className="mt-4 text-sm text-slate-400">Customer</p>
              <p className="mt-2 text-base font-medium text-[#F9FAFB]">{customerDetails.name || 'Guest name missing'}</p>
              {customerDetails.phone ? <p className="mt-1 text-sm text-slate-400">{customerDetails.phone}</p> : null}
            </div>

            <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm">
              <h2 className="text-base font-medium text-[#F9FAFB]">Payment methods</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(method.id);
                      if (method.id === 'upi') {
                        setShowUpiModal(true);
                      }
                    }}
                    className={`rounded-xl border p-6 text-left shadow-sm transition ${paymentMethod === method.id ? 'border-[#F59E0B] bg-[#F59E0B]/10 text-[#F9FAFB]' : 'border-[#374151] bg-[#111827] text-[#F9FAFB] hover:bg-[#0B1220]'}`}
                  >
                    <p className="text-base font-medium">{method.title}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{method.detail}</p>
                  </button>
                ))}
              </div>
            </div>

            {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

            <div className="flex justify-end gap-3">
              <Link to="/menu">
                <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]">Back to menu</Button>
              </Link>
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" onClick={() => paymentMethod === 'upi' ? setShowUpiModal(true) : submitOrder()}>
                Place order
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {cartItems.map((item) => (
              <div key={item.lineId} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium text-[#F9FAFB]">{item.name}</p>
                    {item.preferences?.length ? <p className="mt-2 text-sm text-slate-400">{item.preferences.join(' • ')}</p> : null}
                  </div>
                  <p className="text-sm text-slate-400">x{item.quantity}</p>
                </div>
                <p className="mt-3 text-sm text-slate-400">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}

            <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span>Tax</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#374151] pt-3 text-base font-medium text-[#F9FAFB]">
                <span>Total</span>
                <span className="text-amber-300">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showUpiModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-[#F9FAFB]">UPI QR payment</h2>
            <p className="mt-3 text-sm leading-7 text-slate-400">Scan this placeholder QR to complete the payment in the mock checkout flow.</p>
            <div className="mt-6 flex items-center justify-center rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=POS-Suite-UPI" alt="UPI QR placeholder" className="h-56 w-56 rounded-lg bg-white p-3" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] px-5 text-sm text-[#F9FAFB] hover:bg-[#111827]" onClick={() => setShowUpiModal(false)}>
                Cancel
              </Button>
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]" onClick={submitOrder}>
                I have paid
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}