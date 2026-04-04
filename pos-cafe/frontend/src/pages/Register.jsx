import { useSearchParams } from 'react-router-dom';
import RegisterLayout from '../components/RegisterLayout';

export default function Register() {
  const [searchParams] = useSearchParams();
  const activeTable = searchParams.get('table') || 'Walk-in counter';

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="rounded-[28px] border border-white/10 bg-[#111827] p-6 shadow-[0_24px_60px_rgba(2,6,23,0.38)]">
        <p className="text-sm font-medium text-slate-400">Point of sale</p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-50">Register</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 md:text-base">
              A clean three-column workspace for staff to browse products, manage the cart, and complete billing without visual clutter.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-4">
              <p className="text-2xl font-semibold text-slate-50">{activeTable}</p>
              <p className="mt-1 text-sm text-slate-400">Active table</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-4">
              <p className="text-2xl font-semibold text-slate-50">18</p>
              <p className="mt-1 text-sm text-slate-400">Active tickets</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#0B1220] px-4 py-4">
              <p className="text-2xl font-semibold text-slate-50">₹9,840</p>
              <p className="mt-1 text-sm text-slate-400">Shift sales</p>
            </div>
          </div>
        </div>
      </div>

      <RegisterLayout />
    </div>
  );
}