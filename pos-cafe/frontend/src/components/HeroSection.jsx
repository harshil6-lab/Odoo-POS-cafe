import { Link } from "react-router-dom"
import { ArrowRight, ChefHat, CookingPot, CreditCard, QrCode, ShieldCheck, UserRound } from "lucide-react"
import { Button } from "./ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"

const roleCards = [
  {
    title: "Customer Mode",
    description: "Browse the menu, place table QR orders, and follow order status in real time.",
    icon: QrCode,
    to: "/menu",
  },
  {
    title: "Waiter Mode",
    description: "Take floor-side orders, manage tables, and coordinate guest requests from the POS.",
    icon: UserRound,
    to: "/admin/pos",
  },
  {
    title: "Cashier Mode",
    description: "Process card, cash, and UPI payments with accurate session totals and handoff control.",
    icon: CreditCard,
    to: "/admin/pos",
  },
  {
    title: "Kitchen Mode",
    description: "Track incoming tickets, move items through prep stages, and maintain service speed.",
    icon: CookingPot,
    to: "/admin/kitchen",
  },
  {
    title: "Manager Mode",
    description: "Monitor active tables, revenue flow, and operational blockers from the dashboard.",
    icon: ChefHat,
    to: "/admin",
  },
  {
    title: "Admin Mode",
    description: "Configure products, categories, staff workflows, and full restaurant control settings.",
    icon: ShieldCheck,
    to: "/admin/settings",
  },
]

export default function HeroSection() {
  return (
    <section className="landing-hero relative overflow-hidden border-b border-slate-900 bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_28%),radial-gradient(circle_at_70%_20%,_rgba(45,212,191,0.12),_transparent_22%),linear-gradient(180deg,_rgba(15,23,42,0.28),_rgba(2,6,23,0.98))]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="container relative mx-auto px-6 lg:px-8">
        <div className="grid items-start cards-gap xl:grid-cols-[1.15fr,0.85fr]">
          <div className="max-w-4xl">
            <p className="section-kicker">Restaurant control system</p>
            <h1 className="mt-8 max-w-5xl font-display text-5xl font-semibold leading-[0.92] text-white sm:text-6xl xl:text-7xl">
              Manage Orders. Control Tables. Run Kitchen. Track Revenue.
            </h1>
            <p className="mt-8 max-w-2xl section-body">
              A complete restaurant operating system inspired by Odoo POS Cafe.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-xl px-8 font-accent text-base font-semibold">
                <Link to="/menu">
                  Customer Ordering
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-xl px-8 font-accent text-base">
                <Link to="/admin/pos">Open Waiter POS</Link>
              </Button>
            </div>
          </div>

          <div className="dark-card relative overflow-hidden p-6 lg:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_34%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div>
                  <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-400">Live operations</p>
                  <p className="mt-2 text-2xl font-semibold text-white">18 active tables</p>
                </div>
                <div className="rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 font-accent text-xs uppercase tracking-[0.24em] text-teal-300">
                  synced
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="dark-card p-5">
                  <p className="font-accent text-xs uppercase tracking-[0.22em] text-slate-500">Kitchen queue</p>
                  <p className="mt-3 text-3xl font-semibold text-white">12</p>
                  <p className="mt-2 text-sm text-slate-400">Tickets waiting across hot bar, pastry, and coffee line.</p>
                </div>
                <div className="dark-card p-5">
                  <p className="font-accent text-xs uppercase tracking-[0.22em] text-slate-500">Cashier session</p>
                  <p className="mt-3 text-3xl font-semibold text-white">₹48.2k</p>
                  <p className="mt-2 text-sm text-slate-400">Realtime payment capture across split bills and QR payments.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 grid cards-gap md:grid-cols-2 xl:grid-cols-3">
          {roleCards.map((role) => {
            const Icon = role.icon
            return (
              <Card key={role.title} className="group overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-amber-500 transition group-hover:text-teal-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Button asChild variant="ghost" className="font-accent text-slate-400 hover:text-white">
                      <Link to={role.to}>Enter</Link>
                    </Button>
                  </div>
                  <CardTitle className="font-display text-3xl">{role.title}</CardTitle>
                  <CardDescription className="section-body text-base leading-7">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-1 rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-teal-400 opacity-70" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}