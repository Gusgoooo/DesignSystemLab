# Blocks, Components, And Token Mapping

Use this rule when creating new UI or after the user explicitly approves mapping
existing UI. Do not run it during Token installation.

## Core Boundary

- Blocks provide page-level structure, composition, and expected states.
- Components provide executable controls and interaction behavior.
- Tokens provide stable visual meaning.

Start with a Block for a page or substantial workflow. Do not begin by placing
individual primitives without first checking whether a matching Block or block
rule already expresses the user job.

## Blocks-First Order

1. classify the page type and primary user job
2. read the matched page shell or Block rule
3. identify the real product responsibilities and states
4. choose the component-system implementation
5. bind Block slots to semantic Tokens
6. replace demo content with real routes, data, actions, and copy
7. verify responsive, loading, empty, error, disabled, selected, and permission
   states

Blocks are guidance, not templates to copy verbatim.

## shadcn

For shadcn:

1. inspect existing project components and configured registries
2. search matching official or configured Registry Blocks before composing from
   primitives
3. prefer an existing compatible project Block, then a close Registry Block,
   then a small composition from approved primitives
4. preserve the existing Radix or Base UI engine
5. before an actual Registry write, inspect the item and file diff
6. never use overwrite by default

Useful safety checks before a write:

```sh
npx shadcn@latest view <items>
npx shadcn@latest add <items> --dry-run
npx shadcn@latest add <items> --diff
```

Do not copy demo users, teams, routes, permissions, chart values, table rows, or
marketing copy. A Block supplies structure and behavior guidance only.

## Ant Design

For Ant Design:

1. read the matched Design System Lab Block rule
2. use its slots and state expectations as the page structure
3. compose those slots from official Ant Design components and existing business
   wrappers
4. let the installed ThemeConfig provide global visual behavior
5. use component overrides only for repeated concepts that the global Token
   layer cannot express

Do not run the shadcn Registry workflow or add a second component system.

## New UI Creation

New UI must use the installed Token system from its first implementation.

For each Block slot, record:

- product responsibility
- component or component group
- semantic Token role
- interaction and state requirements
- real data or handler source

Example:

| Block slot | Responsibility | Component | Token role |
| --- | --- | --- | --- |
| page canvas | application workspace | layout root | background + foreground |
| primary command | highest-priority action | Button | primary pair |
| selected navigation | current location | nav item | accent/sidebar accent pair |
| quiet metadata | supporting facts | text/description | muted foreground |
| raised module | object or workflow preview | Card | card pair + border |
| feedback | success/warning/info/danger | Alert/Badge | matching status pair |

## Existing UI Mapping

Existing UI mapping requires explicit user approval after Token installation.
It does not automatically authorize component replacement or layout redesign.

For every existing element:

1. infer its responsibility and hierarchy
2. distinguish commands from selection, navigation, feedback, and data identity
3. infer surface and interaction state
4. choose the semantic Token and component variant
5. preserve routes, data, handlers, validation, permissions, accessibility, and
   responsive behavior
6. use the matched Block to identify missing or misclassified page-level roles

Do not map by old literal value. Two elements with the same old color may need
different semantic Tokens. Two elements with different old colors may need the
same Token when they serve the same responsibility.

Only replace component structure when the user separately asks for component or
page optimization. Token mapping alone should improve semantic consistency
without silently changing workflows.

## Verification

The result is incomplete if:

- no matching Block was considered for page-level work
- demo content remains
- a Block slot lacks a semantic Token role
- command, selection, status, and category colors are confused
- existing UI was mapped without explicit approval
- mapping was literal search-and-replace rather than semantic reasoning
- routes, data, handlers, validation, permissions, accessibility, or responsive
  states were lost
- a Registry write overwrote meaningful local work without diff review
