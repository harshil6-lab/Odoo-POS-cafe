import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Coffee, Menu as MenuIcon, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { getNavLinksForRole, PUBLIC_NAV_LINKS } from '../utils/roleNavigation';
import { useAppState } from '../context/AppStateContext';

export default function Navbar({ isDashboard = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, role, roleBadge, redirectPath, logout } = useAuth();
  const { lastPlacedOrder } = useAppState();
  const navLinks = isDashboard ? getNavLinksForRole(role) : PUBLIC_NAV_LINKS;
  const lastTrackedOrderId = (typeof window !== 'undefined' ? window.sessionStorage.getItem('last_order_id') : null) || lastPlacedOrder?.id || null;
  const trackingPath = lastTrackedOrderId ? `/order-status/${lastTrackedOrderId}` : '/track-order';

  const NavLink = ({ link, onClick }) => {
    const isActive = isDashboard
      ? location.pathname.startsWith(link.to)
      : location.pathname === link.to;
    return (
      <Link
        to={link.to}
        onClick={onClick}
        className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-white/[0.07] text-white shadow-sm'
            : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
        }`}
      >
        {link.label}
        {isActive && (
          <span className="absolute -bottom-[13px] left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary" />
        )}
      </Link>
    );
  };

  if (!isDashboard) {
    return (
      <>
        <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/80 backdrop-blur-2xl shadow-lg">
          <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center gap-6 px-6">
            {/* Logo */}
            <Link to="/" className="flex shrink-0 items-center gap-3 transition hover:opacity-80">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 shadow-glow-red">
                <span className="text-lg">🍽️</span>
              </div>
              <span className="font-display text-lg font-bold text-white">POS <span className="text-primary">Café</span></span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
              {navLinks.map((link) => <NavLink key={link.label} link={link} />)}
            </nav>

            {/* Desktop actions */}
            <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2">
                    <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {user?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.email}</p>
                      <p className="text-[11px] text-slate-500">{roleBadge}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="h-10 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    Logout
                  </button>
                  <Link to={redirectPath}>
                    <Button size="sm" className="gap-1.5">
                      Dashboard <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/reserve-table">
                    <Button variant="outline" size="sm">Reserve table</Button>
                  </Link>
                  <Link to={trackingPath}>
                    <Button variant="ghost" size="sm">Track order</Button>
                  </Link>
                  <Link to="/login">
                    <Button size="sm">Login</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/[0.04] hover:text-white md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <MenuIcon size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 top-[72px] z-40 bg-background/98 backdrop-blur-xl md:hidden animate-fade-in">
            <nav className="flex flex-col gap-1 p-6">
              {navLinks.map((link) => <NavLink key={link.label} link={link} onClick={() => setMobileOpen(false)} />)}
              <hr className="my-4 border-white/[0.06]" />
              {isAuthenticated ? (
                <>
                  <Link to={redirectPath} onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Dashboard</Button>
                  </Link>
                  <button type="button" onClick={() => { void logout(); setMobileOpen(false); }} className="mt-2 w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2.5 text-sm text-slate-300">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Login</Button>
                  </Link>
                  <Link to="/reserve-table" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="mt-2 w-full">Reserve table</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </>
    );
  }

  // Dashboard navbar
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-background/90 backdrop-blur-2xl shadow-lg">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 transition duration-200 hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 shadow-glow-red">
            <Coffee size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white">POS <span className="text-primary">Café</span></p>
            <p className="text-[11px] text-slate-500">{roleBadge}</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => <NavLink key={link.label} link={link} />)}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 sm:flex">
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <p className="text-xs font-medium text-white">{user?.email}</p>
              <p className="text-[10px] text-slate-500">{role}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="h-9 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 text-xs font-medium text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
          >
            Logout
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/[0.04] hover:text-white lg:hidden"
          >
            {mobileOpen ? <X size={18} /> : <MenuIcon size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer for dashboard */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-white/[0.06] bg-background/95 backdrop-blur-xl lg:hidden animate-slide-up">
          <nav className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => <NavLink key={link.label} link={link} onClick={() => setMobileOpen(false)} />)}
          </nav>
        </div>
      )}
    </header>
  );
}