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
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-slate-800 bg-card">
          <ShoppingCart className="h-10 w-10 text-slate-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Your cart is empty</h2>
          <p className="mt-2 text-sm text-text-secondary">Browse our menu and add items to get started.</p>
        </div>
        <Link to="/menu">
          <Button className="h-11 rounded-xl bg-primary px-6 text-sm text-white hover:bg-primary/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0B1220] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">Your Cart</h1>
              <p className="mt-1 text-sm text-text-secondary">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} added</p>
            </div>
            <Button
              variant="outline"
              className="h-10 rounded-xl border-rose-500/30 bg-rose-500/10 px-4 text-sm text-rose-300 hover:bg-rose-500/20"
              onClick={clearCart}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear cart
            </Button>
          </div>

          {cartItems.map((item) => (
            <Card key={item.lineId} className="rounded-xl border-slate-800 bg-card">
              <CardContent className="flex items-center gap-4 p-4">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-500">No img</div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-white">{item.name}</p>
                  {item.preferences?.length ? (
                    <p className="mt-1 text-xs text-slate-400">{item.preferences.join(' • ')}</p>
                  ) : null}
                  <p className="mt-1 text-sm text-amber-400">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.lineId, Math.max(1, item.quantity - 1))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-white transition hover:bg-slate-700"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.lineId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-white transition hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-base font-semibold text-white">{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    type="button"
                    onClick={() => removeCartItem(item.lineId)}
                    className="mt-1 text-xs text-rose-400 transition hover:text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Link to="/menu" className="inline-flex items-center gap-2 text-sm text-amber-400 transition hover:text-amber-300">
            <ArrowLeft className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>

        <Card className="sticky top-24 rounded-xl border-slate-800 bg-card">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-semibold text-white">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            {selectedTableId ? (
              <div className="rounded-lg border border-slate-800 bg-background px-4 py-3">
                <p className="text-xs text-slate-500">Table</p>
                <p className="text-sm font-medium text-white">Table {selectedTableId}</p>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-3">
                <p className="text-xs text-amber-400">No table selected</p>
                <p className="text-xs text-slate-400">Select a table from the menu page</p>
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
              <div className="flex justify-between border-t border-slate-800 pt-2 text-base font-semibold text-white">
                <span>Total</span>
                <span className="text-amber-400">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button
                className="h-12 w-full rounded-xl bg-primary text-sm font-medium text-white hover:bg-primary/90"
                disabled={!cartItems.length || !selectedTableId}
              >
                Proceed to checkout — {formatCurrency(totals.total)}
              </Button>
            </Link>

            {!selectedTableId && cartItems.length > 0 ? (
              <p className="text-center text-xs text-amber-400">Please select a table before checkout</p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
