# External Knowledge Routing

Use this file when the task asks for Impeccable, UIUXPROMAX, external design
intelligence, style-library extraction, raw GitHub references, or cross-stack
design rules.

## Priority

1. Local product context: `PRODUCT.md`, `DESIGN.md`, `AGENTS.md`.
2. Local rule router: `design-rules/index.json` and matched local rule files.
3. Impeccable raw assets for vocabulary, commands, critique, QA, and context
   patterns.
4. UIUXPROMAX raw assets for datasets, style recipes, generator scripts, and
   cross-stack rules.
5. Generic UI judgment.

External assets are references, not source-of-truth replacements. Preserve
local routes, APIs, data, handlers, validation, state, tokens, and component
architecture.

## Asset Index

Start from:

- Human index: `design-rules/external/knowledge-assets.md`
- Machine index: `design-rules/external/knowledge-assets.json`

The machine index intentionally stores raw GitHub URLs rather than embedding the
full external knowledge base in local prompts.

## Impeccable Extraction

Use Impeccable for:

- language: layout, typesetting, color, interaction, shape, bolder/quieter,
  distill, polish
- commands: audit, critique, polish, harden, optimize, adapt, animate, extract,
  document, onboard
- QA: detector scripts, anti-pattern registry, rule checks, browser/visual
  inspection concepts
- project context: product/brand register, init/context patterns, `PRODUCT.md`
  and `DESIGN.md` conventions

Do not copy Impeccable's own brand direction into this product.

## UIUXPROMAX Extraction

Use UIUXPROMAX for:

- datasets: style recipes, color palettes, typography pairs, chart guidance,
  product-type mappings, UX guidelines, interface rules
- generator: search and design-system scripts as implementation references
- style library: rows from `styles.csv` mapped through Design System Lab seed,
  semantic tokens, shadcn adapter tokens, and preview components
- cross-stack rules: Next.js, React, shadcn, Tailwind, Vue, Flutter, SwiftUI,
  Jetpack Compose, and other stack-specific CSV files

Do not apply UIUXPROMAX colors, fonts, shadows, or CSS snippets directly to
structural UI. Translate them into the local token architecture.

## Retrieval Discipline

- Load only the asset family needed for the current page type and task.
- Prefer raw URLs pinned to a commit or tag when publishing durable prompts.
- When using `main`, record the access date in the implementation notes.
- If a raw URL is unavailable, do not hallucinate its contents. Continue with
  local rules and report the missing external asset.
- Summarize external assets; do not paste long copyrighted bodies into final
  responses or prompts.

## Mapping To The Five-Step Workflow

1. Page type: local page-type workflow first; UIUXPROMAX product/style rows may
   inform archetype selection.
2. Shell/spacing: Impeccable layout/product register, then local page-shell
   rules.
3. Tokens: UIUXPROMAX colors/typography as seed candidates only; local semantic
   token binding decides implementation.
4. Type/density: Impeccable typeset/product register plus local density tokens.
5. Decoration: Impeccable bolder/quieter/distill/polish commands; UIUXPROMAX
   style recipe only after product fit and token mapping are clear.
