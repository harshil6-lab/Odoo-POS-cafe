import { Coffee, MonitorSmartphone } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../utils/helpers';

function Sidebar({ items }) {
  return (
    <aside className="panel h-fit p-4 lg:sticky lg:top-6">
      <div className="rounded-[1.75rem] bg-hero-grid p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-slate-950">
            <Coffee className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">POS Cafe</p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Single store ops</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-3">
            <MonitorSmartphone className="h-5 w-5 text-teal-300" />
            <div>
              <p className="text-sm font-semibold text-white">Realtime service flow</p>
              <p className="text-xs text-slate-400">Floor, POS, kitchen, and customer display in sync.</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive ? 'bg-brand-500 text-slate-950' : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <span>{item.label}</span>
            <span className="text-xs opacity-70">{item.shortcut}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;