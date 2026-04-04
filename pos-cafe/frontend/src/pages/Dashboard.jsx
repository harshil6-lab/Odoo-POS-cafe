import { useState } from 'react';
import { ClipboardList, Coffee, LayoutGrid, ReceiptText } from 'lucide-react';
import KitchenStatusBadge, { KITCHEN_ORDER_STATUSES } from '../components/KitchenStatusBadge';
import TableGrid from '../components/TableGrid';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { useAuth } from '../context/AuthContext';
import { updateMenuItemAvailability } from '../services/menuService';
import { formatCurrency } from '../utils/helpers';

const icons = [LayoutGrid, ClipboardList, Coffee, ReceiptText];

export default function Dashboard() {
  const { displayName } = useAuth();
  const { tables, reservations, kitchenTickets, liveOrders, catalogItems, refreshCatalog, syncKitchenTicketStatus } = useAppState();
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const metrics = [
    { label: 'Tables in service', value: tables.filter((table) => table.status === 'occupied').length, meta: 'Across both floors' },
    { label: 'Reservations', value: reservations.length, meta: 'Synced from Supabase' },
    { label: 'Kitchen tickets', value: kitchenTickets.length, meta: 'Waiting in the kitchen queue' },
    { label: 'Live customer orders', value: liveOrders.length, meta: 'Placed from QR or customer menu' },
  ];

  const handleToggleAvailability = async (item) => {
    setUpdatingItemId(item.id);

    try {
      await updateMenuItemAvailability(item.id, !item.isAvailable);
      await refreshCatalog();
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleOrderStatusChange = async (orderId, nextStatus) => {
    setUpdatingOrderId(orderId);

    try {
      await syncKitchenTicketStatus(orderId, nextStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
        <p className="text-sm text-slate-400">Dashboard</p>
        <h1 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">Welcome back, {displayName}</h1>
        <p className="mt-3 text-sm text-slate-400">
          Keep an eye on floor activity, kitchen flow, and the latest Supabase orders from one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = icons[index];
          return (
            <Card key={metric.label} className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
              <CardContent className="p-4">
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

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Table overview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <TableGrid tables={tables} compact emptyMessage="No live table records were returned from Supabase." />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Upcoming reservations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
              {reservations.length ? reservations.slice(0, 4).map((reservation) => (
                <div key={reservation.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                  <p className="text-base font-medium text-[#F9FAFB]">{reservation.tableId}</p>
                  <p className="mt-2 text-sm text-slate-400">{reservation.name} · {reservation.guests} guests</p>
                  <p className="mt-1 text-sm text-slate-400">{reservation.date} · {reservation.time}</p>
                </div>
              )) : <p className="text-sm text-slate-400">No reservations have been created yet.</p>}
            </CardContent>
          </Card>

          <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-[#F9FAFB]">
                <Coffee className="h-5 w-5 text-[#F59E0B]" />
                Live orders panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 pt-0">
              {liveOrders.length ? liveOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-[#F9FAFB]">Table {order.tableId || 'Walk-in'} · {order.customer.name}</p>
                      <p className="text-sm text-slate-400">{order.items.length} items · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-sm text-slate-400">Order {order.id}</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end">
                      <KitchenStatusBadge status={order.status} />
                      <select
                        value={order.status}
                        className="h-10 rounded-lg border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB] outline-none"
                        disabled={updatingOrderId === order.id}
                        onChange={(event) => void handleOrderStatusChange(order.id, event.target.value)}
                      >
                        {KITCHEN_ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-400">No live orders yet. Place one from the customer flow to see it here.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
        <CardHeader className="p-4">
          <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Menu editor</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-4 pt-0 md:grid-cols-2 xl:grid-cols-3">
          {catalogItems.length ? catalogItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-medium text-[#F9FAFB]">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.category} · {formatCurrency(item.price)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm ${item.isAvailable ? 'bg-emerald-400/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'}`}>
                  {item.isAvailable ? 'Available' : 'Hidden'}
                </span>
              </div>
              <Button
                variant="outline"
                className="mt-4 h-10 w-full rounded-xl border-[#374151] bg-[#0B1220] text-sm text-[#F9FAFB] hover:bg-[#111827]"
                disabled={updatingItemId === item.id}
                onClick={() => void handleToggleAvailability(item)}
              >
                {updatingItemId === item.id ? 'Saving...' : item.isAvailable ? 'Mark unavailable' : 'Mark available'}
              </Button>
            </div>
          )) : <p className="text-sm text-slate-400">No menu items were loaded from Supabase.</p>}
        </CardContent>
      </Card>
    </div>
  );
}