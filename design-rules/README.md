# Design System Lab Design Rules

This directory is the distributed design rule library for Design System Lab.

Agents should not read every file by default. Start from `design-rules/index.json`,
inventory the selected UI scope, then open only the matched rule files.

## Routing Flow

1. Read `design-rules/index.json`.
2. Always load the core rules marked `requiredAlways`.
3. Read local `PRODUCT.md` and `DESIGN.md` when present.
4. Classify the page type with `design-rules/core/page-type-workflow.md`.
5. Normalize shell/background/width/grid/spacing before component polish.
6. Inventory the selected scope by element type.
7. Match element types against each rule's `appliesTo`.
8. Open only the matched `source` files.
9. Apply user-authored rules before generic UI taste.
10. If no rule matches, keep the change conservative and report the missing rule.

## Access Requirements

An AI tool can read these rules only when it has access to one of:

- the local `design-rules/` directory inside the target project
- pasted rule file contents
- accessible raw text URLs for the rule files

If the user only copies a prompt but does not provide local files or raw URLs,
the AI tool cannot open `design-rules/components/card.md`.

For GitHub, use raw text URLs when sharing rule files across projects:

```txt
https://raw.githubusercontent.com/<owner>/<repo>/<commit-or-tag>/design-rules/components/card.md
```

Prefer commit SHAs or tags over `main` so rules do not change silently.

## Read Confirmation

Before editing, agents must list the exact rule files actually opened. For
example, if the selected scope contains cards, the confirmation must include
`design-rules/components/card.md`. If the file cannot be opened, the agent must
say so instead of pretending the card rule was applied.

## Rule Families

- `core`: execution boundaries, token system installation, token binding,
  page-type workflow, project context, external knowledge routing, product
  alignment, visual QA, and completion compliance.
- `blocks`: page-level compositions such as page shells and standard dashboards.
- `components`: cards, tables, page headings, sidebars, buttons/actions,
  filters, forms/inputs, tabs, overlays, badges/alerts, metrics/charts.
- `patterns`: page backgrounds and UI states.
- `external`: raw GitHub asset indexes for Impeccable and UIUXPROMAX.

The rules are intentionally detailed. Do not compress them into a single prompt.

## External Knowledge Assets

External design intelligence lives behind a separate router:

- `design-rules/core/external-knowledge-routing.md`
- `design-rules/external/knowledge-assets.md`
- `design-rules/external/knowledge-assets.json`

Use Impeccable for design vocabulary, commands, critique, QA, and context
patterns. Use UIUXPROMAX for datasets, style recipes, generators, and
cross-stack rules. Load only the needed raw GitHub files and map every decision
back through local tokens and local product context.
