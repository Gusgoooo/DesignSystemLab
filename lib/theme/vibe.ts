import type { ThemeSeed, VibeDescriptor } from "./schema"
import { hexAlphaToOklch } from "./algorithms/utils"

function unique(values: string[]): string[] {
  return Array.from(new Set(values))
}

const temperatureLabels: Record<ThemeSeed["vibe"]["temperature"], string> = {
  cool: "cool",
  neutral: "neutral",
  warm: "warm",
}

const expressionLabels: Record<ThemeSeed["vibe"]["expression"], string> = {
  minimal: "minimal",
  balanced: "balanced",
  expressive: "expressive",
}

const domainLabels: Record<ThemeSeed["vibe"]["domain"], string> = {
  saas: "SaaS",
  ai: "AI",
  editorial: "editorial",
  finance: "finance",
  consumer: "consumer",
  tooling: "tooling",
}

const toneLabels: Record<ThemeSeed["vibe"]["tone"], string> = {
  calm: "calm",
  precise: "precise",
  friendly: "friendly",
  premium: "premium",
  experimental: "experimental",
}

function getRadiusLabel(radius: number): string {
  if (radius < 0.5) {
    return "low-radius"
  }

  if (radius > 1) {
    return "large-radius"
  }

  return "medium-radius"
}

function getDensityLabel(seed: ThemeSeed): string {
  if (seed.density.mode === "compact") {
    return "compact density"
  }

  if (seed.density.mode === "comfortable") {
    return "comfortable density"
  }

  return "default density"
}

function getMotionLabel(seed: ThemeSeed): string {
  if (seed.motion.level === "none") {
    return "no motion"
  }

  if (seed.motion.level === "expressive") {
    return "expressive motion"
  }

  return "subtle motion"
}

function deriveName(seed: ThemeSeed): string {
  if (seed.vibe.domain === "ai") {
    return `${toneLabels[seed.vibe.tone]} AI workspace`
  }

  if (seed.vibe.tone === "premium" && seed.vibe.expression === "minimal") {
    return "premium minimal interface"
  }

  if (seed.vibe.domain === "saas" && seed.vibe.tone === "calm") {
    return "calm technical SaaS"
  }

  return `${expressionLabels[seed.vibe.expression]} ${toneLabels[seed.vibe.tone]} ${domainLabels[seed.vibe.domain]}`
}

function deriveKeywords(seed: ThemeSeed): string[] {
  const primary = hexAlphaToOklch(seed.color.primary)
  const keywords = [
    toneLabels[seed.vibe.tone],
    expressionLabels[seed.vibe.expression],
    temperatureLabels[seed.vibe.temperature],
    domainLabels[seed.vibe.domain],
    getDensityLabel(seed),
    getRadiusLabel(seed.shape.radius),
    getMotionLabel(seed),
  ]

  if (primary.chroma < 0.08) {
    keywords.push("low-noise")
  }

  if (primary.chroma > 0.18) {
    keywords.push("high-expression color")
  }

  if (seed.vibe.domain === "finance") {
    keywords.push("data-dense")
  }

  if (seed.vibe.domain === "tooling") {
    keywords.push("technical")
  }

  return unique(keywords).slice(0, 8)
}

function deriveAvoid(seed: ThemeSeed): string[] {
  const avoid = [
    "Avoid raw Tailwind palette colors",
    "Avoid highly saturated background fills",
    "Avoid decorative gradients",
    "Avoid excessive border noise",
  ]

  if (seed.material.elevation !== "floating") {
    avoid.push("Avoid heavy shadows")
  }

  if (seed.vibe.expression !== "expressive") {
    avoid.push("Avoid toy-like decorative shapes")
  }

  if (seed.density.mode !== "compact") {
    avoid.push("Avoid crowded layouts")
  }

  return avoid.slice(0, 8)
}

function deriveVisualLanguage(seed: ThemeSeed): VibeDescriptor["visualLanguage"] {
  return {
    surface:
      seed.material.elevation === "flat"
        ? "Flat surfaces use clear borders to establish hierarchy with minimal reliance on shadows."
        : "Canvas, panel, raised, and overlay surfaces establish a clear hierarchy.",
    shape: `${getRadiusLabel(seed.shape.radius)} with a ${seed.shape.radiusRatio} radius ratio across controls, cards, and panels.`,
    color:
      seed.vibe.temperature === "warm"
        ? "Warm neutrals anchor the interface, while actions and states are expressed through semantic tokens."
        : "A cool-to-neutral color system uses brand color for key actions while keeping backgrounds restrained.",
    density: `${getDensityLabel(seed)} with controls around ${seed.density.controlHeight}rem tall.`,
    motion: `${getMotionLabel(seed)} using deterministic duration tokens.`,
    typography: `Sans stack ${seed.typography.sans}; heading weight ${seed.typography.headingWeight}, body weight ${seed.typography.bodyWeight}.`,
  }
}

function deriveVisualContract(
  seed: ThemeSeed
): VibeDescriptor["visualContract"] {
  const density = getDensityLabel(seed)
  const tone = toneLabels[seed.vibe.tone]
  const domain = domainLabels[seed.vibe.domain]

  return {
    summary: `A design system for ${domain} product interiors, using a ${tone} tone and ${density} to create clear, reusable interface hierarchy rather than decorative expression.`,
    principles: [
      "Visual quality comes from component consistency, semantic tokens, and stable surface hierarchy rather than decoration.",
      `Maintain ${density} with consistent spacing and rhythm across repeated components.`,
      "Use brand color with restraint, reserved for key actions and states while backgrounds and surfaces stay neutral.",
      "Maintain a clear surface hierarchy from canvas to overlay.",
      "Ensure predictable interaction states, accessible contrast, and consistent light/dark theme behavior.",
    ],
    prefer: [
      "shadcn semantic classes and project semantic tokens",
      "Consistent component styling and interaction states",
      "Clear surface hierarchy (canvas / panel / card / raised / overlay)",
      "Readable density and typographic rhythm",
      "Restrained brand-color emphasis",
    ],
    avoid: [
      "Decorative visual effects unless explicitly requested",
      "Raw Tailwind palette classes for structural UI",
      "Hardcoded hex colors and arbitrary OKLCH values",
      "Decorative gradients and random shadows",
      "Unapproved glassmorphism",
      "Copying Theme Lab preview fixtures directly into the project",
    ],
    tokenUsage: [
      "Use bg-background / text-foreground / bg-card / border-border for structural color.",
      "Use var(--surface-canvas|panel|raised|overlay) for surface hierarchy.",
      "Use var(--content-primary|secondary|tertiary) for text hierarchy.",
      "Use var(--border-subtle|default|strong) for borders.",
      "Use var(--elevation-card|popover|dialog) for shadows.",
      "Use var(--status-success|warning|info|danger) plus -bg / -fg for status color.",
    ],
  }
}

export function deriveVibeDescriptor(seed: ThemeSeed): VibeDescriptor {
  const name = deriveName(seed)
  const keywords = deriveKeywords(seed)
  const avoid = deriveAvoid(seed)

  return {
    name,
    keywords,
    avoid,
    visualLanguage: deriveVisualLanguage(seed),
    visualContract: deriveVisualContract(seed),
  }
}
