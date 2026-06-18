# Agent Guidance

This file applies to the whole repository. Update it when the project scaffold,
package scripts, aliases, or theme architecture changes.

## Repository inspection

Current repository state:

- Package manager: npm. Use `package-lock.json` as the source of truth.
- Framework: Next.js App Router with static export enabled.
- App routes: `app/page.tsx`, `app/theme-lab/page.tsx`, and
  `app/dashboard/page.tsx`.
- Components: product UI lives in `components/theme-lab`; shadcn/ui base
  components live in `components/ui`.
- Styles: Tailwind v4 and theme variables live in `app/globals.css`.
- Distributed design rules: detailed AI UI rules live in `design-rules/`.
  Start from `design-rules/index.json` and load only matched markdown rules.
- Aliases: `@/*` is configured in `tsconfig.json` and `components.json`.
- Static output: `next.config.ts` uses `output: "export"` and writes the
  publishable static artifact to `out/`.

## Project-specific commands

- Install dependencies: `npm install`
- Run the dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Build the app: `npm run build`
- Build static artifact: `npm run build:static`
- Static artifact output directory: `out/`
- Lint/tests: no dedicated scripts currently.

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
- `design-rules`: distributed markdown rule library for AI UI normalization.
  `design-rules/index.json` routes UI element types to detailed rule files.
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

## Design rule routing

Do not compress all UI rules into a single prompt. Before UI normalization:

1. Read `design-rules/index.json`.
2. Load rules marked `requiredAlways`.
3. Inventory the selected UI by element type.
4. Match element types against `rules[].appliesTo`.
5. Open only the matched `rules[].source` files.
6. Apply matched rules before generic UI judgment.
7. If no rule matches, keep changes conservative and report the missing rule.

The distributed rule library currently covers page shell/layout routing,
standard dashboard blocks, cards, tables, page headings, sidebars,
actions/buttons, filters/controls, page backgrounds, UI states, token system
installation, token binding, product alignment, visual QA, completion
compliance, and the rule router itself.

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
