import type { ThemeSeed } from "../schema"
import { clamp, rem, round } from "./utils"

function em(value: number): string {
  return `${round(value)}em`
}

function integerPxRem(value: number): string {
  return rem(Math.round(value) / 16)
}

export function deriveTypographyMap(seed: ThemeSeed): Record<string, string> {
  const baseSize = Number.isFinite(seed.typography.baseSize)
    ? seed.typography.baseSize
    : 16
  const basePx = clamp(Math.round(baseSize), 14, 18)
  const ratio = clamp(seed.typography.scaleRatio, 1.12, 1.28)
  const scaleBias = ratio / 1.2
  const xsPx = Math.min(
    Math.round(clamp(basePx * 0.75 / scaleBias, 12, basePx - 2)),
    basePx - 2
  )
  const smPx = clamp(
    Math.round(
      clamp(
        basePx * 0.875 / Math.sqrt(scaleBias),
        xsPx + 1,
        basePx - 1
      )
    ),
    xsPx + 1,
    basePx - 1
  )
  const rawUpperScale = [
    basePx * 1.125 * Math.sqrt(scaleBias),
    basePx * 1.25 * scaleBias,
    basePx * 1.5 * scaleBias ** 1.5,
    basePx * 1.875 * scaleBias ** 2,
    basePx * 2.25 * scaleBias ** 2.5,
    basePx * 3 * scaleBias ** 3,
    basePx * 3.75 * scaleBias ** 3.5,
  ]
  const upperScalePx = rawUpperScale.reduce<number[]>((sizes, rawSize) => {
    const previous = sizes.at(-1) ?? basePx
    sizes.push(Math.max(Math.round(rawSize), previous + 1))
    return sizes
  }, [])
  const fontSizesPx = {
    xs: xsPx,
    sm: smPx,
    base: basePx,
    lg: upperScalePx[0],
    xl: upperScalePx[1],
    "2xl": upperScalePx[2],
    "3xl": upperScalePx[3],
    "4xl": upperScalePx[4],
    "5xl": upperScalePx[5],
    "6xl": upperScalePx[6],
  }
  const captionPx = clamp(Math.round(basePx * 0.8125), 12, 14)

  return {
    "--font-family-sans": seed.typography.sans,
    "--font-family-mono": seed.typography.mono,
    "--font-size-xs": integerPxRem(fontSizesPx.xs),
    "--font-size-sm": integerPxRem(fontSizesPx.sm),
    "--font-size-base": integerPxRem(fontSizesPx.base),
    "--font-size-lg": integerPxRem(fontSizesPx.lg),
    "--font-size-xl": integerPxRem(fontSizesPx.xl),
    "--font-size-2xl": integerPxRem(fontSizesPx["2xl"]),
    "--font-size-3xl": integerPxRem(fontSizesPx["3xl"]),
    "--font-size-4xl": integerPxRem(fontSizesPx["4xl"]),
    "--font-size-5xl": integerPxRem(fontSizesPx["5xl"]),
    "--font-size-6xl": integerPxRem(fontSizesPx["6xl"]),
    "--text-caption": integerPxRem(captionPx),
    "--text-body": "var(--font-size-base)",
    "--text-title": "var(--font-size-2xl)",
    "--text-display": "var(--font-size-4xl)",
    "--font-weight-body": String(seed.typography.bodyWeight),
    "--font-weight-heading": String(seed.typography.headingWeight),
    "--tracking-body": em(seed.typography.trackingBias),
    "--tracking-heading": em(seed.typography.trackingBias - 0.01),
  }
}
