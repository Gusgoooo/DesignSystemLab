# Actions And Buttons

Use this rule for buttons, action groups, toolbars, primary actions, secondary actions, destructive actions, and icon buttons.

## Action Hierarchy

Each scope should have a clear action hierarchy:

- one primary action when possible
- secondary actions quieter
- destructive actions clearly separated
- repeated row actions grouped consistently

Primary actions should be easy to find but not visually noisy.

## Token Pairs

Filled buttons and filled action states must use matching foreground tokens:

- `bg-primary text-primary-foreground`
- `bg-secondary text-secondary-foreground`
- `bg-accent text-accent-foreground`
- `bg-destructive text-destructive-foreground`

Never use `bg-primary text-primary`.

## Component Rule

Use existing project or shadcn components before custom markup:

- `Button`
- `DropdownMenu`
- `Tooltip`
- `Sheet`
- `Dialog`

Icon-only buttons need `aria-label`.

Decorative icons need `aria-hidden="true"`.

## Responsive Rule

On small screens:

- keep the primary action visible
- collapse secondary actions into a More menu when needed
- avoid clipped action text
- avoid title/action collision

## Do Not

- use raw palette button colors
- invent one-off hover colors
- leave low-contrast button text
- make destructive actions look like ordinary primary actions
