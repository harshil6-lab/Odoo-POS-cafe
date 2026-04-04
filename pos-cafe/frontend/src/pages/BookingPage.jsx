import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { bookingSlots } from '../data/restaurantData';

export default function BookingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
        <Card className="rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
          <CardHeader className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Table booking</p>
            <CardTitle className="mt-1 text-xl font-semibold text-slate-100">Reserve your table</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 pt-0 md:grid-cols-2">
            <label className="grid gap-2 text-xs uppercase tracking-wide text-slate-400">
              Name
              <input className="h-11 rounded-lg border border-slate-800 bg-[#111827] px-3 text-sm text-slate-100" placeholder="Priya Shah" />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-wide text-slate-400">
              Phone
              <input className="h-11 rounded-lg border border-slate-800 bg-[#111827] px-3 text-sm text-slate-100" placeholder="+91 98765 43210" />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-wide text-slate-400">
              Guests
              <input className="h-11 rounded-lg border border-slate-800 bg-[#111827] px-3 text-sm text-slate-100" placeholder="4" />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-wide text-slate-400">
              Date
              <input type="date" className="h-11 rounded-lg border border-slate-800 bg-[#111827] px-3 text-sm text-slate-100" />
            </label>
            <label className="grid gap-2 text-xs uppercase tracking-wide text-slate-400 md:col-span-2">
              Time
              <input type="time" className="h-11 rounded-lg border border-slate-800 bg-[#111827] px-3 text-sm text-slate-100" />
            </label>
            <Button className="h-11 rounded-lg text-xs font-medium uppercase tracking-wide md:col-span-2">Reserve</Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
          <CardHeader className="p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Popular slots</p>
            <CardTitle className="mt-1 text-lg font-semibold text-slate-100">Tonight</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 p-4 pt-0">
            {bookingSlots.map((slot) => (
              <div key={slot} className="rounded-lg border border-slate-800 bg-[#111827] px-3 py-3 text-sm text-slate-100">
                {slot}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}