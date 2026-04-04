import { Clock3, GripVertical } from 'lucide-react';
import { formatElapsedTime, summarizeItems } from '../utils/helpers';
import { Button } from './ui/Button';

function TicketCard({ ticket, onDragStart, actionLabel, onAction }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(ticket.id)}
      className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg transition-all hover:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-semibold text-white">#{ticket.id}</span>
            <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 font-accent text-[11px] uppercase tracking-[0.24em] text-slate-300">
              {ticket.table}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <Clock3 className="h-4 w-4 text-amber-400" />
            {formatElapsedTime(ticket.elapsedMinutes || 0)}
          </div>
        </div>
        <GripVertical className="h-5 w-5 text-slate-600" />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <p className="text-base leading-7 text-slate-300">{summarizeItems(ticket.items, 4)}</p>
        {ticket.note ? <p className="mt-3 text-sm text-rose-300">Note: {ticket.note}</p> : null}
      </div>

      {actionLabel ? (
        <Button className="mt-5 h-12 w-full rounded-2xl font-accent uppercase tracking-[0.18em]" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default TicketCard;