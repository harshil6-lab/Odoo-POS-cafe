import { Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatCurrency } from '../utils/helpers';

function StatusStep({ label, state }) {
  const tone =
    state === 'done'
      ? 'border-teal-500/20 bg-teal-500/10 text-teal-300'
      : state === 'active'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-300'
        : 'border-slate-800 bg-[#111827] text-slate-400';

  return <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${tone}`}>{label}</div>;
}

function CartDrawer({ cartItems, total, orderStatus, onRemove, onCheckout }) {
  return (
    <Card className="flex h-full flex-col rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
      <CardHeader className="border-b border-slate-800 p-4">
        <p className="text-xs uppercase tracking-wide text-slate-400">Cart</p>
        <CardTitle className="mt-1 text-lg font-semibold text-slate-100">Your order</CardTitle>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-4">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          {cartItems.length ? (
            cartItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-[#111827] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-slate-100">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-400">Qty {item.qty}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg border border-slate-800 p-2 text-slate-500 transition hover:border-red-500/30 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm font-medium text-amber-400">{formatCurrency(item.price * item.qty)}</p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-800 bg-[#111827] p-4 text-center">
              <p className="text-base font-semibold text-slate-100">Your cart is empty</p>
              <p className="mt-1 text-xs text-slate-400">Add items to start ordering</p>
            </div>
          )}
        </div>

        <div className="space-y-4 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total</span>
            <span className="font-medium text-amber-400">{formatCurrency(total)}</span>
          </div>

          <Button className="h-11 w-full rounded-lg text-xs font-medium uppercase tracking-wide" onClick={onCheckout}>
            Checkout
          </Button>

          <div className="rounded-lg border border-slate-800 bg-[#111827] p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Order status preview</p>
            <div className="mt-3 grid gap-2">
              {orderStatus.map((step) => (
                <StatusStep key={step.label} label={step.label} state={step.state} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartDrawer;