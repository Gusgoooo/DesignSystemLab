# Theme Lab Token Binding

Theme Lab tokens are mandatory for structural UI.

## Required Semantic Pairs

Use matching background and foreground pairs:

- `bg-background text-foreground`
- `bg-card text-card-foreground`
- `bg-popover text-popover-foreground`
- `bg-primary text-primary-foreground`
- `bg-secondary text-secondary-foreground`
- `bg-muted text-muted-foreground`
- `bg-accent text-accent-foreground`
- `bg-destructive text-destructive-foreground`
- `bg-sidebar text-sidebar-foreground`
- `bg-sidebar-primary text-sidebar-primary-foreground`
- `bg-sidebar-accent text-sidebar-accent-foreground`

Never use same-role filled pairs:

- `bg-primary text-primary`
- `bg-secondary text-secondary`
- `bg-accent text-accent`
- `bg-destructive text-destructive`
- `bg-card text-card`
- `bg-popover text-popover`

## Token-Bound Values

Use token-backed values for:

- surfaces
- foreground text
- borders
- focus rings
- radius
- spacing and density
- elevation
- states
- motion timing

Examples:

- `rounded-[var(--radius-card)]`
- `rounded-[var(--radius-control)]`
- `rounded-[var(--radius-panel)]`
- `[box-shadow:var(--elevation-card)]`
- `[box-shadow:var(--elevation-popover)]`
- `duration-[var(--duration-base)]`
- `ease-[var(--ease-standard)]`

## Forbidden For Structural UI

- raw Tailwind palette classes
- hardcoded hex colors
- arbitrary OKLCH values
- one-off shadows
- one-off border colors
- legacy non-token radius values
- random gradients
- unapproved color scales

## Decorative Exception

Decorative ambient layers explicitly allowed by matched rules may use non-token colors, opacity, blur, or gradient stops only when they are non-structural.

This exception never applies to:

- text
- primary surfaces
- card shells
- borders
- focus rings
- actions
- badges
- alerts
- form fields
- state indicators
