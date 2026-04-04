import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Coffee } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { getNavLinksForRole, PUBLIC_NAV_LINKS } from '../utils/roleNavigation';
import { useAppState } from '../context/AppStateContext';

export default function Navbar({ isDashboard = false }) {
  const location = useLocation();
  const { isAuthenticated, user, role, roleBadge, redirectPath, logout } = useAuth();
  const { lastPlacedOrder } = useAppState();
  const navLinks = isDashboard ? getNavLinksForRole(role) : PUBLIC_NAV_LINKS;
  const lastTrackedOrderId = (typeof window !== 'undefined' ? window.sessionStorage.getItem('last_order_id') : null) || lastPlacedOrder?.id || null;
  const trackingPath = lastTrackedOrderId ? `/order-status/${lastTrackedOrderId}` : '/track-order';

  const baseHeaderClasses = "sticky top-0 z-50 border-b backdrop-blur-xl";
  const publicHeaderClasses = `${baseHeaderClasses} bg-background/80 border-slate-800`;
  const dashboardHeaderClasses = `${baseHeaderClasses} bg-background/90 border-slate-800 h-[64px]`;

  if (!isDashboard) {
    return (
      <header className={publicHeaderClasses}>
        <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center gap-6 px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3 text-accent transition hover:opacity-80">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-card">
              <Coffee size={20} />
            </div>
            <div>
              <p className="text-base font-semibold text-white">Cafe POS Suite</p>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 md:flex">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive ? 'bg-card text-white' : 'text-text-secondary hover:bg-card hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-card px-4 py-2.5 sm:flex">
                  <div>
                    <p className="text-sm font-medium text-white">{user?.email}</p>
                    <p className="text-xs text-text-secondary">{roleBadge}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="h-11 rounded-xl border border-slate-800 bg-card px-4 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  Logout
                </button>
                <Link to={redirectPath} className="hidden sm:inline-flex">
                  <Button variant="ghost" className="h-11 rounded-lg px-4 text-sm text-white hover:bg-card">
                    Open workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/reserve-table">
                  <Button variant="outline" className="h-11 rounded-lg border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                    Reserve table
                  </Button>
                </Link>
                <Link to={trackingPath}>
                  <Button variant="outline" className="h-11 rounded-lg border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                    Track order
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="h-11 rounded-lg bg-primary px-5 text-sm text-white hover:bg-primary/90">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={dashboardHeaderClasses}>
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 transition duration-200 hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
            <Coffee size={20} className="text-accent" />
          </div>
          <div>
            <p className="font-semibold text-white">Dashboard</p>
            <p className="text-xs text-text-secondary">{roleBadge}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-card text-white' : 'text-text-secondary hover:bg-card hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user?.email}</p>
            <p className="text-xs text-text-secondary">{role}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="h-10 rounded-lg bg-card px-4 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}