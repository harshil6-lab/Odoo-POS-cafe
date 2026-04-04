import { ArrowRightLeft, ChefHat, CreditCard, QrCode, ReceiptIndianRupee } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"

const workflow = [
  {
    title: "Customer scans QR",
    description: "Table-side ordering starts from the guest device with menu visibility and item notes.",
    icon: QrCode,
  },
  {
    title: "Waiter confirms order",
    description: "Floor staff validates additions, modifiers, and routing before the ticket is sent live.",
    icon: ArrowRightLeft,
  },
  {
    title: "Kitchen prepares items",
    description: "Kitchen display organizes tickets into cook, preparing, and completed states.",
    icon: ChefHat,
  },
  {
    title: "Cashier processes payment",
    description: "Cash, card, and UPI payments are recorded with clear session accountability.",
    icon: CreditCard,
  },
  {
    title: "Manager views analytics",
    description: "Dashboards surface revenue movement, table turnover, and shift-level performance instantly.",
    icon: ReceiptIndianRupee,
  },
]

export default function QRSection() {
  return (
    <section className="landing-section border-t border-slate-900 bg-slate-950">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="section-kicker">Workflow orchestration</p>
          <h2 className="section-heading mt-5">One service flow from table scan to revenue visibility</h2>
          <p className="section-body mt-6">
            The portal is structured around the actual restaurant workflow, not a brochure. Every role enters the same operating system from a mode built for that part of service.
          </p>
        </div>
        <div className="mt-14 grid cards-gap md:grid-cols-2 xl:grid-cols-5">
          {workflow.map((step, index) => {
            const Icon = step.icon
            return (
              <Card key={step.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950 text-teal-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">0{index + 1}</span>
                  </div>
                  <CardTitle className="font-display text-2xl">{step.title}</CardTitle>
                  <CardDescription className="text-base leading-7 text-slate-400">
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-28 rounded-2xl border border-slate-800 bg-[linear-gradient(135deg,rgba(15,23,42,0.95),rgba(30,41,59,0.55))] p-4">
                    <div className="flex h-full items-end rounded-xl border border-dashed border-slate-700 px-3 py-2">
                      <p className="font-accent text-xs uppercase tracking-[0.28em] text-slate-500">Restaurant workflow placeholder</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}