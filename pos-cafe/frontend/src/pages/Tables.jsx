import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { tablesData } from '../data/restaurantData';

const statusTone = {
  available: 'border-teal-400/20 bg-teal-400/10 text-teal-300',
  occupied: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  reserved: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
  cleaning: 'border-rose-400/20 bg-rose-400/10 text-rose-300',
};

export default function Tables() {
  const occupiedCount = tablesData.filter((table) => table.status === 'occupied').length;
  const reservedCount = tablesData.filter((table) => table.status === 'reserved').length;
  const availableCount = tablesData.filter((table) => table.status === 'available').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-[#111827] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.38)] lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">Floor overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-50">Tables</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
            Monitor seating, reservations, and active bills from a layout that is clean enough for fast service.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-4">
            <p className="text-2xl font-semibold text-slate-50">{availableCount}</p>
            <p className="mt-1 text-sm text-slate-400">Available tables</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-4">
            <p className="text-2xl font-semibold text-slate-50">{occupiedCount}</p>
            <p className="mt-1 text-sm text-slate-400">Occupied now</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-4">
            <p className="text-2xl font-semibold text-slate-50">{reservedCount}</p>
            <p className="mt-1 text-sm text-slate-400">Upcoming reservations</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tablesData.map((table) => (
          <Card key={table.id} className="overflow-hidden">
            <CardHeader className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">{table.zone}</p>
                  <CardTitle className="mt-2 text-2xl">{table.label}</CardTitle>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] ${statusTone[table.status]}`}>
                  {table.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-5 pt-0">
              <div className="rounded-2xl border border-white/10 bg-[#0B1220] p-4">
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>Seats</span>
                  <span className="text-slate-200">{table.seats}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                  <span>Server</span>
                  <span className="text-slate-200">{table.server}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
                  <span>Order amount</span>
                  <span className="font-medium text-amber-300">{table.orderAmount}</span>
                </div>
              </div>

              <p className="text-sm leading-7 text-slate-400">{table.note}</p>

              <Link to="/register" className="inline-flex w-full">
                <Button variant="outline" className="h-11 w-full text-sm">Open register</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}