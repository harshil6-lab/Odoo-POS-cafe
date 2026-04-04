import { Link } from 'react-router-dom';
import { mockCafeInfo } from '../utils/mockData';

const roleLinks = [
  { to: '/admin/dashboard', label: 'Staff login' },
  { to: '/admin/reports', label: 'Manager login' },
  { to: '/admin/kitchen', label: 'Kitchen display' },
  { to: '/admin/customer-display', label: 'Customer display' },
];

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80">
      <div className="section-shell grid gap-10 py-14 lg:grid-cols-[1fr,0.8fr,0.8fr]">
        <div>
          <p className="text-xl font-bold text-white">POS Cafe</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
            Premium restaurant operations for one cafe business, combining dining room control, POS, kitchen speed, and customer delight.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-400">Role entry</p>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            {roleLinks.map((link) => (
              <Link key={link.to} to={link.to} className="block transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-400">Contact</p>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <p>{mockCafeInfo.address}</p>
            <p>{mockCafeInfo.phone}</p>
            <p>{mockCafeInfo.email}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;