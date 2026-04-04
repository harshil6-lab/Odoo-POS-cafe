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
  <Link to={to} className="text-text-secondary transition hover:text-white">
    {children}
  </Link>
);

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 text-primary">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-card">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">POS Cafe</span>
            </Link>
            <p className="mt-4 max-w-sm text-text-secondary">
              The future of dining is here. A premium restaurant experience for guests and staff.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="text-text-secondary hover:text-white"><Globe size={20} /></a>
              <a href="#" className="text-text-secondary hover:text-white"><MessageCircle size={20} /></a>
              <a href="#" className="text-text-secondary hover:text-white"><Send size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerSections.company.map(link => <li key={link.label}><FooterLink to={link.to}>{link.label}</FooterLink></li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Product</h3>
            <ul className="mt-4 space-y-3">
              {footerSections.product.map(link => <li key={link.label}><FooterLink to={link.to}>{link.label}</FooterLink></li>)}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Features</h3>
            <ul className="mt-4 space-y-3">
              {footerSections.features.map(link => <li key={link.label}><FooterLink to={link.to}>{link.label}</FooterLink></li>)}
            </ul>
          </div>
        </div>
        <div className="mt-16 border-t border-slate-800 pt-8 text-center text-sm text-text-secondary">
          &copy; {new Date().getFullYear()} POS Cafe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}