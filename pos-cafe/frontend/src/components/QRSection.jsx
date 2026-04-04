import { QrCode, ScanLine, Smartphone } from 'lucide-react';

function QRSection() {
  return (
    <section className="section-shell py-16 sm:py-20">
      <div className="grid items-center gap-8 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 lg:grid-cols-[0.85fr,1.15fr] lg:p-10">
        <div className="rounded-[1.75rem] border border-dashed border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-teal-400/10 p-8">
          <div className="mx-auto grid h-48 w-48 grid-cols-5 gap-2 rounded-[1.75rem] bg-slate-950 p-4">
            {Array.from({ length: 25 }).map((_, index) => (
              <span key={index} className={`rounded-md ${index % 2 === 0 || index % 7 === 0 ? 'bg-brand-400' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-300">QR ordering</p>
          <h2 className="section-title mt-4">Guests scan, browse, and order without waiting for the bill folder.</h2>
          <p className="section-copy mt-4">
            Every table can show a QR experience for self-ordering, while staff still control fulfillment, payments, and customer communication from the main POS.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: QrCode, title: 'Scan from table', copy: 'Open a mobile-first menu instantly.' },
              { icon: Smartphone, title: 'Add to cart', copy: 'Review items, notes, and totals before checkout.' },
              { icon: ScanLine, title: 'Sync with kitchen', copy: 'Orders land in realtime on the kitchen board.' },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <item.icon className="h-6 w-6 text-brand-300" />
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default QRSection;