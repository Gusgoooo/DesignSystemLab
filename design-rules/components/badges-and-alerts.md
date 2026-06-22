# Badges And Alerts

Use this rule for badges, tags, chips, labels, pills, status indicators, alerts,
inline notices, banners, toast-like messages, callouts, and validation summaries.

## Intent

Badges summarize compact meaning. Alerts interrupt or guide attention. Both must
communicate real status, category, priority, or action-needed information rather
than decorate the interface.

Also apply `design-rules/patterns/semantic-color.md` for color mapping.

## Badges

Use badges for:

- status
- priority
- category
- type
- ownership or permission state
- selected filters
- compact counts

Neutral is the default. A tag that only names a thing does not need a unique
color.

Status badges use status tokens:

- success: `bg-success-bg text-success-foreground`
- warning: `bg-warning-bg text-warning-foreground`
- info: `bg-info-bg text-info-foreground`
- danger: `bg-danger-bg text-danger-foreground`

Categorical badges use the chart palette only when categories need stable visual
distinction. Assign a stable category-to-index mapping.

## Alerts

Use alerts for information the user should notice before continuing:

- error or failure
- warning or risk
- success confirmation
- info or policy note
- permission limitation
- required next step

Alerts should have:

- clear title or concise first sentence
- short supporting detail only when needed
- next action when useful
- dismiss behavior only when the message is safe to dismiss

Do not turn ordinary helper text into an alert.

## Placement

Badges sit close to the object they describe.

Alerts sit close to the workflow they affect:

- form-level errors near the form actions or top of the form
- page-level notices below the page heading
- table/list notices above the affected table
- inline field issues next to the field, not in a distant banner

## Copy

Use domain-specific, actionable copy:

- what happened
- what it affects
- what the user can do next

Avoid generic copy such as "Something went wrong" when the product has a more
specific error.

## Token Binding

Badges and alerts must use semantic tokens:

- neutral: `bg-muted text-muted-foreground` or outline variant
- status soft: `bg-success-bg text-success-foreground`, warning, info, danger
- status solid only for strong emphasis: `bg-success text-success-foreground`,
  warning, info, danger
- destructive: `bg-destructive text-destructive-foreground` where the existing
  shadcn primitive expects destructive tokens
- border: `border-border` or status border token if one exists
- focus for removable chips/actions: `ring-ring`

Do not use raw palette colors for badge or alert meaning.

## States

Check:

- neutral
- status
- selected filter chip
- removable chip
- disabled chip/action
- alert with action
- dismissible alert
- loading or pending status
- error and success states

## Do Not

- color every tag differently
- use category colors for selected/active interaction state
- use status color when the badge is only a label
- make alerts decorative
- hide critical errors in toast-only UI
- use solid status fills everywhere
- leave status fills without matching foreground tokens

## Final Report

State:

- badge, chip, alert, or notice types found
- neutral, status, category, and interaction meanings separated
- semantic-color rule applied
- token pairs, dismiss/action behavior, and placement checked
