import { Menu, Sparkles } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { getInitials } from '../utils/helpers';
import { Button } from './ui/button';

const publicLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/book-table', label: 'Book Table' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

function Navbar({ mode = 'dashboard', title, user, onSignOut }) {
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Cafe Operator';

  if (mode === 'landing') {
    return (
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between gap-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-slate-950">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">POS Cafe</p>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Crafted dining operations</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {publicLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-sm font-medium text-slate-300 transition hover:text-white">
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard">
              <Button variant="secondary" className="hidden md:inline-flex">
                Staff Login
              </Button>
            </Link>
            <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="panel sticky top-4 z-30 flex flex-wrap items-center justify-between gap-4 px-6 py-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-400">POS Cafe Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right lg:block">
          <p className="text-sm font-semibold text-white">{displayName}</p>
          <p className="text-xs text-slate-400">{user?.email}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 text-sm font-bold text-brand-300">
          {getInitials(displayName) || 'PC'}
        </div>
        {onSignOut ? (
          <Button type="button" variant="secondary" onClick={onSignOut}>
            Sign out
          </Button>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;