import { ChefHat, Clock3 } from 'lucide-react';
import { formatDateTime, formatCurrency } from '../utils/helpers';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

function KitchenTicket({ order, onMove }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-5 shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{order.table?.name || 'Pickup'}</p>
          <h3 className="mt-2 text-2xl font-bold text-white">#{order.orderNumber}</h3>
        </div>
        <Badge variant="warning">{order.status}</Badge>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
        <Clock3 className="h-4 w-4" />
        {formatDateTime(order.createdAt)}
      </div>

      <div className="mt-5 space-y-3">
        {order.items.map((item) => (
          <div key={item.id} className="rounded-[1.25rem] bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-white">{item.name}</p>
              <span className="text-sm font-semibold text-brand-300">x{item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
        <span className="flex items-center gap-2"><ChefHat className="h-4 w-4" /> Kitchen ticket</span>
        <span>{formatCurrency(order.totalAmount)}</span>
      </div>

      {onMove ? (
        <Button variant="secondary" className="mt-5 w-full" onClick={() => onMove(order)}>
          Move ticket
        </Button>
      ) : null}
    </article>
  );
}

export default KitchenTicket;