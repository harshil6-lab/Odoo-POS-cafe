import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { featuredItems, menuItems, popularItems } from '../data/restaurantData';
import { formatCurrency } from '../utils/helpers';

const featureList = menuItems.filter((item) => featuredItems.includes(item.id));
const popularList = menuItems.filter((item) => popularItems.includes(item.id)).slice(0, 6);

export default function MenuPreviewSection() {
  return (
    <section className="border-b border-[#374151] bg-[#111827] py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#F9FAFB]">Featured menu</h2>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {featureList.map((item) => (
            <article key={item.id} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm transition duration-200 hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-4">
                <h3 className="text-base font-medium text-[#F9FAFB]">{item.name}</h3>
                <p className="mt-2 text-sm text-slate-400">{formatCurrency(item.price)}</p>
              </div>
              <Link to="/menu" className="mt-4 inline-flex w-full">
                <Button variant="outline" className="h-10 w-full rounded-xl border-[#374151] bg-[#111827] text-sm text-[#F9FAFB] hover:bg-[#0B1220]">
                  Quick add
                </Button>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-semibold text-[#F9FAFB]">Popular items</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {popularList.map((item) => (
              <article key={item.id} className="flex items-center gap-4 rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm transition duration-200 hover:shadow-md">
                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg">
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-medium text-[#F9FAFB]">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{item.category}</p>
                  <p className="mt-3 text-sm text-slate-400">{formatCurrency(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}