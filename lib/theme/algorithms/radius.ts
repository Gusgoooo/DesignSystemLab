import type { ThemeSeed } from "../schema"
import { rem } from "./utils"

export function deriveRadiusMap(seed: ThemeSeed): Record<string, string> {
  const base = seed.shape.radius
  const ratio = seed.shape.radiusRatio

  return {
    "--radius": "var(--radius-base)",
    "--radius-base": rem(base),
    "--radius-control": rem(base * 0.85 * ratio),
    "--radius-card": rem(base * 1.2 * ratio),
    "--radius-panel": rem(base * 1.5 * ratio),
    "--radius-pill": "999px",
  }
}
