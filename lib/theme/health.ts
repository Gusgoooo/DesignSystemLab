import {
  requiredMapTokenNames,
  requiredSemanticTokenNames,
  requiredShadcnExtensionTokenNames,
  requiredShadcnOfficialTokenNames,
  type ThemeOutput,
} from "./schema"
import {
  shadcnExtensionAdapterMapping,
  shadcnOfficialAdapterMapping,
} from "./shadcn-adapter"

export type ThemeHealthIssue = {
  code:
    | "missing-token"
    | "unresolved-reference"
    | "invalid-color"
    | "structural-opacity"
    | "contrast"
    | "scale-order"
    | "adapter-mapping"
    | "category-collision"
    | "foreground-policy"
    | "surface-separation"
    | "typography-scale"
  mode: "light" | "dark" | "shared"
  tokens: readonly string[]
  message: string
  actual?: number | string
  minimum?: number
}

export type ThemeHealthReport = {
  version: "theme-health-v5"
  healthy: boolean
  checks: number
  issues: readonly ThemeHealthIssue[]
  minimumContrast: number | null
}

export type CoreThemeHealthReport = {
  version: "core-theme-health-v1"
  healthy: boolean
  checks: number
  issues: readonly ThemeHealthIssue[]
  minimumContrast: number | null
}

type LinearColor = {
  r: number
  g: number
  b: number
  alpha: number
}

type ContrastPair = {
  background: string
  foreground: string
  minimum: number
}

const whiteForeground = "oklch(1 0 0)"

const shadcnContrastPairs: readonly ContrastPair[] = [
  { background: "--background", foreground: "--foreground", minimum: 7 },
  { background: "--card", foreground: "--card-foreground", minimum: 7 },
  { background: "--popover", foreground: "--popover-foreground", minimum: 7 },
  { background: "--primary", foreground: "--primary-foreground", minimum: 4.5 },
  { background: "--secondary", foreground: "--secondary-foreground", minimum: 4.5 },
  { background: "--muted", foreground: "--muted-foreground", minimum: 4.5 },
  { background: "--accent", foreground: "--accent-foreground", minimum: 4.5 },
  { background: "--sidebar", foreground: "--sidebar-foreground", minimum: 7 },
  {
    background: "--sidebar-primary",
    foreground: "--sidebar-primary-foreground",
    minimum: 4.5,
  },
  {
    background: "--sidebar-accent",
    foreground: "--sidebar-accent-foreground",
    minimum: 4.5,
  },
]

const shadcnExtensionContrastPairs: readonly ContrastPair[] = [
  {
    background: "--destructive",
    foreground: "--destructive-foreground",
    minimum: 4.5,
  },
]

const semanticContrastPairs: readonly ContrastPair[] = [
  {
    background: "--surface-canvas",
    foreground: "--content-primary",
    minimum: 7,
  },
  {
    background: "--surface-panel",
    foreground: "--content-primary",
    minimum: 7,
  },
  {
    background: "--surface-raised",
    foreground: "--content-primary",
    minimum: 7,
  },
  {
    background: "--surface-overlay",
    foreground: "--content-primary",
    minimum: 7,
  },
  {
    background: "--surface-inverse",
    foreground: "--content-inverse",
    minimum: 7,
  },
  {
    background: "--action-primary",
    foreground: "--action-primary-fg",
    minimum: 4.5,
  },
  {
    background: "--action-secondary",
    foreground: "--action-secondary-fg",
    minimum: 4.5,
  },
  {
    background: "--status-success-bg",
    foreground: "--status-success-fg",
    minimum: 4.5,
  },
  {
    background: "--status-warning-bg",
    foreground: "--status-warning-fg",
    minimum: 4.5,
  },
  {
    background: "--status-info-bg",
    foreground: "--status-info-fg",
    minimum: 4.5,
  },
  {
    background: "--status-danger-bg",
    foreground: "--status-danger-fg",
    minimum: 4.5,
  },
  {
    background: "--status-success",
    foreground: "--status-success-solid-fg",
    minimum: 4.5,
  },
  {
    background: "--status-warning",
    foreground: "--status-warning-solid-fg",
    minimum: 4.5,
  },
  {
    background: "--status-info",
    foreground: "--status-info-solid-fg",
    minimum: 4.5,
  },
  {
    background: "--status-danger",
    foreground: "--status-danger-solid-fg",
    minimum: 4.5,
  },
]

const structuralColorTokens = [
  ...shadcnContrastPairs.flatMap((pair) => [pair.background, pair.foreground]),
  ...shadcnExtensionContrastPairs.flatMap((pair) => [
    pair.background,
    pair.foreground,
  ]),
  ...semanticContrastPairs.flatMap((pair) => [pair.background, pair.foreground]),
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const

const coreStructuralColorTokens = [
  ...semanticContrastPairs.flatMap((pair) => [
    pair.background,
    pair.foreground,
  ]),
  "--surface-canvas",
  "--surface-panel",
  "--surface-raised",
  "--surface-overlay",
  "--surface-inverse",
  "--content-secondary",
  "--content-tertiary",
  "--content-disabled",
  "--border-subtle",
  "--border-default",
  "--border-strong",
  "--focus-ring",
  "--action-primary-hover",
  "--action-primary-active",
  "--action-secondary-hover",
  "--data-1",
  "--data-2",
  "--data-3",
  "--data-4",
  "--data-5",
] as const

const brandScaleNames = [
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
] as const

const neutralScaleNames = [
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
] as const

export const themeHealthContract = {
  version: "theme-health-v5",
  requiredFamilies: {
    map: requiredMapTokenNames,
    semantic: requiredSemanticTokenNames,
    shadcnOfficial: requiredShadcnOfficialTokenNames,
    shadcnExtensions: requiredShadcnExtensionTokenNames,
  },
  contrast: {
    primaryContent: 7,
    controlsAndStates: 4.5,
    focusIndicator: 3,
    pairs: [
      ...shadcnContrastPairs,
      ...shadcnExtensionContrastPairs,
      ...semanticContrastPairs,
    ],
  },
  stateSurfaceSeparation: {
    sidebarAccentAgainstSidebar: 1.1,
  },
  typography: {
    compactControlToken: "--text-caption",
    compactControlMinRem: 0.75,
    compactControlMaxRem: 0.875,
    bodyToken: "--text-body",
    bodyMinRem: 0.875,
    bodyMaxRem: 1.125,
    order: [
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
    ],
    aliases: [
      ["--text-body", "--font-size-base"],
      ["--text-title", "--font-size-2xl"],
      ["--text-display", "--font-size-4xl"],
    ],
  },
  invariants: [
    "ThemeSeed is the only editable source of truth",
    "semantic colors consume algorithmic map tokens rather than bypassing the map layer",
    "official shadcn tokens stay separate from Design System Lab extensions",
    "all structural colors are opaque",
    "all CSS variable references resolve",
    "brand and neutral scales descend monotonically by luminance",
    "chart categories are opaque, distinct, and independent from status colors",
    "official shadcn adapter roles keep their canonical semantic mapping",
    "shadcn-compatible extensions keep their declared project mapping",
    "sidebar accent remains visibly distinct from the sidebar surface",
    "baseSize and scaleRatio generate the complete xs-through-6xl typography scale",
    "every generated typography size resolves to an integer pixel value",
    "compact control text stays between 12px and 14px while body text stays between 14px and 18px",
    "primary actions keep a white foreground and darken the fill when needed",
    "light and dark themes pass the same foreground/background checks",
  ],
} as const

export const coreThemeHealthContract = {
  version: "core-theme-health-v1",
  requiredFamilies: {
    map: requiredMapTokenNames,
    semantic: requiredSemanticTokenNames,
  },
  contrast: {
    primaryContent: 7,
    controlsAndStates: 4.5,
    focusIndicator: 3,
    pairs: semanticContrastPairs,
  },
  typography: themeHealthContract.typography,
  invariants: [
    "ThemeSeed is the only editable source of truth",
    "semantic colors consume algorithmic map tokens",
    "the core contract has no component-library adapter tokens",
    "all structural colors are opaque",
    "all CSS variable references resolve",
    "brand and neutral scales descend monotonically by luminance",
    "data categories are opaque and distinct",
    "baseSize and scaleRatio generate the complete integer-pixel typography scale",
    "primary actions keep a white foreground and darken the fill when needed",
    "light and dark themes pass the same semantic checks",
  ],
} as const

function clampChannel(value: number): number {
  return Math.min(Math.max(value, 0), 1)
}

function parseHexColor(value: string): LinearColor | null {
  const match = value.match(/^#([0-9a-f]{6})$/i)

  if (!match) {
    return null
  }

  const raw = match[1]
  const toLinear = (channel: number): number => {
    const normalized = channel / 255
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return {
    r: toLinear(Number.parseInt(raw.slice(0, 2), 16)),
    g: toLinear(Number.parseInt(raw.slice(2, 4), 16)),
    b: toLinear(Number.parseInt(raw.slice(4, 6), 16)),
    alpha: 1,
  }
}

function parseRgbColor(value: string): LinearColor | null {
  const match = value.match(
    /^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i
  )

  if (!match) {
    return null
  }

  const toLinear = (channel: number): number => {
    const normalized = clampChannel(channel / 255)
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return {
    r: toLinear(Number(match[1])),
    g: toLinear(Number(match[2])),
    b: toLinear(Number(match[3])),
    alpha: clampChannel(match[4] === undefined ? 1 : Number(match[4])),
  }
}

function parseOklchColor(value: string): LinearColor | null {
  const match = value.match(
    /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+(-?[\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i
  )

  if (!match) {
    return null
  }

  const lightness = Number(match[1])
  const chroma = Number(match[2])
  const hue = (Number(match[3]) * Math.PI) / 180
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b
  const l = lPrime ** 3
  const m = mPrime ** 3
  const s = sPrime ** 3

  return {
    r: clampChannel(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: clampChannel(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: clampChannel(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    alpha: clampChannel(match[4] === undefined ? 1 : Number(match[4])),
  }
}

function parseColor(value: string): LinearColor | null {
  return (
    parseHexColor(value.trim()) ??
    parseRgbColor(value.trim()) ??
    parseOklchColor(value.trim())
  )
}

function resolveTokenValue(
  tokens: Record<string, string>,
  tokenName: string,
  seen = new Set<string>()
): string | null {
  if (seen.has(tokenName)) {
    return null
  }

  const value = tokens[tokenName]

  if (value === undefined) {
    return null
  }

  const reference = value.trim().match(/^var\((--[a-z0-9-]+)\)$/i)?.[1]

  if (!reference) {
    return value
  }

  const nextSeen = new Set(seen)
  nextSeen.add(tokenName)
  return resolveTokenValue(tokens, reference, nextSeen)
}

function resolveTokenColor(
  tokens: Record<string, string>,
  tokenName: string
): LinearColor | null {
  const value = resolveTokenValue(tokens, tokenName)
  return value ? parseColor(value) : null
}

function luminance(color: LinearColor): number {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b
}

function contrastRatio(first: LinearColor, second: LinearColor): number {
  const firstLuminance = luminance(first)
  const secondLuminance = luminance(second)
  const lighter = Math.max(firstLuminance, secondLuminance)
  const darker = Math.min(firstLuminance, secondLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

function checkRequiredTokens(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  required: readonly string[],
  mode: ThemeHealthIssue["mode"],
  label: string
): number {
  let checks = 0

  for (const tokenName of required) {
    checks += 1
    if (tokens[tokenName] === undefined) {
      issues.push({
        code: "missing-token",
        mode,
        tokens: [tokenName],
        message: `${label} is missing ${tokenName}.`,
      })
    }
  }

  return checks
}

function checkReferences(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: ThemeHealthIssue["mode"]
): number {
  let checks = 0

  for (const [tokenName, value] of Object.entries(tokens)) {
    const reference = value.trim().match(/^var\((--[a-z0-9-]+)\)$/i)?.[1]

    if (!reference) {
      continue
    }

    checks += 1
    if (resolveTokenValue(tokens, tokenName) === null) {
      issues.push({
        code: "unresolved-reference",
        mode,
        tokens: [tokenName, reference],
        message: `${tokenName} cannot resolve ${reference}.`,
      })
    }
  }

  return checks
}

function checkContrastPairs(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark",
  pairs: readonly ContrastPair[]
): { checks: number; ratios: number[] } {
  const ratios: number[] = []

  for (const pair of pairs) {
    const background = resolveTokenColor(tokens, pair.background)
    const foreground = resolveTokenColor(tokens, pair.foreground)

    if (!background || !foreground) {
      issues.push({
        code: "invalid-color",
        mode,
        tokens: [pair.background, pair.foreground],
        message: `Cannot resolve a color for ${pair.background} and ${pair.foreground}.`,
      })
      continue
    }

    const ratio = contrastRatio(background, foreground)
    ratios.push(ratio)

    if (ratio + 0.001 < pair.minimum) {
      issues.push({
        code: "contrast",
        mode,
        tokens: [pair.background, pair.foreground],
        message: `${pair.background} and ${pair.foreground} have insufficient contrast.`,
        actual: Math.round(ratio * 100) / 100,
        minimum: pair.minimum,
      })
    }
  }

  return { checks: pairs.length, ratios }
}

function checkFocusContrast(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): { checks: number; ratios: number[] } {
  const ring = resolveTokenColor(tokens, "--ring")
  const surfaces = ["--background", "--card", "--popover"] as const
  const ratios: number[] = []

  if (!ring) {
    issues.push({
      code: "invalid-color",
      mode,
      tokens: ["--ring"],
      message: "Cannot resolve the focus ring color.",
    })
    return { checks: surfaces.length, ratios }
  }

  for (const surfaceName of surfaces) {
    const surface = resolveTokenColor(tokens, surfaceName)

    if (!surface) {
      issues.push({
        code: "invalid-color",
        mode,
        tokens: ["--ring", surfaceName],
        message: `Cannot resolve ${surfaceName} for focus contrast.`,
      })
      continue
    }

    const ratio = contrastRatio(ring, surface)
    ratios.push(ratio)

    if (ratio + 0.001 < 3) {
      issues.push({
        code: "contrast",
        mode,
        tokens: ["--ring", surfaceName],
        message: `Focus ring contrast is insufficient against ${surfaceName}.`,
        actual: Math.round(ratio * 100) / 100,
        minimum: 3,
      })
    }
  }

  return { checks: surfaces.length, ratios }
}

function checkSurfaceSeparation(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark",
  baseToken: string,
  stateToken: string,
  minimum: number
): { checks: number; ratios: number[] } {
  const base = resolveTokenColor(tokens, baseToken)
  const state = resolveTokenColor(tokens, stateToken)

  if (!base || !state) {
    issues.push({
      code: "invalid-color",
      mode,
      tokens: [baseToken, stateToken],
      message: `Cannot resolve ${baseToken} and ${stateToken} for state separation.`,
    })
    return { checks: 1, ratios: [] }
  }

  const ratio = contrastRatio(base, state)

  if (ratio + 0.001 < minimum) {
    issues.push({
      code: "surface-separation",
      mode,
      tokens: [baseToken, stateToken],
      message: `${stateToken} is not visibly distinct from ${baseToken}.`,
      actual: Math.round(ratio * 100) / 100,
      minimum,
    })
  }

  return { checks: 1, ratios: [ratio] }
}

function checkStructuralOpacity(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): number {
  return checkTokenOpacity(issues, tokens, mode, structuralColorTokens)
}

function checkTokenOpacity(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark",
  tokenNames: readonly string[]
): number {
  const uniqueTokens = new Set(tokenNames)

  for (const tokenName of uniqueTokens) {
    const color = resolveTokenColor(tokens, tokenName)

    if (!color) {
      continue
    }

    if (color.alpha < 0.999) {
      issues.push({
        code: "structural-opacity",
        mode,
        tokens: [tokenName],
        message: `${tokenName} must be opaque for deterministic contrast.`,
        actual: color.alpha,
        minimum: 1,
      })
    }
  }

  return uniqueTokens.size
}

function checkScaleOrder(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  names: readonly string[],
  label: string
): number {
  const values = names.map((name) => ({
    name,
    color: resolveTokenColor(tokens, name),
  }))

  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1]
    const current = values[index]

    if (!previous.color || !current.color) {
      continue
    }

    const previousLuminance = luminance(previous.color)
    const currentLuminance = luminance(current.color)

    if (previousLuminance <= currentLuminance + 0.0001) {
      issues.push({
        code: "scale-order",
        mode: "shared",
        tokens: [previous.name, current.name],
        message: `${label} must descend monotonically from light to dark.`,
        actual: `${previousLuminance.toFixed(4)} <= ${currentLuminance.toFixed(4)}`,
      })
    }
  }

  return names.length - 1
}

function parseRemToken(
  tokens: Record<string, string>,
  tokenName: string
): number | null {
  const value = resolveTokenValue(tokens, tokenName)
  const match = value?.trim().match(/^(-?[\d.]+)rem$/i)
  return match ? Number(match[1]) : null
}

function checkTypographyScale(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>
): number {
  const {
    compactControlToken,
    compactControlMinRem,
    compactControlMaxRem,
    bodyToken,
    bodyMinRem,
    bodyMaxRem,
    order,
    aliases,
  } =
    themeHealthContract.typography
  const values = order.map((tokenName) => ({
    tokenName,
    value: parseRemToken(tokens, tokenName),
  }))
  const caption = {
    tokenName: compactControlToken,
    value: parseRemToken(tokens, compactControlToken),
  }
  const body = {
    tokenName: bodyToken,
    value: parseRemToken(tokens, bodyToken),
  }
  const integerPixelValues = [
    caption,
    ...values,
  ]

  if (
    caption.value === null ||
    caption.value < compactControlMinRem ||
    caption.value > compactControlMaxRem
  ) {
    issues.push({
      code: "typography-scale",
      mode: "shared",
      tokens: [caption.tokenName],
      message: `${caption.tokenName} must stay within the compact control text range.`,
      actual:
        caption.value === null
          ? resolveTokenValue(tokens, caption.tokenName) ?? "missing"
          : `${caption.value}rem`,
      minimum: compactControlMinRem,
    })
  }

  if (
    body.value === null ||
    body.value < bodyMinRem ||
    body.value > bodyMaxRem
  ) {
    issues.push({
      code: "typography-scale",
      mode: "shared",
      tokens: [body.tokenName],
      message: `${body.tokenName} must stay within the base font size range.`,
      actual:
        body.value === null
          ? resolveTokenValue(tokens, body.tokenName) ?? "missing"
          : `${body.value}rem`,
      minimum: bodyMinRem,
    })
  }

  for (let index = 1; index < values.length; index += 1) {
    const previous = values[index - 1]
    const current = values[index]

    if (
      previous.value !== null &&
      current.value !== null &&
      previous.value >= current.value
    ) {
      issues.push({
        code: "typography-scale",
        mode: "shared",
        tokens: [previous.tokenName, current.tokenName],
        message: "Generated font-size tokens must increase from xs to 6xl.",
        actual: `${previous.value}rem >= ${current.value}rem`,
      })
    }
  }

  for (const item of integerPixelValues) {
    if (
      item.value !== null &&
      !Number.isInteger(Math.round(item.value * 16 * 10_000) / 10_000)
    ) {
      issues.push({
        code: "typography-scale",
        mode: "shared",
        tokens: [item.tokenName],
        message: `${item.tokenName} must resolve to an integer pixel value.`,
        actual: `${item.value * 16}px`,
      })
    }
  }

  for (const [semanticToken, scaleToken] of aliases) {
    const semanticValue = parseRemToken(tokens, semanticToken)
    const scaleValue = parseRemToken(tokens, scaleToken)

    if (
      semanticValue === null ||
      scaleValue === null ||
      Math.abs(semanticValue - scaleValue) > 0.0001
    ) {
      issues.push({
        code: "typography-scale",
        mode: "shared",
        tokens: [semanticToken, scaleToken],
        message: `${semanticToken} must remain an alias of ${scaleToken}.`,
        actual: `${semanticValue ?? "missing"} / ${scaleValue ?? "missing"}`,
      })
    }
  }

  return values.length + aliases.length + integerPixelValues.length + 2
}

function checkAdapterMapping(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark",
  mapping: Readonly<Record<string, string>>,
  label: string
): number {
  for (const [tokenName, expected] of Object.entries(mapping)) {
    if (tokens[tokenName] !== expected) {
      issues.push({
        code: "adapter-mapping",
        mode,
        tokens: [tokenName],
        message: `${tokenName} does not match the ${label} semantic mapping.`,
        actual: tokens[tokenName] ?? "missing",
      })
    }
  }

  return Object.keys(mapping).length
}

function checkCategoryColors(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): number {
  const names = [
    "--chart-1",
    "--chart-2",
    "--chart-3",
    "--chart-4",
    "--chart-5",
  ] as const
  const values = names.map((name) => resolveTokenValue(tokens, name))
  const uniqueValues = new Set(values.filter((value) => value !== null))

  if (uniqueValues.size !== names.length) {
    issues.push({
      code: "category-collision",
      mode,
      tokens: names,
      message: "Chart category colors must resolve to five distinct values.",
      actual: uniqueValues.size,
      minimum: names.length,
    })
  }

  return names.length
}

function checkPrimaryActionForeground(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): number {
  const foreground = resolveTokenValue(tokens, "--primary-foreground")

  if (foreground !== whiteForeground) {
    issues.push({
      code: "foreground-policy",
      mode,
      tokens: ["--primary", "--primary-foreground"],
      message: "Primary actions must use white text; adjust the fill instead.",
      actual: foreground ?? "missing",
    })
  }

  return 1
}

function checkCoreFocusContrast(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): { checks: number; ratios: number[] } {
  const ring = resolveTokenColor(tokens, "--focus-ring")
  const surfaces = [
    "--surface-canvas",
    "--surface-panel",
    "--surface-raised",
  ] as const
  const ratios: number[] = []

  if (!ring) {
    issues.push({
      code: "invalid-color",
      mode,
      tokens: ["--focus-ring"],
      message: "Cannot resolve the core focus ring color.",
    })
    return { checks: surfaces.length, ratios }
  }

  for (const surfaceName of surfaces) {
    const surface = resolveTokenColor(tokens, surfaceName)

    if (!surface) {
      issues.push({
        code: "invalid-color",
        mode,
        tokens: ["--focus-ring", surfaceName],
        message: `Cannot resolve ${surfaceName} for focus contrast.`,
      })
      continue
    }

    const ratio = contrastRatio(ring, surface)
    ratios.push(ratio)

    if (ratio + 0.001 < 3) {
      issues.push({
        code: "contrast",
        mode,
        tokens: ["--focus-ring", surfaceName],
        message: `Core focus ring contrast is insufficient against ${surfaceName}.`,
        actual: Math.round(ratio * 100) / 100,
        minimum: 3,
      })
    }
  }

  return { checks: surfaces.length, ratios }
}

function checkCoreCategoryColors(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): number {
  const names = [
    "--data-1",
    "--data-2",
    "--data-3",
    "--data-4",
    "--data-5",
  ] as const
  const values = names.map((name) => resolveTokenValue(tokens, name))
  const uniqueValues = new Set(values.filter((value) => value !== null))

  if (uniqueValues.size !== names.length) {
    issues.push({
      code: "category-collision",
      mode,
      tokens: names,
      message: "Core data category colors must resolve to five distinct values.",
      actual: uniqueValues.size,
      minimum: names.length,
    })
  }

  return names.length
}

function checkCorePrimaryActionForeground(
  issues: ThemeHealthIssue[],
  tokens: Record<string, string>,
  mode: "light" | "dark"
): number {
  const foreground = resolveTokenValue(tokens, "--action-primary-fg")

  if (foreground !== whiteForeground) {
    issues.push({
      code: "foreground-policy",
      mode,
      tokens: ["--action-primary", "--action-primary-fg"],
      message: "Core primary actions must use white text; adjust the fill instead.",
      actual: foreground ?? "missing",
    })
  }

  return 1
}

export function createThemeHealthReport(theme: ThemeOutput): ThemeHealthReport {
  const issues: ThemeHealthIssue[] = []
  let checks = 0
  const ratios: number[] = []

  checks += checkRequiredTokens(
    issues,
    theme.mapTokens,
    requiredMapTokenNames,
    "shared",
    "Map token layer"
  )
  checks += checkRequiredTokens(
    issues,
    theme.semanticTokens,
    requiredSemanticTokenNames,
    "light",
    "Light semantic layer"
  )
  checks += checkRequiredTokens(
    issues,
    theme.darkSemanticTokens,
    requiredSemanticTokenNames,
    "dark",
    "Dark semantic layer"
  )
  checks += checkRequiredTokens(
    issues,
    theme.shadcnTokens,
    requiredShadcnOfficialTokenNames,
    "light",
    "Light shadcn adapter"
  )
  checks += checkRequiredTokens(
    issues,
    theme.darkShadcnTokens,
    requiredShadcnOfficialTokenNames,
    "dark",
    "Dark shadcn adapter"
  )
  checks += checkRequiredTokens(
    issues,
    theme.shadcnExtensionTokens,
    requiredShadcnExtensionTokenNames,
    "light",
    "Light shadcn extension adapter"
  )
  checks += checkRequiredTokens(
    issues,
    theme.darkShadcnExtensionTokens,
    requiredShadcnExtensionTokenNames,
    "dark",
    "Dark shadcn extension adapter"
  )
  checks += checkReferences(issues, theme.cssVariables, "light")
  checks += checkReferences(issues, theme.darkCssVariables, "dark")
  checks += checkAdapterMapping(
    issues,
    theme.shadcnTokens,
    "light",
    shadcnOfficialAdapterMapping,
    "official shadcn"
  )
  checks += checkAdapterMapping(
    issues,
    theme.darkShadcnTokens,
    "dark",
    shadcnOfficialAdapterMapping,
    "official shadcn"
  )
  checks += checkAdapterMapping(
    issues,
    theme.shadcnExtensionTokens,
    "light",
    shadcnExtensionAdapterMapping,
    "shadcn extension"
  )
  checks += checkAdapterMapping(
    issues,
    theme.darkShadcnExtensionTokens,
    "dark",
    shadcnExtensionAdapterMapping,
    "shadcn extension"
  )
  checks += checkScaleOrder(issues, theme.cssVariables, brandScaleNames, "Brand scale")
  checks += checkScaleOrder(issues, theme.cssVariables, neutralScaleNames, "Neutral scale")
  checks += checkTypographyScale(issues, theme.cssVariables)

  for (const [mode, tokens] of [
    ["light", theme.cssVariables],
    ["dark", theme.darkCssVariables],
  ] as const) {
    const pairResult = checkContrastPairs(
      issues,
      tokens,
      mode,
      [
        ...shadcnContrastPairs,
        ...shadcnExtensionContrastPairs,
        ...semanticContrastPairs,
      ]
    )
    const focusResult = checkFocusContrast(issues, tokens, mode)
    const sidebarSeparation = checkSurfaceSeparation(
      issues,
      tokens,
      mode,
      "--sidebar",
      "--sidebar-accent",
      themeHealthContract.stateSurfaceSeparation.sidebarAccentAgainstSidebar
    )
    checks +=
      pairResult.checks + focusResult.checks + sidebarSeparation.checks
    ratios.push(
      ...pairResult.ratios,
      ...focusResult.ratios
    )
    checks += checkStructuralOpacity(issues, tokens, mode)
    checks += checkCategoryColors(issues, tokens, mode)
    checks += checkPrimaryActionForeground(issues, tokens, mode)
  }

  return {
    version: "theme-health-v5",
    healthy: issues.length === 0,
    checks,
    issues,
    minimumContrast:
      ratios.length > 0
        ? Math.round(Math.min(...ratios) * 100) / 100
        : null,
  }
}

export function createCoreThemeHealthReport(
  theme: ThemeOutput
): CoreThemeHealthReport {
  const issues: ThemeHealthIssue[] = []
  let checks = 0
  const ratios: number[] = []
  const lightTokens = {
    ...theme.mapTokens,
    ...theme.semanticTokens,
  }
  const darkTokens = {
    ...theme.mapTokens,
    ...theme.darkSemanticTokens,
  }

  checks += checkRequiredTokens(
    issues,
    theme.mapTokens,
    requiredMapTokenNames,
    "shared",
    "Core map token layer"
  )
  checks += checkRequiredTokens(
    issues,
    theme.semanticTokens,
    requiredSemanticTokenNames,
    "light",
    "Core light semantic layer"
  )
  checks += checkRequiredTokens(
    issues,
    theme.darkSemanticTokens,
    requiredSemanticTokenNames,
    "dark",
    "Core dark semantic layer"
  )
  checks += checkReferences(issues, lightTokens, "light")
  checks += checkReferences(issues, darkTokens, "dark")
  checks += checkScaleOrder(issues, lightTokens, brandScaleNames, "Brand scale")
  checks += checkScaleOrder(
    issues,
    lightTokens,
    neutralScaleNames,
    "Neutral scale"
  )
  checks += checkTypographyScale(issues, lightTokens)

  for (const [mode, tokens] of [
    ["light", lightTokens],
    ["dark", darkTokens],
  ] as const) {
    const pairResult = checkContrastPairs(
      issues,
      tokens,
      mode,
      semanticContrastPairs
    )
    const focusResult = checkCoreFocusContrast(issues, tokens, mode)

    checks += pairResult.checks + focusResult.checks
    ratios.push(...pairResult.ratios, ...focusResult.ratios)
    checks += checkTokenOpacity(
      issues,
      tokens,
      mode,
      coreStructuralColorTokens
    )
    checks += checkCoreCategoryColors(issues, tokens, mode)
    checks += checkCorePrimaryActionForeground(issues, tokens, mode)
  }

  return {
    version: "core-theme-health-v1",
    healthy: issues.length === 0,
    checks,
    issues,
    minimumContrast:
      ratios.length > 0
        ? Math.round(Math.min(...ratios) * 100) / 100
        : null,
  }
}

export function assertThemeHealth(theme: ThemeOutput, label: string): void {
  const report = createThemeHealthReport(theme)

  if (!report.healthy) {
    const details = report.issues
      .map((issue) => `${issue.mode}:${issue.code}:${issue.tokens.join("+")}`)
      .join(", ")
    throw new Error(`${label} failed theme health checks: ${details}`)
  }
}

export function assertCoreThemeHealth(
  theme: ThemeOutput,
  label: string
): void {
  const report = createCoreThemeHealthReport(theme)

  if (!report.healthy) {
    const details = report.issues
      .map((issue) => `${issue.mode}:${issue.code}:${issue.tokens.join("+")}`)
      .join(", ")
    throw new Error(`${label} failed core theme health checks: ${details}`)
  }
}
