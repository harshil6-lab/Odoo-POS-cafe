import { cva } from 'class-variance-authority';
import { cn } from '../../utils/helpers';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        default: 'bg-brand-500 text-slate-950 hover:bg-brand-400',
        secondary: 'border border-white/10 bg-slate-900 text-white hover:border-brand-500/60 hover:bg-slate-800',
        ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
        accent: 'bg-teal-400 text-slate-950 hover:bg-teal-300',
        outline: 'border border-white/15 bg-transparent text-white hover:border-brand-400 hover:bg-white/5',
      },
      size: {
        default: 'px-5 py-3',
        sm: 'px-3 py-2 text-xs',
        lg: 'px-6 py-3.5',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? 'span' : 'button';
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };