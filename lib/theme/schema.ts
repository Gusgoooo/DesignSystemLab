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
    baseSize: number
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
export type ShadcnExtensionTokens = TokenMap
export type CssVariables = TokenMap
export type AntdTokenValue = string | number | boolean
export type AntdTokens = Record<string, AntdTokenValue>

export type AntdThemeAlgorithmName =
  | "defaultAlgorithm"
  | "darkAlgorithm"
  | "compactAlgorithm"

export type AntdThemeMode = {
  algorithm: AntdThemeAlgorithmName[]
  token: AntdTokens
}

export type AntdThemeAdapter = {
  version: "antd-theme-config-v1"
  componentCoverage: "all-components-via-global-theme-tokens"
  componentSize: "small" | "middle" | "large"
  cssVar: {
    prefix: "ant"
    lightKey: string
    darkKey: string
  }
  light: AntdThemeMode
  dark: AntdThemeMode
}

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
  "--status-success-solid-fg",
  "--status-success-bg",
  "--status-success-fg",
  "--status-warning",
  "--status-warning-solid-fg",
  "--status-warning-bg",
  "--status-warning-fg",
  "--status-info",
  "--status-info-solid-fg",
  "--status-info-bg",
  "--status-info-fg",
  "--status-danger",
  "--status-danger-solid-fg",
  "--status-danger-bg",
  "--status-danger-fg",
] as const

export const requiredMapTokenNames = [
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
  "--neutral-400",
  "--neutral-500",
  "--neutral-600",
  "--neutral-700",
  "--neutral-800",
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
  "--radius-none",
  "--radius-base",
  "--radius-control",
  "--radius-card",
  "--radius-panel",
  "--radius-pill",
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
  "--font-family-sans",
  "--font-family-mono",
  "--font-size-xs",
  "--font-size-sm",
  "--font-size-base",
  "--font-size-lg",
  "--font-size-xl",
  "--font-size-2xl",
  "--font-size-3xl",
  "--font-size-4xl",
  "--font-size-5xl",
  "--font-size-6xl",
  "--text-caption",
  "--text-body",
  "--text-title",
  "--text-display",
  "--font-weight-body",
  "--font-weight-heading",
  "--tracking-body",
  "--tracking-heading",
  "--elevation-none",
  "--elevation-control",
  "--elevation-card",
  "--elevation-popover",
  "--elevation-dialog",
  "--duration-fast",
  "--duration-base",
  "--duration-slow",
  "--ease-standard",
  "--ease-emphasized",
] as const

export const requiredShadcnOfficialTokenNames = [
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

export const requiredShadcnExtensionTokenNames = [
  "--destructive-foreground",
] as const

export const requiredAntdSeedTokenNames = [
  "colorPrimary",
  "colorSuccess",
  "colorWarning",
  "colorError",
  "colorInfo",
  "colorLink",
  "colorTextBase",
  "colorBgBase",
  "fontFamily",
  "fontFamilyCode",
  "fontSize",
  "lineWidth",
  "lineType",
  "borderRadius",
  "sizeUnit",
  "sizeStep",
  "sizePopupArrow",
  "controlHeight",
  "zIndexBase",
  "zIndexPopupBase",
  "opacityImage",
  "wireframe",
  "motion",
] as const

export const requiredAntdAliasTokenNames = [
  "colorText",
  "colorTextSecondary",
  "colorTextTertiary",
  "colorTextQuaternary",
  "colorTextHeading",
  "colorTextLabel",
  "colorTextDescription",
  "colorTextDisabled",
  "colorTextPlaceholder",
  "colorTextLightSolid",
  "colorBgLayout",
  "colorBgContainer",
  "colorBgElevated",
  "colorBgSpotlight",
  "colorBorder",
  "colorBorderSecondary",
  "colorSplit",
  "colorFill",
  "colorFillSecondary",
  "colorFillTertiary",
  "colorFillQuaternary",
  "colorPrimaryHover",
  "colorPrimaryActive",
  "colorPrimaryBg",
  "colorPrimaryBgHover",
  "colorPrimaryBorder",
  "colorPrimaryBorderHover",
  "colorPrimaryText",
  "colorPrimaryTextHover",
  "colorPrimaryTextActive",
  "colorSuccessBg",
  "colorSuccessBorder",
  "colorSuccessText",
  "colorWarningBg",
  "colorWarningBorder",
  "colorWarningText",
  "colorInfoBg",
  "colorInfoBorder",
  "colorInfoText",
  "colorErrorBg",
  "colorErrorBorder",
  "colorErrorText",
  "colorIcon",
  "colorIconHover",
  "colorHighlight",
  "controlOutline",
  "controlOutlineWidth",
  "controlItemBgHover",
  "controlItemBgActive",
  "controlItemBgActiveHover",
  "controlHeightXS",
  "controlHeightSM",
  "controlHeightLG",
  "fontSizeSM",
  "fontSizeLG",
  "fontSizeXL",
  "fontSizeHeading1",
  "fontSizeHeading2",
  "fontSizeHeading3",
  "fontSizeHeading4",
  "fontSizeHeading5",
  "fontWeightStrong",
  "borderRadiusXS",
  "borderRadiusSM",
  "borderRadiusLG",
  "borderRadiusOuter",
  "paddingXXS",
  "paddingXS",
  "paddingSM",
  "padding",
  "paddingMD",
  "paddingLG",
  "paddingXL",
  "boxShadow",
  "boxShadowSecondary",
  "boxShadowTertiary",
  "motionDurationFast",
  "motionDurationMid",
  "motionDurationSlow",
] as const

// Backward-compatible alias. This list now means the exact official shadcn
// baseline; project additions live in requiredShadcnExtensionTokenNames.
export const requiredShadcnTokenNames = requiredShadcnOfficialTokenNames

export type RequiredSemanticTokenName =
  (typeof requiredSemanticTokenNames)[number]

export type RequiredMapTokenName = (typeof requiredMapTokenNames)[number]

export type RequiredShadcnTokenName = (typeof requiredShadcnTokenNames)[number]

export type RequiredShadcnExtensionTokenName =
  (typeof requiredShadcnExtensionTokenNames)[number]

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
  visualContract: {
    summary: string
    principles: string[]
    prefer: string[]
    avoid: string[]
    tokenUsage: string[]
    craft: string[]
  }
}

export type ThemeOutput = {
  seed: ThemeSeed
  mapTokens: MapTokens
  semanticTokens: SemanticTokens
  darkSemanticTokens: SemanticTokens
  shadcnTokens: ShadcnTokens
  darkShadcnTokens: ShadcnTokens
  shadcnExtensionTokens: ShadcnExtensionTokens
  darkShadcnExtensionTokens: ShadcnExtensionTokens
  antdTheme: AntdThemeAdapter
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
