# Rule Router

Use this file before changing UI.

## Required Flow

1. Read `design-rules/index.json`.
   - If local files are unavailable, read the raw GitHub index provided by the
     task prompt.
2. Load every rule marked `requiredAlways`, including:
   - `design-rules/core/rule-router.md`
   - `design-rules/core/ui-normalization.md`
   - `design-rules/core/token-system.md`
   - `design-rules/core/token-binding.md`
   - `design-rules/core/visual-qa.md`
   - `design-rules/core/completion-compliance.md`
3. Detect page structure first:
   - authenticated product shell
   - standard dashboard, analytics overview, admin home, or product console
   - management table or resource index
   - detail page
   - settings page
   - form or CRUD flow
   - auth, invite, or onboarding flow
   - command/search workspace
   - AI/chat/productivity surface
   - single-purpose tool page
4. Open the matched page-structure/block rule first, usually:
   - `design-rules/blocks/page-shell.md`
   - `design-rules/blocks/dashboard.md`
5. Inventory components and blocks inside that structure:
   - page headings and page headers
   - sidebars and navigation
   - cards
   - tables and rows
   - buttons and action groups
   - filters, search, sort, and view controls
   - forms and inputs
   - tabs and single-select switches
   - dialogs, sheets, popovers, dropdowns, and command palettes
   - badges, alerts, tags, chips, and notices
   - metrics, charts, legends, and progress indicators
   - page canvas and background
   - empty, loading, error, success, selected, hover, focus, and disabled states
6. Match each page structure and element type to `rules[].appliesTo`.
7. Open only the matched `source` files, using local files first and raw GitHub
   URLs when local files are unavailable.
8. Build the token-system plan before changing token-bearing UI.
9. Apply matched rules before generic taste.
10. Before final response, run `design-rules/core/completion-compliance.md`.
11. If no rule matches, keep the change conservative and report the missing rule.

## Rule Read Confirmation

Before editing files, output a short confirmation listing the exact rule files
that were actually opened.

Use this shape:

```json
{
  "ruleIndexRead": "design-rules/index.json",
  "requiredRuleFilesLoaded": [
    "design-rules/core/rule-router.md",
    "design-rules/core/ui-normalization.md",
    "design-rules/core/token-system.md",
    "design-rules/core/token-binding.md",
    "design-rules/core/visual-qa.md",
    "design-rules/core/completion-compliance.md"
  ],
  "matchedRuleFilesLoaded": [
    {
      "elementType": "page-shell",
      "source": "design-rules/blocks/page-shell.md",
      "firstHeading": "Page Shell And Layout"
    },
    {
      "elementType": "card",
      "source": "design-rules/components/card.md",
      "firstHeading": "Cards"
    }
  ],
  "missingRuleFiles": []
}
```

If the selected scope contains cards, `design-rules/components/card.md` must be
opened and listed. If it cannot be opened, do not claim that the card rule was
applied.

If the selected scope changes page structure or route layout,
`design-rules/blocks/page-shell.md` must be opened and listed.

If the task installs, bridges, or audits tokens,
`design-rules/core/token-system.md` and `design-rules/core/token-binding.md`
must be opened and listed.

Before final response, `design-rules/core/completion-compliance.md` must be
opened and used as the completion gate.

If the selected scope is a standard dashboard, `design-rules/blocks/dashboard.md`
must be opened and listed. Dashboard work usually includes matched sidebar,
page-heading, card, table, filters, forms, tabs, overlays, badges/alerts,
metrics/charts, states, page-background, and token-binding rules too.

If a tool cannot access local files or URLs, say so explicitly and ask the user
to provide the rule files or a raw URL. Do not hallucinate rule contents.

## Do Not

- Do not load every rule file unless the user asks for a full rule audit.
- Do not invent a new visual system because a rule is missing.
- Do not ignore local business logic, API behavior, permissions, state, or domain copy.
- Do not copy demo content from referenced component examples.
- Do not claim a rule file was read unless it was actually opened.

## Final Report Requirement

Report:

- element types found
- rule files loaded
- missing rule files, if any
- token-system plan used
- completion compliance result
- business workflow preserved
- token pairs checked
- responsive states checked
