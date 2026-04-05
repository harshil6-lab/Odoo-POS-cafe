import { useState } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
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
  const {
    tables: realTables,
    reservations: realReservations,
    kitchenTickets: realKitchenTickets,
    liveOrders: realLiveOrders,
    catalogItems: realCatalogItems,
    refreshCatalog,
    syncKitchenTicketStatus,
  } = useAppState();
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Dummy data fallbacks
  const dummyTables = [
    { id: 'G1', dbId: 'dummy-g1', label: 'Table G1', floor: 'Ground Floor', status: 'occupied', seats: 4, note: 'G1 — seats 4' },
    { id: 'F1', dbId: 'dummy-f1', label: 'Table F1', floor: 'First Floor', status: 'available', seats: 6, note: 'F1 — seats 6' },
  ];
  const dummyReservations = [
    { id: 'r1', tableId: 'G1', name: 'Alice', guests: 2, date: '2024-06-01', time: '19:00' },
    { id: 'r2', tableId: 'F1', name: 'Bob', guests: 4, date: '2024-06-01', time: '20:00' },
  ];
  const dummyKitchenTickets = [
    { id: 'kt1', tableId: 'G1', status: 'preparing', items: ['Pizza x2', 'Coffee x1'], timer: 'Live' },
    { id: 'kt2', tableId: 'F1', status: 'ready', items: ['Burger x1'], timer: 'Live' },
  ];
  const dummyLiveOrders = [
    { id: 'o1', tableId: 'G1', customer: { name: 'Alice' }, items: [{ name: 'Pizza', quantity: 2 }, { name: 'Coffee', quantity: 1 }], status: 'preparing', createdAt: new Date().toISOString() },
    { id: 'o2', tableId: 'F1', customer: { name: 'Bob' }, items: [{ name: 'Burger', quantity: 1 }], status: 'ready', createdAt: new Date().toISOString() },
    { id: 'o3', tableId: 'G2', customer: { name: 'Charlie' }, items: [{ name: 'Pasta', quantity: 1 }, { name: 'Tea', quantity: 2 }], status: 'cooking', createdAt: new Date().toISOString() },
    { id: 'o4', tableId: 'F2', customer: { name: 'Diana' }, items: [{ name: 'Sandwich', quantity: 3 }], status: 'pending', createdAt: new Date().toISOString() },
    { id: 'o5', tableId: 'G3', customer: { name: 'Eve' }, items: [{ name: 'Salad', quantity: 1 }, { name: 'Juice', quantity: 1 }], status: 'preparing', createdAt: new Date().toISOString() },
    { id: 'o6', tableId: 'F3', customer: { name: 'Frank' }, items: [{ name: 'Pizza', quantity: 1 }, { name: 'Coffee', quantity: 2 }], status: 'ready', createdAt: new Date().toISOString() },
  ];
  const dummyCatalogItems = [
    { id: 'm1', name: 'Pizza', category: 'Meals', price: 299, isAvailable: true },
    { id: 'm2', name: 'Coffee', category: 'Drinks', price: 99, isAvailable: false },
  ];

  const tables = realTables && realTables.length > 0 ? realTables : dummyTables;
  const reservations = realReservations && realReservations.length > 0 ? realReservations : dummyReservations;
  const kitchenTickets = realKitchenTickets && realKitchenTickets.length > 0 ? realKitchenTickets : dummyKitchenTickets;
  const liveOrders = realLiveOrders && realLiveOrders.length > 0 ? realLiveOrders : dummyLiveOrders;
  const catalogItems = realCatalogItems && realCatalogItems.length > 0 ? realCatalogItems : dummyCatalogItems;

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
    <PageWrapper className="page-container space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">👋</span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Dashboard</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Welcome back, {displayName}</h1>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          Keep an eye on floor activity, kitchen flow, and the latest Supabase orders from one place.
        </p>
      </motion.div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => {
          const Icon = icons[index];
          const colors = ['text-primary', 'text-accent', 'text-teal-400', 'text-violet-400'];
          const bgColors = ['bg-primary/10', 'bg-accent/10', 'bg-teal-400/10', 'bg-violet-400/10'];
          const glows = ['shadow-glow-red/20', 'shadow-glow-amber/20', 'shadow-glow-green/20', 'shadow-premium/30'];
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className={`metric-card group transition-shadow duration-300 hover:${glows[index]}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{metric.label}</p>
                  <p className="mt-2 font-display text-3xl font-bold text-white">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{metric.meta}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bgColors[index]} ${colors[index]} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)]">
        <Card className="glass-card">
          <CardHeader className="p-5">
            <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
              🪑 Table overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <TableGrid tables={tables} compact emptyMessage="No live table records were returned from Supabase." />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader className="p-5">
              <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
                📅 Upcoming reservations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              {reservations.length ? reservations.slice(0, 4).map((reservation) => (
                <div key={reservation.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
                  <p className="text-sm font-medium text-white">{reservation.tableId}</p>
                  <p className="mt-1.5 text-xs text-slate-500">{reservation.name} · {reservation.guests} guests</p>
                  <p className="mt-0.5 text-xs text-slate-500">{reservation.date} · {reservation.time}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No reservations have been created yet.</p>}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="p-5">
              <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
                <Coffee className="h-4 w-4 text-accent" />
                Live orders panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5 pt-0">
              {liveOrders.length ? liveOrders.slice(0, 6).map((order) => (
                <div key={order.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">Table {order.tableId || 'Walk-in'} · {order.customer.name}</p>
                      <p className="text-xs text-slate-500">{order.items.length} items · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <KitchenStatusBadge status={order.status} />
                      <select
                        value={order.status}
                        className="h-9 rounded-xl border border-white/[0.08] bg-surface px-3 text-xs text-white outline-none"
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
              )) : <p className="text-sm text-slate-500">No live orders yet. Place one from the customer flow to see it here.</p>}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu editor */}
      <Card className="glass-card">
        <CardHeader className="p-5">
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold">
            🍽️ Menu editor
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-5 pt-0 md:grid-cols-2 xl:grid-cols-3">
          {catalogItems.length ? catalogItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.category} · {formatCurrency(item.price)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${item.isAvailable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {item.isAvailable ? 'Available' : 'Hidden'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                disabled={updatingItemId === item.id}
                onClick={() => void handleToggleAvailability(item)}
              >
                {updatingItemId === item.id ? 'Saving...' : item.isAvailable ? 'Mark unavailable' : 'Mark available'}
              </Button>
            </div>
          )) : <p className="text-sm text-slate-500">No menu items were loaded from Supabase.</p>}
        </CardContent>
      </Card>
    </PageWrapper>
  );
}