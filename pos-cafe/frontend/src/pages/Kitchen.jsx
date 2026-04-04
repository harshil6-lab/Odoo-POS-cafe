import { useEffect, useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { getOrderStatusTone } from '../utils/helpers';

const stages = ['Preparing', 'Cooking', 'Ready', 'Served'];

export default function Kitchen() {
  const { kitchenTickets, syncKitchenTicketStatus } = useAppState();
  const [tickets, setTickets] = useState(kitchenTickets);

  useEffect(() => {
    setTickets(kitchenTickets);
  }, [kitchenTickets]);

  const moveTicket = async (id, currentStatus) => {
    const currentIndex = stages.indexOf(currentStatus);
    if (currentIndex === stages.length - 1) {
      setTickets((current) => current.filter((ticket) => ticket.id !== id));
      return;
    }

    const nextStatus = stages[currentIndex + 1];
    setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status: nextStatus } : ticket)));

    try {
      await syncKitchenTicketStatus(id, nextStatus);
    } catch {
      setTickets((current) => current.map((ticket) => (ticket.id === id ? { ...ticket, status: currentStatus } : ticket)));
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#F9FAFB]">Kitchen board</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">Track every ticket from preparing to served using Supabase order data.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-4">
        {stages.map((stage, index) => (
          <Card key={stage} className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">{stage}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {tickets.filter((ticket) => ticket.status === stage).map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-medium text-[#F9FAFB]">{ticket.tableId}</p>
                      <p className="mt-1 text-sm text-slate-400">{ticket.id}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] ${getOrderStatusTone(ticket.status.toLowerCase())}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    {ticket.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-400">Timer: {ticket.timer}</p>
                  <Button className="mt-4 h-11 w-full rounded-xl text-sm" variant={index === stages.length - 1 ? 'outline' : 'default'} onClick={() => void moveTicket(ticket.id, ticket.status)}>
                    {index === stages.length - 1 ? 'Clear ticket' : `Move to ${stages[index + 1]}`}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}