import type { ThemeSeed } from "../schema"
import { clamp, rem } from "./utils"

export const densityPercentRange = {
  min: 84,
  max: 116,
  default: 100,
} as const

export function densityPercentFromSeed(
  density: ThemeSeed["density"]
): number {
  return Math.round(
    clamp(
      density.densityRatio * 100,
      densityPercentRange.min,
      densityPercentRange.max
    )
  )
}

export function densitySeedFromPercent(
  value: number
): ThemeSeed["density"] {
  const densityPercent = Math.round(
    clamp(value, densityPercentRange.min, densityPercentRange.max)
  )
  const mode: ThemeSeed["density"]["mode"] =
    densityPercent <= 94
      ? "compact"
      : densityPercent >= 106
        ? "comfortable"
        : "default"
  const controlHeightPx = Math.round(
    38 + (densityPercent - densityPercentRange.default) / 4
  )

  return {
    mode,
    controlHeight: controlHeightPx / 16,
    densityRatio: densityPercent / 100,
  }
}

export function deriveDensityMap(seed: ThemeSeed): Record<string, string> {
  const ratio = clamp(seed.density.densityRatio, 0.84, 1.16)
  const controlHeight = clamp(seed.density.controlHeight, 2.125, 2.75)

  return {
    "--control-height-sm": rem(Math.max(controlHeight - 0.35, 1.4)),
    "--control-height-md": rem(controlHeight),
    "--control-height-lg": rem(controlHeight + 0.55),
    "--control-padding-x": rem(0.75 * ratio),
    "--control-gap": rem(0.5 * ratio),
    "--field-gap": rem(0.5 * ratio),
    "--section-gap": rem(1.5 * ratio),
    "--panel-padding": rem(1 * ratio),
    "--page-padding": rem(1.5 * ratio),
    "--table-cell-padding-x": rem(0.5 * ratio),
    "--table-cell-padding-y": rem(0.42 * ratio),
    "--list-row-height": rem(controlHeight + 0.25 * ratio),
  }
}
