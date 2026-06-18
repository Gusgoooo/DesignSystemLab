# Semantic And Categorical Color

Color carries meaning. Use it to communicate status, type, priority, or data
series, not to decorate. When a label has no real meaning to express, it stays
neutral.

This rule covers badges, tags, chips, pills, labels, status indicators, legends,
and chart/data series colors.

## Neutral By Default

Most labels are not status. A tag that only names a thing does not need a hue.

Good defaults:

- `bg-muted text-muted-foreground` for a soft neutral chip
- the `outline` badge variant for a quiet bordered tag
- plain `text-foreground` / `text-muted-foreground` for inline labels

Only apply color when the label carries real `status`, `type`, `priority`,
`category`, or `state` meaning (see UI Normalization). A wall of multicolored
tags with no shared system reads as noise.

## Status Colors

Map real status meaning to the sanctioned `--status-*` families. Each family has
a solid color, a soft `-bg`, and a paired `-fg`, generated for both light and
dark themes.

- success → `bg-success-bg text-success-foreground` (soft) or `bg-success text-success-foreground` (solid)
- warning → `bg-warning-bg text-warning-foreground` or `bg-warning text-warning-foreground`
- info → `bg-info-bg text-info-foreground` or `bg-info text-info-foreground`
- danger → `bg-danger-bg text-danger-foreground` or `bg-danger text-danger-foreground`

Use the soft `-bg` pairing for badges and inline status. Reserve solid fills for
emphasis. Always keep the matching `-foreground`; never put status text on a bare
status fill without it.

## Categorical Colors

Non-status categories — model types, labels, segments, chart series, legend
keys — use the `--chart-1` through `--chart-5` palette.

- Utilities: `bg-chart-1`..`bg-chart-5`, `text-chart-1`..`text-chart-5`, `border-chart-1`..`border-chart-5`
- Arbitrary form when needed: `text-[var(--chart-2)]`, `bg-[var(--chart-3)]`

### Stable Mapping

Assign a fixed `category → index` mapping and reuse it everywhere. The same
category must always get the same chart color across tables, charts, and legends.

- Decide the mapping once, near the data, and keep it.
- Cap meaningful hues at about five. Beyond that, group the long tail or fall
  back to neutral plus a single accent.
- Do not pick a color per render or per row. Random per-tag color is the rainbow
  failure this rule exists to prevent.

## Selected And Active States Are Not Categories

A selected row, active tab, or active nav item expresses interaction state, not
category. Use interaction-state tokens, not a chart color. See UI States.

Active filter chips stay neutral and removable; do not color them by value. See
Filters And Controls.

## Never

- raw Tailwind palette classes such as `text-pink-600` or `bg-emerald-100`
- hardcoded hex or arbitrary OKLCH for category or status color
- a different color for every tag with no stable mapping
- status fills without the matching `-foreground`
- more than ~5 competing categorical hues in one view

## Recommended Implementation

Prefer reusable variants over ad-hoc classes. The project `Badge` component
exposes `success`, `warning`, `info`, and `danger` variants bound to the
`--status-*` tokens — use them for status badges instead of hand-writing the
pairing each time.
