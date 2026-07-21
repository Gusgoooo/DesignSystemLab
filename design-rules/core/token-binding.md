# Design System Lab Token Binding

Use this rule for new UI creation or an Existing UI Mapping task that the user
has explicitly approved. Do not use it to mutate existing UI during Token
installation.

Design System Lab tokens are mandatory for structural UI created after
installation.

## Semantic Mapping Method

Token mapping is a model-reasoned design decision, not literal value
replacement. Before choosing a Token or component variant, classify each
element by:

1. product responsibility
2. information hierarchy
3. surface layer
4. interaction type: command, navigation, selection, input, feedback, or data
5. state: default, hover, focus, active, selected, disabled, loading, success,
   warning, information, or destructive
6. component-system expression

The same legacy blue value may represent a primary command, selected
navigation, information feedback, chart category, or decoration. Those roles
must not map to the same Token merely because their old literal values match.

Mapping may correct an inappropriate semantic choice, such as a selected tab
styled as a primary command or neutral metadata styled as status. Preserve
business behavior and component APIs unless the user separately asks for a
structural change.

The official shadcn token vocabulary is the first-choice compatibility layer.
Project additions are allowed only in the explicit Design System Lab extension
layer. `text-destructive-foreground` is one such compatibility extension:
official shadcn supplies `destructive`, while this project adds a generated,
contrast-checked foreground so filled destructive variants remain deterministic.

For Ant Design, use the generated global Seed and Alias Tokens first. Choose
official component variants and `theme.components` overrides only when a
repeated component-specific responsibility cannot be expressed by the global
layer. Do not create a parallel CSS palette beside ThemeConfig.

## shadcn Required Semantic Pairs

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
- `bg-success-bg text-success-foreground`
- `bg-warning-bg text-warning-foreground`
- `bg-info-bg text-info-foreground`
- `bg-danger-bg text-danger-foreground`

Never use same-role filled pairs:

- `bg-primary text-primary`
- `bg-secondary text-secondary`
- `bg-accent text-accent`
- `bg-destructive text-destructive`
- `bg-card text-card`
- `bg-popover text-popover`

## Status And Categorical Color

`--status-*` and `--chart-1..5` are sanctioned semantic color families, not
unapproved scales. Use them for status and category meaning instead of raw
palette colors.

- status (success/warning/info/danger): the soft `bg-*-bg text-*-foreground`
  pairs above
- non-status categories, model types, chart and legend series: `bg-chart-1..5`,
  `text-chart-1..5`, `border-chart-1..5`, with a stable category-to-index mapping

See Semantic And Categorical Color for when to apply color versus staying
neutral.

## Token-Bound Values

Use token-backed values for:

- surfaces
- foreground text
- borders
- focus rings
- radius
- spacing and density
- the generated `--font-size-xs` through `--font-size-6xl` typography scale
- compact control typography
- elevation
- states
- motion timing

Examples:

- `text-xs` through `text-6xl` after Tailwind maps them to the generated font-size scale
- `text-[length:var(--text-caption)]` for default button labels
- `[box-shadow:var(--elevation-control)]`
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
- unapproved color scales beyond the sanctioned `--status-*` and `--chart-1..5` families

Intrinsic primitive geometry is exempt from the global radius scale. A
checkbox may keep a stable 4-6px corner, a radio and avatar remain circular,
and switch/progress tracks remain pill-shaped. Do not map those shapes to
`--radius-control` when doing so can change their semantic geometry.

`typography.baseSize` and `typography.scaleRatio` are Seeds. They must regenerate
the full Tailwind-compatible font-size scale. Do not maintain a parallel set of
fixed `text-xs`, `text-sm`, or heading sizes outside that generated scale.
Generated typography may be serialized as `rem`, but every runtime size must
resolve to an integer pixel value.

## Strong Token QA Gate

Run a token audit on every changed route, layout, and product component before
final report. Focus on product UI files such as `app/**`, `components/**`, and
feature folders. Do not treat untouched upstream shadcn base files as failures
unless this task changed them.

Flag these patterns:

```txt
rg -n "(bg|text|border|ring|from|via|to)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}" app components
rg -n "#[0-9a-fA-F]{3,8}|oklch\\(|rgba?\\(|hsla?\\(" app components
rg -n "rounded-(sm|md|lg|xl|2xl|3xl)|shadow-(sm|md|lg|xl|2xl|inner|none)" app components
rg -n -P "bg-primary[^\\n]*text-primary(?!-foreground)|bg-secondary[^\\n]*text-secondary(?!-foreground)|bg-accent[^\\n]*text-accent(?!-foreground)|bg-destructive[^\\n]*text-destructive(?!-foreground)" app components
```

For each hit:

- replace with a semantic token class
- replace with a Design System Lab variable-backed utility
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

`--sidebar-accent` reuses the existing `--action-secondary-hover` state token.
That shared state surface must remain visibly distinct from `--sidebar` in both
light and dark themes.

## Radius And Elevation Rules

Do not keep legacy radius or shadow values after normalizing a component.

Use:

- controls: `rounded-[var(--radius-control)]`
- cards and compact preview surfaces: `rounded-[var(--radius-card)]`
- panels, sheets, and large containers: `rounded-[var(--radius-panel)]`
- cards: `[box-shadow:var(--elevation-card)]` when elevation is needed
- popovers, menus, and floating surfaces: `[box-shadow:var(--elevation-popover)]`

Keep intrinsic primitive geometry stable instead of theme-driven:

- checkbox: a restrained fixed corner, normally 4-6px
- radio and avatar: circular
- switch, progress, and compact status tracks: pill-shaped

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
