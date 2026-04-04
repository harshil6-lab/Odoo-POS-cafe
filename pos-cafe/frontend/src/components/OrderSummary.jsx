import { formatCurrency } from '../utils/helpers';

function OrderSummary({ cartItems, totals, onQuantityChange, onRemoveItem, onCheckout }) {
  return (
    <div className="panel flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Current order</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Summary</h2>
        </div>
        <span className="badge bg-slate-100 text-slate-700">{cartItems.length} items</span>
      </div>

      <div className="mt-5 flex-1 space-y-3 overflow-y-auto">
        {cartItems.length ? (
          cartItems.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{formatCurrency(item.price)} each</p>
                </div>
                <button type="button" className="text-sm font-semibold text-rose-600" onClick={() => onRemoveItem(item.id)}>
                  Remove
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button type="button" className="btn-secondary h-9 w-9 px-0" onClick={() => onQuantityChange(item.id, -1)}>
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                  <button type="button" className="btn-secondary h-9 w-9 px-0" onClick={() => onQuantityChange(item.id, 1)}>
                    +
                  </button>
                </div>
                <p className="font-semibold text-slate-900">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center text-sm text-slate-500">
            Add products from the menu to start a live order.
          </div>
        )}
      </div>

      <div className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Tax</span>
          <span>{formatCurrency(totals.taxAmount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Service charge</span>
          <span>{formatCurrency(totals.serviceCharge)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
          <span>Total</span>
          <span>{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <button type="button" className="btn-primary mt-5 w-full" onClick={onCheckout} disabled={!cartItems.length}>
        Proceed to payment
      </button>
    </div>
  );
}

export default OrderSummary;