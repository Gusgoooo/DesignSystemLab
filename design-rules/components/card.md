# Cards

Cards are compressed previews of the next layer of content. They are not empty decorative containers.

## Content Rule

If a card is clickable or opens a detail view, derive its content from that destination.

Pull useful preview information forward:

- title
- status
- type or category
- owner or team
- date or last activity
- key metric
- short outcome
- next action
- 2-4 important facts

Do not show only a title, icon, and generic description when the destination contains richer useful information.

## Hierarchy Rule

Card content should be rich but scannable.

Use:

- compact facts
- labels and values
- chips
- short snippets
- one or two line summaries
- clear primary, secondary, and tertiary text hierarchy

Avoid long paragraphs.

## Number-Heavy Cards

Group related values into small token-backed sub-sections or mini cells.

Each value should have:

- label
- unit
- trend or status when available
- consistent alignment

Do not leave many unrelated numbers floating in one flat stack.

## Top Ambient Wash

Cards may use a very subtle top ambient wash only when it communicates status, category, priority, product domain, or an important preview state.

This ambient layer is a decorative exception:

- it may use non-token colors
- it may use non-token opacity, blur, and gradient stops
- it must remain non-structural and sit behind content

The card shell, text, border, focus state, actions, badges, metric cells, radius, spacing, and elevation must remain token-bound.

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

Good hue families include very pale cyan, blue, mint, and lavender when they fit the product meaning.

### Never

- reduce text contrast
- hide dividers
- wash over metrics
- compete with primary actions
- become a blob
- become bokeh
- become a rainbow gradient
- become a strong brand-color strip

Use the ambient treatment sparingly. Do not apply it to every basic card just to decorate the page.

## Actions

The primary card click target should be clear. Secondary actions should be quiet and should not compete with the content preview.
