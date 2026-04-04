import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';

function StatCard({ label, value, change, icon: Icon }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-bold text-white">{value}</p>
          </div>
          {Icon ? (
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </div>

        {change ? (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {change}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default StatCard;