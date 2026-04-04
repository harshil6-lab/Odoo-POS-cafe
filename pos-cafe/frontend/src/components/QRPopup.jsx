import { formatCurrency } from '../utils/helpers';

function QRPopup({ total }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-300 bg-brand-50 p-5">
      <div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-2xl bg-white p-3 shadow-sm">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={`rounded-sm ${index % 2 === 0 || index % 7 === 0 ? 'bg-slate-900' : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-sm font-semibold text-slate-900">Scan to pay {formatCurrency(total)}</p>
      <p className="mt-2 text-center text-xs text-slate-500">Connect a UPI provider or replace this placeholder with a generated QR payload.</p>
    </div>
  );
}

export default QRPopup;