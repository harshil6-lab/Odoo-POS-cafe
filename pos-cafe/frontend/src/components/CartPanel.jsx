import { Minus, Plus, ScrollText, Trash2, UsersRound } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { formatCurrency } from '../utils/helpers';

function CartPanel({
  variant = 'staff',
  cartItems,
  guestCount,
  subtotal,
  tax,
  total,
  selectedTableId,
  customerDetails,
  onCustomerChange,
  onGuestChange,
  onIncrease,
  onDecrease,
  onRemove,
  onCheckout,
  onSendToKitchen,
  onPayment,
  onClearCart,
}) {
  if (variant === 'customer') {
    return (
      <Card className="flex h-full flex-col overflow-hidden rounded-[28px] border-white/10 bg-[#111827]">
        <CardHeader className="gap-4 border-b border-white/10 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-400">Your cart</p>
              <CardTitle className="mt-1 text-2xl font-semibold text-slate-100">Order summary</CardTitle>
            </div>
            <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium tracking-[0.14em] text-amber-300">
              {selectedTableId ? `Table ${selectedTableId}` : 'Select table'}
            </div>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0B1220] p-4">
            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Guest name
              <Input
                value={customerDetails?.name || ''}
                onChange={(event) => onCustomerChange?.({ name: event.target.value })}
                placeholder="Enter your name"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-slate-300">
              Phone number
              <Input
                value={customerDetails?.phone || ''}
                onChange={(event) => onCustomerChange?.({ phone: event.target.value })}
                placeholder="Optional phone number"
              />
            </label>
          </div>
        </CardHeader>

        <CardContent className="flex min-h-0 flex-1 flex-col p-0">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-5">
            {cartItems.length ? (
              cartItems.map((item) => (
                <div key={item.lineId} className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-slate-100">{item.name}</p>
                      {item.preferences?.length ? <p className="mt-1 text-xs text-slate-400">{item.preferences.join(' • ')}</p> : null}
                      <p className="mt-1 text-xs text-slate-400">{formatCurrency(item.price)} each</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.lineId)}
                      className="rounded-xl border border-white/10 p-2 text-slate-500 transition hover:border-red-500/40 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-[#111827] px-1 py-1">
                      <button type="button" onClick={() => onDecrease(item.lineId)} className="rounded-xl p-2 text-slate-300 transition hover:bg-white/5">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-9 text-center text-sm font-medium text-slate-100">{item.quantity}</span>
                      <button type="button" onClick={() => onIncrease(item.lineId)} className="rounded-xl p-2 text-amber-400 transition hover:bg-white/5">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-amber-400">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#0B1220] p-4 text-center">
                <ScrollText className="h-10 w-10 text-slate-700" />
                <p className="mt-3 text-base font-semibold text-slate-100">No items in the cart</p>
                <p className="mt-1 max-w-xs text-sm text-slate-400">Choose menu items and add your preferences before checkout.</p>
              </div>
            )}
          </div>

          <div className="border-t border-white/10 bg-[#0B1220] p-5">
            <div className="grid gap-3">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Tax</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-base font-semibold text-slate-100">
                <span>Total</span>
                <span className="text-amber-400">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              <Button className="h-11 text-sm" disabled={!cartItems.length || !selectedTableId} onClick={onCheckout}>
                Continue to checkout
              </Button>
              <Button variant="outline" className="h-11 text-sm" disabled={!cartItems.length} onClick={onClearCart}>
                Clear cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl border-slate-800 bg-card shadow-md">
      <CardHeader className="border-b border-slate-800 p-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-xl font-semibold text-white">Current order</CardTitle>
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-background p-2">
            <UsersRound className="h-4 w-4 text-text-secondary" />
            <Input
              type="number"
              value={guestCount}
              onChange={(event) => onGuestChange(Number(event.target.value))}
              className="h-auto w-12 border-none bg-transparent p-0 text-center text-sm text-white"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex min-h-0 flex-1 flex-col p-0">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {cartItems.length ? (
            cartItems.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-800 bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{item.name}</p>
                    <p className="mt-1 text-xs text-text-secondary">{formatCurrency(item.price)} each</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="rounded-md border border-slate-800 p-1.5 text-slate-500 transition hover:border-red-500/40 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-card p-1">
                    <button type="button" onClick={() => onDecrease(item.id)} className="rounded-md p-1.5 text-slate-300 transition hover:bg-slate-800">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-medium text-white">{item.qty}</span>
                    <button type="button" onClick={() => onIncrease(item.id)} className="rounded-md p-1.5 text-primary transition hover:bg-slate-800">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-primary">{formatCurrency(item.price * item.qty)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 bg-background p-4 text-center">
              <ScrollText className="h-8 w-8 text-slate-700" />
              <p className="mt-3 text-sm font-semibold text-white">Cart is empty</p>
              <p className="mt-1 max-w-xs text-xs text-text-secondary">Add products from the grid to get started.</p>
            </div>
          )}
        </div>

        <div className="mt-auto space-y-3 border-t border-slate-800 p-4">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <span>Tax (18%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="flex items-center justify-between text-lg font-semibold text-white">
            <span>Total</span>
            <span className="text-3xl font-bold text-primary">{formatCurrency(total)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={onSendToKitchen}
              className="h-12 w-full rounded-lg bg-primary text-white shadow-lg transition-transform hover:scale-105"
              disabled={!cartItems.length}
            >
              Send to Kitchen
            </Button>
            <Button
              type="button"
              onClick={onPayment}
              className="h-12 w-full rounded-lg bg-green-500 text-white shadow-lg transition-transform hover:scale-105"
              disabled={!cartItems.length}
            >
              Payment
            </Button>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={onClearCart}
            className="h-10 w-full rounded-lg border-slate-800 text-sm text-text-secondary"
            disabled={!cartItems.length}
          >
            Clear Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CartPanel;