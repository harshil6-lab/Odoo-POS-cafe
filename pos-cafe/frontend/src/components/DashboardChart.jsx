import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

function DashboardChart({ type = 'line', title, data, dataKey = 'revenue', nameKey = 'label' }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey={dataKey} nameKey={nameKey} innerRadius={60} outerRadius={92} paddingAngle={4}>
                {data.map((entry) => (
                  <Cell key={entry[nameKey]} fill={entry.color || '#f59e0b'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : type === 'bar' ? (
            <BarChart data={data}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              <XAxis dataKey={nameKey} stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#14b8a6" radius={[12, 12, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(148, 163, 184, 0.15)" vertical={false} />
              <XAxis dataKey={nameKey} stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip />
              <Line type="monotone" dataKey={dataKey} stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default DashboardChart;