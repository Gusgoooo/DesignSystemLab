# Metrics And Charts

Use this rule for KPI cards, metric strips, stat rows, progress indicators,
charts, legends, data series, sparklines, trend indicators, and dashboard
summary modules.

## Intent

Metrics and charts should answer a product question, not merely fill space. They
must preserve the underlying calculation, filters, date range, units, and data
transforms.

Use metric UI to make comparison, status, or change clear. Use charts when shape
or distribution matters more than a single value.

## Anatomy

A metric should have:

- label
- value
- unit
- time range or scope when needed
- comparison or trend when available
- status or interpretation only when meaningful

A chart should have:

- clear title
- concise subtitle only when it clarifies scope, time range, or calculation
- readable axes or labels
- visible legend when multiple series exist
- stable series color mapping
- empty/loading/error states

## Data Preservation

Preserve:

- API calls and loaders
- filters and query params
- date range behavior
- aggregation windows
- chart transforms
- sorting and grouping
- units, denominators, and rounding behavior
- permissions and hidden data states

Do not replace real data with sample values from component examples.

## Layout

Metrics should support scanning:

- group related metrics together
- avoid equal emphasis for every number
- put the most important operational signal first
- align values and units consistently
- keep trend indicators close to the value they explain

Charts should have enough space to be readable. Do not squeeze a dense chart
into a tiny decorative card. If the chart is not useful at small size, use a
summary metric plus a detail view or larger chart region.

## Color Mapping

Status color communicates status. Chart color communicates series identity.

Use:

- status tokens for success, warning, info, and danger meaning
- `bg-chart-1`..`bg-chart-5`, `text-chart-1`..`text-chart-5`, or
  `border-chart-1`..`border-chart-5` for stable series/category mapping

Assign a stable category-to-index mapping and reuse it across charts, legends,
tables, and badges.

Do not generate random series colors.

## Token Binding

Use Design System Lab tokens:

- metric card shell: `bg-card text-card-foreground`
- page/chart surface: `bg-background` or `bg-card`
- captions and axis-like text: `text-muted-foreground`
- borders and grid-like separators: `border-border`
- focus: `ring-ring`
- radius: `rounded-[var(--radius-card)]`
- elevation when needed: `[box-shadow:var(--elevation-card)]`
- chart series: chart token palette
- status: status token families

Hardcoded chart colors are allowed only inside a chart adapter if they are
directly bound to Design System Lab CSS variables.

## States

Check:

- loading
- empty
- error
- permission-hidden
- filtered zero-result
- stale data
- hover tooltip
- selected series or highlighted point
- responsive layout

Empty metric/chart states should explain what data is missing and preserve the
module's layout.

## Do Not

- copy sample chart data
- change calculations while polishing UI
- hide units, denominators, or time ranges
- use a different color for the same category across components
- overload one chart with unrelated series
- use chart color for selected row, active tab, or ordinary interaction state
- make all KPI cards equal weight when one signal matters more

## Final Report

State:

- metric and chart modules found
- calculations, filters, date ranges, transforms, and units preserved
- status colors separated from chart series colors
- stable category-to-index mapping checked
- loading, empty, error, tooltip, and responsive states verified
