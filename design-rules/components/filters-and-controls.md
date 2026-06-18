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

## Single-Select Rule

For single-select UI that switches a view, filter, mode, status, period, or
section, use the shadcn `Tabs` component.

Use:

- `Tabs`
- `TabsList`
- `TabsTrigger`
- `TabsContent` when the selected value changes visible content

Do not build single-select UI as a row of `Button` components where the selected
item is a primary button and the other items are secondary or outline buttons.
That pattern confuses action hierarchy with selection state.

Tabs should:

- have one selected value
- use real product labels
- keep trigger text short
- preserve keyboard navigation and focus states
- use token-backed selected, hover, focus, disabled, and content states
- stay visually quieter than primary page actions

If the choice is a true form field that will be submitted as data and does not
switch visible content, `RadioGroup` is allowed. Even then, do not fake the
single-select state with a row of primary/secondary buttons.

## Horizontal Control Row Rule

When multiple horizontal controls appear in the same row, such as `Tabs`,
buttons, `Select`, search input, date range, or view controls, make the row feel
like one coordinated toolbar.

Use two alignment zones:

- left side: search, filters, tabs, view switches, status switches, sort, date range
- right side: primary and secondary operation buttons such as create, export,
  refresh, save, apply, delete, or bulk actions

The right action group should align to the far right on desktop. The left
control group should stay left-aligned.

All visible controls in the same row should share the same height:

- `TabsList`
- `TabsTrigger`
- `Input`
- `SelectTrigger`
- `Button`
- `DropdownMenuTrigger`
- date range trigger

Use one token-backed control height for the row, usually:

- `h-[var(--control-height-sm)]` for dense table/tool rows
- `h-[var(--control-height-md)]` for page-level control rows

Do not mix visibly different control heights in one row unless there is a clear
hierarchy difference between a page-level action area and a lower-density
content region.

Recommended structure:

```tsx
<div className="flex flex-wrap items-center justify-between gap-3">
  <div className="flex min-w-0 flex-wrap items-center gap-2">
    {/* search, filters, tabs, select */}
  </div>
  <div className="ml-auto flex items-center gap-2">
    {/* operation buttons */}
  </div>
</div>
```

On narrow screens, controls may wrap. Preserve reading order: filters and tabs
first, operation buttons after them. Do not let right-aligned actions collide
with tabs or squeeze labels until they become unreadable.

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
- use a row of primary/secondary buttons for single-select state
- mix different heights for tabs, buttons, select triggers, and inputs in the same control row
- leave operation buttons floating in the middle when filters and tabs are left-aligned
- hide active filter state
- make filter bars taller than the content they control
