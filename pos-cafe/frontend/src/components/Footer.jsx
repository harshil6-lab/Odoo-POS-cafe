import { Coffee, Globe, MessageCircle, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerSections = {
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Careers', to: '#' },
  ],
  product: [
    { label: 'Menu', to: '/menu' },
    { label: 'Book a Table', to: '/book-table' },
    { label: 'Track Order', to: '/track-order' },
  ],
  features: [
    { label: 'QR Ordering', to: '#' },
    { label: 'Live Kitchen', to: '#' },
    { label: 'Smart Billing', to: '#' },
  ],
  support: [
    { label: 'Help Center', to: '#' },
    { label: 'Terms of Service', to: '#' },
    { label: 'Privacy Policy', to: '#' },
  ],
};

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-slate-500 transition-colors duration-200 hover:text-slate-200">
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-[#060911] text-white">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <span className="text-lg">🍽️</span>
              </div>
              <span className="font-display text-xl font-bold">POS Cafe</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              The future of dining is here. A premium restaurant experience powered by realtime technology.
            </p>
            <div className="mt-6 flex gap-3">
              {[Globe, MessageCircle, Send].map((Icon, i) => (
                <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03] text-slate-500 transition hover:bg-white/[0.06] hover:text-white">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
          
          {Object.entries(footerSections).slice(0, 3).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
              <ul className="mt-4 space-y-3 text-sm">
                {links.map(link => <li key={link.label}><FooterLink to={link.to}>{link.label}</FooterLink></li>)}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/[0.04] pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} POS Cafe. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-slate-600">
            <span>Made with 🍕 for restaurants</span>
          </div>
        </div>
      </div>
    </footer>
  );
}