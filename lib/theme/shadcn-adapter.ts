import {
  requiredSemanticTokenNames,
  requiredShadcnExtensionTokenNames,
  requiredShadcnOfficialTokenNames,
} from "./schema"
import { assertRequiredTokens } from "./semantic"

export const shadcnOfficialAdapterMapping = {
  "--background": "var(--surface-canvas)",
  "--foreground": "var(--content-primary)",
  "--card": "var(--surface-raised)",
  "--card-foreground": "var(--content-primary)",
  "--popover": "var(--surface-overlay)",
  "--popover-foreground": "var(--content-primary)",
  "--primary": "var(--action-primary)",
  "--primary-foreground": "var(--action-primary-fg)",
  "--secondary": "var(--action-secondary)",
  "--secondary-foreground": "var(--action-secondary-fg)",
  "--muted": "var(--surface-panel)",
  "--muted-foreground": "var(--content-secondary)",
  "--accent": "var(--action-secondary-hover)",
  "--accent-foreground": "var(--action-secondary-fg)",
  "--destructive": "var(--status-danger)",
  "--border": "var(--border-default)",
  "--input": "var(--border-default)",
  "--ring": "var(--focus-ring)",
  "--chart-1": "var(--data-1)",
  "--chart-2": "var(--data-2)",
  "--chart-3": "var(--data-3)",
  "--chart-4": "var(--data-4)",
  "--chart-5": "var(--data-5)",
  "--sidebar": "var(--surface-panel)",
  "--sidebar-foreground": "var(--content-primary)",
  "--sidebar-primary": "var(--action-primary)",
  "--sidebar-primary-foreground": "var(--action-primary-fg)",
  "--sidebar-accent": "var(--action-secondary-hover)",
  "--sidebar-accent-foreground": "var(--action-secondary-fg)",
  "--sidebar-border": "var(--border-subtle)",
  "--sidebar-ring": "var(--focus-ring)",
  "--radius": "var(--radius-base)",
} as const

export const shadcnExtensionAdapterMapping = {
  "--destructive-foreground": "var(--status-danger-solid-fg)",
} as const

export function deriveShadcnTokens(
  semanticTokens: Record<string, string>
): Record<string, string> {
  assertRequiredTokens(
    semanticTokens,
    requiredSemanticTokenNames,
    "semantic tokens for shadcn adapter"
  )

  const tokens: Record<string, string> = {
    ...shadcnOfficialAdapterMapping,
  }

  assertRequiredTokens(
    tokens,
    requiredShadcnOfficialTokenNames,
    "official shadcn tokens"
  )

  return tokens
}

export function deriveShadcnExtensionTokens(
  semanticTokens: Record<string, string>
): Record<string, string> {
  assertRequiredTokens(
    semanticTokens,
    requiredSemanticTokenNames,
    "semantic tokens for shadcn extensions"
  )

  const tokens: Record<string, string> = {
    ...shadcnExtensionAdapterMapping,
  }

  assertRequiredTokens(
    tokens,
    requiredShadcnExtensionTokenNames,
    "shadcn extension tokens"
  )

  return tokens
}
