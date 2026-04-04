import { formatCurrency, getStatusBadgeClass } from '../utils/helpers';

function TableCard({ table, activeOrder, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(table)}
      className="panel w-full p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{table.area || 'Main Floor'}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{table.name}</h3>
        </div>
        <span className={`badge ${getStatusBadgeClass(activeOrder ? 'occupied' : table.status)}`}>
          {activeOrder ? 'occupied' : table.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div>
          <p className="text-slate-400">Capacity</p>
          <p className="mt-1 font-semibold text-slate-900">{table.capacity} guests</p>
        </div>
        <div>
          <p className="text-slate-400">Current bill</p>
          <p className="mt-1 font-semibold text-slate-900">{formatCurrency(activeOrder?.total_amount)}</p>
        </div>
      </div>

      {activeOrder ? (
        <p className="mt-4 text-sm text-brand-700">Order #{activeOrder.order_number} is {activeOrder.status}.</p>
      ) : (
        <p className="mt-4 text-sm text-slate-500">Tap to start or manage an order.</p>
      )}
    </button>
  );
}

export default TableCard;