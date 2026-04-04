import { Clock3, ReceiptText, Store, UtensilsCrossed } from 'lucide-react';
import { formatCurrency, formatElapsedTime, getOrderStatusTone, summarizeItems } from '../utils/helpers';

function OrderCard({ order, action }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg transition-all hover:bg-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-semibold text-white">{order.table}</span>
            <span className={`rounded-full border px-3 py-1 font-accent text-[11px] uppercase tracking-[0.24em] ${getOrderStatusTone(order.status)}`}>
              {order.statusLabel || order.status}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="inline-flex items-center gap-2">
              <Store className="h-4 w-4 text-teal-400" />
              {order.typeLabel || order.type}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-amber-400" />
              {formatElapsedTime(order.elapsedMinutes || 0)} elapsed
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Total amount</p>
          <p className="mt-2 text-2xl font-semibold text-amber-400">{formatCurrency(order.total)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr,auto] lg:items-end">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <UtensilsCrossed className="h-4 w-4" />
            <span className="text-sm">Items summary</span>
          </div>
          <p className="mt-3 text-base leading-7 text-slate-300">{summarizeItems(order.items)}</p>
        </div>
        {action || (
          <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
            <ReceiptText className="h-4 w-4 text-amber-400" />
            Ready for realtime sync later
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderCard;