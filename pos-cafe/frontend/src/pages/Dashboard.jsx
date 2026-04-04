import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card"
import { DollarSign, ShoppingCart, Users, Coffee } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: '08:00', sales: 400 },
  { name: '10:00', sales: 3000 },
  { name: '12:00', sales: 5000 },
  { name: '14:00', sales: 2780 },
  { name: '16:00', sales: 1890 },
  { name: '18:00', sales: 2390 },
  { name: '20:00', sales: 3490 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard Review</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-slate-400 mt-1">+20.1% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-slate-400 mt-1">+12.5% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tables</CardTitle>
            <Users className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14 / 20</div>
            <p className="text-xs text-slate-400 mt-1">70% capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <Coffee className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$22.40</div>
            <p className="text-xs text-slate-400 mt-1">+$1.20 from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily sales performance metrics over the last hours.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tick={{fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f59e0b' }}
                  />
                  <Line type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Live updates from your cafe floor.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { id: 1, action: "Order #4052 placed", time: "2 min ago", type: "order" },
                { id: 2, action: "Table 5 occupied", time: "10 min ago", type: "table" },
                { id: 3, action: "Payment received $45", time: "12 min ago", type: "payment" },
                { id: 4, action: "Order #4050 completed", time: "15 min ago", type: "order" },
              ].map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-4 ${
                    activity.type === 'order' ? 'bg-amber-500' : 
                    activity.type === 'table' ? 'bg-teal-400' : 'bg-blue-400'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}