import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/helpers"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const variants = {
    default: "bg-[#F59E0B] text-black hover:brightness-110",
    destructive: "border border-red-500/30 bg-red-500/90 text-white shadow-[0_12px_30px_rgba(239,68,68,0.18)] hover:bg-red-500",
    outline: "border border-slate-600 bg-transparent text-white hover:bg-slate-800",
    secondary: "border border-teal-400/30 bg-teal-400/90 text-slate-950 shadow-[0_12px_30px_rgba(45,212,191,0.16)] hover:bg-teal-300",
    ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
    link: "text-amber-500 underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }
  
  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.default;

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
