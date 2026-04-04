import { useEffect, useState } from 'react';
import QRPopup from './QRPopup';
import { formatCurrency } from '../utils/helpers';

const paymentMethods = [
  { label: 'Cash', value: 'cash' },
  { label: 'Card', value: 'card' },
  { label: 'UPI QR', value: 'upi_qr' },
];

function PaymentModal({ isOpen, total, isProcessing, onClose, onConfirm }) {
  const [method, setMethod] = useState('cash');
  const [amount, setAmount] = useState(total);
  const [providerReference, setProviderReference] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(total);
      setMethod('cash');
      setProviderReference('');
    }
  }, [isOpen, total]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm({
      method,
      amount: Number(amount),
      provider_reference: providerReference,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="panel w-full max-w-xl p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">Collect payment</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Settle bill</h2>
          </div>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Amount due</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(total)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMethod(option.value)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  method === option.value
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-brand-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {method === 'upi_qr' ? <QRPopup total={total} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700">
              Paid amount
              <input
                className="input mt-2"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Reference
              <input
                className="input mt-2"
                type="text"
                placeholder="Txn / terminal reference"
                value={providerReference}
                onChange={(event) => setProviderReference(event.target.value)}
              />
            </label>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isProcessing}>
            {isProcessing ? 'Processing payment...' : `Confirm ${formatCurrency(total)}`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;