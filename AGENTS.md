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
- Product context: `PRODUCT.md` and `DESIGN.md` store Impeccable-style local
  context for product purpose, design register, page types, layout grammar, and
  anti-patterns.
- External design intelligence: `design-rules/external/knowledge-assets.json`
  routes Impeccable and UIUXPROMAX assets through raw GitHub URLs.
- Aliases: `@/*` is configured in `tsconfig.json` and `components.json`.
- Static output: `next.config.ts` uses `output: "export"` and writes the
  publishable static artifact to `out/`.

## Project-specific commands

- Install dependencies: `npm install`
- Run the dev server: `npm run dev`
- Typecheck: `npm run typecheck`
- Lightweight theme/registry health test: `npm run test:theme`
- Synchronize generated default theme CSS: `npm run theme:sync`
- Build the app: `npm run build`
- Build static artifact: `npm run build:static`
- Static artifact output directory: `out/`
- Lint/tests: no dedicated scripts currently.

## Project purpose

This project contains an AI-era design system generator with two project
adapters: shadcn/ui and Ant Design. It provides seed token controls,
algorithmic token generation, semantic token mapping, component-system
adapters, preview pages, raw GitHub component guidance, and exportable theme
artifacts. Framework-neutral core Token CSS remains a portable export artifact.

## Core architecture

- `src/theme` or `lib/theme`: theme seed schema, token algorithms, CSS export,
  vibe descriptor generation.
- `lib/theme/registry-capabilities.ts`: audited block/primitive-bundle capability
  index, page-slot profiles, resolver weights, and install diff gate.
- `lib/theme/registry-resolver.ts`: deterministic registry candidate inference,
  scoring, blocked/deferred decisions, and pre-install command generation.
- `lib/theme/health.ts`: framework-neutral core health plus required-token,
  reference, opacity, contrast, scale-order, category-separation, and
  shadcn-adapter health checks.
- `lib/theme/antd-adapter.ts`: seed-driven Ant Design Seed/Alias token adapter.
- `lib/theme/antd-health.ts`: Ant Design all-component coverage, algorithm,
  opaque-color, foreground, and integer-size health checks.
- `lib/theme/export-css.ts`: shadcn-compatible runtime CSS and portable
  framework-neutral Map/Semantic CSS exports.
- `lib/theme/export-antd.ts`: Ant Design ThemeConfig and optional Tailwind v4
  bridge exports.
- `lib/theme/export-prompt.ts`: compact Token-first installation packet. It
  transports only Seed plus compiled Token values and routes static adapter,
  rule, and Blocks guidance through versioned raw Git sources.
- `scripts/verify-theme-system.ts`: lightweight preset, edge-seed, registry,
  shadcn, isolated Ant Design, and portable core Token compatibility
  verification.
- `design-rules/core/registry-block-mapping.md`: Blocks-first creation and
  approved existing-UI semantic mapping contract.
- `app/theme-lab` or equivalent route: UI for seed controls and preview.
- `components/theme-lab`: theme lab UI, preview frame, control panel, preview
  tabs, and spec browser.
- `components/ui`: shadcn/ui base components.
- `design-rules`: distributed markdown rule library for AI UI normalization.
  `design-rules/index.json` routes UI element types to detailed rule files.
- `PRODUCT.md` and `DESIGN.md`: local product/design context used before
  external references.
- `design-rules/external`: raw GitHub asset indexes for Impeccable and
  UIUXPROMAX knowledge families.
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

For an Ant Design target:

- Keep Ant Design as the complete component system.
- Install the generated `ThemeConfig` through `ConfigProvider` and wrap feedback
  consumers with Ant Design `App`.
- Keep `cssVar` enabled. Generate the `@theme inline` bridge to `--ant-*`
  variables only when Tailwind v4 is already active.
- Auto-detect Tailwind, CSS Modules, CSS-in-JS, Less/SCSS, or plain CSS. Do not
  add Tailwind solely for theme installation.
- Do not add shadcn, Radix, `components.json`, or registry workflows.
- Avoid global `.ant-*` overrides for normal theming; use global Alias tokens,
  then justified `theme.components` overrides.

For the portable core Token export:

- Export framework-neutral algorithmic Map and Semantic CSS variables only.
- Treat it as a low-level artifact rather than a third main application mode.

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

Treat `typography.baseSize` and `typography.scaleRatio` as Seeds for the complete
generated `--font-size-xs` through `--font-size-6xl` scale. Tailwind `text-xs`
through `text-6xl` must resolve to that generated scale instead of maintaining a
second hardcoded type scale. Generated sizes may serialize as `rem`, but every
runtime font size must resolve to an integer pixel value.

Default shadcn Button labels should bind to the generated compact typography
token with `text-[length:var(--text-caption)]`. Do not let default product
buttons inherit `--text-body`.

Preview components should consume semantic classes, not raw palette values. Raw
palette or map-token classes are acceptable only in pages or components that are
explicitly displaying token swatches.

## Design rule routing

Do not compress all UI rules into a single prompt. Read
`design-rules/index.json`, choose a task mode, then load only that mode's rules:

1. `token-installation`: install and verify Tokens; do not mutate existing UI;
   ask whether to map existing UI after success.
2. `new-ui-creation`: classify page type, load the matched Block before
   component rules, and use Tokens from the first implementation.
3. `existing-ui-mapping`: require explicit user approval, then infer semantic
   roles instead of replacing literal values one-to-one.
4. Open only matched `rules[].source` files or their raw GitHub URLs.
5. If no rule matches, keep changes conservative and report the missing rule.

The distributed rule library currently covers page shell/layout routing,
standard dashboard blocks, cards, tables, page headings, sidebars,
actions/buttons, filters/controls, forms/inputs, tabs, overlays,
badges/alerts, metrics/charts, page backgrounds, UI states, token system
installation, token binding, product alignment, visual QA, completion
compliance, page-type workflow, project context, external knowledge routing,
and the rule router itself.

## UI creation and mapping flow

Use this sequence for new UI creation or approved existing-UI mapping:

1. Confirm the task mode; existing UI mapping requires explicit approval.
2. Classify the page type and user job.
3. Load the closest matched Block before individual component rules.
4. For shadcn, inspect matching Registry Blocks before primitives. For Ant
   Design, compose the Block structure from official Ant components.
5. Map real product responsibilities and states into Block slots.
6. Infer semantic Token roles from responsibility, hierarchy, surface,
   interaction, and state.
7. Preserve business behavior and verify responsive states.

Do not start UI work by adding gradients, glassmorphism, shadows, radius, or
animation. If the result still feels wrong, return to page type, information
hierarchy, spacing, and token usage before adding ornament.

## External design knowledge assets

Use external raw GitHub assets only when the task explicitly asks for
Impeccable, UIUXPROMAX, external style intelligence, raw GitHub routing,
generators, or cross-stack rules.

- Start from `design-rules/core/external-knowledge-routing.md`.
- Use `design-rules/external/knowledge-assets.json` as the machine-readable
  manifest.
- Use Impeccable for language, commands, critique, QA, anti-pattern detection,
  and project-context patterns.
- Use UIUXPROMAX for datasets, style recipes, color and typography candidates,
  chart guidance, generator scripts, and stack-specific rules.
- Preserve local `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`, route behavior, token
  architecture, and shadcn components as the source of truth.
- Translate external style rows into the chain `Seed Token -> Algorithmic Map
  Token -> Semantic Token -> Official shadcn Adapter Token -> Design System Lab
  shadcn Extension Token -> Preview Component`.
- Do not copy external demo content, brand styling, or long rule bodies into
  local prompts. Route to raw URLs and summarize decisions.

## Design rule authoring

Keep rule placement consistent:

- The tool-native AI instruction file stores durable agent behavior, routing
  policy, token contract boundaries, and rule authoring policy.
- Detailed component, block, pattern, token, or QA rules live in dedicated
  `design-rules/**/*.md` files.
- `design-rules/index.json` registers every rule with `source`,
  `requiredAlways`, and `appliesTo`.
- Exported prompts should route to local files or raw GitHub URLs instead of
  embedding long rule bodies.
- Do not add detailed rules to the import dialog UI.

When adding a new rule, update the dedicated rule file, `design-rules/index.json`,
the export manifest/list if needed, and only add a short routing or authoring
note to the tool-native AI instruction file. Do not expand it into a
component-rule handbook.

## AI instruction targets

Use the target tool's native instruction file when installing Design System Lab guidance:

- Claude Code: `CLAUDE.md`
- Codex and generic coding agents: `AGENTS.md`
- Cursor: `.cursor/rules/theme-lab.mdc` when Cursor rules exist; otherwise
  `AGENTS.md` is acceptable for cross-agent compatibility.
- GitHub Copilot: `.github/copilot-instructions.md`
- Gemini CLI: `GEMINI.md`
- Windsurf/Cascade: `.windsurfrules`
- Qoder: `AGENTS.md` is compatible; native Qoder rules may override it.

Do not create every supported instruction file by default. Detect the target AI
tool or existing instruction files first, then update the matching native file.
Create multiple instruction files only when the user explicitly requests
multi-tool compatibility.

## Token architecture

Use this chain:

Seed Token
-> Algorithmic Map Token
-> Semantic Token
-> Official shadcn Adapter Token
-> Design System Lab shadcn Extension Token
-> Preview Component

For Ant Design, the adapter branch is:

```txt
Seed Token
-> Algorithmic Map Token
-> Semantic Token
-> Ant Design Seed/Alias Token
-> ConfigProvider ThemeConfig
-> Ant CSS Variables
-> Optional Detected Styling-Layer Exposure
```

The portable core export stops before a component-system adapter:

```txt
Seed Token
-> Algorithmic Map Token
-> Semantic Token
-> Existing Project Styling Mechanism
```

`ThemeSeed` is the only editable theme source. Algorithms generate maps and
scales, semantic mapping makes product decisions, the official shadcn adapter
guarantees compatibility, and project-only concepts stay in the separate
extension layer.

Keep the primary project prompt compact. Do not embed health reports, health
contracts, Registry contracts, long rule bodies, or duplicated runtime
artifacts. Validate before export; include only the Seed and compiled Token
payload, then route static adapter and design guidance to versioned raw Git.

## Preview architecture

Theme lab has four tabs:

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

3. Spec:
   - rule router
   - page type workflow
   - project context and external knowledge routing
   - page shell / dashboard / page heading / sidebar specs
   - component interaction specs such as cards as data previews, tables as
     investigation surfaces, actions as commands, filters as data-scope
     controls, forms as data mutation contracts, tabs as view-state controls,
     overlays as focused workflows, badges/alerts as meaning and feedback,
     metrics/charts as analytical answers
   - state, semantic color, and page background specs
   - source paths and conditions for when AI should load each spec

4. Aesthetic:
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

- Run `npm run test:theme` when registry, token generation, semantic mapping,
  shadcn adaptation, Ant Design adaptation, portable core export, conditional
  styling bridging, or theme export behavior changes.
- Run typecheck if available.
- Run lint if available.
- Confirm the app builds or at least the edited route compiles.
- Summarize changed files.
- Summarize known limitations.
- Call out anything not implemented.
