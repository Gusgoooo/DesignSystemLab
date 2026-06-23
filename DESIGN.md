# Design System Lab Design Context

## Design North Star

Design System Lab should feel like a calm engineering instrument for visual
systems: precise, inspectable, and quietly expressive. The interface should help
users reason about tokens, page types, and rule routing without turning the
product into a decorative showcase.

## Operating Sequence

Every UI change follows this order:

1. Classify the page type.
2. Normalize page shell, background, maximum width, grid, and spacing.
3. Audit token usage and remove raw structural palette values.
4. Tune typography hierarchy and density.
5. Apply radius, elevation, motion, and decoration only after the structure is
   stable.

## Registers

- Product surfaces: restrained, dense enough for repeated work, semantic-first,
  familiar controls, clear focus states.
- Theme-lab surfaces: slightly more expressive because the subject is visual
  systems, but still token-bound and scannable.
- Marketing surfaces: may use stronger brand hierarchy and imagery, while
  preserving the same token contract.

## Layout Grammar

- Use one app/page shell per page type before polishing individual cards.
- Keep page headings unframed by default.
- Let content width communicate mode: wider for dashboards and previews, tighter
  for forms, docs, and onboarding.
- Use cards for repeated items, previews, tools, and modals; avoid cards inside
  cards.
- Keep control rows predictable: filters and view state on the left, commands on
  the right.

## Token Grammar

- Use shadcn semantic classes first.
- Use project semantic utilities only when the existing shadcn token vocabulary
  cannot express the concept.
- Do not use raw Tailwind palette classes, hardcoded hex colors, or arbitrary
  OKLCH values for structural UI.
- Status color means status. Chart color means stable categorical mapping.
  Decorative color is allowed only in explicitly approved ambient layers.

## External Knowledge Usage

Impeccable is used for language, commands, critique, QA, and project context
patterns. UIUXPROMAX is used for searchable data assets: style recipes, color
palettes, font pairings, chart guidance, generators, and cross-stack rules.

Local product context and local design rules always win. External raw GitHub
assets inform decisions; they do not replace the product's token contract,
routes, data, state, or interaction behavior.

## Anti-Patterns

- Starting with gradients, shadow, border radius, or animation before page type
  and layout are settled.
- Treating a dashboard like a marketing hero page.
- Treating tabs, filters, and command buttons as interchangeable.
- Pasting entire external rule bodies into prompts instead of routing to raw
  URLs.
- Using UIUXPROMAX style rows as direct implementation specs without mapping
  them through Design System Lab semantic tokens.
