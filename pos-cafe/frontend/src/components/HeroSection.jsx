import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAppState } from '../context/AppStateContext';
import { formatCurrency } from '../utils/helpers';

const statusTone = {
  available: 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
  unavailable: 'border border-rose-500/20 bg-rose-500/10 text-rose-300',
};

export default function HeroSection() {
  const { catalogItems } = useAppState();
  const items = catalogItems.slice(0, 4);

  return (
    <section className="border-b border-[#374151] bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,#0B1220,#111827)] py-10">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
        <div>
          <p className="text-sm text-[#F59E0B]">Cafe POS Suite</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-bold leading-[1.02] text-[#F9FAFB] md:text-6xl xl:text-7xl">
            Scan QR. Order instantly. Reserve easily. Bill faster.
          </h1>
          <p className="mt-6 max-w-xl text-sm text-slate-400">
            A premium restaurant frontend for guests and staff, powered by Supabase with QR ordering, live table flow, kitchen tracking, and fast billing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/menu">
              <Button className="h-11 rounded-lg bg-[#F59E0B] px-5 text-sm text-black hover:brightness-110">
                Scan menu
              </Button>
            </Link>
            <Link to="/reserve-table">
              <Button variant="outline" className="h-11 rounded-lg border border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                Reserve table
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="h-11 rounded-lg border border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                Staff login
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:pt-2">
          {items.length ? items.map((item) => (
            <article
              key={item.id}
              className="rounded-xl border border-[#374151] bg-[#1F2937] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-medium text-[#F9FAFB]">{item.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">{formatCurrency(item.price)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm ${statusTone[item.isAvailable ? 'available' : 'unavailable']}`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <Link to="/menu" className="mt-4 inline-flex w-full">
                <Button variant="outline" className="h-10 w-full rounded-lg border border-slate-600 text-sm text-white hover:bg-slate-800">
                  View item
                </Button>
              </Link>
            </article>
          )) : <div className="sm:col-span-2 rounded-xl border border-dashed border-[#374151] bg-[#111827] p-6 text-sm text-[#9CA3AF]">No menu items are available yet from Supabase.</div>}
        </div>
      </div>
    </section>
  );
}