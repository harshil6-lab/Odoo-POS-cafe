import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Coffee } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { APP_NAV_LINKS, PUBLIC_NAV_LINKS, getNavLinksForRole } from '../utils/roleNavigation';
import { useAppState } from '../context/AppStateContext';

export default function Navbar({ isDashboard = false }) {
  const location = useLocation();
  const { isAuthenticated, user, role, roleBadge, redirectPath, logout } = useAuth();
  const { lastPlacedOrder } = useAppState();
  const navLinks = isDashboard ? getNavLinksForRole(role) : PUBLIC_NAV_LINKS;
  const trackingPath = lastPlacedOrder?.id ? `/track-order?orderId=${lastPlacedOrder.id}` : '/track-order';

  if (!isDashboard) {
    return (
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1220] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center gap-6 px-6">
          <Link to="/" className="flex shrink-0 items-center gap-3 text-[#F59E0B] transition hover:text-[#D97706]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#374151] bg-[#111827]">
              <Coffee size={20} />
            </div>
            <div>
              <p className="text-base font-semibold text-[#F9FAFB]">Cafe POS Suite</p>
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
                    isActive ? 'bg-[#111827] text-[#F9FAFB]' : 'text-[#9CA3AF] hover:bg-[#111827] hover:text-[#F9FAFB]'
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
                <div className="hidden items-center gap-3 rounded-xl border border-[#374151] bg-[#111827] px-4 py-2.5 sm:flex">
                  <div>
                    <p className="text-sm font-medium text-[#F9FAFB]">{user?.email}</p>
                    <p className="text-xs text-[#9CA3AF]">{roleBadge}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="h-11 rounded-xl border border-[#374151] bg-[#111827] px-4 text-sm font-medium text-[#F9FAFB] transition hover:bg-[#1F2937]"
                >
                  Logout
                </button>
                <Link to={redirectPath} className="hidden sm:inline-flex">
                  <Button variant="ghost" className="h-11 rounded-lg px-4 text-sm text-[#F9FAFB] hover:bg-[#111827]">
                    Open workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/reserve-table">
                  <Button variant="outline" className="h-11 rounded-lg border border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                    Reserve table
                  </Button>
                </Link>
                <Link to={trackingPath}>
                  <Button variant="outline" className="h-11 rounded-lg border border-slate-600 px-5 text-sm text-white hover:bg-slate-800">
                    Track order
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="h-11 rounded-lg bg-[#F59E0B] px-5 text-sm text-black hover:brightness-110">
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
    <header className="sticky top-0 z-50 h-[64px] border-b border-slate-800 bg-[#0B1220] backdrop-blur-md">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 transition duration-200 hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Coffee size={20} className="text-amber-400" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-white">POS Suite</span>
            <p className="text-xs text-slate-400">Restaurant system</p>
          </div>
        </Link>

        <nav className="ml-8 hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={
                  isActive
                    ? 'rounded-lg bg-amber-500 px-4 py-1.5 text-sm font-medium text-black shadow-md'
                    : 'text-sm font-medium text-slate-300 transition duration-200 hover:text-white'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-2 rounded-lg bg-slate-800 px-4 py-1.5 sm:flex">
                <p className="text-sm text-slate-200">{user?.email}</p>
                {roleBadge && (
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                    {roleBadge}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className="rounded-lg border border-slate-700 px-4 py-1.5 text-sm text-slate-300 transition duration-200 hover:bg-slate-800 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="h-11 px-5 text-sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="h-11 px-5 text-sm">
                  Signup
                </Button>
              </Link>
            </>
          )}

          <Link
            to={isAuthenticated ? redirectPath : '/menu'}
            className="hidden items-center gap-2 text-sm text-slate-400 transition duration-200 hover:text-white sm:inline-flex"
          >
            {isAuthenticated ? 'Open workspace' : 'Order now'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}