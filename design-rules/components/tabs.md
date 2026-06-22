# Tabs

Use this rule for tabs, segmented view switches, section switches, status
switches, period switches, mode switches, and any single-select UI that changes
visible content.

## Intent

Tabs switch one visible content region or view state. They are selection controls,
not commands.

Use tabs when the user is choosing between sibling views. Use buttons when the
user is executing commands. Use radio groups or selects when the value is form
data rather than visible view state.

## Anatomy

Use shadcn tab primitives when available:

- `Tabs`
- `TabsList`
- `TabsTrigger`
- `TabsContent`

A tabs pattern should have:

- one selected value
- short trigger labels
- visible selected state
- keyboard navigation preserved
- content panels that match the selected value

## When To Use Tabs

Use tabs for:

- overview/activity/settings sections
- table view switches
- period switches
- status switches
- mode switches
- component preview modes
- single selected content groups

Do not use tabs for unrelated navigation that should be sidebar, breadcrumb, or
top nav. Do not use tabs for commands like save, export, refresh, or delete.

## Content Behavior

Tabs should preserve the underlying state model:

- URL/query state if the product already uses it
- controlled value if the component is controlled
- lazy or eager rendering behavior when it affects data loading
- permissions and hidden tabs
- loading, empty, and error states per panel

Do not disconnect data fetching, table state, chart transforms, or form state
when moving content into tabs.

## Layout

Tabs in a toolbar should align with other controls:

- shared token-backed height
- left aligned with filters/search/view controls
- quieter than primary page actions
- no clipped labels

Tabs for major page sections can sit below the heading or within the main
content region. Keep the selected content directly below or clearly associated
with the `TabsList`.

## Token Binding

Tabs should use Design System Lab tokens:

- list surface: `bg-muted` or a token-backed quiet surface
- trigger text: `text-muted-foreground`
- selected trigger: `bg-background text-foreground`, `bg-card text-card-foreground`,
  or the project's established shadcn selected style
- border when needed: `border-border`
- focus: `ring-ring`
- radius: `rounded-[var(--radius-control)]`
- height: `h-[var(--control-height-sm)]` or `h-[var(--control-height-md)]`

Do not express selected state with `bg-primary` unless the product explicitly
uses primary color for this interaction pattern.

## States

Check:

- selected
- hover
- focus-visible
- disabled
- loading panel
- empty panel
- error panel
- permission-hidden tab

## Do Not

- build tabs as rows of primary/secondary buttons
- make tabs louder than the primary page action
- use tabs for commands
- hide selected content far away from the selected trigger
- create a different tabs style for every page
- use raw palette classes for selected or hover states

## Final Report

State:

- tab-like controls found
- which were kept as Tabs, converted from buttons, or kept as Select/RadioGroup
- state model, data loading, permissions, and selected value preserved
- token-backed selected, hover, focus, disabled, and responsive behavior checked
