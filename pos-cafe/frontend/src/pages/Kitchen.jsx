import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import KitchenStatusBadge, { KITCHEN_ORDER_STATUSES } from '../components/KitchenStatusBadge';
import { useAppState } from '../context/AppStateContext';

export default function Kitchen() {
  const { kitchenTickets, syncKitchenTicketStatus } = useAppState();
  const [tickets, setTickets] = useState(kitchenTickets);

  useEffect(() => {
    setTickets(kitchenTickets);
  }, [kitchenTickets]);

  const moveTicket = async (id, currentStatus) => {
    const currentIndex = KITCHEN_ORDER_STATUSES.indexOf(String(currentStatus || '').toLowerCase());
    if (currentIndex === KITCHEN_ORDER_STATUSES.length - 1) {
      setTickets((current) => current.filter((ticket) => ticket.id !== id));
      return;
    }

    const nextStatus = KITCHEN_ORDER_STATUSES[currentIndex + 1];
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status: nextStatus } : ticket)));

    try {
      await syncKitchenTicketStatus(id, nextStatus);
    } catch {
      setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status: currentStatus } : ticket)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Kitchen board</h1>
        <p className="mt-3 text-sm text-slate-400">Track every ticket from pending to served using Supabase order data.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        {KITCHEN_ORDER_STATUSES.map((stage, index) => (
          <Card key={stage} className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">{stage[0].toUpperCase() + stage.slice(1)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
              {tickets.filter((ticket) => String(ticket.status).toLowerCase() === stage).map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-medium text-[#F9FAFB]">{ticket.tableId}</p>
                      <p className="mt-1 text-sm text-slate-400">{ticket.id}</p>
                    </div>
                    <KitchenStatusBadge status={ticket.status} />
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    {ticket.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-400">Timer: {ticket.timer}</p>
                  <Button className="mt-4 h-11 w-full rounded-xl text-sm" variant={index === KITCHEN_ORDER_STATUSES.length - 1 ? 'outline' : 'default'} onClick={() => void moveTicket(ticket.id, ticket.status)}>
                    {index === KITCHEN_ORDER_STATUSES.length - 1 ? 'Clear ticket' : `Move to ${KITCHEN_ORDER_STATUSES[index + 1][0].toUpperCase() + KITCHEN_ORDER_STATUSES[index + 1].slice(1)}`}
                  </Button>
                </div>
              ))}
              {!tickets.filter((ticket) => String(ticket.status).toLowerCase() === stage).length ? <div className="rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-4 text-sm text-slate-400">No tickets in this stage.</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}