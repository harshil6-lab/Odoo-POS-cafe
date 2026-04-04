import { useEffect, useMemo, useState } from 'react';
import { Banknote, CreditCard, QrCode, UserRound } from 'lucide-react';
import QRPopup from './QRPopup';
import { formatCurrency } from '../utils/helpers';
import PaymentButton from './PaymentButton';

const paymentMethods = [
  { label: 'Cash', value: 'cash', icon: Banknote },
  { label: 'Card', value: 'card', icon: CreditCard },
  { label: 'UPI QR', value: 'upi_qr', icon: QrCode },
  { label: 'Customer Account', value: 'customer_account', icon: UserRound },
];

function PaymentModal({ isOpen, total, isProcessing, onClose, onConfirm }) {
  const [method, setMethod] = useState('cash');
  const [amount, setAmount] = useState(total);
  const [providerReference, setProviderReference] = useState('');
  const [guestCount, setGuestCount] = useState(2);
  const [splitEnabled, setSplitEnabled] = useState(false);
  const [splits, setSplits] = useState([total / 2, total / 2]);

  useEffect(() => {
    if (isOpen) {
      setAmount(total);
      setMethod('cash');
      setProviderReference('');
      setGuestCount(2);
      setSplitEnabled(false);
      setSplits([total / 2, total / 2]);
    }
  }, [isOpen, total]);

  const remaining = useMemo(() => total - splits.reduce((sum, value) => sum + Number(value || 0), 0), [splits, total]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm({
      method,
      amount: Number(amount),
      provider_reference: providerReference,
      guest_count: guestCount,
      splits: splitEnabled ? splits.map((value) => Number(value || 0)) : null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-[2rem] border border-slate-800 bg-slate-950 p-6 shadow-2xl lg:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-accent text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Payment screen</p>
            <h2 className="mt-2 font-display text-4xl font-semibold text-white">Settle guest bill</h2>
          </div>
          <button type="button" className="rounded-2xl border border-slate-800 px-4 py-3 font-accent text-sm uppercase tracking-[0.2em] text-slate-300 transition hover:bg-slate-900" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="mt-8 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-8 text-center shadow-lg">
              <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Total amount</p>
              <p className="mt-6 font-display text-6xl font-semibold text-white">{formatCurrency(total)}</p>
              <p className="mt-4 text-sm text-slate-400">Large, readable billing view optimized for cashier and guest-facing confirmation.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {paymentMethods.map((option) => (
                <PaymentButton
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  active={method === option.value}
                  onClick={() => setMethod(option.value)}
                />
              ))}
            </div>

            {method === 'upi_qr' ? <QRPopup total={splitEnabled ? splits.reduce((sum, value) => sum + Number(value || 0), 0) : total} /> : null}
          </div>

          <div className="rounded-[2rem] border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <div className="grid gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <p className="font-accent text-xs uppercase tracking-[0.24em] text-slate-500">Guest count</p>
                <div className="mt-4 flex items-center gap-3">
                  <button type="button" className="h-12 w-12 rounded-2xl border border-slate-800 bg-slate-900 text-white" onClick={() => setGuestCount((value) => Math.max(1, value - 1))}>-</button>
                  <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-center font-display text-3xl text-white">{guestCount}</div>
                  <button type="button" className="h-12 w-12 rounded-2xl border border-slate-800 bg-slate-900 text-white" onClick={() => setGuestCount((value) => value + 1)}>+</button>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-accent text-xs uppercase tracking-[0.24em] text-slate-500">Split payment</p>
                    <p className="mt-2 text-sm text-slate-400">Divide the bill across two tenders when guests want separate settlements.</p>
                  </div>
                  <button type="button" className={`rounded-full border px-3 py-1 font-accent text-[11px] uppercase tracking-[0.24em] ${splitEnabled ? 'border-violet-400/20 bg-violet-400/10 text-violet-200' : 'border-slate-700 bg-slate-900 text-slate-400'}`} onClick={() => setSplitEnabled((value) => !value)}>
                    {splitEnabled ? 'enabled' : 'disabled'}
                  </button>
                </div>
                {splitEnabled ? (
                  <div className="mt-4 grid gap-3">
                    {splits.map((value, index) => (
                      <label key={index} className="grid gap-2 text-sm text-slate-400">
                        Split {index + 1}
                        <input
                          className="h-12 rounded-2xl border border-slate-800 bg-slate-900 px-4 text-white outline-none transition focus:border-amber-500"
                          type="number"
                          step="0.01"
                          min="0"
                          value={value}
                          onChange={(event) => {
                            const nextValue = event.target.value;
                            setSplits((current) => current.map((item, splitIndex) => (splitIndex === index ? nextValue : item)));
                          }}
                        />
                      </label>
                    ))}
                    <p className={`text-sm ${remaining === 0 ? 'text-teal-300' : 'text-rose-300'}`}>
                      Remaining: {formatCurrency(remaining)}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm text-slate-400">
                  Paid amount
                  <input
                    className="h-12 rounded-2xl border border-slate-800 bg-slate-950 px-4 text-white outline-none transition focus:border-amber-500"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </label>

                <label className="grid gap-2 text-sm text-slate-400">
                  Reference
                  <input
                    className="h-12 rounded-2xl border border-slate-800 bg-slate-950 px-4 text-white outline-none transition focus:border-amber-500"
                    type="text"
                    placeholder="Txn / customer account ref"
                    value={providerReference}
                    onChange={(event) => setProviderReference(event.target.value)}
                  />
                </label>
              </div>

              <button type="submit" className="h-16 rounded-2xl bg-amber-500 px-6 font-accent text-base font-semibold uppercase tracking-[0.22em] text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500" disabled={isProcessing || (splitEnabled && remaining !== 0)}>
                {isProcessing ? 'Processing payment...' : `Confirm ${formatCurrency(total)}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;