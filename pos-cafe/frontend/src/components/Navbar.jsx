import { Link } from "react-router-dom"
import { Menu, Coffee, Bell, Search, User, ArrowRight } from "lucide-react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"

const landingNavItems = [
  { label: "Customer Ordering", to: "/menu" },
  { label: "Waiter POS", to: "/admin/pos" },
  { label: "Kitchen Display", to: "/admin/kitchen" },
  { label: "Cashier Billing", to: "/admin/pos" },
  { label: "Manager Dashboard", to: "/admin" },
  { label: "Reports", to: "/admin/reports" },
  { label: "Settings", to: "/admin/settings" },
]

export default function Navbar({ isDashboard = false }) {
  if (isDashboard) {
    return (
      <header className="flex h-16 items-center shrink-0 border-b border-slate-800 bg-slate-900 px-4 md:px-6 shadow-sm sticky top-0 z-40">
        <div className="flex md:hidden items-center text-amber-500 font-bold gap-2">
          <Coffee size={24} />
          <span className="hidden sm:inline">POS CAFE</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
              type="search" 
              placeholder="Search anything..." 
              className="pl-9 bg-slate-950 border-slate-800 h-9" 
            />
          </div>
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-amber-500 rounded-full border border-slate-900"></span>
          </Button>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center cursor-pointer hover:border-amber-500 transition">
            <User size={16} className="text-slate-400" />
          </div>
        </div>
      </header>
    )
  }

  // Landing Navbar
  return (
    <header className="sticky top-0 z-50 flex h-20 items-center border-b border-slate-800 bg-slate-950/90 px-6 backdrop-blur-md lg:px-12">
      <Link to="/" className="flex items-center gap-2 text-amber-500 transition hover:text-amber-400">
        <Coffee size={32} />
        <span className="font-display text-xl font-semibold tracking-wide text-white">POS CAFE</span>
      </Link>
      
      <nav className="ml-10 hidden items-center gap-6 xl:flex">
        {landingNavItems.map((item) => (
          <Link key={item.label} to={item.to} className="font-accent text-sm font-medium text-slate-300 transition hover:text-amber-500">
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-4">
        <Link to="/admin" className="hidden sm:inline-flex">
          <Button variant="ghost" className="font-accent text-slate-300">Staff Access</Button>
        </Link>
        <Link to="/admin/pos">
          <Button className="rounded-xl px-5 font-accent font-semibold shadow-premium">
            Open Control Portal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={24} />
        </Button>
      </div>
    </header>
  )
}