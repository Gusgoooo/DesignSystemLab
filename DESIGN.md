# Design System Lab Design Context

## Design North Star

Design System Lab should feel like a calm engineering instrument for visual
systems: precise, inspectable, and quietly expressive. The interface should help
users reason about tokens, page types, and rule routing without turning the
product into a decorative showcase.

The product should hide infrastructure work by default. Automatic detection,
registry scoring, coverage calculation, and token health checks happen behind
the primary flow; users see only decisions that materially change the outcome.

## Operating Sequence

Token installation follows this order:

1. Choose shadcn or Ant Design.
2. Install the compact Token package, generate the selected runtime adapter
   from its raw mapping, and update one AI instruction section.
3. Verify Token health and project compilation.
4. Leave existing UI unchanged.
5. Ask whether the user wants to map the existing interface to the Token system.

New UI creation follows this order:

1. Classify the page type and user job.
2. Load the matched Block before component rules.
3. Use the installed Tokens from the first implementation.
4. Compose with shadcn Registry Blocks/components or official Ant components.
5. Replace demo content with real product content and behavior.
6. Verify states, responsiveness, and Token usage.

Existing UI mapping runs only after explicit approval. It infers responsibility,
hierarchy, surface, interaction, and state before choosing Tokens or component
variants; it is not literal value replacement.

The primary prompt transports Token data, not the whole governance library.
Health reports and static contracts stay in the generator; adapter mappings,
rules, and Blocks are loaded from versioned raw Git sources only when needed.

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

- `ThemeSeed` is the only editable theme source. Map, semantic, and selected
  framework adapter tokens are deterministic derived layers.
- Semantic colors consume algorithmic map tokens; components never skip directly
  from seed values to concrete colors.
- Match the current official shadcn theme vocabulary exactly as the compatibility
  baseline. Keep project additions, including `--destructive-foreground`,
  status pairs, richer surfaces/content roles, density, elevation, and motion,
  in an explicit extension layer.
- For Ant Design targets, emit a complete ConfigProvider Seed/Alias token layer
  for all Ant components. Tailwind v4 semantic utilities reference `--ant-*`
  variables only when Tailwind already exists; other styling layers consume Ant
  CSS variables or runtime tokens.
- Ant Design targets do not install or route through shadcn, Radix,
  `components.json`, or shadcn Registry workflows.
- Portable Map and Semantic CSS remains an export artifact for custom
  integration, not a third main application mode.
- Registry/block structure and semantic tokens are independent contracts:
  registry supplies executable structure and behavior; tokens supply stable
  visual meaning.
- Existing products preserve their detected Radix or Base UI engine. Radix is a
  greenfield fallback, not a theme requirement.
- Page creation starts from the closest matched Block. Existing UI mapping does
  not trigger Block replacement unless separately requested.
- Token export is allowed only when the selected adapter's health contract
  passes. Portable core exports retain their own health contract.
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
