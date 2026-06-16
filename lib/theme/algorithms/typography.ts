import type { ThemeSeed } from "../schema"
import { rem, round } from "./utils"

function em(value: number): string {
  return `${round(value)}em`
}

export function deriveTypographyMap(seed: ThemeSeed): Record<string, string> {
  const body = 1
  const ratio = seed.typography.scaleRatio
  const caption = body / ratio
  const title = body * ratio * ratio
  const display = title * ratio * ratio

  return {
    "--font-family-sans": seed.typography.sans,
    "--font-family-mono": seed.typography.mono,
    "--text-caption": rem(caption),
    "--text-body": rem(body),
    "--text-title": rem(title),
    "--text-display": rem(display),
    "--font-weight-body": String(seed.typography.bodyWeight),
    "--font-weight-heading": String(seed.typography.headingWeight),
    "--tracking-body": em(seed.typography.trackingBias),
    "--tracking-heading": em(seed.typography.trackingBias - 0.01),
  }
}
