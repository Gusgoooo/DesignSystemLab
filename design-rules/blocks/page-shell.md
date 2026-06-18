# Page Shell And Layout

Use this rule before changing a route, page, or app-level layout.

## Goal

Identify the page structure first, then load the right block and component
rules. Do not start by styling individual cards or buttons before the page shell
is understood.

## Page Structure Inventory

Classify the selected scope as one or more of:

- authenticated product shell
- standard dashboard
- management table or resource index
- detail page
- settings page
- form or CRUD flow
- auth page
- onboarding or invite flow
- command/search workspace
- AI/chat/productivity surface
- marketing or public page
- single-purpose tool page

Also identify:

- sidebar or navigation rail
- top header
- page heading
- breadcrumbs
- toolbar
- content sections
- primary action region
- filters/search/sort controls
- cards
- tables/lists
- charts
- forms
- dialogs/sheets/drawers/popovers
- empty/loading/error states

## Routing

After structure inventory, open matched rules:

- standard dashboard -> `design-rules/blocks/dashboard.md`
- app shell/sidebar -> `design-rules/components/sidebar.md`
- page heading/header -> `design-rules/components/page-heading.md`
- cards -> `design-rules/components/card.md`
- tables/lists -> `design-rules/components/table.md`
- buttons/actions/toolbars -> `design-rules/components/actions-and-buttons.md`
- filters/search/sort/view controls -> `design-rules/components/filters-and-controls.md`
- page canvas/background -> `design-rules/patterns/page-background.md`
- empty/loading/error/selected/disabled states -> `design-rules/patterns/states.md`
- token setup -> `design-rules/core/token-system.md`
- token classes and audits -> `design-rules/core/token-binding.md`
- final compliance -> `design-rules/core/completion-compliance.md`

If a page type has no dedicated block rule, preserve the existing page structure
and normalize components conservatively.

## Layout Rules

Preserve useful product structure:

- route and navigation model
- content order
- primary workflow order
- major page regions
- existing API/data/state boundaries
- domain copy

Normalize:

- inconsistent shell spacing
- mixed content widths
- page headers with unclear action placement
- floating controls with no alignment system
- page sections that feel unrelated
- nested card/panel layouts
- responsive overflow
- old radius/shadow/surface systems

## Confirmation

Before editing, state:

- detected page structure
- shell regions found
- block rules to open
- component rules to open
- token-system rule source
- compliance rule source
- content/workflow that must stay unchanged

Do not ask open-ended questions about obvious shell regions. If a sidebar,
header, page heading, toolbar, or primary content region is present, include it
in the plan by default and ask for one direct confirmation of the full plan only
when approval is required.
