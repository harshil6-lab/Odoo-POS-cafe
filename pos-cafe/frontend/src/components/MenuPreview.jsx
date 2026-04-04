import { Activity, Boxes, CreditCard, QrCode, ReceiptText } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/Card"

const features = [
  {
    title: "Live kitchen sync",
    description: "Orders move into kitchen workflow boards the moment floor staff or QR guests confirm them.",
    icon: Activity,
  },
  {
    title: "QR table ordering",
    description: "Guests order from table while staff monitors capacity, item notes, and prep queues centrally.",
    icon: QrCode,
  },
  {
    title: "Split payments",
    description: "Process mixed tender flows without losing reconciliation or table-level transaction clarity.",
    icon: CreditCard,
  },
  {
    title: "Session reports",
    description: "Track cashier sessions, shift performance, and order values without waiting for end-of-day exports.",
    icon: ReceiptText,
  },
  {
    title: "Inventory tracking",
    description: "Use the product and category structure as the base layer for later stock and availability rules.",
    icon: Boxes,
  },
]

export default function MenuPreview() {
  return (
    <section className="landing-section border-t border-slate-900 bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid cards-gap xl:grid-cols-[0.9fr,1.1fr]">
          <div>
            <p className="section-kicker">POS feature highlights</p>
            <h2 className="section-heading mt-5">Operational depth designed for service, billing, and floor control</h2>
            <p className="section-body mt-6 max-w-xl">
              This landing portal now presents the product as an internal operating system. Each module below connects directly to a live restaurant workflow instead of generic marketing promises.
            </p>
          </div>
          <div className="grid cards-gap md:grid-cols-2">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-amber-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="font-display text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-7 text-slate-400">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}