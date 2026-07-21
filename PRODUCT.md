# Design System Lab Product Context

## Product Purpose

Design System Lab is an AI-era design system generator with two project
adapters: shadcn/ui and Ant Design. A portable framework-neutral core Token
export remains available as a low-level artifact, not a third project workflow.
It helps builders move from seed tokens to deterministic map tokens, semantic
tokens, framework adapters, preview components, and exportable AI guidance.

The product should make AI-assisted UI work less improvised. Its value is not a
single pretty screen; it is a repeatable process for classifying page types,
normalizing page shells, binding tokens, and routing detailed design rules.

## Primary Users

- Product engineers improving an existing React or Next.js app.
- Designers or design engineers defining a reusable shadcn-compatible theme.
- Teams using Ant Design as the component system with any existing styling
  layer.
- AI coding agents that need precise UI rules instead of vague aesthetic
  direction.

## Core Jobs

- Generate a coherent theme from seed controls.
- Keep `ThemeSeed` as the only editable theme source and deterministically derive
  map, semantic, official shadcn, and project extension token layers.
- Match shadcn's current theme vocabulary before adding clearly separated
  project semantics that shadcn does not provide.
- Export a complete Ant Design `ConfigProvider` ThemeConfig and add a Tailwind v4
  bridge only when Tailwind already exists.
- Keep Ant Design targets free of shadcn, Radix, registry, and
  `components.json` installation requirements.
- Keep the portable Map/Semantic CSS export available for custom integration
  without exposing another setup workflow in the main product.
- Offer five curated visual presets with distinct color, neutral, density,
  typography, shape, and material outputs instead of a long list of lightly
  differentiated business scenarios.
- Install the Token contract without modifying existing product UI.
- After successful installation, ask whether the user wants to map existing UI
  to the Token system; never start that work automatically.
- Treat approved mapping as semantic reasoning over responsibility, hierarchy,
  surface, interaction, and state rather than literal value replacement.
- For new shadcn UI, inspect matching Blocks before composing from primitives.
- For new Ant Design UI, use matched block guidance and official Ant components.
- For Ant Design targets, preserve the installed Ant version, ConfigProvider,
  App context, component overrides, Pro Components, and detected styling setup.
- Keep the current framework, directory structure, build setup, and unrelated
  styling tools instead of turning them into product choices.
- Route future component guidance through raw GitHub rules and load matched
  Blocks before component-level guidance.
- Run token health automatically before export; do not turn correctness checks
  into another user workflow.
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
- Agents record registry candidate scores, primitive compatibility, install
  diff evidence, logic-to-slot mappings, and slot-to-token mappings before
  concrete styling.
- Page shell, background, content width, grid, and spacing are normalized before
  component polish.
- Structural UI consumes semantic tokens instead of raw Tailwind palette values.
- Official shadcn compatibility tokens and project extensions remain separately
  inspectable in generated CSS and machine-readable manifests.
- Ant Design exports pass required Seed/Alias token, opaque-color, integer-size,
  algorithm-composition, and all-component global coverage checks.
- Portable core exports pass framework-neutral required-token, reference,
  opacity, contrast, scale-order, category-separation, and typography checks.
- Every preset passes required-token, reference, opacity, contrast, scale-order,
  category-separation, and shadcn-adapter checks in light and dark modes.
- The main application flow stays short: choose shadcn or Ant Design, then copy
  the installation packet.
- The installation packet is Token-first: it contains the Seed and compiled
  Token payload, while health reports, static contracts, adapters, and Blocks
  are validated locally or loaded from versioned raw Git rather than embedded.
- Existing UI remains unchanged until the user explicitly approves semantic
  Token mapping after installation.
- New pages and substantial components start from matched Blocks and consume
  Tokens from their first implementation.
- Typography, density, and hierarchy are adjusted before radius, shadow, motion,
  or decorative effects.
- Impeccable-derived vocabulary and QA patterns are used as design language, not
  copied brand styling.
- UIUXPROMAX-derived datasets and generators are routed as raw GitHub assets,
  not pasted into a monolithic prompt.

## Non-Goals

- Backend persistence.
- A generic landing-page template generator.
- A parallel visual system outside the selected shadcn or Ant Design adapter.
- Blindly copying external visual styles, demo content, or brand systems.
