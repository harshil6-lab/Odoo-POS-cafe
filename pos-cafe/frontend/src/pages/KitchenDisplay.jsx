import { useMemo, useState } from 'react';
import { ChefHat } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { kitchenOrders } from '../data/restaurantData';

const columns = [
  { id: 'pending', title: 'Pending', tone: 'border-rose-500/20 bg-rose-500/10 text-rose-300' },
  { id: 'preparing', title: 'Preparing', tone: 'border-amber-500/20 bg-amber-500/10 text-amber-300' },
  { id: 'ready', title: 'Ready', tone: 'border-teal-500/20 bg-teal-500/10 text-teal-300' },
];

export default function KitchenDisplay() {
  const [orders, setOrders] = useState(kitchenOrders);

  const counts = useMemo(
    () => columns.reduce((acc, column) => ({ ...acc, [column.id]: orders.filter((order) => order.status === column.id).length }), {}),
    [orders],
  );

  const moveOrder = (id, currentIndex) => {
    if (currentIndex === columns.length - 1) {
      setOrders((current) => current.filter((order) => order.id !== id));
      return;
    }

    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status: columns[currentIndex + 1].id } : order)));
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Kitchen</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100">Chef display</h1>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column, index) => (
          <Card key={column.id} className="rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
            <CardHeader className="p-4">
              <div className={`flex items-center justify-between rounded-lg border px-3 py-3 ${column.tone}`}>
                <div className="flex items-center gap-2">
                  <ChefHat className="h-4 w-4" />
                  <CardTitle className="text-lg font-semibold">{column.title}</CardTitle>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide">{counts[column.id]}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 p-4 pt-0">
              {orders.filter((order) => order.status === column.id).map((order) => (
                <div key={order.id} className="rounded-lg border border-slate-800 bg-[#111827] p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-100">{order.id}</p>
                      <p className="mt-1 text-xs text-slate-400">{order.table} · {order.time}</p>
                    </div>
                    <span className="rounded-md border border-slate-800 px-2 py-1 text-xs text-slate-400">{column.title}</span>
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-slate-300">
                    {order.items.map((item) => (
                      <p key={item}>{item}</p>
                    ))}
                  </div>
                  <Button
                    variant={index === columns.length - 1 ? 'outline' : 'default'}
                    className="mt-3 h-10 w-full rounded-lg text-xs font-medium uppercase tracking-wide"
                    onClick={() => moveOrder(order.id, index)}
                  >
                    {index === columns.length - 1 ? 'Clear Ticket' : `Move to ${columns[index + 1].title}`}
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