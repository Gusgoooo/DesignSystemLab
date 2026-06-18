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

## Invalid Outcomes

- only swapping raw values for tokens
- leaving obvious ad hoc controls untouched
- disconnecting API behavior
- increasing visual noise
- making the primary action harder to find
- making layout less scannable
- shipping low-contrast filled surfaces
