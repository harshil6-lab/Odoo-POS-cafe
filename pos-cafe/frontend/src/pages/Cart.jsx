import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { formatCurrency } from '../utils/helpers';

export default function Cart() {
  const { cartItems, updateCartQuantity, removeCartItem, clearCart, totals, selectedTableId } = useAppState();

  if (!cartItems.length) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02]">
          <ShoppingCart className="h-10 w-10 text-slate-600" />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-white">Your cart is empty</h2>
          <p className="mt-2 text-sm text-slate-400">Browse our menu and add items to get started.</p>
        </div>
        <Link to="/menu">
          <Button size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="space-y-4">
          <div className="glass-card flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h1 className="font-display text-xl font-bold text-white">Your Cart</h1>
                <p className="mt-0.5 text-xs text-slate-400">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} added</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10"
              onClick={clearCart}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Clear cart
            </Button>
          </div>

          {cartItems.map((item) => (
            <div key={item.lineId} className="glass-card p-4">
              <div className="flex items-center gap-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-14 w-14 rounded-xl border border-white/[0.06] object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/[0.06] bg-surface text-xs text-slate-600">No img</div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{item.name}</p>
                  {item.preferences?.length ? (
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.preferences.join(' • ')}</p>
                  ) : null}
                  <p className="mt-0.5 text-sm text-accent">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.lineId, -1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-surface text-white transition hover:bg-white/[0.04]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-7 text-center text-xs font-medium text-white">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.lineId, 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.06] bg-surface text-white transition hover:bg-white/[0.04]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => removeCartItem(item.lineId)}
                    className="mt-0.5 text-[11px] text-rose-400 transition hover:text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <Link to="/menu" className="inline-flex items-center gap-2 text-sm text-primary transition hover:text-primary/80">
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <Card className="sticky top-24 glass-card">
          <CardHeader className="p-5">
            <CardTitle className="font-display text-lg font-bold text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-5 pt-0">
            {selectedTableId ? (
              <div className="rounded-lg border border-white/[0.06] bg-surface px-4 py-3">
                <p className="text-[11px] text-slate-500">Table</p>
                <p className="text-sm font-medium text-white">Table {selectedTableId}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-primary/20 bg-primary/5 px-4 py-3">
                <p className="text-xs text-primary">No table selected</p>
                <p className="text-[11px] text-slate-500">Select a table from the menu page</p>
              </div>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tax</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Service charge</span>
                <span>{formatCurrency(totals.serviceCharge)}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.06] pt-2 text-base font-semibold text-white">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button
                className="w-full"
                disabled={!cartItems.length || !selectedTableId}
              >
                Proceed to checkout — {formatCurrency(totals.total)}
              </Button>
            </Link>

            {!selectedTableId && cartItems.length > 0 ? (
              <p className="text-center text-[11px] text-primary">Please select a table before checkout</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
