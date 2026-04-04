import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

export default function ReserveSection() {
  return (
    <section className="border-b border-[#374151] bg-[#0B1220] py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl rounded-xl border border-[#374151] bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.12),_transparent_40%),#111827] p-4 shadow-sm">
          <div className="text-center">
            <h2 className="text-xl font-medium text-[#F9FAFB]">Reserve tables easily</h2>
            <p className="mt-4 text-sm text-slate-400">
              Reserve your table in advance and avoid waiting time during peak hours
            </p>
            <Link to="/reserve-table" className="mt-6 inline-flex">
              <Button className="h-11 rounded-lg bg-[#F59E0B] px-5 text-sm text-black hover:brightness-110">
                Reserve table
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}