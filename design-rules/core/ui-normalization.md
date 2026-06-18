# UI Normalization

Treat redesign, optimize, rebuild, and refactor requests as UI normalization by default.

## Goal

Make the existing product UI calmer, clearer, more readable, and more internally consistent while preserving the user's current product.

## Preserve

- routes
- page content
- information architecture
- workflow order
- API contracts
- data loading
- mutations
- event handlers
- validation
- permissions
- feature flags
- state transitions
- domain copy

## Normalize

- bespoke controls that have safe project or shadcn equivalents
- repeated visual class fragments
- inconsistent spacing
- mixed radius scales
- one-off shadows
- weak hierarchy
- missing or unsafe states
- raw palette colors in structural UI
- token mismatches

## Boundaries

Do not replace the whole visible UI tree by default. Keep the same product page recognizable.

Do not move major content regions or change workflow order unless:

- the existing structure blocks usability
- a matched design rule requires it
- the user explicitly asks for a full redesign

## Diagnosis Step

Before editing, identify the top three UI problems in scope:

1. hierarchy problem
2. component consistency problem
3. token, state, or contrast problem

Then normalize specifically to solve those problems.

## UI/UX Quality Rules

Before applying tokens, make the screen easier to understand.

Every normalized screen should make these things clear:

- where the user is
- what the page is about
- what changed or needs attention
- what the primary action is
- what secondary actions are available
- what state the data is in
- what the user can safely ignore

Design for progressive exploration:

- show summary before detail
- expose enough preview information before requiring a click
- group related controls near the content they affect
- keep destructive or rare actions visually quieter until needed
- use tables and cards as entry points into deeper information, not as isolated decoration
- make loading, empty, error, disabled, selected, hover, and focus states feel like part of the same component system

Use hierarchy deliberately:

- one dominant page heading
- one clear primary action per workflow region
- compact metadata below or beside titles
- stronger text for object identity
- muted text for helper context
- badges only for real status, type, priority, or state
- icons only when they speed recognition or clarify action meaning

Avoid:

- equal visual weight for every block
- action bars with too many loud buttons
- cards that contain only icon + title + generic description
- tables that expose every database field at once
- filters far away from the data they affect
- nested cards or panel-inside-panel layouts
- adding decoration to compensate for weak information design

## Invalid Outcomes

- only swapping raw values for tokens
- leaving obvious ad hoc controls untouched
- disconnecting API behavior
- increasing visual noise
- making the primary action harder to find
- making layout less scannable
- shipping low-contrast filled surfaces
