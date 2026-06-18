# UI States

Use this rule for empty, loading, error, success, disabled, selected, hover, focus, active, and permission-hidden states.

## Required States

When relevant, preserve or improve:

- hover
- active
- focus-visible
- selected
- disabled
- loading
- empty
- error
- success
- destructive
- permission-hidden

## Token Rule

State surfaces must use semantic tokens and matching foregrounds.

Examples:

- `bg-muted text-muted-foreground`
- `bg-primary text-primary-foreground`
- `bg-destructive text-destructive-foreground`
- `ring-ring`

## Empty States

Empty states should be concise and useful:

- state what is missing
- provide the next useful action when available
- avoid long explanatory paragraphs
- do not add decorative illustration unless the product pattern already uses one

## Loading States

Loading states should preserve layout stability.

Use skeletons or subdued progress indicators. Do not cause layout shift.

## Error States

Error states should:

- identify the problem
- keep user data safe
- offer retry or next action when possible
- use destructive tokens without overwhelming the page

## Focus

Every interactive element needs a visible `focus-visible` state.

Do not remove outlines without a token-backed replacement.
