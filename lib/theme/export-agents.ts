import { deriveTheme } from "./derive-theme"
import { themeLabAiCodingRules } from "./export-json"
import type { ThemeOutput, ThemeSeed } from "./schema"

function codeList(values: readonly string[]): string {
  return values.map((value) => `- \`${value}\``).join("\n")
}

function markdownList(values: readonly string[]): string {
  return values.map((value) => `- ${value}`).join("\n")
}

export function exportAgentsThemeRules(seed: ThemeSeed): string {
  return exportAgentsThemeRulesFromOutput(deriveTheme(seed))
}

export function exportAgentsThemeRulesFromOutput(theme: ThemeOutput): string {
  return `<!-- theme-lab:agents:start -->
## Theme Lab Contract

This project uses Theme Lab as a persistent visual system contract.

Theme name:
${theme.vibe.name}

Vibe keywords:
${theme.vibe.keywords.join(", ")}

Before UI changes:

${markdownList(themeLabAiCodingRules)}

Runtime source:

- Read \`theme-lab.json\` before UI changes.
- The existing global CSS Theme Lab marker block is the runtime source for CSS variables.
- One-time prompts are not the source of truth.
- When changing UI, consume the existing compiled CSS variables and token contract.
- When changing theme direction, update the seed in \`theme-lab.json\`, then regenerate compiled CSS variables through Theme Lab or the available theme generation pipeline.
- Do not manually invent new structural visual values.

Use shadcn semantic classes first:
${codeList([
  "bg-background",
  "text-foreground",
  "bg-card",
  "text-card-foreground",
  "bg-primary",
  "text-primary-foreground",
  "text-muted-foreground",
  "border-border",
  "ring-ring",
])}

Use project semantic variables when needed:
${codeList([
  "bg-[var(--surface-canvas)]",
  "bg-[var(--surface-panel)]",
  "bg-[var(--surface-raised)]",
  "text-[var(--content-primary)]",
  "text-[var(--content-secondary)]",
  "text-[var(--content-tertiary)]",
  "border-[var(--border-subtle)]",
  "border-[var(--border-default)]",
  "[box-shadow:var(--elevation-card)]",
  "[box-shadow:var(--elevation-popover)]",
])}

Do not use these for structural UI:

- Avoid \`bg-blue-600\`
- Avoid \`bg-zinc-950\`
- Avoid \`text-zinc-500\`
- Avoid \`border-gray-200\`
- Avoid hardcoded hex colors
- Avoid arbitrary OKLCH values
- Avoid one-off shadows, one-off border colors, random gradients, and unapproved new color scales

Preserve routes, APIs, data loading, state, handlers, forms, validation, permissions, feature flags, and business logic.

Do not scaffold a new app inside an existing project. Do not create a parallel design system. Do not install dependencies unless approved.

Visual guidance:

- Use the vibe in \`theme-lab.json\` for composition, hierarchy, density, surface treatment, motion restraint, icon style, tone, and what to avoid.
- Do not use the vibe to invent new colors or override runtime CSS variables.
<!-- theme-lab:agents:end -->
`
}
