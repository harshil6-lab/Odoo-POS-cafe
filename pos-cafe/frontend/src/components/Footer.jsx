import { Link } from "react-router-dom"

const portalLinks = [
  { label: "Customer ordering", to: "/menu" },
  { label: "Waiter POS", to: "/admin/pos" },
  { label: "Kitchen display", to: "/admin/kitchen" },
  { label: "Cashier billing", to: "/admin/pos" },
  { label: "Manager dashboard", to: "/admin" },
  { label: "Reports", to: "/admin/reports" },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="container mx-auto grid cards-gap px-6 py-16 md:grid-cols-[1.1fr,0.9fr,0.8fr] lg:px-8">
        <div>
          <p className="section-kicker">POS Cafe</p>
          <h3 className="mt-5 font-display text-3xl font-semibold text-white">
            Restaurant control portal for floor, kitchen, billing, and reporting.
          </h3>
          <p className="mt-6 max-w-lg text-base leading-8 text-slate-400">
            Single-business operations stack inspired by Odoo POS Cafe, optimized for dine-in service flow and role-based execution.
          </p>
        </div>
        <div>
          <h4 className="font-accent text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">Portal links</h4>
          <div className="mt-6 grid gap-4">
            {portalLinks.map((link) => (
              <Link key={link.label} to={link.to} className="text-base text-slate-400 transition hover:text-amber-500">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-accent text-sm font-semibold uppercase tracking-[0.28em] text-slate-300">Access roles</h4>
          <div className="mt-6 grid gap-4 text-base text-slate-400">
            <Link to="/admin" className="transition hover:text-amber-500">Staff login</Link>
            <Link to="/admin" className="transition hover:text-amber-500">Manager login</Link>
            <Link to="/admin/kitchen" className="transition hover:text-amber-500">Kitchen display</Link>
            <Link to="/admin/customer-display" className="transition hover:text-amber-500">Customer display</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}