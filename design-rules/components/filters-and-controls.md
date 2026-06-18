# Filters And Controls

Use this rule for search, filters, sort controls, view controls, segmented controls, date ranges, and table toolbars.

## Goal

Controls should help the user narrow or reshape data without becoming a second dashboard.

## Structure

Prefer predictable grouping:

- search first
- filters next
- sort and view controls after filters
- bulk actions near selection state
- primary creation action outside the filter group when possible

## Component Rule

Use existing project or shadcn components:

- `Input`
- `Select`
- `Checkbox`
- `Switch`
- `Tabs`
- `DropdownMenu`
- `Popover`
- `Button`
- `Badge`

## Density

Controls should be compact but comfortable.

Use token-backed control heights and spacing:

- `h-[var(--control-height-sm)]`
- `h-[var(--control-height-md)]`
- `gap-[var(--section-gap)]`

## State Rule

Show active filters clearly.

Use removable chips or compact badges when filter state persists.

Empty, loading, disabled, and error states must remain readable and token-correct.

## Do Not

- scatter filters across unrelated page regions
- use raw color chips for active filters
- create many equal-weight buttons
- hide active filter state
- make filter bars taller than the content they control
