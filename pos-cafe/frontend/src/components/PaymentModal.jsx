import { useEffect, useState } from 'react';
import { CreditCard, Landmark, ScanQrCode } from 'lucide-react';
import QRPopup from './QRPopup';
import { formatCurrency } from '../utils/helpers';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';

const paymentMethods = [
  { label: 'Cash payment', value: 'cash', icon: Landmark },
  { label: 'Card payment', value: 'card', icon: CreditCard },
  { label: 'UPI QR popup', value: 'upi_qr', icon: ScanQrCode },
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

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm({
      method,
      amount: Number(amount),
      provider_reference: providerReference,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (!open ? onClose() : null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settle bill</DialogTitle>
          <DialogDescription>Accept cash, card, or UPI QR payments from the POS terminal.</DialogDescription>
        </DialogHeader>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-4">
            <p className="text-sm text-slate-500">Amount due</p>
            <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(total)}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {paymentMethods.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMethod(option.value)}
                className={`rounded-[1.5rem] border px-4 py-4 text-sm font-semibold transition ${
                  method === option.value
                    ? 'border-brand-500 bg-brand-500 text-slate-950'
                    : 'border-white/10 bg-slate-900 text-slate-300 hover:border-brand-400/60'
                }`}
              >
                <option.icon className="mx-auto mb-3 h-5 w-5" />
                {option.label}
              </button>
            ))}
          </div>

          {method === 'upi_qr' ? <QRPopup total={total} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-300">
              Paid amount
              <Input
                className="mt-2"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </label>

            <label className="block text-sm font-medium text-slate-300">
              Reference
              <Input
                className="mt-2"
                type="text"
                placeholder="Txn / terminal reference"
                value={providerReference}
                onChange={(event) => setProviderReference(event.target.value)}
              />
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? 'Processing payment...' : `Confirm ${formatCurrency(total)}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default PaymentModal;