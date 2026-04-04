import { ClipboardList, Coffee, LayoutGrid, ReceiptText, Soup } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';

const icons = [LayoutGrid, ClipboardList, Soup, ReceiptText];

export default function Dashboard() {
  const { displayName } = useAuth();
  const { tables, reservations, kitchenTickets, liveOrders } = useAppState();

  const metrics = [
    { label: 'Tables in service', value: tables.filter((table) => table.status === 'occupied').length, meta: 'Across both floors' },
    { label: 'Reservations', value: reservations.length, meta: 'Synced from Supabase' },
    { label: 'Kitchen tickets', value: kitchenTickets.length, meta: 'Preparing to served' },
    { label: 'Live customer orders', value: liveOrders.length, meta: 'Placed from QR or customer menu' },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-6 shadow-sm">
        <p className="text-sm text-slate-400">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">Welcome back, {displayName}</h1>
        <p className="mt-3 text-sm leading-7 text-slate-400">
          Keep an eye on floor activity, kitchen flow, and the latest Supabase orders from one place.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = icons[index];
          return (
            <Card key={metric.label} className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-[#F9FAFB]">{metric.value}</p>
                    <p className="mt-2 text-sm text-slate-400">{metric.meta}</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#374151] bg-[#1F2937] text-[#F59E0B]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Live floor snapshot</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {tables.slice(0, 6).map((table) => (
              <div key={table.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium text-[#F9FAFB]">{table.id}</p>
                    <p className="mt-1 text-sm text-slate-400">{table.floor}</p>
                  </div>
                  <span className="rounded-full border border-[#374151] bg-[#111827] px-3 py-1 text-[11px] font-medium tracking-[0.14em] text-slate-300">
                    {table.status}
                  </span>
                </div>
                <p className="mt-4 text-sm text-slate-400">{table.note}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Upcoming reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {reservations.slice(0, 4).map((reservation) => (
                <div key={reservation.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                  <p className="text-base font-medium text-[#F9FAFB]">{reservation.tableId}</p>
                  <p className="mt-2 text-sm text-slate-400">{reservation.name} · {reservation.guests} guests</p>
                  <p className="mt-1 text-sm text-slate-400">{reservation.date} · {reservation.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-[#F9FAFB]">
                <Coffee className="h-5 w-5 text-[#F59E0B]" />
                Latest orders
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 pt-0">
              {liveOrders.length ? liveOrders.slice(0, 4).map((order) => (
                <div key={order.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                  <p className="text-base font-medium text-[#F9FAFB]">{order.id}</p>
                  <p className="mt-2 text-sm text-slate-400">Table {order.tableId} · {order.customer.name}</p>
                  <p className="mt-1 text-sm text-slate-400">{order.items.length} items · ₹{Math.round(order.total)}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No live orders yet. Place one from the customer flow to see it here.</p>}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}