import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, QrCode, UtensilsCrossed } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { featuredItems, menuItems, orderSteps, popularItems } from '../data/restaurantData';
import { formatCurrency } from '../utils/helpers';

const featuredMenu = menuItems.filter((item) => featuredItems.includes(item.id));
const popularMenu = menuItems.filter((item) => popularItems.includes(item.id));

const icons = [QrCode, UtensilsCrossed, Clock3];

export default function LandingPage() {
  return (
    <div className="bg-[#020617]">
      <section className="border-b border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.16),_transparent_32%),linear-gradient(180deg,#020617,#0F172A)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-wide text-amber-400">Customer-first dining</p>
            <h1 className="max-w-2xl text-3xl font-semibold text-slate-100 md:text-4xl">
              Fresh Coffee. Fast Ordering. Better Dining Experience.
            </h1>
            <p className="max-w-xl text-sm leading-7 text-slate-400">
              Scan your table QR, browse the menu, order instantly, and track your food in real time.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/customer-ordering">
                <Button className="h-11 rounded-lg px-4 text-xs font-medium uppercase tracking-wide">Order From Table</Button>
              </Link>
              <Link to="/menu">
                <Button variant="outline" className="h-11 rounded-lg px-4 text-xs font-medium uppercase tracking-wide">View Menu</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredMenu.map((item) => (
              <Card key={item.id} className="overflow-hidden rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
                <div className="h-36 overflow-hidden border-b border-slate-800">
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <CardContent className="space-y-3 p-4 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-100">{item.name}</p>
                      <p className="mt-1 text-sm font-medium text-amber-400">{formatCurrency(item.price)}</p>
                    </div>
                    <span className="rounded-md border border-slate-800 bg-[#111827] px-2 py-1 text-xs text-slate-400">{item.status}</span>
                  </div>
                  <Link to="/customer-ordering">
                    <Button variant="outline" className="h-10 w-full rounded-lg text-xs font-medium uppercase tracking-wide">
                      Quick Add
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Menu preview</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-100">Featured items</h2>
            </div>
            <Link to="/menu" className="inline-flex items-center text-xs font-medium uppercase tracking-wide text-amber-400">
              Explore menu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredMenu.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-slate-800 bg-[#0F172A] shadow-md">
                <img src={item.imageUrl} alt={item.name} className="h-36 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <p className="text-base font-semibold text-slate-100">{item.name}</p>
                  <p className="text-sm font-medium text-amber-400">{formatCurrency(item.price)}</p>
                  <Link to="/customer-ordering">
                    <Button className="h-10 w-full rounded-lg text-xs font-medium uppercase tracking-wide">Quick Add</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Popular items</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Everything your cafe needs to run smoothly.</h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {popularMenu.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#0F172A] p-3 shadow-md">
                <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-slate-100">{item.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{item.category}</p>
                  <p className="mt-2 text-sm font-medium text-amber-400">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">How ordering works</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Designed for guests and staff in the same flow.</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {orderSteps.map((step, index) => {
              const Icon = icons[index];
              return (
                <Card key={step.title} className="rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
                  <CardHeader className="space-y-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#111827] text-amber-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-100">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm leading-7 text-slate-400">{step.detail}</CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-6 shadow-md">
            <p className="text-xs uppercase tracking-wide text-slate-400">Reserve table</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Plan ahead for dinner service or coffee meetings.</h2>
            <p className="mt-2 text-sm text-slate-400">Book a table before arrival and keep service fast even during peak hours.</p>
            <Link to="/book-table" className="mt-4 inline-flex">
              <Button className="h-11 rounded-lg px-4 text-xs font-medium uppercase tracking-wide">Reserve Table</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}