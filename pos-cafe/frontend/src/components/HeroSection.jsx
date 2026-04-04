import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { menuItems } from '../data/restaurantData';
import { formatCurrency } from '../utils/helpers';

const heroItems = ['latte', 'cold-brew', 'masala-chai', 'club-sandwich'];

const statusTone = {
  Popular: 'border border-amber-400/20 bg-amber-400/10 text-amber-300',
  Available: 'border border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
};

export default function HeroSection() {
  const items = menuItems.filter((item) => heroItems.includes(item.id));

  return (
    <section className="border-b border-[#374151] bg-[radial-gradient(circle_at_top_right,_rgba(245,158,11,0.16),_transparent_28%),linear-gradient(180deg,#0B1220,#111827)] py-20">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.1fr,0.9fr] lg:items-start">
        <div>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] text-[#F9FAFB] md:text-6xl xl:text-7xl">
            Fresh coffee. Fast ordering. Better dining experience.
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">
            Scan your table QR, browse menu instantly, place orders, and track kitchen status live.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/customer-ordering">
              <Button className="h-11 rounded-xl border-[#F59E0B] bg-[#F59E0B] px-5 text-sm text-[#0B1220] hover:bg-[#D97706]">
                Order from table
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#111827] px-5 text-sm text-[#F9FAFB] hover:bg-[#1F2937]">
                View menu
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:pt-2">
          {items.map((item) => (
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
                <span className={`rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] ${statusTone[item.status] ?? statusTone.Available}`}>
                  {item.status}
                </span>
              </div>
              <Button variant="outline" className="mt-4 h-10 w-full rounded-xl border-[#374151] bg-[#111827] text-sm text-[#F9FAFB] hover:bg-[#0B1220]">
                Quick add
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}