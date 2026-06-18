# Rule Router

Use this file before changing UI.

## Required Flow

1. Read `design-rules/index.json`.
2. Inventory the selected page or product scope by element type:
   - page headings and page headers
   - sidebars and navigation
   - cards
   - tables and rows
   - buttons and action groups
   - filters, search, sort, and view controls
   - forms and inputs
   - dialogs, sheets, popovers, dropdowns, and tabs
   - page canvas and background
   - empty, loading, error, success, selected, hover, focus, and disabled states
3. Load every rule marked `requiredAlways`.
4. Match each element type to `rules[].appliesTo`.
5. Open only the matched `source` files.
6. Apply matched rules before generic taste.
7. If no rule matches, keep the change conservative and report the missing rule.

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
    "design-rules/core/token-binding.md",
    "design-rules/core/visual-qa.md"
  ],
  "matchedRuleFilesLoaded": [
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
- business workflow preserved
- token pairs checked
- responsive states checked
