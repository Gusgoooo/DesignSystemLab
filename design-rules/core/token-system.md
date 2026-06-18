# Token System Installation

Use this rule whenever Theme Lab tokens are installed, bridged, or audited.

## Goal

Create a complete token baseline before UI normalization so components do not
fall back to old radius, unsafe foreground colors, incomplete focus rings, or
partial surface systems.

## Long-Term Project Contract

For persistent or long-term projects, the token system must be fully landed in
the target project.

Required persistent files:

- existing global CSS theme block
- `theme-lab.json`
- `AGENTS.md` Theme Lab section
- `design-rules/index.json`
- matched `design-rules/**/*.md` files, or the complete exported `design-rules/`
  package when the user provides it

Do not treat raw GitHub links as the long-term project contract. Raw links are
for reading and bootstrapping. A long-term project must have the rule files
available locally so future agents can read them without relying on prompt
memory.

The persistent contract is incomplete if `theme-lab.json` exists but the global
CSS variables, AGENTS section, or design-rule router are missing.

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
- persistent files to land for long-term work
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
- long-term work relies only on raw links instead of landing the local contract
  files

Report unresolved token gaps before final response.
