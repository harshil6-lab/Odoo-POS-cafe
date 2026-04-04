import { NavLink } from 'react-router-dom';
import { classNames } from '../utils/helpers';

function Sidebar({ items }) {
  return (
    <aside className="panel h-fit p-4 lg:sticky lg:top-6">
      <div className="rounded-2xl bg-hero-grid p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Operations</p>
        <h2 className="mt-3 text-xl font-bold text-slate-900">Restaurant control center</h2>
        <p className="mt-2 text-sm text-slate-600">Realtime dining room, counter, kitchen, and reporting in one workspace.</p>
      </div>

      <nav className="mt-5 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              classNames(
                'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive ? 'bg-brand-500 text-white' : 'text-slate-700 hover:bg-slate-100',
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