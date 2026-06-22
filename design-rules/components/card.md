# Cards

Use this rule for cards, clickable cards, metric cards, summary cards, preview
cards, setting cards, and repeated card grids.

## Intent

Cards are compressed previews of the next layer of content. They are not empty
decorative containers and should not be used only to add borders around loose
content.

Use cards when the content represents a distinct object, module, decision area,
or navigable destination.

## Anatomy

A useful card usually has:

- identity: title, object name, or module label
- context: status, type, owner, team, date, or scope
- evidence: key metric, latest activity, short outcome, or 2-4 important facts
- action: primary click target or a quiet secondary action

If a card opens a detail view, derive the card content from that destination. Do
not show only a title, icon, and generic description when the destination
contains richer useful information.

## Content

Make card content rich but scannable:

- compact facts
- labels and values
- chips or badges only when they carry meaning
- short snippets
- one or two line summaries
- clear primary, secondary, and tertiary text hierarchy

Avoid long paragraphs. Move deep reading into the destination, sheet, dialog, or
detail region.

## Layout

Card grids should share a steady rhythm:

- align card edges and internal gutters
- keep repeated cards the same density unless one card is intentionally featured
- keep heading, metadata, facts, and actions in predictable locations
- avoid nested cards
- avoid many equal-weight surfaces that make the page feel fragmented

When a card contains a toolbar or menu, keep it visually quieter than the card's
main content.

## Number-Heavy Cards

Group related values into small token-backed sub-sections or mini cells.

Each value should have:

- label
- unit
- trend or status when available
- consistent alignment

Do not leave many unrelated numbers floating in one flat stack.

## Token Binding

Structural card UI must use Theme Lab tokens:

- shell: `bg-card text-card-foreground`
- border: `border-border`
- muted text: `text-muted-foreground`
- focus: `ring-ring`
- radius: `rounded-[var(--radius-card)]`
- elevation when needed: `[box-shadow:var(--elevation-card)]`

Do not keep old raw palette colors, one-off borders, one-off shadows, or legacy
radius values after normalizing a card.

## States

Clickable cards need visible hover and focus-visible states. Selected cards need
a state that is readable in light and dark mode and does not look like a primary
button unless the whole card is the primary action.

Disabled cards must communicate disabled state without hiding important content.
Loading cards should preserve layout stability with skeletons or placeholder
rows.

## Top Ambient Wash

Cards may use a very subtle top ambient wash only when it communicates status,
category, priority, product domain, or an important preview state.

This ambient layer is a decorative exception:

- it may use non-token colors
- it may use non-token opacity, blur, and gradient stops
- it must remain non-structural and sit behind content

The card shell, text, border, focus state, actions, badges, metric cells, radius,
spacing, and elevation must remain token-bound.

### Shape

- Anchor the color to the upper edge inside the card.
- Clip the layer to the card radius.
- Fade it downward into the normal `bg-card` surface.
- Keep the strongest color near the top edge or upper corners.
- Keep the center and lower body visually clean.

### Size

- Occupy only the upper 20-35% of the card.
- Become fully transparent before the main content area.
- Do not cover the whole card.

### Tone

- low saturation
- high lightness
- low opacity
- broad softness
- no hard edge
- one gentle hue, or two adjacent hues at most

Good hue families include very pale cyan, blue, mint, and lavender when they fit
the product meaning.

## Do Not

- use cards as generic page-section wrappers
- put cards inside cards unless the inner element is a real repeated item
- create empty decorative icon cards
- apply ambient wash to every card
- use raw Tailwind palette colors for structural card UI
- hide text contrast with decorative layers
- make secondary actions compete with the card's main purpose

## Final Report

State:

- which card types were found
- how destination/detail content was previewed
- which card token pairs, radius, elevation, hover, focus, selected, disabled,
  and loading states were checked
- whether any card rule was missing or intentionally not applied
