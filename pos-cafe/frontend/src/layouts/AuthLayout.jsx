import { Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

function AuthLayout({ eyebrow, title, description, children, footer, panelTitle, panelDescription, panelPoints = [] }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,#0B1220,#0F172A)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-[#111827] shadow-[0_30px_90px_rgba(2,6,23,0.5)] lg:grid-cols-[1.05fr,0.95fr]">
        <div className="flex flex-col justify-between border-b border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.12),_transparent_32%),#111827] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3 text-amber-400">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Restaurant system</p>
                <span className="text-base font-semibold text-slate-100">POS Suite</span>
              </div>
            </Link>

            <div className="mt-12 max-w-lg">
              <p className="text-sm font-medium text-amber-400">{panelTitle}</p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight text-slate-50">{panelDescription}</h2>
            </div>
          </div>

          <div className="grid gap-3 pt-10">
            {panelPoints.map((point) => (
              <div key={point} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div>
              <p className="text-sm font-medium text-slate-400">{eyebrow}</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-50">{title}</h1>
              <p className="mt-3 text-sm leading-7 text-slate-400">{description}</p>
            </div>

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-6 text-sm text-slate-400">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;