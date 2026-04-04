import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard,
  Table,
  MonitorPlay,
  ChefHat,
  ClipboardList,
  Users,
  ConciergeBell,
  CircleUserRound
} from "lucide-react"

export default function Sidebar() {
  const location = useLocation()
  
  const navItems = [
    { label: "Guest Menu", href: "/menu", icon: <CircleUserRound size={18} />, audience: "Customer" },
    { label: "Book Table", href: "/book-table", icon: <ConciergeBell size={18} />, audience: "Customer" },
    { label: "Dashboard", href: "/admin", icon: <LayoutDashboard size={18} />, audience: "Staff" },
    { label: "Tables", href: "/admin/tables", icon: <Table size={18} />, audience: "Staff" },
    { label: "Register", href: "/admin/pos", icon: <MonitorPlay size={18} />, audience: "Staff" },
    { label: "Kitchen", href: "/admin/kitchen", icon: <ChefHat size={18} />, audience: "Staff" },
    { label: "Orders", href: "/admin/orders", icon: <ClipboardList size={18} />, audience: "Staff" },
    { label: "Customers", href: "/admin/customers", icon: <Users size={18} />, audience: "Staff" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-amber-500 transition hover:text-amber-400">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <ConciergeBell size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Hotel operations</p>
              <span className="text-lg font-semibold tracking-wide text-white">Frontdesk Flow</span>
            </div>
          </Link>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em]">
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 font-semibold text-amber-300">Staff</span>
            <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 font-semibold text-slate-300">Customers</span>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href || (item.href.startsWith('/admin') && item.href !== '/admin' && location.pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                    : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  {item.audience}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}