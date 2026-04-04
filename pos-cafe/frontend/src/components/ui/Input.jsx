import * as React from "react"
import { cn } from "../../utils/helpers"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/[0.08] bg-surface px-4 py-2 text-sm text-slate-100 ring-offset-background transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }
