import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAppState } from '../context/AppStateContext';
import { formatCurrency } from '../utils/helpers';

export default function MenuPreviewSection() {
  const { catalogItems } = useAppState();
  const featureList = catalogItems.slice(0, 4);
  const popularList = catalogItems.slice(4, 10);

  return (
    <section className="border-b border-[#374151] bg-[#111827] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <h2 className="text-xl font-medium text-[#F9FAFB]">Menu preview section</h2>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featureList.length ? featureList.map((item) => (
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
          )) : <div className="sm:col-span-2 xl:col-span-4 rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-6 text-sm text-[#9CA3AF]">No featured menu items are available yet.</div>}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-medium text-[#F9FAFB]">Popular items</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {popularList.length ? popularList.map((item) => (
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
            )) : <div className="md:col-span-2 xl:col-span-3 rounded-xl border border-dashed border-[#374151] bg-[#0B1220] p-6 text-sm text-[#9CA3AF]">Popular items will appear here once menu data is available.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}