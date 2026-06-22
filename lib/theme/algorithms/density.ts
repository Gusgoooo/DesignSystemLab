import type { ThemeSeed } from "../schema"
import { clamp, rem } from "./utils"

const densityModeRatios: Record<ThemeSeed["density"]["mode"], number> = {
  compact: 0.78,
  default: 1,
  comfortable: 1.2,
}

export function deriveDensityMap(seed: ThemeSeed): Record<string, string> {
  const modeRatio = densityModeRatios[seed.density.mode]
  const ratio = clamp(
    1 + (modeRatio - 1) * 0.8 + (seed.density.densityRatio - 1) * 0.7,
    0.7,
    1.32
  )
  const controlHeight = seed.density.controlHeight

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
