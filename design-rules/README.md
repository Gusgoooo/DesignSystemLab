# Theme Lab Design Rules

This directory is the distributed design rule library for Theme Lab.

Agents should not read every file by default. Start from `design-rules/index.json`,
inventory the selected UI scope, then open only the matched rule files.

## Routing Flow

1. Read `design-rules/index.json`.
2. Inventory the selected scope by element type.
3. Always load the core rules marked `requiredAlways`.
4. Match element types against each rule's `appliesTo`.
5. Open only the matched `source` files.
6. Apply user-authored rules before generic UI taste.
7. If no rule matches, keep the change conservative and report the missing rule.

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
  product alignment, visual QA, and completion compliance.
- `blocks`: page-level compositions such as page shells and standard dashboards.
- `components`: cards, tables, page headings, sidebars, buttons/actions,
  filters, forms/inputs, tabs, overlays, badges/alerts, metrics/charts.
- `patterns`: page backgrounds and UI states.

The rules are intentionally detailed. Do not compress them into a single prompt.
