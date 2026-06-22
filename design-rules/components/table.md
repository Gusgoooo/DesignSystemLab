# Tables

Use this rule for tables, data tables, list tables, resource indexes, dense
lists, row grids, and table-like investigation surfaces.

## Intent

Tables are card-like previews without card background rendering. A table row
should expose enough identity, status, key facts, latest signal, and action
context for the user to decide whether to open, select, filter, or act on it.

## Anatomy

Use progressive exploration:

1. identity
2. status or category
3. most decision-relevant facts
4. latest signal or next action
5. row actions

The first column should usually identify the object with a strong label and
secondary metadata. Put row actions at the end unless the product already has a
stronger local pattern.

## Scannability

Do not dump every available field into columns.

Move deeper information into:

- row expansion
- sheet
- detail page
- popover
- tooltip

Use:

- concise cell layouts
- secondary metadata lines
- badges only when they carry status, category, or priority meaning
- compact value stacks
- truncation with accessible full-content access

Avoid paragraph-heavy cells.

## Numeric Tables

Use:

- consistent alignment
- units
- tabular numbers when available
- grouped metrics when several values belong together
- clear delta or trend treatment when change matters

Numeric alignment should help comparison. Do not mix centered, right-aligned,
and left-aligned numeric values without a reason.

## Toolbar And Controls

If the table has search, filters, tabs, date ranges, bulk actions, export,
refresh, column visibility, or sort controls, also apply
`design-rules/components/filters-and-controls.md`.

Bulk actions should appear only when rows are selected. Persistent table filters
should be visible as chips or readable control state.

## Token Binding

Structural table UI must use Design System Lab tokens:

- page/card surface around the table: `bg-background` or `bg-card`
- table text: `text-foreground`
- captions and metadata: `text-muted-foreground`
- borders and separators: `border-border`
- row hover/selected: `bg-muted`, `bg-accent text-accent-foreground`, or a
  project table state token if one exists
- focus: `ring-ring`

Do not turn tables into decorative card backgrounds. Hierarchy should come from
typography, alignment, spacing, dividers, badges, and row states.

## States

Preserve and check:

- row hover
- selected rows
- keyboard focus
- disabled rows or actions
- loading skeleton rows
- empty state
- error state
- permission-hidden actions
- pagination or infinite-loading state when present

Loading and empty states should preserve table width and column rhythm where
possible.

## Responsive Behavior

On narrow screens, do not let tables create uncontrolled horizontal overflow.
Use the existing product pattern when present:

- horizontal scroll for genuinely wide data
- column priority hiding
- row cards only when the mobile experience is intentionally card-like
- detail sheet for deeper row data

Do not silently drop key identity, status, or action context on mobile.

## Do Not

- include every backend field as a visible column
- use raw palette colors for rows, badges, or cell emphasis
- create rainbow status/category badges without stable meaning
- make row actions visually louder than primary page actions
- remove sorting, filtering, pagination, row selection, or row actions during UI
  normalization

## Final Report

State:

- table/list types found
- column order and any fields moved into detail/expansion
- controls and bulk actions preserved
- row states checked
- token pairs, borders, focus, and responsive behavior verified
