import { Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';

const footerLinks = [
  { label: 'Menu', to: '/menu' },
  { label: 'Reserve table', to: '/reserve-table' },
  { label: 'Floor layout', to: '/floor-layout' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  const { tables, catalogItems, reservations } = useAppState();

  return (
    <footer className="border-t border-[#374151] bg-[#111827] text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 text-[#F59E0B]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#374151] bg-[#111827]">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold text-[#F9FAFB]">Cafe POS Suite</p>
              <p className="text-sm text-[#9CA3AF]">Restaurant operating system</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-[#9CA3AF]">
            Premium QR ordering, live kitchen progress, and fast billing for restaurant teams.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-medium text-[#F9FAFB]">Quick links</h3>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm text-[#9CA3AF] transition hover:text-[#F9FAFB]">
                {link.label}
              </Link>
            ))}
            <Link to="/track-order" className="text-sm text-[#9CA3AF] transition hover:text-[#F9FAFB]">Track order</Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-[#F9FAFB]">Contact info</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#9CA3AF]">
            <p>support@cafepossuite.com</p>
            <p>+91 98765 43210</p>
            <p>Ground floor service desk</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-[#F9FAFB]">Opening hours</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#9CA3AF]">
            <p>Mon to Fri: 8:00 AM to 10:00 PM</p>
            <p>Sat to Sun: 9:00 AM to 11:00 PM</p>
            <p>{tables.length} tables, {catalogItems.length} items, {reservations.length} reservations</p>
            <div className="flex gap-3 pt-1">
              <a href="https://instagram.com" className="transition hover:text-[#F9FAFB]">Instagram</a>
              <a href="https://facebook.com" className="transition hover:text-[#F9FAFB]">Facebook</a>
              <a href="https://x.com" className="transition hover:text-[#F9FAFB]">X</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}