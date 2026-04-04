import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { tablesData } from '../data/restaurantData';

const tones = {
  available: 'border-teal-500/20 bg-teal-500/10 text-teal-300',
  occupied: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  reserved: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
  cleaning: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
};

export default function TablesLayout() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Dining floor</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100">Tables layout</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {tablesData.map((table) => (
          <Card key={table.id} className="rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
            <CardHeader className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-slate-100">{table.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{table.note}</p>
                </div>
                <span className={`rounded-md border px-2 py-1 text-xs capitalize ${tones[table.status]}`}>{table.status}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Link to="/register">
                <Button variant="outline" className="h-10 w-full rounded-lg text-xs font-medium uppercase tracking-wide">
                  Open Register
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}