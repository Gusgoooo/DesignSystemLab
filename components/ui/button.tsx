import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-[var(--control-gap)] rounded-[var(--radius-control)] text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,opacity,transform] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-standard)] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border border-border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-[var(--control-height-md)] px-[var(--control-padding-x)] py-0 has-[>svg]:px-[calc(var(--control-padding-x)*0.85)]",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-[var(--control-height-sm)] gap-[calc(var(--control-gap)*0.75)] rounded-md px-[calc(var(--control-padding-x)*0.78)] has-[>svg]:px-[calc(var(--control-padding-x)*0.68)]",
        lg: "h-[var(--control-height-lg)] rounded-md px-[calc(var(--control-padding-x)*1.35)] has-[>svg]:px-[calc(var(--control-padding-x)*1.1)]",
        icon: "h-[var(--control-height-md)] w-[var(--control-height-md)]",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "h-[var(--control-height-sm)] w-[var(--control-height-sm)]",
        "icon-lg": "h-[var(--control-height-lg)] w-[var(--control-height-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
