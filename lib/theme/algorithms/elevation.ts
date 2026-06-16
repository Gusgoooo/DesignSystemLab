import type { ThemeSeed } from "../schema"
import { clamp, round } from "./utils"

function shadowAlpha(seed: ThemeSeed, multiplier = 1): string {
  return String(round(clamp(seed.material.shadowAlpha * multiplier, 0, 0.24)))
}

export function deriveElevationMap(seed: ThemeSeed): Record<string, string> {
  const alpha = shadowAlpha(seed)
  const alphaLight = shadowAlpha(seed, 0.65)
  const alphaStrong = shadowAlpha(seed, 1.25)

  if (seed.material.elevation === "flat") {
    return {
      "--elevation-card": "none",
      "--elevation-popover": `0 4px 10px rgb(0 0 0 / ${alphaLight})`,
      "--elevation-dialog": `0 8px 18px rgb(0 0 0 / ${alpha})`,
    }
  }

  if (seed.material.elevation === "floating") {
    return {
      "--elevation-card": `0 2px 8px rgb(0 0 0 / ${alphaLight}), 0 1px 2px rgb(0 0 0 / ${alphaLight})`,
      "--elevation-popover": `0 12px 30px rgb(0 0 0 / ${alpha}), 0 4px 10px rgb(0 0 0 / ${alphaLight})`,
      "--elevation-dialog": `0 22px 50px rgb(0 0 0 / ${alphaStrong}), 0 8px 18px rgb(0 0 0 / ${alpha})`,
    }
  }

  return {
    "--elevation-card": `0 1px 2px rgb(0 0 0 / ${alpha}), 0 1px 1px rgb(0 0 0 / ${alphaLight})`,
    "--elevation-popover": `0 8px 22px rgb(0 0 0 / ${alpha}), 0 2px 6px rgb(0 0 0 / ${alphaLight})`,
    "--elevation-dialog": `0 16px 38px rgb(0 0 0 / ${alphaStrong}), 0 5px 14px rgb(0 0 0 / ${alpha})`,
  }
}
