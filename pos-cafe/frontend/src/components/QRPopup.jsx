import { Smartphone } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

function QRPopup({ total }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-brand-500/30 bg-brand-500/10 p-5">
      <div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-[1.5rem] bg-slate-950 p-3 shadow-sm">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={`rounded-sm ${index % 2 === 0 || index % 7 === 0 ? 'bg-brand-400' : 'bg-white/10'}`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-white">
        <Smartphone className="h-4 w-4 text-teal-300" />
        Scan to pay {formatCurrency(total)}
      </div>
      <p className="mt-2 text-center text-xs text-slate-400">Connect a UPI provider or replace this placeholder with a generated QR payload.</p>
    </div>
  );
}

export default QRPopup;