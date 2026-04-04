import { Armchair, Users } from 'lucide-react';
import { formatCurrency, getStatusTone } from '../utils/helpers';
import { Badge } from './ui/badge';

function TableCard({ table, activeOrder, onSelect, compact = false }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(table)}
      className="panel w-full p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-500/50 hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{table.zone || 'Main Floor'}</p>
          <h3 className="mt-2 text-xl font-bold text-white">{table.name}</h3>
        </div>
        <Badge className={getStatusTone(activeOrder ? 'occupied' : table.status)}>
          {activeOrder ? 'occupied' : table.status}
        </Badge>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-400">
        <div>
          <p className="flex items-center gap-2 text-slate-500"><Users className="h-4 w-4" /> Capacity</p>
          <p className="mt-1 font-semibold text-white">{table.seats} guests</p>
        </div>
        <div>
          <p className="flex items-center gap-2 text-slate-500"><Armchair className="h-4 w-4" /> Current bill</p>
          <p className="mt-1 font-semibold text-white">{formatCurrency(activeOrder?.totalAmount)}</p>
        </div>
      </div>

      {activeOrder ? (
        <p className="mt-4 text-sm text-brand-300">Order #{activeOrder.orderNumber} is {activeOrder.status}.</p>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Tap to open the POS terminal for this table.</p>
      )}

      {!compact ? <div className="mt-4 h-1 rounded-full bg-white/5" /> : null}
    </button>
  );
}

export default TableCard;