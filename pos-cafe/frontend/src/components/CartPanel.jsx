import { Minus, Percent, Plus, ReceiptText, StickyNote } from 'lucide-react';
import { calculateOrderTotals, formatCurrency } from '../utils/helpers';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function CartPanel({
  items,
  discountAmount,
  onQuantityChange,
  onAddNote,
  onApplyDiscount,
  onSendToKitchen,
  onOpenPayment,
}) {
  const totals = calculateOrderTotals(items, discountAmount);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Cart panel</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-5">
        <div className="space-y-3">
          {items.length ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-400">{formatCurrency(item.unitPrice ?? item.price)} each</p>
                  </div>
                  <p className="font-semibold text-brand-300">{formatCurrency((item.unitPrice ?? item.price) * item.quantity)}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="icon" onClick={() => onQuantityChange(item.id, -1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="min-w-10 text-center text-sm font-semibold text-white">{item.quantity}</span>
                    <Button variant="secondary" size="icon" onClick={() => onQuantityChange(item.id, 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-xs text-slate-500">Notes ready for kitchen</span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[1.75rem] border border-dashed border-white/10 p-8 text-center text-sm text-slate-500">
              Add products to build an order.
            </div>
          )}
        </div>

        <div className="space-y-3 rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-sm text-slate-400">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(totals.discountAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>{formatCurrency(totals.taxAmount)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Service</span>
            <span>{formatCurrency(totals.serviceCharge)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-lg font-semibold text-white">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={onAddNote}>
            <StickyNote className="h-4 w-4" />
            Add note
          </Button>
          <Button variant="secondary" onClick={onApplyDiscount}>
            <Percent className="h-4 w-4" />
            Apply discount
          </Button>
        </div>

        <Button variant="accent" onClick={onSendToKitchen} disabled={!items.length}>
          <ReceiptText className="h-4 w-4" />
          Send to kitchen
        </Button>
        <Button onClick={() => onOpenPayment(totals)} disabled={!items.length}>
          Payment button
        </Button>
      </CardContent>
    </Card>
  );
}

export default CartPanel;