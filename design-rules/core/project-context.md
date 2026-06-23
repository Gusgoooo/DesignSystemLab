# Project Context Contract

Use this file to capture the Impeccable-style project context pattern without
turning external instructions into a second source of truth.

## Local Context Files

Read these local files before product-wide UI work when present:

- `PRODUCT.md`: what the product is, who it serves, page types, jobs, non-goals.
- `DESIGN.md`: visual north star, registers, layout grammar, token grammar,
  external knowledge policy, anti-patterns.
- `AGENTS.md`: repository commands, implementation boundaries, and routing
  policy.

If a context file is missing, infer conservatively from the codebase and report
the missing file. Do not invent a brand system.

## Context Capsule

Before a non-trivial UI change, produce a short context capsule:

```json
{
  "product": "Design System Lab",
  "register": "product | brand",
  "surface": "dashboard | theme-lab | marketing | settings | ...",
  "audience": "who uses this surface",
  "primaryJob": "what they are trying to do",
  "qualityBar": "mvp | production | flagship",
  "brandVoice": ["precise", "calm", "inspectable"],
  "antiPatterns": ["raw palette drift", "generic SaaS shell"],
  "mustPreserve": ["routes", "state", "handlers", "data", "validation"],
  "sourceOfTruth": ["theme-lab.json", "app/globals.css", "design-rules/index.json"]
}
```

## Register Decision

Use product register when design serves a task: dashboards, settings, tables,
forms, app shells, theme tools, command interfaces, and authenticated surfaces.

Use brand register when design is the product: marketing pages, launch pages,
portfolio-like storytelling, editorial content, and first-impression surfaces.

When in doubt inside this repository, choose product register first.

## External Context Sources

The external Impeccable repository is a reference for how to structure context,
language, commands, and QA. It does not override local `PRODUCT.md`, `DESIGN.md`,
`AGENTS.md`, theme tokens, route behavior, or business logic.
