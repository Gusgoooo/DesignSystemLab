import type { ThemeSeed } from "../schema"
import { clamp, rem } from "./utils"

export function deriveRadiusMap(seed: ThemeSeed): Record<string, string> {
  const base = clamp(seed.shape.radius, 0, 1)
  const ratio = clamp(seed.shape.radiusRatio, 0.8, 1.15)

  return {
    "--radius-none": "0px",
    "--radius": "var(--radius-base)",
    "--radius-base": rem(base),
    "--radius-control": rem(base * 0.85 * ratio),
    "--radius-card": rem(base * 1.2 * ratio),
    "--radius-panel": rem(base * 1.5 * ratio),
    "--radius-pill": "999px",
  }
}
