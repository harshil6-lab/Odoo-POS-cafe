import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import KitchenStatusBadge from '../components/KitchenStatusBadge';
import MenuCard from '../components/MenuCard';
import TableGrid from '../components/TableGrid';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAppState } from '../context/AppStateContext';
import { updateTableStatus } from '../services/tableService';
import { formatCurrency } from '../utils/helpers';

const statusOptions = ['cleaning', 'available'];
const paymentMethods = ['Cash', 'Card', 'UPI QR'];

export default function Register() {
  const navigate = useNavigate();
  const { tableId: routeTableId } = useParams();
  const [searchParams] = useSearchParams();
  const {
    selectedTableId,
    setSelectedTableId,
    tables,
    catalogItems,
    catalogCategories,
    cartItems,
    addCartItem,
    updateCartQuantity,
    removeCartItem,
    clearCart,
    customerDetails,
    setCustomerDetails,
    totals,
    placeOrder,
    liveOrders,
    refreshTables,
    syncKitchenTicketStatus,
  } = useAppState();

  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    // Path param from /register/:tableId takes priority, fallback to ?table= query
    if (routeTableId) {
      // routeTableId is a DB id — find matching table and set its display id
      const match = tables.find((t) => t.dbId === routeTableId || t.id === routeTableId);
      if (match) setSelectedTableId(match.id);
    } else {
      const tableParam = searchParams.get('table');
      if (tableParam) setSelectedTableId(tableParam);
    }
  }, [routeTableId, searchParams, tables, setSelectedTableId]);

  const categories = useMemo(() => ['All', ...catalogCategories.map((category) => category.name)], [catalogCategories]);
  const activeTable = tables.find((table) => table.id === selectedTableId) || null;
  const activeStatuses = ['pending', 'preparing', 'cooking', 'ready'];
  const activeTableOrders = useMemo(() => liveOrders.filter((order) => order.tableId === selectedTableId && activeStatuses.includes(order.status)), [liveOrders, selectedTableId]);
  const tableHasActiveOrder = activeTableOrders.length > 0;
  const activeOrderTotal = useMemo(() => activeTableOrders.reduce((sum, order) => sum + order.total, 0), [activeTableOrders]);
  const filteredItems = useMemo(
    () =>
      catalogItems.filter((item) => {
        const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
        const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      }),
    [activeCategory, catalogItems, search],
  );

  const handleTableStatusUpdate = async (status) => {
    if (!activeTable?.dbId) {
      return;
    }

    setStatusLoading(true);
    setError('');

    try {
      await updateTableStatus(activeTable.dbId, status);
      await refreshTables();
    } catch (err) {
      setError(err.message || 'Unable to update table status.');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmitOrder = async () => {
    setPlacingOrder(true);
    setError('');

    try {
      const order = await placeOrder({ paymentMethod, releaseTable: false });
      // Redirect to billing for the specific table so cashier can complete payment
      const tableDbId = tables.find((t) => t.id === selectedTableId)?.dbId;
      navigate(tableDbId ? `/billing/${tableDbId}` : '/billing', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to send the order to billing.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧑‍🍳</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Waiter workspace</p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">Register</h1>
              <p className="mt-1 text-sm text-slate-400">
                Select a table, add menu items, and send the order to billing.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { value: activeTable?.id || '—', label: 'Active table' },
              { value: activeTableOrders.length, label: 'Table orders' },
              { value: formatCurrency(activeOrderTotal + totals.total), label: 'Order value' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                <p className="font-display text-xl font-bold text-white">{stat.value}</p>
                <p className="mt-0.5 text-[11px] text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[320px,minmax(0,1fr),340px]">
        {/* Tables panel */}
        <Card className="glass-card">
          <CardHeader className="p-4">
            <CardTitle className="font-display text-base font-semibold">🪑 Tables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <TableGrid
              tables={tables}
              selectedTableId={selectedTableId}
              compact
              actionLabel="Select table"
              emptyMessage="No table records were returned from Supabase."
              onSelect={(table) => setSelectedTableId(table.id)}
            />

            {activeTable ? (
              <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick actions</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!activeTableOrders.length}
                    onClick={() => void syncKitchenTicketStatus(activeTableOrders[0].id, 'served')}
                  >
                    Mark served
                  </Button>
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      size="sm"
                      disabled={statusLoading}
                      onClick={() => void handleTableStatusUpdate(status)}
                    >
                      {status === 'cleaning' ? 'Mark cleaning' : 'Mark available'}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Menu grid */}
        <Card className="glass-card">
          <CardHeader className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-display text-base font-semibold">📋 Menu items</CardTitle>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                {selectedTableId ? `Table ${selectedTableId}` : 'No table'}
              </span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu items..." className="pl-10" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    activeCategory === category
                      ? 'bg-primary text-white shadow-glow-red'
                      : 'border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.length ? filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} actionLabel="Add" compact onAdd={(product) => addCartItem(product, [])} />
            )) : <p className="text-sm text-slate-500">No menu items match this filter.</p>}
          </CardContent>
        </Card>

        {/* Cart / Order panel */}
        <Card className="glass-card sticky top-24 self-start">
          <CardHeader className="p-4">
            <CardTitle className="font-display text-base font-semibold">🛒 Current order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <label className="grid gap-1.5 text-xs text-slate-400">
              Customer name
              <Input value={customerDetails.name || ''} onChange={(event) => setCustomerDetails({ name: event.target.value })} placeholder="Walk-in guest" />
            </label>

            <label className="grid gap-1.5 text-xs text-slate-400">
              Phone
              <Input value={customerDetails.phone || ''} onChange={(event) => setCustomerDetails({ phone: event.target.value })} placeholder="Optional" />
            </label>

            <label className="grid gap-1.5 text-xs text-slate-400">
              Payment method
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="h-10 rounded-xl border border-white/[0.08] bg-surface px-3 text-sm text-white outline-none">
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </label>

            <div className="max-h-[280px] space-y-2 overflow-y-auto pr-1">
              {cartItems.length ? cartItems.map((item) => (
                <div key={item.lineId} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-white">{item.name}</p>
                      {item.preferences?.length ? <p className="mt-0.5 text-[11px] text-slate-500">{item.preferences.join(' · ')}</p> : null}
                    </div>
                    <button type="button" className="text-[11px] text-rose-400 hover:text-rose-300" onClick={() => removeCartItem(item.lineId)}>Remove</button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => updateCartQuantity(item.lineId, -1)}>−</Button>
                      <span className="min-w-6 text-center text-xs text-white">{item.quantity}</span>
                      <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => updateCartQuantity(item.lineId, 1)}>+</Button>
                    </div>
                    <p className="text-xs font-medium text-accent">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              )) : <p className="rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] p-3 text-center text-xs text-slate-500">Add menu items to start.</p>}
            </div>

            {/* Totals */}
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-xs">
              {[
                ['Subtotal', formatCurrency(totals.subtotal)],
                ['Tax', formatCurrency(totals.taxAmount)],
                ['Service', formatCurrency(totals.serviceCharge)],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1 text-slate-400">
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2 text-sm font-semibold text-white">
                <span>Total</span>
                <span className="text-accent">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <div className="grid gap-2">
              {tableHasActiveOrder ? (
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-300">
                  This table has an active order. Complete it first.
                </p>
              ) : null}
              <Button disabled={placingOrder || !selectedTableId || !cartItems.length || tableHasActiveOrder} onClick={() => void handleSubmitOrder()}>
                {placingOrder ? 'Sending...' : 'Send to billing'}
              </Button>
              <Button variant="outline" disabled={!cartItems.length} onClick={clearCart}>
                Clear order
              </Button>
            </div>

            {/* Active order details */}
            <div className="space-y-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Open orders</p>
              {activeTableOrders.length ? activeTableOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-white">{String(order.id).slice(0, 8)}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{order.items.length} items · {formatCurrency(order.total)}</p>
                    </div>
                    <KitchenStatusBadge status={order.status} />
                  </div>
                </div>
              )) : <p className="text-xs text-slate-500">Select a table to see open orders.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}