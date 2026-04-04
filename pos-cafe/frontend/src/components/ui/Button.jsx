import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../utils/helpers"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const variants = {
    default: "bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-white",
    secondary: "bg-teal-400 text-slate-950 hover:bg-teal-300 shadow-md",
    ghost: "hover:bg-slate-800 hover:text-white text-slate-300",
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
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
