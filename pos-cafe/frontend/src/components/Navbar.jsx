import { getInitials } from '../utils/helpers';

function Navbar({ title, user, onSignOut }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Operator';

  return (
    <header className="panel sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">POS Cafe</p>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{displayName}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-sm font-bold text-brand-700">
          {getInitials(displayName) || 'PC'}
        </div>

        <button type="button" className="btn-secondary" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export default Navbar;