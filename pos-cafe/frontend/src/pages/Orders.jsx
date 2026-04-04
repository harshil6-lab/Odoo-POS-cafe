import { useMemo, useState } from 'react';
import { Download, Search } from 'lucide-react';
import OrderCard from '../components/OrderCard';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

const FILTERS = ['Active', 'Completed', 'Dine-in', 'Takeaway', 'Delivery'];

const ORDERS = [
  { id: 'ORD-4051', table: 'T05', items: [{ quantity: 2, name: 'Signature Cappuccino' }, { quantity: 1, name: 'Butter Croissant' }], total: 640, status: 'active', statusLabel: 'Active', type: 'dine_in', typeLabel: 'Dine-in', elapsedMinutes: 14 },
  { id: 'ORD-4052', table: 'Counter', items: [{ quantity: 1, name: 'Spanish Latte' }, { quantity: 1, name: 'Hazelnut Brownie' }], total: 440, status: 'completed', statusLabel: 'Completed', type: 'takeaway', typeLabel: 'Takeaway', elapsedMinutes: 26 },
  { id: 'ORD-4053', table: 'T02', items: [{ quantity: 2, name: 'Avocado Toast' }, { quantity: 2, name: 'Iced Matcha' }], total: 1340, status: 'active', statusLabel: 'Preparing', type: 'dine_in', typeLabel: 'Dine-in', elapsedMinutes: 21 },
  { id: 'ORD-4054', table: 'App', items: [{ quantity: 1, name: 'Truffle Mushroom Melt' }, { quantity: 1, name: 'Cold Brew Tonic' }], total: 710, status: 'active', statusLabel: 'Driver assigned', type: 'delivery', typeLabel: 'Delivery', elapsedMinutes: 12 },
  { id: 'ORD-4055', table: 'Counter', items: [{ quantity: 1, name: 'Signature Cappuccino' }, { quantity: 2, name: 'Butter Croissant' }], total: 500, status: 'completed', statusLabel: 'Paid', type: 'takeaway', typeLabel: 'Takeaway', elapsedMinutes: 38 },
];

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('Active');
  const [search, setSearch] = useState('');

  const filteredOrders = useMemo(() => {
    return ORDERS.filter((order) => {
      const matchesSearch = [order.id, order.table, order.typeLabel].join(' ').toLowerCase().includes(search.toLowerCase());
      const filterMap = {
        Active: order.status === 'active',
        Completed: order.status === 'completed',
        'Dine-in': order.type === 'dine_in',
        Takeaway: order.type === 'takeaway',
        Delivery: order.type === 'delivery',
      };

      return matchesSearch && filterMap[activeFilter];
    });
  }, [activeFilter, search]);

  return (
    <div className="space-y-6 p-6">
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
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            action={<Button variant="outline" className="rounded-2xl font-accent uppercase tracking-[0.18em]">Open ticket</Button>}
          />
        ))}
      </div>
    </div>
  );
}