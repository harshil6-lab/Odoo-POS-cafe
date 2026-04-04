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
    <div className="page-container space-y-6">
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Orders board</p>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">Orders</h1>
            </div>
          </div>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order id, table, or channel" className="pl-10" />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? 'bg-primary text-white shadow-glow-red'
                    : 'border border-white/[0.06] bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {filteredOrders.length ? filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            action={(
              <Link to="/billing">
                <Button variant="outline" size="sm">Open billing</Button>
              </Link>
            )}
          />
        )) : (
          <Card>
            <CardContent className="p-5 text-sm text-slate-500">
              No live orders match the current filter.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}