import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Coffee } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { APP_NAV_LINKS, PUBLIC_NAV_LINKS } from '../utils/roleNavigation';
import { useAppState } from '../context/AppStateContext';

export default function Navbar({ isDashboard = false }) {
  const location = useLocation();
  const { isAuthenticated, user, roleBadge, redirectPath, logout } = useAuth();
  const { lastPlacedOrder } = useAppState();
  const navLinks = isDashboard ? APP_NAV_LINKS : PUBLIC_NAV_LINKS;
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B1220]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] w-full max-w-7xl items-center gap-4 px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-3 text-amber-400 transition hover:text-amber-300">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-500/10">
            <Coffee size={20} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Restaurant system</p>
            <span className="text-base font-semibold text-slate-100">POS Suite</span>
          </div>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-[0_10px_24px_rgba(245,158,11,0.2)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-4 py-2.5 sm:flex">
                <div>
                  <p className="text-sm font-medium text-slate-100">{user?.email}</p>
                  <p className="text-xs text-slate-400">{roleBadge}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => void logout()}
                className="h-11 rounded-2xl border border-white/10 bg-[#111827] px-4 text-sm font-medium text-slate-100 transition hover:bg-slate-800"
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

          <Link to={isAuthenticated ? redirectPath : '/menu'} className="hidden sm:inline-flex">
            <Button variant="ghost" className="h-11 rounded-2xl px-4 text-sm text-slate-300">
              {isAuthenticated ? 'Open workspace' : 'Order now'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}