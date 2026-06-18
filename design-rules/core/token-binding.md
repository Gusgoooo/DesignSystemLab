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

## Strong Token QA Gate

Run a token audit on every changed route, layout, and product component before
final report. Focus on product UI files such as `app/**`, `components/**`, and
feature folders. Do not treat untouched upstream shadcn base files as failures
unless this task changed them.

Flag these patterns:

```txt
rg -n "(bg|text|border|ring|from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}" app components
rg -n "#[0-9a-fA-F]{3,8}|oklch\\(|rgba?\\(|hsla?\\(" app components
rg -n "rounded-(none|sm|md|lg|xl|2xl|3xl|full)|shadow-(sm|md|lg|xl|2xl|inner|none)" app components
rg -n -P "bg-primary[^\\n]*text-primary(?!-foreground)|bg-secondary[^\\n]*text-secondary(?!-foreground)|bg-accent[^\\n]*text-accent(?!-foreground)|bg-destructive[^\\n]*text-destructive(?!-foreground)" app components
```

For each hit:

- replace with a semantic token class
- replace with a Theme Lab variable-backed utility
- or explicitly justify why it is non-structural decorative code allowed by a matched rule

Do not ignore hits silently.

## Filled Surface Pairing Rules

Filled surfaces must use matching foreground tokens in the same component or in
an immediately obvious parent/child pairing.

Required pairs:

- primary button: `bg-primary text-primary-foreground`
- secondary fill: `bg-secondary text-secondary-foreground`
- accent fill: `bg-accent text-accent-foreground`
- destructive fill: `bg-destructive text-destructive-foreground`
- card shell: `bg-card text-card-foreground`
- popover/menu shell: `bg-popover text-popover-foreground`
- sidebar shell: `bg-sidebar text-sidebar-foreground`
- sidebar primary item: `bg-sidebar-primary text-sidebar-primary-foreground`
- sidebar accent item: `bg-sidebar-accent text-sidebar-accent-foreground`

Never rely on inherited foreground color for filled buttons, selected nav items,
badges, alerts, callouts, or table row states unless the parent explicitly sets
the matching foreground token.

## Radius And Elevation Rules

Do not keep legacy radius or shadow values after normalizing a component.

Use:

- controls: `rounded-[var(--radius-control)]`
- cards and compact preview surfaces: `rounded-[var(--radius-card)]`
- panels, sheets, and large containers: `rounded-[var(--radius-panel)]`
- cards: `[box-shadow:var(--elevation-card)]` when elevation is needed
- popovers, menus, and floating surfaces: `[box-shadow:var(--elevation-popover)]`

If a shadcn primitive's base component uses its own radius internally, prefer the
project's established component API or variants. Do not fork every base
component only for radius unless the mismatch is visible in the product UI.

## Completion Failure Conditions

Token binding is incomplete if:

- a filled action has invisible or low-contrast text
- a filled semantic background uses a same-role text class
- old raw palette classes remain in changed structural UI
- old radius or shadow values remain in normalized product components
- focus-visible rings are missing or use raw colors
- cards, tables, sidebar, header, and popovers use unrelated surface systems
- decorative exceptions leak into text, borders, focus rings, or actions
- the final report does not list token pairs checked and unresolved token audit hits

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
