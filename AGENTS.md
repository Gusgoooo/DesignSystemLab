# Agent Guidance

This file applies to the whole repository. Update it when the project scaffold,
package scripts, aliases, or theme architecture changes.

## Repository inspection

Current repository state:

- Package manager: none detected. There is no `package.json`, lockfile, or
  workspace config yet.
- Scripts: none detected because `package.json` is not present.
- App structure: none detected yet. The intended Next.js route is
  `app/theme-lab` or an equivalent route.
- Components structure: none detected yet. Intended locations are
  `components/theme-lab` for product UI and `components/ui` for shadcn/ui base
  components.
- Styles structure: none detected yet. Intended Tailwind and shadcn integration
  should live in `app/globals.css` or a `styles` entry imported by the app.
- shadcn components location: none detected yet. Use `components/ui` once
  shadcn/ui is initialized.
- Aliases: none detected yet. Prefer a conventional `@/*` alias once
  `tsconfig.json` and `components.json` exist.
- Tailwind setup: none detected yet. This project should target Tailwind v4.
- `components.json`: not present yet.

## Project-specific commands

No project commands are available yet because `package.json` does not exist.
When scripts are added, keep this section current and prefer the package
manager indicated by the lockfile.

Expected commands to document here once available:

- Install dependencies
- Run the dev server
- Run typecheck
- Run lint
- Run tests, if present
- Build the app

## Project purpose

This project contains an AI-era design system generator for shadcn/ui. It
provides seed token controls, algorithmic token generation, semantic token
mapping, shadcn adapter output, preview pages, and exportable theme artifacts.

## Core architecture

- `src/theme` or `lib/theme`: theme seed schema, token algorithms, CSS export,
  vibe descriptor generation.
- `app/theme-lab` or equivalent route: UI for seed controls and preview.
- `components/theme-lab`: theme lab UI, preview frame, control panel, preview
  tabs.
- `components/ui`: shadcn/ui base components.
- `styles` or `app/globals.css`: Tailwind and shadcn theme integration.

Prefer the repository's existing structure once it exists. If both `src/*` and
root-level folders exist, follow the established local pattern instead of
creating parallel trees.

## Theme rules

Use shadcn semantic classes first:

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `bg-primary`
- `text-primary-foreground`
- `text-muted-foreground`
- `border-border`
- `ring-ring`

Use project semantic utilities only when needed:

- `bg-surface-canvas`
- `bg-surface-panel`
- `bg-surface-raised`
- `bg-surface-overlay`
- `text-content-primary`
- `text-content-secondary`
- `text-content-tertiary`
- `bg-success-bg`
- `text-success-foreground`
- `bg-warning-bg`
- `text-warning-foreground`
- `bg-info-bg`
- `text-info-foreground`
- `bg-danger-bg`
- `text-danger-foreground`

Do not use raw Tailwind palette colors for themeable UI:

- Avoid `bg-blue-600`
- Avoid `text-zinc-500`
- Avoid `border-gray-200`
- Avoid hex colors in components
- Avoid arbitrary OKLCH values in components

Do not create new theme variables inside components. Add a new token only when
a visual concept repeats across multiple components and cannot be represented by
existing semantic tokens.

Preview components should consume semantic classes, not raw palette values. Raw
palette or map-token classes are acceptable only in pages or components that are
explicitly displaying token swatches.

## Token architecture

Use this chain:

Seed Token
-> Algorithmic Map Token
-> Semantic Token
-> shadcn Adapter Token
-> Preview Component

Algorithm generates gradients and scales. Semantic mapping makes product
decisions. shadcn adapter guarantees compatibility.

## Preview architecture

Theme lab has three tabs:

1. Components:
   - buttons
   - inputs
   - cards
   - badges
   - alerts
   - tabs
   - table
   - dialogs/popovers as static mocks if portal scoping becomes an issue
   - states: default, hover, focus, disabled, loading, destructive, selected

2. Blocks:
   - dashboard
   - settings
   - auth
   - data table
   - AI chat / command
   - pricing / marketing

3. Aesthetic:
   - mood cards
   - material samples
   - typography samples
   - composition samples
   - generated vibe descriptor
   - AI prompt / rules output

## Implementation constraints

- Prefer local TypeScript utilities over new dependencies.
- Ask before adding production dependencies.
- Keep algorithms deterministic and testable.
- Keep preview components readable.
- Avoid overengineering.
- Do not implement backend persistence unless requested.
- Prefer local state for MVP.
- Use `localStorage` only if simple persistence is useful.

## Done criteria

Before completing a task:

- Run typecheck if available.
- Run lint if available.
- Confirm the app builds or at least the edited route compiles.
- Summarize changed files.
- Summarize known limitations.
- Call out anything not implemented.
