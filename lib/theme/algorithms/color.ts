import type { ThemeSeed } from "../schema"
import {
  clamp,
  hexAlphaToCssColor,
  hexAlphaToOklch,
  oklch,
  oklchFromHexAlpha,
} from "./utils"

const brandLightMix = {
  50: { target: 1, amount: 0.94 },
  100: { target: 1, amount: 0.82 },
  200: { target: 1, amount: 0.66 },
  300: { target: 1, amount: 0.48 },
  400: { target: 1, amount: 0.32 },
  500: { target: 1, amount: 0.16 },
  600: { target: 1, amount: 0 },
  700: { target: 0.08, amount: 0.14 },
  800: { target: 0.08, amount: 0.32 },
  900: { target: 0.08, amount: 0.52 },
  950: { target: 0.08, amount: 0.68 },
} as const

const primaryChromaMultipliers = {
  50: 0.12,
  100: 0.22,
  200: 0.36,
  300: 0.55,
  400: 0.78,
  500: 0.95,
  600: 1,
  700: 0.92,
  800: 0.74,
  900: 0.55,
  950: 0.42,
} as const

const neutralStops = {
  50: 0.985,
  100: 0.97,
  200: 0.92,
  300: 0.86,
  400: 0.7,
  500: 0.56,
  600: 0.46,
  700: 0.37,
  800: 0.285,
  900: 0.2,
  950: 0.145,
} as const

const neutralChromaMultipliers = {
  50: 0.18,
  100: 0.26,
  200: 0.42,
  300: 0.62,
  400: 0.86,
  500: 1,
  600: 0.94,
  700: 0.82,
  800: 0.7,
  900: 0.56,
  950: 0.46,
} as const

export function deriveColorMap(seed: ThemeSeed): Record<string, string> {
  const color = seed.color
  const opaque = (value: ThemeSeed["color"]["primary"]) => ({
    ...value,
    alpha: 1,
  })
  const primaryColor = opaque(color.primary)
  const successColor = opaque(color.success)
  const warningColor = opaque(color.warning)
  const infoColor = opaque(
    color.infoMatchesPrimary ? color.primary : color.info
  )
  const dangerColor = opaque(color.danger)
  const backgroundColor = opaque(color.background)
  const foregroundColor = opaque(color.foreground)
  const neutralColor = opaque(color.neutral)
  const brand = hexAlphaToOklch(primaryColor)
  const background = hexAlphaToOklch(backgroundColor)
  const neutral = hexAlphaToOklch(neutralColor)
  const foreground = hexAlphaToOklch(foregroundColor)
  const neutralChroma = Math.min(neutral.chroma, 0.032)
  const tokens: Record<string, string> = {
    "--seed-color-primary": hexAlphaToCssColor(color.primary),
    "--seed-color-success": hexAlphaToCssColor(color.success),
    "--seed-color-warning": hexAlphaToCssColor(color.warning),
    "--seed-color-info": hexAlphaToCssColor(infoColor),
    "--seed-color-danger": hexAlphaToCssColor(color.danger),
    "--seed-color-background": hexAlphaToCssColor(color.background),
    "--seed-color-foreground": hexAlphaToCssColor(color.foreground),
    "--seed-color-neutral": hexAlphaToCssColor(color.neutral),
    "--neutral-0": oklch(
      Math.max(background.lightness, 0.96),
      Math.min(background.chroma, 0.02),
      background.hue,
      1
    ),
  }

  for (const stop of Object.keys(brandLightMix)) {
    const chromaMultiplier =
      primaryChromaMultipliers[
        Number(stop) as keyof typeof primaryChromaMultipliers
      ]
    const lightness = getBrandStopLightness(
      brand.lightness,
      Number(stop) as keyof typeof brandLightMix
    )

    tokens[`--brand-${stop}`] = oklch(
      lightness,
      brand.chroma * chromaMultiplier,
      brand.hue,
      1
    )
  }

  for (const [stop, lightness] of Object.entries(neutralStops)) {
    const chromaMultiplier =
      neutralChromaMultipliers[
        Number(stop) as keyof typeof neutralChromaMultipliers
      ]

    tokens[`--neutral-${stop}`] =
      stop === "950"
        ? oklch(
            Math.min(foreground.lightness, 0.145),
            Math.min(foreground.chroma, 0.032) * 0.46,
            foreground.hue,
            1
          )
        : oklch(
            lightness,
            neutralChroma * chromaMultiplier,
            neutral.hue,
            1
          )
  }

  const categoryChroma = clamp(brand.chroma, 0.09, 0.18)
  const categoryColors = [
    oklch(0.62, categoryChroma, brand.hue, 1),
    oklch(0.66, categoryChroma * 0.92, brand.hue + 72, 1),
    oklch(0.6, categoryChroma * 0.88, brand.hue + 144, 1),
    oklch(0.68, categoryChroma * 0.84, brand.hue + 216, 1),
    oklch(0.58, categoryChroma * 0.96, brand.hue + 288, 1),
  ] as const

  return {
    ...tokens,
    "--green-600": oklchFromHexAlpha(successColor),
    "--amber-600": oklchFromHexAlpha(warningColor),
    "--blue-600": oklchFromHexAlpha(infoColor),
    "--red-600": oklchFromHexAlpha(dangerColor),
    "--data-1": categoryColors[0],
    "--data-2": categoryColors[1],
    "--data-3": categoryColors[2],
    "--data-4": categoryColors[3],
    "--data-5": categoryColors[4],
    "--data-positive": hexAlphaToCssColor(successColor),
    "--data-negative": hexAlphaToCssColor(dangerColor),
    "--data-neutral": "var(--neutral-500)",
  }
}

export function getBrandStopLightness(
  baseLightness: number,
  stop: keyof typeof brandLightMix
): number {
  const mix = brandLightMix[stop]
  const healthyBaseLightness = clamp(baseLightness, 0.38, 0.68)
  return (
    healthyBaseLightness +
    (mix.target - healthyBaseLightness) * mix.amount
  )
}
