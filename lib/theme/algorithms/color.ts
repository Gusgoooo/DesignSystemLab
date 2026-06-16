import type { ThemeSeed } from "../schema"
import {
  hexAlphaToCssColor,
  hexAlphaToOklch,
  oklch,
  oklchFromHexAlpha,
} from "./utils"

const brandStops = {
  50: 0.97,
  100: 0.93,
  200: 0.87,
  300: 0.78,
  400: 0.68,
  500: 0.6,
  600: 0.53,
  700: 0.46,
  800: 0.38,
  900: 0.3,
  950: 0.22,
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
  500: 0.56,
  700: 0.37,
  900: 0.2,
  950: 0.145,
} as const

export function deriveColorMap(seed: ThemeSeed): Record<string, string> {
  const color = seed.color
  const infoColor = color.infoMatchesPrimary ? color.primary : color.info
  const brand = hexAlphaToOklch(color.primary)
  const neutral = hexAlphaToOklch(color.neutral)
  const neutralChroma = Math.min(neutral.chroma, 0.08)
  const tokens: Record<string, string> = {
    "--seed-color-primary": hexAlphaToCssColor(color.primary),
    "--seed-color-success": hexAlphaToCssColor(color.success),
    "--seed-color-warning": hexAlphaToCssColor(color.warning),
    "--seed-color-info": hexAlphaToCssColor(infoColor),
    "--seed-color-danger": hexAlphaToCssColor(color.danger),
    "--seed-color-background": hexAlphaToCssColor(color.background),
    "--seed-color-foreground": hexAlphaToCssColor(color.foreground),
    "--seed-color-neutral": hexAlphaToCssColor(color.neutral),
    "--neutral-0": hexAlphaToCssColor(color.background),
  }

  for (const [stop, lightness] of Object.entries(brandStops)) {
    const chromaMultiplier =
      primaryChromaMultipliers[
        Number(stop) as keyof typeof primaryChromaMultipliers
      ]
    const isBaseStop = stop === "600"

    tokens[`--brand-${stop}`] = oklch(
      isBaseStop ? brand.lightness : lightness + (brand.lightness - 0.53) * 0.28,
      brand.chroma * chromaMultiplier,
      brand.hue,
      brand.alpha
    )
  }

  for (const [stop, lightness] of Object.entries(neutralStops)) {
    tokens[`--neutral-${stop}`] =
      stop === "950"
        ? hexAlphaToCssColor(color.foreground)
        : oklch(lightness, neutralChroma, neutral.hue, neutral.alpha)
  }

  return {
    ...tokens,
    "--green-600": oklchFromHexAlpha(color.success),
    "--amber-600": oklchFromHexAlpha(color.warning),
    "--blue-600": oklchFromHexAlpha(infoColor),
    "--red-600": oklchFromHexAlpha(color.danger),
    "--data-1": hexAlphaToCssColor(color.primary),
    "--data-2": hexAlphaToCssColor(infoColor),
    "--data-3": hexAlphaToCssColor(color.success),
    "--data-4": hexAlphaToCssColor(color.warning),
    "--data-5": hexAlphaToCssColor(color.danger),
    "--data-positive": hexAlphaToCssColor(color.success),
    "--data-negative": hexAlphaToCssColor(color.danger),
    "--data-neutral": "var(--neutral-500)",
  }
}
