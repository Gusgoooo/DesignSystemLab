import {
  requiredSemanticTokenNames,
  requiredShadcnTokenNames,
  type ThemeOutput,
} from "./schema"

const tailwindExposureTokens = {
  "--color-background": "var(--background)",
  "--color-foreground": "var(--foreground)",
  "--color-card": "var(--card)",
  "--color-card-foreground": "var(--card-foreground)",
  "--color-popover": "var(--popover)",
  "--color-popover-foreground": "var(--popover-foreground)",
  "--color-primary": "var(--primary)",
  "--color-primary-foreground": "var(--primary-foreground)",
  "--color-secondary": "var(--secondary)",
  "--color-secondary-foreground": "var(--secondary-foreground)",
  "--color-muted": "var(--muted)",
  "--color-muted-foreground": "var(--muted-foreground)",
  "--color-accent": "var(--accent)",
  "--color-accent-foreground": "var(--accent-foreground)",
  "--color-destructive": "var(--destructive)",
  "--color-destructive-foreground": "var(--destructive-foreground)",
  "--color-border": "var(--border)",
  "--color-input": "var(--input)",
  "--color-ring": "var(--ring)",
  "--color-chart-1": "var(--chart-1)",
  "--color-chart-2": "var(--chart-2)",
  "--color-chart-3": "var(--chart-3)",
  "--color-chart-4": "var(--chart-4)",
  "--color-chart-5": "var(--chart-5)",
  "--color-sidebar": "var(--sidebar)",
  "--color-sidebar-foreground": "var(--sidebar-foreground)",
  "--color-sidebar-primary": "var(--sidebar-primary)",
  "--color-sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
  "--color-sidebar-accent": "var(--sidebar-accent)",
  "--color-sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
  "--color-sidebar-border": "var(--sidebar-border)",
  "--color-sidebar-ring": "var(--sidebar-ring)",
  "--color-surface-canvas": "var(--surface-canvas)",
  "--color-surface-panel": "var(--surface-panel)",
  "--color-surface-raised": "var(--surface-raised)",
  "--color-surface-overlay": "var(--surface-overlay)",
  "--color-surface-inverse": "var(--surface-inverse)",
  "--color-content-primary": "var(--content-primary)",
  "--color-content-secondary": "var(--content-secondary)",
  "--color-content-tertiary": "var(--content-tertiary)",
  "--color-content-disabled": "var(--content-disabled)",
  "--color-content-inverse": "var(--content-inverse)",
  "--color-success": "var(--status-success)",
  "--color-success-bg": "var(--status-success-bg)",
  "--color-success-foreground": "var(--status-success-fg)",
  "--color-warning": "var(--status-warning)",
  "--color-warning-bg": "var(--status-warning-bg)",
  "--color-warning-foreground": "var(--status-warning-fg)",
  "--color-info": "var(--status-info)",
  "--color-info-bg": "var(--status-info-bg)",
  "--color-info-foreground": "var(--status-info-fg)",
  "--color-danger": "var(--status-danger)",
  "--color-danger-bg": "var(--status-danger-bg)",
  "--color-danger-foreground": "var(--status-danger-fg)",
  "--radius-sm": "calc(var(--radius) * 0.6)",
  "--radius-md": "calc(var(--radius) * 0.8)",
  "--radius-lg": "var(--radius)",
  "--radius-xl": "calc(var(--radius) * 1.4)",
  "--radius-2xl": "calc(var(--radius) * 1.8)",
  "--radius-3xl": "calc(var(--radius) * 2.2)",
  "--radius-4xl": "calc(var(--radius) * 2.6)",
  "--shadow-card": "var(--elevation-card)",
  "--shadow-popover": "var(--elevation-popover)",
  "--shadow-dialog": "var(--elevation-dialog)",
  "--font-sans": "var(--font-family-sans)",
  "--font-mono": "var(--font-family-mono)",
} as const

const colorMapTokenNames = [
  "--brand-50",
  "--brand-100",
  "--brand-200",
  "--brand-300",
  "--brand-400",
  "--brand-500",
  "--brand-600",
  "--brand-700",
  "--brand-800",
  "--brand-900",
  "--brand-950",
  "--neutral-0",
  "--neutral-50",
  "--neutral-100",
  "--neutral-200",
  "--neutral-300",
  "--neutral-500",
  "--neutral-700",
  "--neutral-900",
  "--neutral-950",
  "--green-600",
  "--amber-600",
  "--blue-600",
  "--red-600",
  "--data-1",
  "--data-2",
  "--data-3",
  "--data-4",
  "--data-5",
  "--data-positive",
  "--data-negative",
  "--data-neutral",
] as const

const radiusTokenNames = [
  "--radius",
  "--radius-base",
  "--radius-control",
  "--radius-card",
  "--radius-panel",
  "--radius-pill",
] as const

const densityTokenNames = [
  "--control-height-sm",
  "--control-height-md",
  "--control-height-lg",
  "--control-padding-x",
  "--control-gap",
  "--field-gap",
  "--section-gap",
  "--panel-padding",
  "--page-padding",
  "--table-cell-padding-x",
  "--table-cell-padding-y",
  "--list-row-height",
] as const

const typographyTokenNames = [
  "--font-family-sans",
  "--font-family-mono",
  "--text-caption",
  "--text-body",
  "--text-title",
  "--text-display",
  "--font-weight-body",
  "--font-weight-heading",
  "--tracking-body",
  "--tracking-heading",
] as const

const elevationTokenNames = [
  "--elevation-card",
  "--elevation-popover",
  "--elevation-dialog",
] as const

const motionTokenNames = [
  "--duration-fast",
  "--duration-base",
  "--duration-slow",
  "--ease-standard",
  "--ease-emphasized",
] as const

const compactDensityTokens = {
  "--control-height-sm": "1.45rem",
  "--control-height-md": "1.8rem",
  "--control-height-lg": "2.35rem",
  "--control-padding-x": "0.525rem",
  "--control-gap": "0.35rem",
  "--field-gap": "0.35rem",
  "--section-gap": "1.05rem",
  "--panel-padding": "0.7rem",
  "--page-padding": "1.05rem",
  "--table-cell-padding-x": "0.35rem",
  "--table-cell-padding-y": "0.3rem",
  "--list-row-height": "1.975rem",
} as const

const comfortableDensityTokens = {
  "--control-height-sm": "2.65rem",
  "--control-height-md": "3rem",
  "--control-height-lg": "3.55rem",
  "--control-padding-x": "0.99rem",
  "--control-gap": "0.66rem",
  "--field-gap": "0.66rem",
  "--section-gap": "1.98rem",
  "--panel-padding": "1.32rem",
  "--page-padding": "1.98rem",
  "--table-cell-padding-x": "0.66rem",
  "--table-cell-padding-y": "0.55rem",
  "--list-row-height": "3.33rem",
} as const

function serializeCssBlock(
  selector: string,
  tokens: Record<string, string>
): string {
  return `${selector} {\n${serializeTokenRecord(tokens)}\n}`
}

function serializeTokenRecord(tokens: Record<string, string>): string {
  return Object.entries(tokens)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n")
}

function pickTokens(
  tokens: Record<string, string>,
  names: readonly string[]
): Record<string, string> {
  return names.reduce<Record<string, string>>((pickedTokens, name) => {
    const value = tokens[name]

    if (value !== undefined) {
      pickedTokens[name] = value
    }

    return pickedTokens
  }, {})
}

function omitTokens(
  tokens: Record<string, string>,
  names: readonly string[]
): Record<string, string> {
  const omitted = new Set(names)

  return Object.entries(tokens).reduce<Record<string, string>>(
    (keptTokens, [name, value]) => {
      if (!omitted.has(name)) {
        keptTokens[name] = value
      }

      return keptTokens
    },
    {}
  )
}

function serializeSection(
  title: string,
  tokens: Record<string, string>
): string {
  const serialized = serializeTokenRecord(tokens)

  if (serialized.length === 0) {
    return ""
  }

  return `  /* ${title} */\n${serialized}`
}

function serializeGroupedCssBlock(
  selector: string,
  declarations: string[],
  groups: Array<{ title: string; tokens: Record<string, string> }>
): string {
  const body = [
    ...declarations.map((declaration) => `  ${declaration}`),
    ...groups
      .map((group) => serializeSection(group.title, group.tokens))
      .filter((section) => section.length > 0),
  ].join("\n\n")

  return `${selector} {\n${body}\n}`
}

function serializeLightVariables(theme: ThemeOutput): string {
  return serializeGroupedCssBlock(
    ":root",
    ["color-scheme: light;"],
    [
      {
        title: "map tokens: color",
        tokens: pickTokens(theme.cssVariables, colorMapTokenNames),
      },
      {
        title: "map tokens: radius",
        tokens: pickTokens(theme.cssVariables, radiusTokenNames),
      },
      {
        title: "map tokens: density",
        tokens: pickTokens(theme.cssVariables, densityTokenNames),
      },
      {
        title: "map tokens: typography",
        tokens: pickTokens(theme.cssVariables, typographyTokenNames),
      },
      {
        title: "map tokens: elevation",
        tokens: pickTokens(theme.cssVariables, elevationTokenNames),
      },
      {
        title: "map tokens: motion",
        tokens: pickTokens(theme.cssVariables, motionTokenNames),
      },
      {
        title: "semantic tokens",
        tokens: pickTokens(theme.cssVariables, requiredSemanticTokenNames),
      },
      {
        title: "shadcn adapter tokens",
        tokens: pickTokens(theme.cssVariables, requiredShadcnTokenNames),
      },
    ]
  )
}

function serializeDarkVariables(theme: ThemeOutput): string {
  const darkVariableTokens = omitTokens(
    theme.darkCssVariables,
    Object.keys(theme.mapTokens)
  )

  return serializeGroupedCssBlock(
    ".dark",
    ["color-scheme: dark;"],
    [
      {
        title: "dark semantic tokens",
        tokens: pickTokens(darkVariableTokens, requiredSemanticTokenNames),
      },
      {
        title: "dark shadcn adapter tokens",
        tokens: pickTokens(darkVariableTokens, requiredShadcnTokenNames),
      },
    ]
  )
}

export function exportThemeCssFromOutput(theme: ThemeOutput): string {
  return [
    "/* Generated by Design System Lab */",
    "/* 1. Tailwind exposure */",
    serializeCssBlock("@theme inline", tailwindExposureTokens),
    "/* 2. Light theme variables */",
    serializeLightVariables(theme),
    "/* 3. Dark theme variables */",
    serializeDarkVariables(theme),
    "/* 4. Optional density presets */",
    serializeCssBlock('[data-density="compact"]', compactDensityTokens),
    serializeCssBlock(
      '[data-density="comfortable"]',
      comfortableDensityTokens
    ),
  ].join("\n\n")
}
