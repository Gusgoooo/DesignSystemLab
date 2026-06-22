# Forms And Inputs

Use this rule for forms, field groups, inputs, textareas, selects, checkboxes,
switches, radio groups, sliders, date pickers, validation messages, settings
forms, CRUD forms, auth forms, and multi-step forms.

## Intent

Forms collect or change data. They must preserve validation, state, submission,
permissions, default values, and data contracts before visual polish.

Good form UI reduces uncertainty: every field has a clear label, the required
inputs are obvious, validation is close to the field, and actions are placed
where the user expects them.

## Anatomy

A field should have:

- label
- control
- optional description or hint
- optional validation message
- disabled or read-only state when relevant

A form should have:

- logical groups
- clear section headings when the form is long
- primary submit action
- secondary cancel/back action when needed
- loading/submitting state
- error and success handling

Use existing project or shadcn components:

- `Field`
- `Label`
- `Input`
- `Textarea`
- `Select`
- `Checkbox`
- `Switch`
- `RadioGroup`
- `Slider`
- `Popover`
- `Calendar`
- `Button`

## Layout

Keep form layout predictable:

- one column for narrow screens and complex fields
- two columns only when fields are short and naturally paired
- labels close to controls
- helper text directly below the related control
- validation message directly below the related control
- action row aligned with the form content

Do not split one logical field group across unrelated cards or panels.

For settings pages, group fields by product concept, not by input type. For CRUD
flows, keep required identity fields near the top.

## Labels And Help Text

Every input needs an accessible label. Placeholder text is not a label.

Use help text for decisions the user might not know how to make. Do not add
generic help text that repeats the label.

Required and optional indicators should follow the product's existing pattern.
Do not invent a new required-state system for one form.

## Validation

Preserve existing validation logic and messages.

Validation messages should:

- appear close to the field
- explain what needs to change
- use destructive or danger tokens without overwhelming the form
- be announced accessibly when possible

Do not replace domain-specific validation copy with generic text.

## Actions

Use `Button` for form commands:

- submit
- save
- apply
- create
- invite
- cancel
- reset

The primary action should be visually strongest. Secondary actions should be
quiet. Destructive form actions should be separated from ordinary save/cancel
actions and should use confirmation when data loss is possible.

## Token Binding

Controls should use Theme Lab tokens:

- field surface: `bg-background text-foreground`
- popover surface: `bg-popover text-popover-foreground`
- border: `border-border`
- muted copy: `text-muted-foreground`
- focus: `ring-ring`
- invalid state: destructive or danger tokens
- radius: `rounded-[var(--radius-control)]`
- height: `h-[var(--control-height-sm)]`, `h-[var(--control-height-md)]`, or
  `h-[var(--control-height-lg)]`

Filled action buttons must use matching foreground tokens.

## States

Check:

- default
- hover
- focus-visible
- disabled
- read-only
- invalid
- required
- optional
- loading
- submitting
- success
- error

Disabled controls should still be readable. Loading or submitting forms should
avoid layout shift and double submission.

## Responsive Behavior

On small screens:

- fields stack cleanly
- labels and validation do not collide with controls
- action rows wrap without hiding the primary action
- date pickers, selects, and popovers remain usable

Do not let long labels, email addresses, URLs, file names, or validation
messages overflow their containers.

## Do Not

- use placeholders as the only labels
- remove form handlers, schemas, default values, or validation
- style invalid state with raw palette colors
- hide error messages far away from fields
- make every field full-width when paired fields would be clearer
- use buttons as radio options when the value is submitted as data
- create a new form abstraction unless repeated form complexity justifies it

## Final Report

State:

- form types found
- field groups preserved
- validation, default values, submission, loading, and error behavior preserved
- accessible labels checked
- token-backed control height, radius, border, focus, invalid, disabled, and
  responsive states verified
