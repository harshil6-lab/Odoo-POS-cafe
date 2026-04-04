import { Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { contactDetails } from '../data/restaurantData';

const footerLinks = [
  { label: 'Menu', to: '/menu' },
  { label: 'Reserve table', to: '/reserve-table' },
  { label: 'Floor layout', to: '/floor-layout' },
  { label: 'Contact', to: '/contact' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#374151] bg-[#0B1220]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3 text-[#F59E0B]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#374151] bg-[#111827]">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-medium text-[#F9FAFB]">POS Suite</p>
              <p className="text-sm text-[#9CA3AF]">Restaurant operating system</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#9CA3AF]">
            Restaurant control portal for floor, kitchen, billing, and reporting.
          </p>
        </div>

        <div>
          <h3 className="text-base font-medium text-[#F9FAFB]">Navigation</h3>
          <div className="mt-4 grid gap-3">
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-sm text-[#9CA3AF] transition hover:text-[#F9FAFB]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-medium text-[#F9FAFB]">Restaurant info</h3>
          <div className="mt-4 grid gap-3 text-sm text-[#9CA3AF]">
            <p>{contactDetails.address}</p>
            <p>Privacy policy</p>
            <p>Terms</p>
          </div>
        </div>
      </div>
    </footer>
  );
}