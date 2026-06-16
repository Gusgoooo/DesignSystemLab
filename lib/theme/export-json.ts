import { deriveTheme } from "./derive-theme"
import type { ThemeOutput, ThemeSeed } from "./schema"

const algorithmVersions = {
  color: "oklch-seed-v1",
  radius: "ratio-v1",
  density: "density-v1",
  typography: "type-v1",
  elevation: "elevation-v1",
  motion: "motion-v1",
  semantic: "semantic-map-v1",
  shadcn: "shadcn-adapter-v1",
  vibe: "descriptor-v1",
} as const

const themeLabManifestAlgorithmVersion = "theme-lab-seed-algorithm-v1"

export const themeLabTokenContract = {
  allowed: [
    "bg-background",
    "text-foreground",
    "bg-card",
    "text-card-foreground",
    "bg-primary",
    "text-primary-foreground",
    "bg-secondary",
    "text-secondary-foreground",
    "bg-muted",
    "text-muted-foreground",
    "border-border",
    "ring-ring",
    "bg-[var(--surface-canvas)]",
    "bg-[var(--surface-panel)]",
    "bg-[var(--surface-raised)]",
    "text-[var(--content-primary)]",
    "text-[var(--content-secondary)]",
    "text-[var(--content-tertiary)]",
    "border-[var(--border-subtle)]",
    "border-[var(--border-default)]",
    "[box-shadow:var(--elevation-card)]",
    "[box-shadow:var(--elevation-popover)]",
  ],
  forbiddenForStructuralUi: [
    "raw Tailwind palette classes",
    "hardcoded hex colors",
    "arbitrary OKLCH values",
    "one-off shadow values",
    "one-off border colors",
    "random gradient utilities",
    "unapproved new color scales",
  ],
} as const

export const themeLabAiCodingRules = [
  "Read theme-lab.json before UI changes.",
  "Global CSS variables are the runtime source for styling.",
  "One-time prompts are not the source of truth.",
  "Preserve routes, APIs, data loading, state, handlers, forms, validation, permissions, feature flags, and business logic.",
  "Do not scaffold a new app inside an existing project.",
  "Do not create a parallel design system.",
  "Do not install dependencies unless approved.",
  "Do not use raw Tailwind palette classes for structural UI.",
  "Do not use hardcoded hex colors for structural UI.",
  "Do not use arbitrary OKLCH values for structural UI.",
  "When changing UI, consume the existing compiled CSS variables and token contract.",
  "When changing theme direction, update the seed in theme-lab.json, then regenerate compiled CSS variables through Theme Lab or the available theme generation pipeline.",
] as const

export function exportPresetJson(seed: ThemeSeed): string {
  return exportPresetJsonFromOutput(deriveTheme(seed))
}

export function exportPresetJsonFromOutput(theme: ThemeOutput): string {
  return JSON.stringify(
    {
      version: "0.1.0",
      name: theme.vibe.name,
      seed: theme.seed,
      algorithms: algorithmVersions,
      tokens: {
        map: theme.mapTokens,
        semantic: theme.semanticTokens,
        darkSemantic: theme.darkSemanticTokens,
        shadcn: theme.shadcnTokens,
        darkShadcn: theme.darkShadcnTokens,
      },
      vibe: theme.vibe,
    },
    null,
    2
  )
}

export function exportVibeJson(seed: ThemeSeed): string {
  return exportVibeJsonFromOutput(deriveTheme(seed))
}

export function exportVibeJsonFromOutput(theme: ThemeOutput): string {
  return JSON.stringify(
    {
      name: theme.vibe.name,
      keywords: theme.vibe.keywords,
      avoid: theme.vibe.avoid,
      visualLanguage: theme.vibe.visualLanguage,
      principles: theme.vibe.principles,
      aiPrompt: theme.vibe.aiPrompt,
    },
    null,
    2
  )
}

export function exportThemeLabManifestJson(seed: ThemeSeed): string {
  return exportThemeLabManifestJsonFromOutput(deriveTheme(seed))
}

export function exportThemeLabManifestJsonFromOutput(
  theme: ThemeOutput
): string {
  return JSON.stringify(
    {
      schemaVersion: 1,
      kind: "theme-lab-manifest",
      theme: {
        name: theme.vibe.name,
        sourceOfTruth: "seed-and-algorithm",
        algorithmVersion: themeLabManifestAlgorithmVersion,
        cssTarget: "existing-global-css-marker-block",
        generatedAt: new Date().toISOString(),
        seed: theme.seed,
      },
      vibe: {
        summary: `${theme.vibe.name}: ${theme.vibe.keywords.join(", ")}`,
        keywords: theme.vibe.keywords,
        avoid: theme.vibe.avoid,
      },
      tokenContract: themeLabTokenContract,
      aiCoding: {
        defaultProjectMode: "existing-product-project",
        rules: themeLabAiCodingRules,
      },
    },
    null,
    2
  )
}
