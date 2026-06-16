import {
  requiredSemanticTokenNames,
  type ThemeSeed,
} from "./schema"
import { clamp, hexAlphaToOklch, oklch } from "./algorithms/utils"

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

function getSurfaceHue(seed: ThemeSeed, neutralHue: number, primaryHue: number) {
  if (seed.vibe.temperature === "neutral") {
    return neutralHue
  }

  return primaryHue
}

export function deriveSemanticTokens(
  seed: ThemeSeed
): Record<string, string> {
  const neutral = hexAlphaToOklch(seed.color.neutral)
  const background = hexAlphaToOklch(seed.color.background)
  const primary = hexAlphaToOklch(seed.color.primary)
  const surfaceRatio =
    clamp(seed.material.surfaceContrast, 0.75, 1.35) *
    getExpressionSurfaceRatio(seed)
  const neutralChroma = Math.min(neutral.chroma, 0.08)
  const softNeutralChroma = Math.min(neutralChroma * 0.22, 0.016)
  const borderStrength = clamp(seed.material.borderContrast, 0.6, 1.6)
  const surfaceHue = getSurfaceHue(seed, neutral.hue, primary.hue)
  const surfaceChroma = clamp(
    softNeutralChroma +
      primary.chroma *
        (seed.vibe.expression === "expressive"
          ? 0.03
          : seed.vibe.expression === "balanced"
            ? 0.02
            : 0.012),
    0.004,
    0.026
  )
  const canvasSurface = oklch(
    background.lightness - 0.012 * surfaceRatio,
    surfaceChroma * 0.8,
    surfaceHue,
    background.alpha
  )
  const panelSurface = oklch(
    background.lightness - (0.032 * surfaceRatio + 0.012),
    surfaceChroma,
    surfaceHue,
    background.alpha
  )
  const raisedSurface = oklch(
    background.lightness - 0.004 * surfaceRatio,
    surfaceChroma * 0.35,
    surfaceHue,
    background.alpha
  )
  const overlaySurface = oklch(
    background.lightness - 0.002 * surfaceRatio,
    surfaceChroma * 0.28,
    surfaceHue,
    background.alpha
  )
  const success = hexAlphaToOklch(seed.color.success)
  const warning = hexAlphaToOklch(seed.color.warning)
  const info = hexAlphaToOklch(
    seed.color.infoMatchesPrimary ? seed.color.primary : seed.color.info
  )
  const danger = hexAlphaToOklch(seed.color.danger)

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
    "--focus-ring": "var(--brand-400)",
    "--action-primary": "var(--brand-600)",
    "--action-primary-hover": "var(--brand-700)",
    "--action-primary-active": "var(--brand-800)",
    "--action-primary-fg": "var(--neutral-0)",
    "--action-secondary": oklch(0.97, softNeutralChroma, neutral.hue),
    "--action-secondary-hover": oklch(0.94, softNeutralChroma, neutral.hue),
    "--action-secondary-fg": "var(--neutral-950)",
    "--status-success": "var(--green-600)",
    "--status-success-bg": oklch(0.96, Math.max(success.chroma * 0.24, 0.025), success.hue),
    "--status-success-fg": oklch(0.28, Math.max(success.chroma * 0.72, 0.08), success.hue),
    "--status-warning": "var(--amber-600)",
    "--status-warning-bg": oklch(0.97, Math.max(warning.chroma * 0.24, 0.03), warning.hue),
    "--status-warning-fg": oklch(0.34, Math.max(warning.chroma * 0.72, 0.08), warning.hue),
    "--status-info": "var(--blue-600)",
    "--status-info-bg": oklch(0.96, Math.max(info.chroma * 0.24, 0.03), info.hue),
    "--status-info-fg": oklch(0.3, Math.max(info.chroma * 0.72, 0.08), info.hue),
    "--status-danger": "var(--red-600)",
    "--status-danger-bg": oklch(0.96, Math.max(danger.chroma * 0.24, 0.035), danger.hue),
    "--status-danger-fg": oklch(0.34, Math.max(danger.chroma * 0.72, 0.09), danger.hue),
  }

  assertRequiredTokens(tokens, requiredSemanticTokenNames, "semantic tokens")

  return tokens
}

export function deriveDarkSemanticTokens(
  seed: ThemeSeed
): Record<string, string> {
  const neutral = hexAlphaToOklch(seed.color.neutral)
  const primary = hexAlphaToOklch(seed.color.primary)
  const success = hexAlphaToOklch(seed.color.success)
  const warning = hexAlphaToOklch(seed.color.warning)
  const info = hexAlphaToOklch(
    seed.color.infoMatchesPrimary ? seed.color.primary : seed.color.info
  )
  const danger = hexAlphaToOklch(seed.color.danger)
  const neutralHue = neutral.hue
  const neutralChroma = Math.min(neutral.chroma, 0.08)
  const softNeutralChroma = Math.min(neutralChroma * 0.22, 0.018)
  const borderStrength = clamp(seed.material.borderContrast, 0.6, 1.6)
  const surfaceRatio =
    clamp(seed.material.surfaceContrast, 0.75, 1.35) *
    getExpressionSurfaceRatio(seed)
  const surfaceHue = getSurfaceHue(seed, neutralHue, primary.hue)
  const surfaceChroma = clamp(
    softNeutralChroma +
      primary.chroma *
        (seed.vibe.expression === "expressive"
          ? 0.026
          : seed.vibe.expression === "balanced"
            ? 0.016
            : 0.01),
    0.006,
    0.03
  )
  const canvasLightness = clamp(0.13 + (1 - surfaceRatio) * 0.008, 0.11, 0.16)
  const panelLightness = clamp(
    canvasLightness + 0.05 * surfaceRatio,
    0.17,
    0.24
  )
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
    "--focus-ring": "var(--brand-400)",
    "--action-primary": "var(--brand-400)",
    "--action-primary-hover": "var(--brand-300)",
    "--action-primary-active": "var(--brand-500)",
    "--action-primary-fg": "var(--neutral-950)",
    "--action-secondary": oklch(0.24, softNeutralChroma, neutralHue),
    "--action-secondary-hover": oklch(0.3, softNeutralChroma, neutralHue),
    "--action-secondary-fg": "var(--neutral-50)",
    "--status-success": oklch(0.72, Math.max(success.chroma * 0.8, 0.1), success.hue),
    "--status-success-bg": oklch(0.23, Math.max(success.chroma * 0.32, 0.045), success.hue),
    "--status-success-fg": oklch(0.88, Math.max(success.chroma * 0.38, 0.055), success.hue),
    "--status-warning": oklch(0.78, Math.max(warning.chroma * 0.8, 0.1), warning.hue),
    "--status-warning-bg": oklch(0.25, Math.max(warning.chroma * 0.32, 0.045), warning.hue),
    "--status-warning-fg": oklch(0.9, Math.max(warning.chroma * 0.38, 0.055), warning.hue),
    "--status-info": oklch(0.72, Math.max(info.chroma * 0.8, 0.1), info.hue),
    "--status-info-bg": oklch(0.23, Math.max(info.chroma * 0.32, 0.045), info.hue),
    "--status-info-fg": oklch(0.88, Math.max(info.chroma * 0.38, 0.055), info.hue),
    "--status-danger": oklch(0.72, Math.max(danger.chroma * 0.8, 0.1), danger.hue),
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
