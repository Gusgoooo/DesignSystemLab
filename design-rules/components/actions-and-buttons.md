# Actions And Buttons

Use this rule for buttons, action groups, toolbars, primary actions, secondary
actions, destructive actions, icon buttons, split buttons, and repeated row
actions.

## Intent

Buttons execute commands. They do not represent passive labels, status chips, or
single-select state.

Each scope should make the next most important command obvious without making
every command visually loud.

## Action Hierarchy

Use a clear action hierarchy:

- one primary action when possible
- secondary actions quieter
- tertiary actions in ghost buttons, icon buttons, menus, or inline links
- destructive actions clearly separated and confirmed when risk is high
- repeated row actions grouped consistently

Primary actions should be easy to find but not visually noisy. If every action
looks primary, none of them are primary.

## Buttons Are Actions, Not Single-Select Controls

Do not use a row of `Button` components to represent a single selected option.

Invalid pattern:

- selected option = primary button
- unselected options = secondary, outline, or ghost buttons

Use shadcn `Tabs` for single-select view, filter, mode, status, period, or
section switching. Keep `Button` components for commands that perform actions,
such as create, save, export, delete, refresh, open, submit, apply, invite,
archive, or cancel.

If the choice is submitted as form data and does not switch visible content, use
`RadioGroup` or `Select` instead of fake button selection.

## Component Rule

Use existing project or shadcn components before custom markup:

- `Button`
- `DropdownMenu`
- `Tooltip`
- `Sheet`
- `Dialog`
- `AlertDialog`

Icon-only buttons need `aria-label`. Decorative icons need
`aria-hidden="true"`.

## Token Binding

Filled buttons and filled action states must use matching foreground tokens:

- `bg-primary text-primary-foreground`
- `bg-secondary text-secondary-foreground`
- `bg-accent text-accent-foreground`
- `bg-destructive text-destructive-foreground`

Use token-backed radius, height, focus, and motion:

- `rounded-[var(--radius-control)]`
- `h-[var(--control-height-sm)]`
- `h-[var(--control-height-md)]`
- `ring-ring`
- `duration-[var(--duration-base)] ease-[var(--ease-standard)]`

Never use `bg-primary text-primary`.

## Layout

In toolbars, align action groups with the control rules:

- filters, search, tabs, date ranges, and view controls on the left
- create, export, refresh, save, apply, delete, and bulk actions on the right
- bulk actions appear near selection state and only when relevant

Repeated row actions should be compact and predictable. Prefer a visible primary
row action plus a menu for secondary row actions when space is tight.

## Responsive Behavior

On small screens:

- keep the primary action visible
- collapse secondary actions into a More menu when needed
- avoid clipped action text
- avoid title/action collision
- keep touch targets usable

## States

Check default, hover, active, focus-visible, disabled, loading, destructive,
pressed, and menu-open states. Loading buttons should preserve their width when
possible and should not hide the command's meaning.

## Do Not

- use raw palette button colors
- invent one-off hover colors
- leave low-contrast button text
- make destructive actions look like ordinary primary actions
- use icon-only buttons without accessible names
- turn filters, tabs, or view switches into primary/secondary button rows

## Final Report

State:

- primary, secondary, destructive, and row action hierarchy used
- any single-select button rows converted to Tabs, Select, or RadioGroup
- icon-only button labels checked
- token pairs, focus, hover, disabled, loading, and responsive behavior verified
