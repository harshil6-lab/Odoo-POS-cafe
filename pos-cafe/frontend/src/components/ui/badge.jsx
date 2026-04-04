import { cva } from 'class-variance-authority';
import { cn } from '../../utils/helpers';

const badgeVariants = cva('badge', {
  variants: {
    variant: {
      default: 'border-white/10 bg-white/5 text-slate-300',
      success: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300',
      warning: 'border-brand-400/20 bg-brand-500/10 text-brand-300',
      info: 'border-sky-400/20 bg-sky-500/10 text-sky-300',
      accent: 'border-teal-400/20 bg-teal-500/10 text-teal-300',
      danger: 'border-rose-400/20 bg-rose-500/10 text-rose-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };