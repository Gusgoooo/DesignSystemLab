# Token System Installation

Use this rule whenever Theme Lab tokens are installed, bridged, or audited.

## Goal

Create a complete token baseline before UI normalization so components do not
fall back to old radius, unsafe foreground colors, incomplete focus rings, or
partial surface systems.

## Long-Term Project Contract

For persistent or long-term projects, the token system lands through the three
Theme Lab contract touchpoints. Do not create extra token-system files by
default.

Required persistent touchpoints:

- existing global CSS theme block
- `theme-lab.json`
- tool-native AI instruction file Theme Lab section

Use the target tool's native AI instruction file:

- Claude Code: `CLAUDE.md`
- Codex and generic coding agents: `AGENTS.md`
- Cursor: `.cursor/rules/theme-lab.mdc` when Cursor rules exist; otherwise
  `AGENTS.md` is acceptable for cross-agent compatibility
- GitHub Copilot: `.github/copilot-instructions.md`
- Gemini CLI: `GEMINI.md`
- Windsurf/Cascade: `.windsurfrules`
- Qoder: `AGENTS.md` is compatible; native Qoder rules may override it

`design-rules/` is a rule reference library, not part of the default persistent
theme contract. Read rule files from local `design-rules/` only when the target
project already has it. Otherwise, read the raw GitHub rule URLs from the task
prompt.

Only create or update local `design-rules/` files when the user explicitly asks
to install the rule library into the project.

The persistent contract is incomplete if `theme-lab.json` exists but the global
CSS variables or tool-native AI instruction section are missing.

## One-Shot Token Bridge

For one-shot selected-scope optimization, do not create a full persistent Theme
Lab contract unless requested.

Create or reuse the smallest complete token bridge needed for the selected
scope. The bridge may be local to the existing global CSS/theme layer, but it
must include every token family touched by the UI:

- surfaces
- foreground text
- borders
- focus rings
- radius
- control height
- spacing/density
- elevation
- state colors
- motion timing

Do not add only `--primary` and `--background`. Partial bridges cause invisible
button text, mismatched radius, unsafe focus rings, and inconsistent cards.

## Minimum Required Runtime Tokens

When the target project does not already expose compatible shadcn/theme tokens,
the one-shot bridge must cover at least:

- `--background`
- `--foreground`
- `--card`
- `--card-foreground`
- `--popover`
- `--popover-foreground`
- `--primary`
- `--primary-foreground`
- `--secondary`
- `--secondary-foreground`
- `--muted`
- `--muted-foreground`
- `--accent`
- `--accent-foreground`
- `--destructive`
- `--destructive-foreground`
- `--border`
- `--input`
- `--ring`
- `--radius`
- `--radius-control`
- `--radius-card`
- `--radius-panel`
- `--control-height-sm`
- `--control-height-md`
- `--control-height-lg`
- `--panel-padding`
- `--section-gap`
- `--elevation-card`
- `--elevation-popover`
- `--duration-base`
- `--ease-standard`

If the selected scope shows status (success, warning, info, danger) on badges,
alerts, or indicators, also include each status family as a solid plus soft
background plus paired foreground:

- `--status-success`, `--status-success-bg`, `--status-success-fg`
- `--status-warning`, `--status-warning-bg`, `--status-warning-fg`
- `--status-info`, `--status-info-bg`, `--status-info-fg`
- `--status-danger`, `--status-danger-bg`, `--status-danger-fg`

If the selected scope distinguishes non-status categories, model types, or chart
and legend series, also include the categorical palette:

- `--chart-1`
- `--chart-2`
- `--chart-3`
- `--chart-4`
- `--chart-5`

If the selected scope contains a sidebar, also include:

- `--sidebar`
- `--sidebar-foreground`
- `--sidebar-primary`
- `--sidebar-primary-foreground`
- `--sidebar-accent`
- `--sidebar-accent-foreground`
- `--sidebar-border`
- `--sidebar-ring`

## Existing Token Systems

If the project already has a token system, map Theme Lab semantics into that
system instead of creating a parallel one.

Use this order:

1. existing shadcn CSS variables
2. existing project semantic variables
3. Ant Design `ConfigProvider` theme tokens when Ant Design is present
4. a minimal scoped CSS variable bridge

Do not overwrite existing Ant Design SCSS/Less/global overrides by default.
Preserve them and add a bridge or `ConfigProvider` mapping.

## Token Plan Requirement

Before editing UI, output a token plan:

- existing token system found
- global CSS/theme file to update or reuse
- three persistent touchpoints to land for long-term work
- whether `design-rules/` is local, raw-only, or explicitly requested for local
  installation
- one-shot bridge variables needed for selected-scope work
- component libraries detected, such as shadcn, Ant Design, Material UI, Radix,
  or custom components
- foreground/background pairs that will be checked
- radius, elevation, focus, state, density, and motion tokens that will be used

## Completion Gate

Token setup is incomplete if:

- a filled button, badge, alert, selected tab, active nav item, or chip uses a
  background token without the matching foreground token
- a normalized card/table/sidebar still uses old radius or shadow values
- focus-visible states are missing or use raw colors
- only color tokens were added while radius, elevation, density, and state tokens
  remain undefined
- one-shot work leaves future optimization without a usable token bridge
- long-term work creates extra rule or token files without explicit user request

Report unresolved token gaps before final response.
