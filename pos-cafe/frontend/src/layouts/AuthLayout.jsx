import { Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

function AuthLayout({ eyebrow, title, description, children, footer, panelTitle, panelDescription, panelPoints = [] }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(239,79,95,0.12),_transparent_28%),linear-gradient(180deg,#0B0F1A,#0F172A)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/[0.06] bg-card shadow-float lg:grid-cols-[1.05fr,0.95fr]">
        <div className="flex flex-col justify-between border-b border-white/[0.06] bg-[radial-gradient(circle_at_top_left,_rgba(239,79,95,0.08),_transparent_32%),#111827] p-8 lg:border-b-0 lg:border-r lg:p-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-lg">🍽️</span>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Restaurant system</p>
                <span className="font-display text-sm font-bold text-white">POS Cafe</span>
              </div>
            </Link>

            <div className="mt-12 max-w-lg">
              <p className="text-sm font-semibold text-primary">{panelTitle}</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-white">{panelDescription}</h2>
            </div>
          </div>

          <div className="grid gap-2 pt-10">
            {panelPoints.map((point) => (
              <div key={point} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-slate-400">
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{eyebrow}</p>
              <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-white">{title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{description}</p>
            </div>

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-6 text-sm text-slate-500">{footer}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;