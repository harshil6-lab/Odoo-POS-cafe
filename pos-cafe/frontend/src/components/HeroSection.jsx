import { ArrowRight, Coffee, QrCode, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

function HeroSection() {
  return (
    <section className="section-shell py-16 sm:py-20 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr,0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
            <Sparkles className="h-4 w-4 text-brand-400" />
            Premium cafe operations for a single restaurant business
          </div>

          <h1 className="mt-8 max-w-4xl text-balance text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Crafted Coffee. Smart Ordering. Better Experience.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            A cinematic restaurant POS frontend inspired by modern cafe hospitality, built for counter service, table ordering, kitchen coordination, and guest delight.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/menu">
              <Button size="lg">
                View Menu
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/book-table">
              <Button size="lg" variant="secondary">
                Order From Table
                <QrCode className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Avg. order ready', value: '18 min' },
              { label: 'Live tables tracked', value: '08' },
              { label: 'Payment mix visible', value: '100%' },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-3 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 rounded-[2rem] bg-amber-glow blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-panel">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] bg-gradient-to-br from-brand-500/30 via-amber-300/10 to-slate-900 p-6">
                <Coffee className="h-8 w-8 text-brand-300" />
                <p className="mt-16 text-xs uppercase tracking-[0.35em] text-slate-400">Coffee lifestyle</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Blue Tokai energy, reserve-style polish</h3>
              </div>
              <div className="rounded-[1.5rem] bg-gradient-to-br from-teal-400/20 via-cyan-400/10 to-slate-900 p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Operational clarity</p>
                <h3 className="mt-3 text-2xl font-bold text-white">Realtime handoff from table to kitchen</h3>
              </div>
            </div>

            <div className="mt-4 rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Tonight's flow</p>
                  <p className="mt-2 text-3xl font-bold text-white">46 active orders</p>
                </div>
                <div className="animate-float rounded-full bg-brand-500/20 px-4 py-2 text-sm font-semibold text-brand-200">
                  Guest experience uplift
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;