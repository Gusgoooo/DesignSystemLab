import type { ThemeSeed } from "../schema"
import { clamp, rem } from "./utils"

const densityModeRatios: Record<ThemeSeed["density"]["mode"], number> = {
  compact: 0.92,
  default: 1,
  comfortable: 1.08,
}

export function deriveDensityMap(seed: ThemeSeed): Record<string, string> {
  const modeRatio = densityModeRatios[seed.density.mode]
  const ratio = clamp(
    1 + (modeRatio - 1) * 0.65 + (seed.density.densityRatio - 1) * 0.55,
    0.88,
    1.14
  )
  const controlHeight = seed.density.controlHeight

  return {
    "--control-height-sm": rem(Math.max(controlHeight - 0.5, 1.5)),
    "--control-height-md": rem(controlHeight),
    "--control-height-lg": rem(controlHeight + 0.5),
    "--field-gap": rem(0.5 * ratio),
    "--section-gap": rem(1.5 * ratio),
    "--panel-padding": rem(1 * ratio),
    "--page-padding": rem(1.5 * ratio),
    "--list-row-height": rem(controlHeight + 0.25 * ratio),
  }
}
