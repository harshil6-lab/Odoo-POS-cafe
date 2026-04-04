import { useEffect, useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import OrderCard from '../components/OrderCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';
import { Input } from '../components/ui/Input';

const FILTERS = ['All', 'Pending', 'Preparing', 'Cooking', 'Ready'];

function formatStatusLabel(status) {
  const normalized = String(status || '').toLowerCase();
  return normalized ? `${normalized[0].toUpperCase()}${normalized.slice(1)}` : 'Pending';
}

export default function Orders() {
  const { liveOrders, refreshOrders } = useAppState();
  const [activeFilter, setActiveFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  const filteredOrders = useMemo(() => {
    return liveOrders
      .map((order) => ({
        ...order,
        table: order.tableId || 'Walk-in',
        type: 'dine_in',
        typeLabel: order.paymentMethod || 'Table order',
        elapsedMinutes: Math.max(0, Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)),
        statusLabel: formatStatusLabel(order.status),
      }))
      .filter((order) => {
        const matchesSearch = [order.id, order.table, order.typeLabel, order.statusLabel].join(' ').toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === 'All' || order.statusLabel === activeFilter;
        return matchesSearch && matchesFilter;
      });
  }, [activeFilter, liveOrders, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Orders board</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-white">Orders</h1>
        </div>
        <Button className="rounded-2xl font-accent uppercase tracking-[0.18em]">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order id, table, or channel" className="h-14 rounded-2xl border-slate-800 bg-slate-950 pl-11" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {FILTERS.map((filter) => (
              <Button key={filter} variant={activeFilter === filter ? 'default' : 'outline'} className="h-12 shrink-0 rounded-2xl px-5 font-accent uppercase tracking-[0.18em]" onClick={() => setActiveFilter(filter)}>
                {filter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {filteredOrders.length ? filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            action={(
              <Link to="/billing">
                <Button variant="outline" className="rounded-2xl font-accent uppercase tracking-[0.18em]">Open billing</Button>
              </Link>
            )}
          />
        )) : (
          <Card>
            <CardContent className="p-6 text-sm text-slate-400">
              No live orders match the current filter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}