import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppState } from '../context/AppStateContext';

export default function ContactPage() {
  const { tables, catalogItems, reservations, liveOrders } = useAppState();

  const cards = [
    { label: 'Table inventory', value: `${tables.length} live tables synced` },
    { label: 'Menu coverage', value: `${catalogItems.length} live menu items` },
    { label: 'Reservations', value: `${reservations.length} upcoming bookings` },
    { label: 'Open orders', value: `${liveOrders.length} active order records` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      <div>
        <p className="text-sm text-slate-400">Support</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Restaurant system overview</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-400">
          This workspace is connected to Supabase for menu, table, reservation, and order operations. Use the live metrics below to verify the environment is responding.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Card key={card.label} className="rounded-xl border-[#374151] bg-[#111827] shadow-md">
            <CardHeader className="p-4">
              <p className="text-sm text-slate-400">{card.label}</p>
              <CardTitle className="mt-1 text-base font-semibold text-slate-100">{card.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm text-slate-400">
              Live operational data is being pulled from the connected Supabase project.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}