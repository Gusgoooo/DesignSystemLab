import * as React from "react"
import { cn } from "../../lib/utils"

export type KbdProps = React.HTMLAttributes<HTMLElement>

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-6 items-center justify-center rounded-[var(--radius-control)] bg-muted px-1.5 py-1 font-mono text-xs text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
