import { useMemo, useState } from 'react';
import { ChefHat, TimerReset } from 'lucide-react';
import TicketCard from '../components/TicketCard';

const INITIAL_TICKETS = [
  { id: '4051', table: 'T05', status: 'new', items: [{ quantity: 2, name: 'Signature Cappuccino' }, { quantity: 1, name: 'Butter Croissant' }], note: 'One oat milk', elapsedMinutes: 7 },
  { id: '4052', table: 'T02', status: 'new', items: [{ quantity: 1, name: 'Avocado Toast' }, { quantity: 1, name: 'Spanish Latte' }], note: 'No chilli flakes', elapsedMinutes: 5 },
  { id: '4053', table: 'Counter', status: 'preparing', items: [{ quantity: 2, name: 'Iced Matcha' }], note: '', elapsedMinutes: 14 },
  { id: '4054', table: 'Delivery', status: 'ready', items: [{ quantity: 1, name: 'Truffle Mushroom Melt' }], note: 'Bag separately', elapsedMinutes: 20 },
];

const COLUMNS = [
  { id: 'new', title: 'New', accent: 'text-rose-300 border-rose-500/20 bg-rose-500/10' },
  { id: 'preparing', title: 'Preparing', accent: 'text-amber-300 border-amber-500/20 bg-amber-500/10' },
  { id: 'ready', title: 'Ready', accent: 'text-teal-300 border-teal-400/20 bg-teal-400/10' },
];

export default function KitchenDisplay() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [draggingId, setDraggingId] = useState(null);

  const moveTicket = (id, nextStatus) => {
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status: nextStatus } : ticket)));
  };

  const counts = useMemo(() => {
    return COLUMNS.reduce((accumulator, column) => ({
      ...accumulator,
      [column.id]: tickets.filter((ticket) => ticket.status === column.id).length,
    }), {});
  }, [tickets]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Kitchen display</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white">Prep board</h1>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400 shadow-lg">
          <TimerReset className="h-4 w-4 text-amber-400" />
          Drag tickets between columns or use one-tap status progression.
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {COLUMNS.map((column, index) => (
          <div
            key={column.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => draggingId && moveTicket(draggingId, column.id)}
            className="min-h-[70vh] rounded-[2rem] border border-slate-800 bg-slate-900 p-4 shadow-lg"
          >
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-4 ${column.accent}`}>
              <div className="flex items-center gap-3">
                <ChefHat className="h-5 w-5" />
                <span className="font-display text-2xl font-semibold">{column.title}</span>
              </div>
              <span className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 font-accent text-[11px] uppercase tracking-[0.24em] text-slate-300">
                {counts[column.id]}
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {tickets
                .filter((ticket) => ticket.status === column.id)
                .map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onDragStart={setDraggingId}
                    actionLabel={index < COLUMNS.length - 1 ? `Move to ${COLUMNS[index + 1].title}` : 'Clear from board'}
                    onAction={() => {
                      if (index < COLUMNS.length - 1) {
                        moveTicket(ticket.id, COLUMNS[index + 1].id);
                      } else {
                        setTickets((current) => current.filter((item) => item.id !== ticket.id));
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}