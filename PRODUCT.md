# Design System Lab Product Context

## Product Purpose

Design System Lab is an AI-era design system generator for shadcn/ui projects.
It helps builders move from seed tokens to deterministic map tokens, semantic
tokens, shadcn adapter tokens, preview components, and exportable AI guidance.

The product should make AI-assisted UI work less improvised. Its value is not a
single pretty screen; it is a repeatable process for classifying page types,
normalizing page shells, binding tokens, and routing detailed design rules.

## Primary Users

- Product engineers improving an existing React or Next.js app.
- Designers or design engineers defining a reusable shadcn-compatible theme.
- AI coding agents that need precise UI rules instead of vague aesthetic
  direction.

## Core Jobs

- Generate a coherent theme from seed controls.
- Preview components, blocks, specs, and aesthetic direction.
- Export token artifacts and AI instructions that preserve product behavior.
- Route UI work through local design rules and external raw GitHub knowledge
  assets when explicitly requested.

## Product Register

Design serves the product. Most surfaces should feel like a precise product
tool: quiet, scannable, deterministic, and trustworthy. Marketing or brand
moments may be more expressive, but the default quality bar is product clarity.

## Page Types

- `app/page.tsx`: marketing / entry surface for the product.
- `app/theme-lab/page.tsx`: theme-lab tool surface.
- `app/dashboard/page.tsx`: dashboard / product console surface.
- `components/theme-lab/*`: product UI for controls, previews, export, and
  spec browsing.
- `design-rules/*`: distributed rule library and design intelligence router.

## Success Criteria

- Agents classify page type before changing visuals.
- Page shell, background, content width, grid, and spacing are normalized before
  component polish.
- Structural UI consumes semantic tokens instead of raw Tailwind palette values.
- Typography, density, and hierarchy are adjusted before radius, shadow, motion,
  or decorative effects.
- Impeccable-derived vocabulary and QA patterns are used as design language, not
  copied brand styling.
- UIUXPROMAX-derived datasets and generators are routed as raw GitHub assets,
  not pasted into a monolithic prompt.

## Non-Goals

- Backend persistence.
- A generic landing-page template generator.
- A parallel design system outside the existing token and shadcn architecture.
- Blindly copying external visual styles, demo content, or brand systems.
