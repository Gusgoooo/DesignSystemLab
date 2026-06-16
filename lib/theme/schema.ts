export type HexAlphaColor = {
  hex: string
  alpha: number
}

export type ThemeSeed = {
  color: {
    primary: HexAlphaColor
    success: HexAlphaColor
    warning: HexAlphaColor
    info: HexAlphaColor
    infoMatchesPrimary: boolean
    danger: HexAlphaColor
    background: HexAlphaColor
    foreground: HexAlphaColor
    neutral: HexAlphaColor
  }
  shape: {
    radius: number
    radiusRatio: number
  }
  density: {
    mode: "compact" | "default" | "comfortable"
    controlHeight: number
    densityRatio: number
  }
  typography: {
    sans: string
    mono: string
    scaleRatio: number
    headingWeight: number
    bodyWeight: number
    trackingBias: number
  }
  material: {
    elevation: "flat" | "soft" | "floating"
    shadowAlpha: number
    borderContrast: number
    surfaceContrast: number
    glassOpacity: number
    noiseOpacity: number
  }
  motion: {
    level: "none" | "subtle" | "expressive"
    durationBase: number
  }
  vibe: {
    temperature: "cool" | "neutral" | "warm"
    expression: "minimal" | "balanced" | "expressive"
    domain: "saas" | "ai" | "editorial" | "finance" | "consumer" | "tooling"
    tone: "calm" | "precise" | "friendly" | "premium" | "experimental"
  }
}

export type TokenMap = Record<string, string>

export type MapTokens = TokenMap
export type SemanticTokens = TokenMap
export type ShadcnTokens = TokenMap
export type CssVariables = TokenMap

export const requiredSemanticTokenNames = [
  "--surface-canvas",
  "--surface-panel",
  "--surface-raised",
  "--surface-overlay",
  "--surface-inverse",
  "--content-primary",
  "--content-secondary",
  "--content-tertiary",
  "--content-disabled",
  "--content-inverse",
  "--border-subtle",
  "--border-default",
  "--border-strong",
  "--focus-ring",
  "--action-primary",
  "--action-primary-hover",
  "--action-primary-active",
  "--action-primary-fg",
  "--action-secondary",
  "--action-secondary-hover",
  "--action-secondary-fg",
  "--status-success",
  "--status-success-bg",
  "--status-success-fg",
  "--status-warning",
  "--status-warning-bg",
  "--status-warning-fg",
  "--status-info",
  "--status-info-bg",
  "--status-info-fg",
  "--status-danger",
  "--status-danger-bg",
  "--status-danger-fg",
] as const

export const requiredShadcnTokenNames = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--destructive-foreground",
  "--border",
  "--input",
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
  "--radius",
] as const

export type RequiredSemanticTokenName =
  (typeof requiredSemanticTokenNames)[number]

export type RequiredShadcnTokenName = (typeof requiredShadcnTokenNames)[number]

export type VibeDescriptor = {
  name: string
  keywords: string[]
  avoid: string[]
  visualLanguage: {
    surface: string
    shape: string
    color: string
    density: string
    motion: string
    typography: string
  }
  principles: string[]
  aiPrompt: string
}

export type ThemeOutput = {
  seed: ThemeSeed
  mapTokens: MapTokens
  semanticTokens: SemanticTokens
  darkSemanticTokens: SemanticTokens
  shadcnTokens: ShadcnTokens
  darkShadcnTokens: ShadcnTokens
  cssVariables: CssVariables
  darkCssVariables: CssVariables
  vibe: VibeDescriptor
}

export const densityModes = ["compact", "default", "comfortable"] as const
export const elevationModes = ["flat", "soft", "floating"] as const
export const motionLevels = ["none", "subtle", "expressive"] as const
export const vibeTemperatures = ["cool", "neutral", "warm"] as const
export const vibeExpressions = ["minimal", "balanced", "expressive"] as const
export const vibeDomains = [
  "saas",
  "ai",
  "editorial",
  "finance",
  "consumer",
  "tooling",
] as const
export const vibeTones = [
  "calm",
  "precise",
  "friendly",
  "premium",
  "experimental",
] as const
