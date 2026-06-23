# External Knowledge Assets

This file is the human-readable routing map for external design intelligence.
The machine-readable companion is `design-rules/external/knowledge-assets.json`.

Do not paste full external rule bodies into prompts. Use the raw GitHub URLs
from the manifest and load only the relevant family.

## Impeccable

Repository: `pbakaus/impeccable`

Raw base:

```txt
https://raw.githubusercontent.com/pbakaus/impeccable/main/.agents/skills/impeccable
```

Use for:

- design language and command vocabulary
- product versus brand register
- project context conventions
- critique, audit, hardening, and anti-pattern detection
- final polish passes

Important families:

- `SKILL.md`
- `reference/product.md`
- `reference/brand.md`
- `reference/layout.md`
- `reference/typeset.md`
- `reference/colorize.md`
- `reference/interaction-design.md`
- `reference/shape.md`
- `reference/polish.md`
- `reference/audit.md`
- `reference/critique.md`
- `reference/distill.md`
- `reference/harden.md`
- `scripts/command-metadata.json`
- `scripts/detect.mjs`
- `scripts/detector/registry/antipatterns.mjs`
- `scripts/detector/rules/checks.mjs`

## UIUXPROMAX

Repository: `nextlevelbuilder/ui-ux-pro-max-skill`

Raw base:

```txt
https://raw.githubusercontent.com/nextlevelbuilder/ui-ux-pro-max-skill/main/src/ui-ux-pro-max
```

Use for:

- data-backed style recipes
- product-type mappings
- color and typography candidates
- chart selection guidance
- generator/search references
- stack-specific UI and implementation rules

Important families:

- `data/styles.csv`
- `data/colors.csv`
- `data/typography.csv`
- `data/charts.csv`
- `data/products.csv`
- `data/ui-reasoning.csv`
- `data/ux-guidelines.csv`
- `data/app-interface.csv`
- `data/landing.csv`
- `data/react-performance.csv`
- `scripts/search.py`
- `scripts/design_system.py`
- `scripts/core.py`
- `data/stacks/nextjs.csv`
- `data/stacks/react.csv`
- `data/stacks/shadcn.csv`
- `data/stacks/html-tailwind.csv`

## Scientific Split

- `context`: product purpose, register, audience, local constraints.
- `pageType`: dashboard, theme-lab, marketing, settings, resource-index, detail,
  form-flow, ai-command, docs-spec.
- `structure`: shell, background, width, grid, spacing, navigation, headings.
- `tokens`: seed candidates, semantic mapping, shadcn adapter tokens.
- `components`: controls, cards, tables, forms, tabs, overlays, status, charts.
- `craft`: typography, color strategy, hierarchy, density, shape, elevation,
  motion, polish.
- `qa`: accessibility, contrast, keyboard, responsive behavior, detectors,
  completion evidence.
- `crossStack`: stack-specific translation rules for implementation targets.

## Local Rule

Use external knowledge to inform decisions, then implement through local Design
System Lab tokens and components. The final UI should look like this product,
not like Impeccable or UIUXPROMAX.
