import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white placeholder:text-slate-500 transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
