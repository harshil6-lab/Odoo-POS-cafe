import * as React from "react"
import { cn } from "../../utils/helpers"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-amber-500 text-slate-950 hover:bg-amber-500/80",
    secondary: "border-transparent bg-teal-400 text-slate-950 hover:bg-teal-400/80",
    destructive: "border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80",
    outline: "text-slate-200 border-slate-700",
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
