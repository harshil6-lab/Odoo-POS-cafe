import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <section className="relative flex h-screen min-h-[700px] items-center justify-center overflow-hidden bg-gradient-to-b from-background via-[#0d1935] to-card text-center">
      {/* Full background image overlay */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=80')" }}
      />
      <div className="absolute inset-0 -z-10 bg-background/[0.88]" />

      {/* 3D Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-20">
        <ThreeHero />
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-primary/[0.08] blur-[150px] pointer-events-none" />

      {/* Floating food emojis */}
      {floatingFoods.map((food, i) => (
        <span
          key={i}
          className={`absolute ${food.size} pointer-events-none select-none opacity-30 animate-float`}
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
      <div className="relative z-10 flex max-w-4xl flex-col items-center px-6">
        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm text-slate-400 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Live &amp; Serving
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl font-bold leading-[1.08] tracking-tight text-white md:text-7xl lg:text-8xl"
        >
          Smart Restaurant
          <br />
          <span className="bg-gradient-to-r from-primary via-[#ff6b7a] to-accent bg-clip-text text-transparent">
            Management System
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl"
        >
          Manage orders, kitchen, billing &amp; staff seamlessly.
          <br className="hidden sm:block" />
          QR Ordering &bull; Live Kitchen Display &bull; Smart Billing &bull; Staff Control
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="gap-2 px-10 text-base shadow-glow-red transition-transform hover:scale-105">
            <Link to="/menu">🍽️ Get Started</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2 px-10 text-base transition-transform hover:scale-105">
            <Link to="/login">Staff Login →</Link>
          </Button>
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xs text-slate-500"
        >
          <span className="flex items-center gap-1.5">✅ Realtime Updates</span>
          <span className="flex items-center gap-1.5">✅ Multi-Role Access</span>
          <span className="flex items-center gap-1.5">✅ PDF Receipts</span>
          <span className="flex items-center gap-1.5">✅ Razorpay Payments</span>
        </motion.div>
      </div>
    </section>
  );
}