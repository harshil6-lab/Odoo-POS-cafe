import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { contactDetails } from '../data/restaurantData';

const cards = [
  { label: 'Address', value: contactDetails.address },
  { label: 'Phone', value: contactDetails.phone },
  { label: 'Email', value: contactDetails.email },
  { label: 'Opening hours', value: contactDetails.hours },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 lg:px-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Contact</p>
        <h1 className="mt-1 text-xl font-semibold text-slate-100">Reach the restaurant team</h1>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.label} className="rounded-xl border-slate-800 bg-[#0F172A] shadow-md">
            <CardHeader className="p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
              <CardTitle className="mt-1 text-lg font-semibold text-slate-100">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-slate-400">
              Restaurant support is available for bookings, ordering help, and service feedback.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}