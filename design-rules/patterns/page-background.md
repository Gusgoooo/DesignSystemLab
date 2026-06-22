# Page Background

Use this rule when a page has a plain canvas and would benefit from a quiet, product-specific atmosphere.

## Page Top Ambient Wash

The intended effect is a barely visible mist-like wash at the very top of the page, similar to pale blue or green morning haze that fades into the normal page background.

## Placement

- Add the layer only to the page canvas or main content canvas.
- Do not apply it inside cards, tables, dialogs, sidebars, or controls.
- The layer must sit behind content.
- Use `pointer-events-none`.
- Do not create layout height.
- Do not push content down.

## Size

The visible wash should occupy only the top fifth of the page or viewport.

Practical range:

- 18-22% of page height or viewport height
- then fade fully into `bg-background` or transparent

## Tone

Keep it extremely subtle:

- low opacity
- low saturation
- high lightness
- broad softness
- no hard edge

It should feel like air or light, not:

- a banner
- a hero background
- a colored section
- a blob
- an orb
- bokeh
- a rainbow gradient
- a strong brand-color band

## Token Boundary

The ambient layer is a decorative exception. It may use non-token colors, opacity, blur, and gradient stops because it is non-structural atmosphere.

All real UI surfaces, text, borders, focus rings, actions, states, radius, and elevation must still use Theme Lab tokens.

## Dark Mode

In dark mode, reduce visual weight further or skip the layer if it creates haze, banding, or low contrast.

## App Shells

In app-shell layouts, apply the layer to the main content canvas by default.

Do not tint the sidebar unless the sidebar itself is the page canvas and the user-authored rules explicitly allow it.
