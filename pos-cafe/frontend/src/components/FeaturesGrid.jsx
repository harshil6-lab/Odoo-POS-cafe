import { QrCode, Zap, Receipt, Users, BarChart } from 'lucide-react';

const features = [
  {
    name: 'QR Ordering',
    description: 'Seamless QR code-based ordering for a modern dining experience.',
    icon: QrCode,
  },
  {
    name: 'Live Kitchen',
    description: 'Real-time order tracking for the kitchen staff to improve efficiency.',
    icon: Zap,
  },
  {
    name: 'Smart Billing',
    description: 'Integrated billing system for quick and easy payment processing.',
    icon: Receipt,
  },
  {
    name: 'Role-Based Access',
    description: 'Secure access control for different staff roles.',
    icon: Users,
  },
  {
    name: 'Analytics Dashboard',
    description: 'Insightful analytics to track sales and performance.',
    icon: BarChart,
  },
];

export default function FeaturesGrid() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything you need, nothing you don't</h2>
          <p className="mt-4 text-lg text-text-secondary">
            A complete POS solution to streamline your restaurant operations.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="bg-card rounded-2xl p-6 shadow-lg transition duration-300 hover:scale-105"
            >
              <feature.icon className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-bold text-white">{feature.name}</h3>
              <p className="mt-2 text-text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}