import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
    const tableParam = searchParams.get('table');
    if (tableParam) {
      setSelectedTableId(tableParam);
    }
  }, [searchParams, setSelectedTableId]);

  const categories = useMemo(() => ['All', ...catalogCategories.map((category) => category.name)], [catalogCategories]);
  const activeTable = tables.find((table) => table.id === selectedTableId) || null;
  const activeTableOrders = useMemo(() => liveOrders.filter((order) => order.tableId === selectedTableId), [liveOrders, selectedTableId]);
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
      await placeOrder({ paymentMethod, releaseTable: false });
      navigate('/billing', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to send the order to billing.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Waiter workspace</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#F9FAFB]">Register</h1>
            <p className="mt-3 text-sm text-slate-400">
              Select a table, add live menu items from Supabase, update the table status, and send the order to billing.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#374151] bg-[#0B1220] px-4 py-4">
              <p className="text-2xl font-semibold text-[#F9FAFB]">{activeTable?.id || 'No table'}</p>
              <p className="mt-1 text-sm text-slate-400">Active table</p>
            </div>
            <div className="rounded-xl border border-[#374151] bg-[#0B1220] px-4 py-4">
              <p className="text-2xl font-semibold text-[#F9FAFB]">{liveOrders.length}</p>
              <p className="mt-1 text-sm text-slate-400">Live orders</p>
            </div>
            <div className="rounded-xl border border-[#374151] bg-[#0B1220] px-4 py-4">
              <p className="text-2xl font-semibold text-[#F9FAFB]">{formatCurrency(totals.total)}</p>
              <p className="mt-1 text-sm text-slate-400">Current order value</p>
            </div>
          </div>
        </div>
      </div>

      {error ? <p className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[340px,minmax(0,1fr),360px]">
        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Tables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 pt-0">
            <TableGrid
              tables={tables}
              selectedTableId={selectedTableId}
              compact
              actionLabel="Select table"
              emptyMessage="No table records were returned from Supabase."
              onSelect={(table) => setSelectedTableId(table.id)}
            />

            {activeTable ? (
              <div className="space-y-3 rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                <p className="text-xl font-medium text-[#F9FAFB]">Quick actions</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-10 rounded-lg border border-slate-600 text-white hover:bg-slate-800"
                    disabled={!activeTableOrders.length}
                    onClick={() => void syncKitchenTicketStatus(activeTableOrders[0].id, 'served')}
                  >
                    Mark served
                  </Button>
                  {statusOptions.map((status) => (
                    <Button
                      key={status}
                      variant="outline"
                      className="h-10 rounded-lg border border-slate-600 text-white hover:bg-slate-800"
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

        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Manual order entry</CardTitle>
              <div className="rounded-full border border-[#374151] bg-[#0B1220] px-4 py-2 text-sm text-[#F9FAFB]">
                {selectedTableId ? `Table ${selectedTableId}` : 'Select a table'}
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search menu items" className="pl-10" />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-xl border px-4 py-2 text-sm transition ${
                    activeCategory === category
                      ? 'border-[#F59E0B] bg-[#F59E0B] text-[#0B1220]'
                      : 'border-[#374151] bg-[#1F2937] text-[#F9FAFB] hover:bg-[#111827]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 p-4 pt-0 md:grid-cols-2 xl:grid-cols-3">
            {filteredItems.length ? filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} actionLabel="Add" compact onAdd={(product) => addCartItem(product, [])} />
            )) : <p className="text-sm text-slate-400">No menu items match this filter.</p>}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-[#374151] bg-[#111827] shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-2xl font-semibold text-[#F9FAFB]">Current order</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-4 pt-0">
            <label className="grid gap-2 text-sm text-[#F9FAFB]">
              Customer name
              <Input value={customerDetails.name || ''} onChange={(event) => setCustomerDetails({ name: event.target.value })} placeholder="Walk-in guest" />
            </label>

            <label className="grid gap-2 text-sm text-[#F9FAFB]">
              Phone number
              <Input value={customerDetails.phone || ''} onChange={(event) => setCustomerDetails({ phone: event.target.value })} placeholder="Optional phone number" />
            </label>

            <label className="grid gap-2 text-sm text-[#F9FAFB]">
              Payment method
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} className="h-11 rounded-xl border border-[#374151] bg-[#0B1220] px-3 text-sm text-[#F9FAFB] outline-none">
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </label>

            <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
              {cartItems.length ? cartItems.map((item) => (
                <div key={item.lineId} className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-medium text-[#F9FAFB]">{item.name}</p>
                      {item.preferences?.length ? <p className="mt-1 text-sm text-slate-400">{item.preferences.join(' • ')}</p> : null}
                    </div>
                    <button type="button" className="text-sm text-rose-300" onClick={() => removeCartItem(item.lineId)}>Remove</button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" className="h-9 w-9 rounded-xl border-[#374151] bg-[#111827] p-0 text-sm text-[#F9FAFB] hover:bg-[#1F2937]" onClick={() => updateCartQuantity(item.lineId, -1)}>
                        -
                      </Button>
                      <span className="min-w-8 text-center text-sm text-[#F9FAFB]">{item.quantity}</span>
                      <Button variant="outline" className="h-9 w-9 rounded-xl border-[#374151] bg-[#111827] p-0 text-sm text-[#F9FAFB] hover:bg-[#1F2937]" onClick={() => updateCartQuantity(item.lineId, 1)}>
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-[#F59E0B]">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              )) : <p className="rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-4 text-sm text-slate-400">Add menu items to start the order.</p>}
            </div>

            <div className="rounded-xl border border-[#374151] bg-[#0B1220] p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span>Tax</span>
                <span>{formatCurrency(totals.taxAmount)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                <span>Service</span>
                <span>{formatCurrency(totals.serviceCharge)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-[#374151] pt-3 text-base font-medium text-[#F9FAFB]">
                <span>Total</span>
                <span className="text-[#F59E0B]">{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <div className="grid gap-3">
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] text-sm text-[#0B1220] hover:bg-[#D97706]" disabled={placingOrder || !selectedTableId || !cartItems.length} onClick={() => void handleSubmitOrder()}>
                {placingOrder ? 'Sending to billing...' : 'Send order to billing'}
              </Button>
              <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#1F2937] text-sm text-[#F9FAFB] hover:bg-[#111827]" disabled={!cartItems.length} onClick={clearCart}>
                Clear order
              </Button>
            </div>

            <div className="space-y-3 rounded-xl border border-[#374151] bg-[#0B1220] p-4">
              <p className="text-xl font-medium text-[#F9FAFB]">Open order details</p>
              {activeTableOrders.length ? activeTableOrders.map((order) => (
                <div key={order.id} className="rounded-xl border border-[#374151] bg-[#111827] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-[#F9FAFB]">{order.id}</p>
                      <p className="mt-1 text-sm text-slate-400">{order.items.length} items · {formatCurrency(order.total)}</p>
                    </div>
                    <KitchenStatusBadge status={order.status} />
                  </div>
                </div>
              )) : <p className="text-sm text-slate-400">Select a table with an active order to inspect its status.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}