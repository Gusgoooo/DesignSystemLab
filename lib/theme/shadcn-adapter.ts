import {
  requiredSemanticTokenNames,
  requiredShadcnTokenNames,
} from "./schema"
import { assertRequiredTokens } from "./semantic"

export function deriveShadcnTokens(
  semanticTokens: Record<string, string>
): Record<string, string> {
  assertRequiredTokens(
    semanticTokens,
    requiredSemanticTokenNames,
    "semantic tokens for shadcn adapter"
  )

  const tokens: Record<string, string> = {
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
    "--accent": "var(--surface-panel)",
    "--accent-foreground": "var(--content-primary)",
    "--destructive": "var(--status-danger)",
    "--destructive-foreground": "var(--content-inverse)",
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
    "--sidebar-accent": "var(--surface-raised)",
    "--sidebar-accent-foreground": "var(--content-primary)",
    "--sidebar-border": "var(--border-subtle)",
    "--sidebar-ring": "var(--focus-ring)",
    "--radius": "var(--radius-base)",
  }

  assertRequiredTokens(tokens, requiredShadcnTokenNames, "shadcn tokens")

  return tokens
}
