import { cn } from '../utils/helpers';

function PaymentButton({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex min-h-24 flex-col items-start justify-between rounded-2xl border p-5 text-left shadow-lg transition-all',
        active
          ? 'border-amber-500 bg-amber-500 text-slate-950'
          : 'border-slate-800 bg-slate-900 text-white hover:bg-slate-800',
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="font-accent text-sm font-semibold uppercase tracking-[0.22em]">{label}</span>
    </button>
  );
}

export default PaymentButton;