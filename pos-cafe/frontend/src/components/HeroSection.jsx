import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import ThreeHero from './ThreeHero';

export default function HeroSection() {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden bg-gradient-to-b from-[#0B0F1A] to-[#111827]">
      <div className="absolute inset-0 opacity-40 pointer-events-none -z-10">
        <ThreeHero />
      </div>
      <div className="relative z-10 flex flex-col items-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
          Smart Restaurant POS System
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl">
          QR Ordering + Kitchen + Billing + Staff Control
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-[#EF4F5F] text-white hover:bg-red-700 transition-transform hover:scale-105">
            <Link to="/menu">Start Ordering</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black transition-transform hover:scale-105">
            <Link to="/login">Staff Login</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}