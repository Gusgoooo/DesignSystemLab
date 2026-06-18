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

function deriveCraftDirectives(seed: ThemeSeed): string[] {
  const directives: string[] = []
  const primary = hexAlphaToOklch(seed.color.primary)
  const radiusLabel = getRadiusLabel(seed.shape.radius)

  if (seed.vibe.tone === "premium" || seed.vibe.expression === "expressive") {
    directives.push(
      "Headings: use a generous, confident scale (such as text-2xl/3xl) with tight tracking and clear weight contrast so sections read at a glance."
    )
  } else if (seed.vibe.expression === "minimal" || seed.vibe.tone === "calm") {
    directives.push(
      "Headings: keep type sizes restrained; establish dominance through weight and surrounding whitespace rather than large sizes."
    )
  } else {
    directives.push(
      "Headings: apply one consistent, repeatable type scale across pages instead of ad-hoc sizes."
    )
  }

  if (seed.density.mode === "comfortable") {
    directives.push(
      "Spacing: use generous section-gap and panel-padding; let whitespace group related content before reaching for borders."
    )
  } else if (seed.density.mode === "compact") {
    directives.push(
      "Spacing: keep spacing tight but align everything to a strict grid; dense is fine, cramped and misaligned is not."
    )
  } else {
    directives.push(
      "Spacing: keep an even, steady rhythm of spacing across repeated blocks."
    )
  }

  if (seed.material.elevation === "flat") {
    directives.push(
      "Depth: separate surfaces with canvas/panel/card steps and subtle borders; avoid shadows to convey hierarchy."
    )
  } else if (seed.material.elevation === "floating") {
    directives.push(
      "Depth: express layering with the elevation tokens ([box-shadow:var(--elevation-card)] and var(--elevation-popover)) rather than heavy borders."
    )
  } else {
    directives.push(
      "Depth: use restrained elevation; never stack a strong border and a strong shadow on the same surface."
    )
  }

  if (radiusLabel === "large-radius") {
    directives.push(
      "Radius: apply the generous corner radius consistently to controls, cards, and panels for one coherent shape language."
    )
  } else if (radiusLabel === "low-radius") {
    directives.push(
      "Radius: keep a crisp, small radius applied consistently; do not mix sharp and heavily rounded corners."
    )
  } else {
    directives.push(
      "Radius: apply the medium radius consistently across controls, cards, and panels."
    )
  }

  if (primary.chroma > 0.18) {
    directives.push(
      "Color: the brand color is vivid — deploy it sparingly and decisively, mainly on the single primary action, and keep large areas neutral."
    )
  } else if (primary.chroma < 0.08) {
    directives.push(
      "Color: the brand color is quiet — build interest through hierarchy, spacing, and typography rather than saturation."
    )
  } else {
    directives.push(
      "Color: reserve the brand color for the primary action and a few key accents; keep surfaces and backgrounds neutral."
    )
  }

  if (seed.motion.level === "expressive") {
    directives.push(
      "Motion: add tasteful transform/opacity transitions on the duration tokens for interactive feedback, and respect prefers-reduced-motion."
    )
  } else if (seed.motion.level === "none") {
    directives.push(
      "Motion: no animation; rely on instant, clearly tokenized state changes."
    )
  } else {
    directives.push(
      "Motion: use quick, supportive transitions only for interactive feedback, never as page-load decoration."
    )
  }

  return directives
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
      "A stable categorical color mapping (the same category always maps to the same chart color)",
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
      "Structural color uses the shadcn semantic classes (bg-background/text-foreground, bg-card/text-card-foreground, bg-muted/text-muted-foreground, border-border, ring-ring). This is the canonical vocabulary.",
      "Status: bg-success-bg/text-success-foreground (soft) or bg-success/text-success-foreground (solid); the same pattern for warning, info, and danger.",
      "Categorical (non-status types, chart and legend series): bg-chart-1..5 / text-chart-1..5 with a stable category-to-index mapping.",
      "Tags and labels stay neutral (bg-muted or the outline variant) unless they carry real status, type, priority, or category meaning.",
      "Radius, spacing, elevation, and motion use the variable-backed utilities (rounded-[var(--radius-*)], gap/padding tokens, [box-shadow:var(--elevation-*)], duration/ease tokens).",
      "Optional: var(--surface-*) and var(--content-*) exist for finer hierarchy but are not required; do not duplicate the shadcn tokens with them.",
    ],
    craft: deriveCraftDirectives(seed),
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
