import { Minus, Plus, ScrollText, Trash2, UsersRound } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { formatCurrency } from '../utils/helpers';

function CartPanel({
  cartItems,
  guestCount,
  subtotal,
  tax,
  total,
  onGuestChange,
  onIncrease,
  onDecrease,
  onRemove,
  onSendToKitchen,
  onPayment,
  onClearCart,
}) {
  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border-slate-800 bg-slate-900">
      <CardHeader className="gap-4 border-b border-slate-800 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Left panel</p>
            <CardTitle className="mt-1 text-3xl text-white">Current order</CardTitle>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
            Dine in
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-slate-300">
              <UsersRound className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">Guest selector</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 p-1">
              <button
                type="button"
                onClick={() => onGuestChange(Math.max(1, guestCount - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-slate-800"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-20 text-center text-sm font-semibold text-white">{guestCount} guests</span>
              <button
                type="button"
                onClick={() => onGuestChange(guestCount + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-amber-400 transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {cartItems.length ? (
            cartItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-base font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatCurrency(item.price)} each</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-lg border border-slate-800 p-2 text-slate-500 transition hover:border-red-500/40 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-2 py-2">
                    <button type="button" onClick={() => onDecrease(item.id)} className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold text-white">{item.qty}</span>
                    <button type="button" onClick={() => onIncrease(item.id)} className="rounded-lg p-2 text-amber-400 transition hover:bg-slate-800">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-lg font-semibold text-amber-400">{formatCurrency(item.price * item.qty)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/50 p-8 text-center">
              <ScrollText className="h-12 w-12 text-slate-700" />
              <p className="mt-5 text-xl font-semibold text-white">No items yet</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">Select products from the center grid to build the current order.</p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 bg-slate-950 p-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-2xl font-semibold text-white">
              <span>Total</span>
              <span className="text-amber-400">{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <Button variant="outline" className="h-12 rounded-xl text-xs font-semibold uppercase tracking-[0.18em]" onClick={onSendToKitchen}>
              Send to kitchen
            </Button>
            <Button className="h-12 rounded-xl text-xs font-semibold uppercase tracking-[0.18em]" disabled={!cartItems.length} onClick={onPayment}>
              Payment
            </Button>
            <Button variant="destructive" className="h-12 rounded-xl text-xs font-semibold uppercase tracking-[0.18em]" disabled={!cartItems.length} onClick={onClearCart}>
              Clear cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartPanel;