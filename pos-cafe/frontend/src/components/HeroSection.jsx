import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import ThreeHero from './ThreeHero';

const floatingFoods = [
  { emoji: '🍕', top: '10%', left: '8%', delay: '0s', size: 'text-5xl' },
  { emoji: '🍔', top: '20%', right: '10%', delay: '1s', size: 'text-4xl' },
  { emoji: '🍣', bottom: '25%', left: '5%', delay: '2s', size: 'text-4xl' },
  { emoji: '🧁', top: '15%', left: '35%', delay: '0.5s', size: 'text-3xl' },
  { emoji: '🍜', bottom: '20%', right: '8%', delay: '1.5s', size: 'text-5xl' },
  { emoji: '☕', top: '40%', left: '12%', delay: '3s', size: 'text-3xl' },
  { emoji: '🥗', bottom: '35%', right: '15%', delay: '2.5s', size: 'text-3xl' },
  { emoji: '🍩', top: '55%', right: '25%', delay: '0.8s', size: 'text-4xl' },
];

export default function HeroSection() {
  return (
    <section className="relative flex h-screen min-h-[700px] items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B0F1A] via-[#0d1322] to-[#111827] text-center">
      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-30">
        <ThreeHero />
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none" />

      {/* Floating food emojis */}
      {floatingFoods.map((food, i) => (
        <span
          key={i}
          className={`absolute ${food.size} pointer-events-none select-none opacity-40 animate-float`}
          style={{
            top: food.top,
            left: food.left,
            right: food.right,
            bottom: food.bottom,
            animationDelay: food.delay,
            animationDuration: `${6 + i * 0.5}s`,
          }}
        >
          {food.emoji}
        </span>
      ))}

      {/* Content */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center px-6 animate-slide-up">
        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-sm text-slate-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live &amp; Serving
        </span>

        <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">
          Smart Restaurant
          <br />
          <span className="bg-gradient-to-r from-primary via-[#ff6b7a] to-accent bg-clip-text text-transparent">
            POS System
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400 md:text-xl">
          QR Ordering &bull; Live Kitchen Display &bull; Smart Billing &bull; Staff Control
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 px-8 text-base shadow-glow-red transition-transform hover:scale-105">
            <Link to="/menu">🍽️ Start Ordering</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 px-8 text-base transition-transform hover:scale-105">
            <Link to="/login">Staff Login →</Link>
          </Button>
        </div>

        {/* Trust bar */}
        <div className="mt-14 flex items-center gap-8 text-xs text-slate-500">
          <span>✅ Realtime Updates</span>
          <span>✅ Multi-Role Access</span>
          <span>✅ PDF Receipts</span>
        </div>
      </div>
    </section>
  );
}