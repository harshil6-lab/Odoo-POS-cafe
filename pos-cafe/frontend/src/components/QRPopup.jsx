import { formatCurrency } from '../utils/helpers';

function QRPopup({ total }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-lg">
      <div className="mx-auto grid h-40 w-40 grid-cols-5 gap-1 rounded-2xl border border-slate-800 bg-white p-3 shadow-sm">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className={`rounded-sm ${index % 2 === 0 || index % 7 === 0 ? 'bg-slate-900' : 'bg-slate-200'}`}
          />
        ))}
      </div>
      <p className="mt-4 text-center font-display text-2xl font-semibold text-white">Scan to pay {formatCurrency(total)}</p>
      <p className="mt-2 text-center text-sm text-slate-400">Connect a UPI provider or replace this placeholder with a generated QR payload.</p>
    </div>
  );
}

export default QRPopup;