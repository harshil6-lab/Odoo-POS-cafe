import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { formatCurrency } from '../utils/helpers';

const revenueData = [
  { day: 'Mon', revenue: 42800 },
  { day: 'Tue', revenue: 46100 },
  { day: 'Wed', revenue: 43800 },
  { day: 'Thu', revenue: 50200 },
  { day: 'Fri', revenue: 57800 },
  { day: 'Sat', revenue: 66400 },
  { day: 'Sun', revenue: 61200 },
];

const hourlyTraffic = [
  { hour: '08:00', orders: 8 },
  { hour: '10:00', orders: 19 },
  { hour: '12:00', orders: 31 },
  { hour: '14:00', orders: 24 },
  { hour: '16:00', orders: 15 },
  { hour: '18:00', orders: 28 },
  { hour: '20:00', orders: 33 },
];

const paymentMethods = [
  { name: 'Cash', value: 18 },
  { name: 'Card', value: 46 },
  { name: 'UPI', value: 28 },
  { name: 'Account', value: 8 },
];

const topSelling = [
  { name: 'Signature Cappuccino', sold: 186 },
  { name: 'Spanish Latte', sold: 161 },
  { name: 'Butter Croissant', sold: 148 },
  { name: 'Avocado Toast', sold: 106 },
];

const COLORS = ['#f59e0b', '#2dd4bf', '#8b5cf6', '#f97316'];

function MetricCard({ label, value, helper }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-4 font-display text-4xl font-semibold text-white">{value}</p>
        <p className="mt-3 text-sm text-slate-400">{helper}</p>
      </CardContent>
    </Card>
  );
}

export default function Reports() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Reports dashboard</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white">Restaurant analytics</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard label="Weekly revenue" value={formatCurrency(369300)} helper="Across all dine-in, takeaway, and delivery channels." />
        <MetricCard label="Top order hour" value="20:00" helper="Dinner rush remains the strongest traffic window." />
        <MetricCard label="Average check" value={formatCurrency(684)} helper="Blended across counter and table orders." />
        <MetricCard label="Payment mix leader" value="Card" helper="Card remains the dominant payment method this week." />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Revenue chart</CardTitle>
          </CardHeader>
          <CardContent className="h-80 p-2 pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Hourly traffic chart</CardTitle>
          </CardHeader>
          <CardContent className="h-80 p-2 pr-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTraffic}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                <Bar dataKey="orders" radius={[12, 12, 0, 0]} fill="#2dd4bf" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Payment method chart</CardTitle>
          </CardHeader>
          <CardContent className="h-96 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={paymentMethods} innerRadius={80} outerRadius={120} paddingAngle={4} dataKey="value">
                  {paymentMethods.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-3xl">Top selling items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {topSelling.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <p className="font-display text-2xl font-semibold text-white">{item.name}</p>
                  <p className="mt-2 text-sm text-slate-400">Rank #{index + 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl font-semibold text-amber-400">{item.sold}</p>
                  <p className="mt-2 text-sm text-slate-400">units sold</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}