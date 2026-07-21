import { themeLabDesignRuleLibrary } from "./export-json"
import type { ProjectComponentSystem } from "./export-prompt"
import type { ThemeOutput } from "./schema"

function rawRuleUrl(path: string): string {
  return `${themeLabDesignRuleLibrary.rawBaseUrl}/${path}`
}

function userDesignRulesSection(userDesignRules?: string): string {
  const normalized = userDesignRules?.trim()

  if (!normalized) {
    return ""
  }

  return `
Project-specific rules:

\`\`\`md
${normalized}
\`\`\`
`
}

export function exportAgentsThemeRulesFromOutput(
  theme: ThemeOutput,
  componentSystem: ProjectComponentSystem = "shadcn",
  userDesignRules?: string
): string {
  const systemLabel =
    componentSystem === "shadcn" ? "shadcn/ui" : "Ant Design"

  return `<!-- theme-lab:agents:start -->
# Design System Lab

- Theme: ${theme.vibe.name}
- Component system: ${systemLabel}
- Token source: \`theme-lab.json\`
- Rule index: ${themeLabDesignRuleLibrary.rawEntrypoint}
- Blocks: ${rawRuleUrl("design-rules/core/registry-block-mapping.md")}
- Binding: ${rawRuleUrl("design-rules/core/token-binding.md")}

Use semantic Tokens and the selected component system for every new UI element. Read the matched Block before component rules. Never invent parallel colors, type scales, radius, density, or shadows. Existing UI mapping requires explicit approval and semantic reasoning, not literal value replacement. Preserve behavior.
${userDesignRulesSection(userDesignRules)}
<!-- theme-lab:agents:end -->`
}
