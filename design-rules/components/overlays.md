# Overlays

Use this rule for dialogs, alert dialogs, sheets, drawers, popovers, dropdown
menus, command palettes, date pickers, combobox popovers, and contextual menus.

## Intent

Overlays interrupt, focus, or extend a workflow. They must preserve the user's
context, focus behavior, dismissal behavior, and action semantics.

Choose the smallest overlay that fits the task:

- dropdown menu for compact actions
- popover for lightweight contextual controls or pickers
- dialog for focused decisions or forms
- alert dialog for destructive or irreversible confirmation
- sheet/drawer for side workflows, details, or multi-field edits that should not
  replace the page

## Anatomy

Use existing project or shadcn components:

- `Dialog`
- `AlertDialog`
- `Sheet`
- `Popover`
- `DropdownMenu`
- `Command`
- `Button`
- `Input`
- `Calendar`

An overlay should have:

- accessible trigger
- clear title when the overlay has content beyond a simple menu
- concise description when the decision needs context
- content sized to the task
- close or cancel affordance when appropriate
- primary action and secondary action for decisions

## Behavior

Preserve:

- open/closed state
- controlled component behavior
- focus trap and focus return
- escape-key behavior
- outside-click behavior
- scroll behavior
- portal/container behavior
- form state inside the overlay
- async loading and error states

Do not convert a controlled overlay to uncontrolled behavior if application
logic depends on the controlled state.

## Placement And Sizing

Dialogs should be focused and not oversized. Sheets can be wider for detail
views or forms. Popovers should stay close to their trigger and should not become
small dialogs full of unrelated content.

On mobile, overlays should remain usable:

- no clipped headers or action rows
- scrollable content when needed
- primary action visible or reachable
- touch targets large enough
- date pickers and menus fit the viewport

## Action Semantics

Use alert dialogs for destructive confirmation, not ordinary editing.

For destructive workflows:

- name the object being affected
- state the consequence
- keep cancel available
- use destructive tokens for the destructive action
- do not make the destructive button look like the ordinary primary action

Menus should not hide the most important page-level primary action unless the
viewport requires it.

## Token Binding

Overlays should use Theme Lab tokens:

- surface: `bg-popover text-popover-foreground` or `bg-card text-card-foreground`
- page scrim when present: existing shadcn overlay tokens or token-compatible
  opacity
- border: `border-border`
- focus: `ring-ring`
- muted copy: `text-muted-foreground`
- destructive action: `bg-destructive text-destructive-foreground`
- radius: `rounded-[var(--radius-panel)]` for panels or
  `rounded-[var(--radius-control)]` for menu items/triggers
- elevation: `[box-shadow:var(--elevation-popover)]`

Do not use raw white/black overlays, raw palette menu highlights, or one-off
shadow values.

## States

Check:

- open
- closed
- hover
- focus-visible
- active item
- disabled item
- loading content
- empty content
- error content
- destructive confirmation
- mobile viewport

## Do Not

- use dialogs for tiny menus
- use popovers for large multi-step workflows
- remove focus return or keyboard behavior
- leave overlay content disconnected from existing handlers
- copy demo menu items or fake routes
- put irreversible actions in ordinary dropdown items without confirmation when
  the product risk requires confirmation

## Final Report

State:

- overlay types found
- trigger, open state, focus behavior, dismissal, and handlers preserved
- destructive confirmation behavior checked
- token-backed surface, border, focus, elevation, action, and mobile behavior
  verified
