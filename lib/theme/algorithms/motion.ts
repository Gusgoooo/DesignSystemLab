import type { ThemeSeed } from "../schema"
import { ms } from "./utils"

export function deriveMotionMap(seed: ThemeSeed): Record<string, string> {
  if (seed.motion.level === "none") {
    return {
      "--duration-fast": "0ms",
      "--duration-base": "0ms",
      "--duration-slow": "0ms",
      "--ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
      "--ease-emphasized": "cubic-bezier(0.16, 1, 0.3, 1)",
    }
  }

  const fastMultiplier = seed.motion.level === "expressive" ? 0.75 : 0.65
  const baseMultiplier = seed.motion.level === "expressive" ? 1.1 : 1
  const slowMultiplier = seed.motion.level === "expressive" ? 1.8 : 1.45

  return {
    "--duration-fast": ms(seed.motion.durationBase * fastMultiplier),
    "--duration-base": ms(seed.motion.durationBase * baseMultiplier),
    "--duration-slow": ms(seed.motion.durationBase * slowMultiplier),
    "--ease-standard": "cubic-bezier(0.2, 0, 0, 1)",
    "--ease-emphasized": "cubic-bezier(0.16, 1, 0.3, 1)",
  }
}
