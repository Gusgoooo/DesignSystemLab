import {
  requiredMapTokenNames,
  requiredSemanticTokenNames,
  type ThemeSeed,
} from "./schema"
import {
  clamp,
  oklch,
  parseOklchColor,
  relativeLuminanceFromOklch,
  type OklchColor,
} from "./algorithms/utils"

const whiteForeground = "oklch(1 0 0)" as const

export function getMissingTokens(
  tokens: Record<string, string>,
  required: readonly string[]
): string[] {
  return required.filter((tokenName) => tokens[tokenName] === undefined)
}

export function assertRequiredTokens(
  tokens: Record<string, string>,
  required: readonly string[],
  label: string
): void {
  const missing = getMissingTokens(tokens, required)

  if (missing.length > 0) {
    throw new Error(`${label} is missing required tokens: ${missing.join(", ")}`)
  }
}

function getExpressionSurfaceRatio(seed: ThemeSeed): number {
  if (seed.vibe.expression === "minimal") {
    return 0.9
  }

  if (seed.vibe.expression === "expressive") {
    return 1.12
  }

  return 1
}

function createWhiteTextPalette(
  color: OklchColor,
  preferredLightness: number
): { base: string; hover: string; active: string; foreground: typeof whiteForeground } {
  const chroma = clamp(color.chroma, 0, 0.2)
  let lightness = clamp(preferredLightness, 0.36, 0.62)

  while (
    1.05 / (relativeLuminanceFromOklch(lightness, chroma, color.hue) + 0.05) <
      4.5 &&
    lightness > 0.3
  ) {
    lightness -= 0.005
  }

  return {
    base: oklch(lightness, chroma, color.hue),
    hover: oklch(Math.max(lightness - 0.045, 0.28), chroma * 0.96, color.hue),
    active: oklch(Math.max(lightness - 0.085, 0.24), chroma * 0.9, color.hue),
    foreground: whiteForeground,
  }
}

function readMapColor(
  mapTokens: Record<string, string>,
  tokenName: string
): OklchColor {
  const value = mapTokens[tokenName]
  const color = value ? parseOklchColor(value) : null

  if (!color) {
    throw new Error(
      `Semantic generation requires an OKLCH map token at ${tokenName}.`
    )
  }

  return color
}

export function deriveSemanticTokens(
  seed: ThemeSeed,
  mapTokens: Record<string, string>
): Record<string, string> {
  assertRequiredTokens(mapTokens, requiredMapTokenNames, "semantic map input")
  const neutral = readMapColor(mapTokens, "--neutral-500")
  const rawBackground = readMapColor(mapTokens, "--neutral-0")
  const background = {
    ...rawBackground,
    lightness: Math.max(rawBackground.lightness, 0.96),
    chroma: Math.min(rawBackground.chroma, 0.02),
    alpha: 1,
  }
  const primary = readMapColor(mapTokens, "--brand-600")
  const surfaceRatio =
    clamp(seed.material.surfaceContrast, 0.75, 1.35) *
    getExpressionSurfaceRatio(seed)
  const neutralChroma = Math.min(neutral.chroma, 0.032)
  const softNeutralChroma = Math.min(neutralChroma * 0.34, 0.014)
  const borderStrength = clamp(seed.material.borderContrast, 0.6, 1.6)
  const surfaceHue = neutral.hue
  const surfaceChroma = softNeutralChroma
  const canvasSurface = oklch(
    background.lightness - 0.012 * surfaceRatio,
    surfaceChroma * 0.8,
    surfaceHue
  )
  const panelLightness =
    background.lightness - (0.032 * surfaceRatio + 0.012)
  const panelSurface = oklch(panelLightness, surfaceChroma, surfaceHue)
  const secondaryHoverLightness = clamp(
    panelLightness - 0.05,
    0.86,
    0.9
  )
  const raisedSurface = oklch(
    background.lightness - 0.004 * surfaceRatio,
    surfaceChroma * 0.35,
    surfaceHue
  )
  const overlaySurface = oklch(
    background.lightness - 0.002 * surfaceRatio,
    surfaceChroma * 0.28,
    surfaceHue
  )
  const success = readMapColor(mapTokens, "--green-600")
  const warning = readMapColor(mapTokens, "--amber-600")
  const info = readMapColor(mapTokens, "--blue-600")
  const danger = readMapColor(mapTokens, "--red-600")
  const primaryAction = createWhiteTextPalette(primary, primary.lightness)
  const successSolid = createWhiteTextPalette(success, success.lightness)
  const warningSolid = createWhiteTextPalette(warning, warning.lightness)
  const infoSolid = createWhiteTextPalette(info, info.lightness)
  const dangerSolid = createWhiteTextPalette(danger, danger.lightness)

  const tokens: Record<string, string> = {
    "--surface-canvas": canvasSurface,
    "--surface-panel": panelSurface,
    "--surface-raised": raisedSurface,
    "--surface-overlay": overlaySurface,
    "--surface-inverse": "var(--neutral-950)",
    "--content-primary": "var(--neutral-950)",
    "--content-secondary": "var(--neutral-700)",
    "--content-tertiary": "var(--neutral-500)",
    "--content-disabled": "var(--neutral-300)",
    "--content-inverse": "var(--neutral-0)",
    "--border-subtle": oklch(0.97 - (borderStrength - 1) * 0.08, neutralChroma, neutral.hue),
    "--border-default": oklch(0.92 - (borderStrength - 1) * 0.1, neutralChroma, neutral.hue),
    "--border-strong": oklch(0.86 - (borderStrength - 1) * 0.12, neutralChroma, neutral.hue),
    "--focus-ring": oklch(
      clamp(primary.lightness, 0.42, 0.52),
      clamp(primary.chroma, 0.08, 0.22),
      primary.hue
    ),
    "--action-primary": primaryAction.base,
    "--action-primary-hover": primaryAction.hover,
    "--action-primary-active": primaryAction.active,
    "--action-primary-fg": primaryAction.foreground,
    "--action-secondary": oklch(0.97, softNeutralChroma, neutral.hue),
    "--action-secondary-hover": oklch(
      secondaryHoverLightness,
      Math.max(softNeutralChroma, surfaceChroma * 0.8),
      neutral.hue
    ),
    "--action-secondary-fg": "var(--neutral-950)",
    "--status-success": successSolid.base,
    "--status-success-solid-fg": successSolid.foreground,
    "--status-success-bg": oklch(0.96, Math.max(success.chroma * 0.24, 0.025), success.hue),
    "--status-success-fg": oklch(0.28, Math.max(success.chroma * 0.72, 0.08), success.hue),
    "--status-warning": warningSolid.base,
    "--status-warning-solid-fg": warningSolid.foreground,
    "--status-warning-bg": oklch(0.97, Math.max(warning.chroma * 0.24, 0.03), warning.hue),
    "--status-warning-fg": oklch(0.34, Math.max(warning.chroma * 0.72, 0.08), warning.hue),
    "--status-info": infoSolid.base,
    "--status-info-solid-fg": infoSolid.foreground,
    "--status-info-bg": oklch(0.96, Math.max(info.chroma * 0.24, 0.03), info.hue),
    "--status-info-fg": oklch(0.3, Math.max(info.chroma * 0.72, 0.08), info.hue),
    "--status-danger": dangerSolid.base,
    "--status-danger-solid-fg": dangerSolid.foreground,
    "--status-danger-bg": oklch(0.96, Math.max(danger.chroma * 0.24, 0.035), danger.hue),
    "--status-danger-fg": oklch(0.34, Math.max(danger.chroma * 0.72, 0.09), danger.hue),
  }

  assertRequiredTokens(tokens, requiredSemanticTokenNames, "semantic tokens")

  return tokens
}

export function deriveDarkSemanticTokens(
  seed: ThemeSeed,
  mapTokens: Record<string, string>
): Record<string, string> {
  assertRequiredTokens(mapTokens, requiredMapTokenNames, "dark semantic map input")
  const neutral = readMapColor(mapTokens, "--neutral-500")
  const primary = readMapColor(mapTokens, "--brand-600")
  const success = readMapColor(mapTokens, "--green-600")
  const warning = readMapColor(mapTokens, "--amber-600")
  const info = readMapColor(mapTokens, "--blue-600")
  const danger = readMapColor(mapTokens, "--red-600")
  const neutralHue = neutral.hue
  const neutralChroma = Math.min(neutral.chroma, 0.032)
  const softNeutralChroma = Math.min(neutralChroma * 0.34, 0.016)
  const borderStrength = clamp(seed.material.borderContrast, 0.6, 1.6)
  const surfaceRatio =
    clamp(seed.material.surfaceContrast, 0.75, 1.35) *
    getExpressionSurfaceRatio(seed)
  const surfaceHue = neutralHue
  const surfaceChroma = softNeutralChroma
  const canvasLightness = clamp(0.13 + (1 - surfaceRatio) * 0.008, 0.11, 0.16)
  const panelLightness = clamp(
    canvasLightness + 0.05 * surfaceRatio,
    0.17,
    0.24
  )
  const primaryAction = createWhiteTextPalette(
    primary,
    Math.max(primary.lightness, 0.56)
  )
  const successSolid = createWhiteTextPalette(success, 0.56)
  const warningSolid = createWhiteTextPalette(warning, 0.56)
  const infoSolid = createWhiteTextPalette(info, 0.56)
  const dangerSolid = createWhiteTextPalette(danger, 0.56)
  const tokens: Record<string, string> = {
    "--surface-canvas": oklch(canvasLightness, surfaceChroma * 0.8, surfaceHue),
    "--surface-panel": oklch(panelLightness, surfaceChroma, surfaceHue),
    "--surface-raised": oklch(
      panelLightness + 0.022 * surfaceRatio,
      surfaceChroma * 0.92,
      surfaceHue
    ),
    "--surface-overlay": oklch(
      panelLightness + 0.05 * surfaceRatio,
      surfaceChroma,
      surfaceHue
    ),
    "--surface-inverse": "var(--neutral-0)",
    "--content-primary": "var(--neutral-50)",
    "--content-secondary": oklch(0.72, neutralChroma, neutralHue),
    "--content-tertiary": oklch(0.58, neutralChroma, neutralHue),
    "--content-disabled": oklch(0.42, neutralChroma, neutralHue),
    "--content-inverse": "var(--neutral-950)",
    "--border-subtle": oklch(0.24 + (borderStrength - 1) * 0.06, neutralChroma, neutralHue),
    "--border-default": oklch(0.3 + (borderStrength - 1) * 0.07, neutralChroma, neutralHue),
    "--border-strong": oklch(0.38 + (borderStrength - 1) * 0.08, neutralChroma, neutralHue),
    "--focus-ring": oklch(
      clamp(primary.lightness, 0.68, 0.76),
      clamp(primary.chroma, 0.08, 0.2),
      primary.hue
    ),
    "--action-primary": primaryAction.base,
    "--action-primary-hover": primaryAction.hover,
    "--action-primary-active": primaryAction.active,
    "--action-primary-fg": primaryAction.foreground,
    "--action-secondary": oklch(0.24, softNeutralChroma, neutralHue),
    "--action-secondary-hover": oklch(0.3, softNeutralChroma, neutralHue),
    "--action-secondary-fg": "var(--neutral-50)",
    "--status-success": successSolid.base,
    "--status-success-solid-fg": successSolid.foreground,
    "--status-success-bg": oklch(0.23, Math.max(success.chroma * 0.32, 0.045), success.hue),
    "--status-success-fg": oklch(0.88, Math.max(success.chroma * 0.38, 0.055), success.hue),
    "--status-warning": warningSolid.base,
    "--status-warning-solid-fg": warningSolid.foreground,
    "--status-warning-bg": oklch(0.25, Math.max(warning.chroma * 0.32, 0.045), warning.hue),
    "--status-warning-fg": oklch(0.9, Math.max(warning.chroma * 0.38, 0.055), warning.hue),
    "--status-info": infoSolid.base,
    "--status-info-solid-fg": infoSolid.foreground,
    "--status-info-bg": oklch(0.23, Math.max(info.chroma * 0.32, 0.045), info.hue),
    "--status-info-fg": oklch(0.88, Math.max(info.chroma * 0.38, 0.055), info.hue),
    "--status-danger": dangerSolid.base,
    "--status-danger-solid-fg": dangerSolid.foreground,
    "--status-danger-bg": oklch(0.23, Math.max(danger.chroma * 0.32, 0.055), danger.hue),
    "--status-danger-fg": oklch(0.88, Math.max(danger.chroma * 0.38, 0.06), danger.hue),
  }

  assertRequiredTokens(
    tokens,
    requiredSemanticTokenNames,
    "dark semantic tokens"
  )

  return tokens
}
