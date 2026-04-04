import HeroSection from "../components/HeroSection"
import MenuPreview from "../components/MenuPreview"
import QRSection from "../components/QRSection"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { ArrowRight, ChefHat, MonitorPlay, QrCode, ReceiptText, UtensilsCrossed } from "lucide-react"

const floorTables = [
  { label: "T1", state: "available", col: "col-span-2", tone: "bg-teal-400/12 text-teal-300" },
  { label: "T2", state: "occupied", col: "col-span-1", tone: "bg-amber-500/12 text-amber-300" },
  { label: "T3", state: "reserved", col: "col-span-1", tone: "bg-slate-700 text-slate-300" },
  { label: "T4", state: "cleaning", col: "col-span-2", tone: "bg-rose-500/12 text-rose-300" },
  { label: "T5", state: "available", col: "col-span-1", tone: "bg-teal-400/12 text-teal-300" },
  { label: "T6", state: "occupied", col: "col-span-2", tone: "bg-amber-500/12 text-amber-300" },
]

const mediaBlocks = [
  {
    title: "Dining room tablet workflow",
    description: "Restaurant workflow photography placeholder",
    size: "lg:col-span-2 lg:row-span-2",
    tone: "from-amber-500/20 via-slate-900 to-slate-950",
  },
  {
    title: "Kitchen pass coordination",
    description: "Restaurant workflow photography placeholder",
    size: "lg:col-span-1",
    tone: "from-teal-400/20 via-slate-900 to-slate-950",
  },
  {
    title: "Cashier settlement station",
    description: "Restaurant workflow photography placeholder",
    size: "lg:col-span-1",
    tone: "from-slate-700 via-slate-900 to-slate-950",
  },
]

const commandPanels = [
  {
    title: "Table command center",
    description: "Visualize occupancy, reservations, and cleaning state before opening waiter controls.",
    icon: UtensilsCrossed,
  },
  {
    title: "Kitchen execution",
    description: "Route orders into prep lanes with clearer handoff between service and back-of-house.",
    icon: ChefHat,
  },
  {
    title: "Billing and session closure",
    description: "Track split tenders, settlement references, and cashier sessions in one place.",
    icon: ReceiptText,
  },
  {
    title: "Operator visibility",
    description: "Jump from entry portal to reports, dashboards, and role-specific operational surfaces.",
    icon: MonitorPlay,
  },
]

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <HeroSection />

      <section className="landing-section border-t border-slate-900 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid cards-gap xl:grid-cols-[0.95fr,1.05fr]">
            <div>
              <p className="section-kicker">Restaurant floor preview</p>
              <h2 className="section-heading mt-5">Preview the dining room before launching floor-side actions</h2>
              <p className="section-body mt-6 max-w-xl">
                The entry portal exposes table state immediately so staff can move from portal overview to waiter POS without searching through dashboards first.
              </p>
              <div className="mt-10 grid cards-gap sm:grid-cols-2">
                {commandPanels.map((panel) => {
                  const Icon = panel.icon
                  return (
                    <Card key={panel.title}>
                      <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-amber-500">
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="font-display text-2xl">{panel.title}</CardTitle>
                        <CardDescription className="text-base leading-7 text-slate-400">
                          {panel.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>
            </div>

            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Live floor state</p>
                    <CardTitle className="mt-3 font-display text-3xl">Dining room layout</CardTitle>
                  </div>
                  <Button variant="outline" className="font-accent">Open Tables</Button>
                </div>
                <CardDescription className="text-base leading-7 text-slate-400">
                  Available, occupied, reserved, and cleaning states rendered as a responsive floor preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 cards-gap rounded-[28px] border border-slate-800 bg-slate-950 p-6">
                  {floorTables.map((table) => (
                    <div key={table.label} className={`${table.col} rounded-2xl border border-slate-800 ${table.tone} p-5 transition-all hover:-translate-y-1`}>
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-display text-3xl font-semibold">{table.label}</span>
                        <span className="font-accent text-[11px] uppercase tracking-[0.26em] text-slate-400">{table.state}</span>
                      </div>
                      <div className="mt-10 h-14 rounded-xl border border-dashed border-slate-700/80" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <QRSection />
      <MenuPreview />

      <section className="landing-section border-t border-slate-900 bg-slate-950">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="section-kicker">Workflow photography layout</p>
            <h2 className="section-heading mt-5">Visual placeholders for restaurant operations storytelling</h2>
            <p className="section-body mt-6">
              These blocks replace generic homepage imagery with photography-oriented placeholders for cashier, dining room, and kitchen workflow scenes.
            </p>
          </div>
          <div className="mt-14 grid auto-rows-[220px] cards-gap lg:grid-cols-3">
            {mediaBlocks.map((block) => (
              <Card key={block.title} className={`overflow-hidden ${block.size}`}>
                <CardContent className="h-full p-0">
                  <div className={`flex h-full flex-col justify-between bg-gradient-to-br ${block.tone} p-8`}>
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/60">
                      <QrCode className="h-8 w-8 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="font-display text-3xl font-semibold text-white">{block.title}</h3>
                      <p className="mt-4 max-w-md text-base leading-7 text-slate-400">{block.description}</p>
                      <div className="mt-6 inline-flex items-center font-accent text-xs uppercase tracking-[0.28em] text-teal-400">
                        Cinematic restaurant operations placeholder
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
