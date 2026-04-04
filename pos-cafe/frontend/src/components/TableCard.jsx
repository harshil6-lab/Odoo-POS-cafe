import { Armchair, Clock3, Receipt, UserRound } from 'lucide-react';
import { formatCurrency, formatElapsedTime, getTableStatusTone } from '../utils/helpers';

function TableCard({ table, isSelected = false, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(table)}
      className={`w-full rounded-2xl border p-6 text-left shadow-lg transition-all ${
        isSelected
          ? 'border-amber-500 bg-slate-800 ring-2 ring-amber-500/40'
          : 'border-slate-800 bg-slate-900 hover:-translate-y-0.5 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Table</p>
          <h3 className="mt-3 font-display text-4xl font-semibold text-white">{table.label || table.name}</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 font-accent text-[11px] uppercase tracking-[0.24em] ${getTableStatusTone(table.status)}`}>
          {table.status}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Armchair className="h-4 w-4" />
            <span className="text-sm">Seats</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">{table.seats || table.capacity}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Receipt className="h-4 w-4" />
            <span className="text-sm">Order amount</span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-amber-400">{formatCurrency(table.orderAmount || 0)}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-400">
        <div className="flex items-center gap-2 min-w-0">
          <UserRound className="h-4 w-4 text-teal-400" />
          <span className="truncate">{table.waiter || 'Unassigned waiter'}</span>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Clock3 className="h-4 w-4 text-amber-400" />
          <span>{formatElapsedTime(table.elapsedMinutes || 0)}</span>
        </div>
      </div>
    </button>
  );
}

export default TableCard;