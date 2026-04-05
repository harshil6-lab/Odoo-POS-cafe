import { motion } from 'framer-motion';
import { Coffee, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import Footer from '../components/Footer';

const teamMembers = [
  {
    name: 'Pranav Dabhi',
    role: 'Full-Stack Developer',
    avatar: '👨‍💻',
    bio: 'Architected the Supabase backend, role-based auth system, and Razorpay integration.',
  },
  {
    name: 'Team Member 2',
    role: 'Frontend Engineer',
    avatar: '👩‍💻',
    bio: 'Built the responsive UI with React, Tailwind CSS, and framer-motion animations.',
  },
  {
    name: 'Team Member 3',
    role: 'UI/UX Designer',
    avatar: '🎨',
    bio: 'Designed the dark theme, glass-card system, and the premium visual language.',
  },
  {
    name: 'Team Member 4',
    role: 'Backend & DevOps',
    avatar: '⚙️',
    bio: 'Managed Supabase schema, realtime subscriptions, and deployment pipelines.',
  },
];

const features = [
  { emoji: '📱', title: 'QR Table Ordering', desc: 'Customers scan, browse, and order from their phone.' },
  { emoji: '👨‍🍳', title: 'Live Kitchen Board', desc: 'Realtime kanban for chefs with 5-stage order tracking.' },
  { emoji: '💳', title: 'Smart Billing', desc: 'Cash, Card, and UPI payments with PDF invoice generation.' },
  { emoji: '🪑', title: 'Floor Management', desc: '3D table preview with live status across multiple floors.' },
  { emoji: '👥', title: 'Role-Based Access', desc: 'Manager, Waiter, Cashier, and Chef — each with tailored views.' },
  { emoji: '📊', title: 'Analytics Dashboard', desc: 'Live metrics, reservation tracking, and menu editor for managers.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background via-[#0d1935] to-card">
        {/* Hero */}
        <section className="relative overflow-hidden pb-20 pt-32">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/[0.06] blur-[140px] pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <motion.span
              {...fadeUp}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-2 text-sm text-slate-400 backdrop-blur-sm"
            >
              <Users className="h-4 w-4" /> About POS Café
            </motion.span>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl"
            >
              We built this to
              <br />
              <span className="bg-gradient-to-r from-primary via-[#ff6b7a] to-accent bg-clip-text text-transparent">
                simplify restaurants
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400"
            >
              POS Café is a modern, full-stack restaurant management system designed for speed,
              simplicity, and a premium user experience. From QR ordering to live kitchen displays,
              every feature is built with real restaurants in mind.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex justify-center gap-4"
            >
              <Button asChild size="lg" className="gap-2 px-8 shadow-glow-red">
                <Link to="/menu">Explore Menu</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 px-8">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features grid */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="text-center font-display text-2xl font-bold text-white md:text-3xl"
          >
            What makes it special
          </motion.h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="glass-card p-6 transition-all duration-200 hover:shadow-card-hover"
              >
                <span className="text-3xl">{f.emoji}</span>
                <h3 className="mt-3 font-display text-base font-semibold text-white">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="text-center font-display text-2xl font-bold text-white md:text-3xl"
          >
            Meet the team
          </motion.h2>
          <p className="mt-3 text-center text-sm text-slate-400">
            The people behind POS Café
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="glass-card flex flex-col items-center p-6 text-center transition-shadow duration-300 hover:shadow-card-hover"
              >
                <span className="text-5xl">{member.avatar}</span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">{member.name}</h3>
                <p className="mt-0.5 text-xs font-medium text-primary">{member.role}</p>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech stack */}
        <section className="mx-auto max-w-4xl px-6 pb-24">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="glass-card p-8 text-center"
          >
            <Coffee className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold text-white">Built with</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {['React 18', 'Vite', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'Razorpay', 'Three.js', 'Lucide Icons'].map((tech) => (
                <span key={tech} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 text-xs text-slate-400">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}
