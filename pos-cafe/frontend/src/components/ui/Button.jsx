import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/helpers"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const variants = {
    default: "bg-primary text-white hover:bg-[#d93f4f] shadow-glow-red",
    amber: "bg-accent text-black hover:brightness-110 shadow-glow-amber",
    destructive: "border border-red-500/30 bg-red-500/90 text-white shadow-[0_12px_30px_rgba(239,68,68,0.18)] hover:bg-red-500",
    outline: "border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06] hover:border-white/[0.12]",
    secondary: "border border-teal-400/30 bg-teal-400/90 text-slate-950 shadow-[0_12px_30px_rgba(45,212,191,0.16)] hover:bg-teal-300",
    ghost: "text-slate-300 hover:bg-white/[0.04] hover:text-white",
    link: "text-primary underline-offset-4 hover:underline",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-glow-green",
  }
  
  const sizes = {
    default: "h-10 px-5 py-2",
    sm: "h-9 rounded-xl px-3.5 text-xs",
    lg: "h-12 rounded-xl px-8 text-base",
    icon: "h-10 w-10",
  }
  
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40",
        variantClass,
        sizeClass,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
