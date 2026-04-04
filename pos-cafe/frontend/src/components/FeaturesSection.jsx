import { Activity, LayoutGrid, ReceiptText, ScanLine, Soup } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

const orderingSteps = [
  {
    icon: ScanLine,
    title: 'Scan table QR',
    description: 'Guests open the digital menu instantly without waiting for a printed menu handoff.',
  },
  {
    icon: LayoutGrid,
    title: 'Place order instantly',
    description: 'Orders move from menu selection to confirmation with a clean mobile-first checkout flow.',
  },
  {
    icon: Activity,
    title: 'Track kitchen status live',
    description: 'Customers and staff can both follow order progress while service stays synchronized.',
  },
];

const capabilities = [
  {
    icon: LayoutGrid,
    title: 'Live table tracking',
    description: 'Monitor occupancy, reservations, and service flow across the dining room.',
  },
  {
    icon: Soup,
    title: 'Kitchen ticket updates',
    description: 'Push orders into prep states and keep the kitchen queue visible for faster execution.',
  },
  {
    icon: ReceiptText,
    title: 'Realtime billing view',
    description: 'See order totals, payment states, and billing actions without losing service context.',
  },
  {
    icon: Activity,
    title: 'Manager dashboard insights',
    description: 'Review shift activity, sales health, and restaurant performance from one overview.',
  },
];

const floorPreview = [
  { label: 'Table 1', status: 'Available', tone: 'bg-emerald-400/10 text-emerald-300' },
  { label: 'Table 2', status: 'Occupied', tone: 'bg-amber-400/10 text-amber-300' },
  { label: 'Table 3', status: 'Reserved', tone: 'bg-blue-400/10 text-blue-300' },
  { label: 'Table 4', status: 'Cleaning', tone: 'bg-rose-400/10 text-rose-300' },
  { label: 'Table 5', status: 'Available', tone: 'bg-emerald-400/10 text-emerald-300' },
  { label: 'Table 6', status: 'Occupied', tone: 'bg-amber-400/10 text-amber-300' },
  { label: 'Table 7', status: 'Reserved', tone: 'bg-blue-400/10 text-blue-300' },
  { label: 'Table 8', status: 'Available', tone: 'bg-emerald-400/10 text-emerald-300' },
];

export default function FeaturesSection() {
  return (
    <>
      <section className="border-b border-[#374151] bg-[#111827] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-semibold text-[#F9FAFB]">How ordering works</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {orderingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm transition duration-200 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#374151] bg-[#111827] text-[#F59E0B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-medium text-[#F9FAFB]">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#374151] bg-[#0B1220] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-semibold text-[#F9FAFB]">Everything your cafe needs to run smoothly</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm transition duration-200 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#374151] bg-[#111827] text-[#F59E0B]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-medium text-[#F9FAFB]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#374151] bg-[#111827] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[0.95fr,1.05fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-[#F9FAFB]">Interactive dining layout preview</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">
              Get a quick visual of table availability, reservations, and occupied seats before opening the full floor management view.
            </p>
            <Link to="/tables" className="mt-6 inline-flex">
              <Button variant="outline" className="h-11 rounded-xl border-[#374151] bg-[#111827] px-5 text-sm text-[#F9FAFB] hover:bg-[#1F2937]">
                Open table layout
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-[#374151] bg-[#1F2937] p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {floorPreview.map((table) => (
                <div key={table.label} className="rounded-xl border border-[#374151] bg-[#111827] p-4 shadow-sm transition duration-200 hover:shadow-md">
                  <p className="text-base font-medium text-[#F9FAFB]">{table.label}</p>
                  <div className={`mt-4 inline-flex rounded-full px-3 py-1 text-[11px] font-medium tracking-[0.14em] ${table.tone}`}>
                    {table.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}