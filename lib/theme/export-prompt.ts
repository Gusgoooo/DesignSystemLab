import { assertAntdThemeHealth } from "./antd-health"
import { exportAgentsThemeRulesFromOutput } from "./export-agents"
import {
  themeLabDesignRuleLibrary,
  themeLabManifestAlgorithmVersion,
} from "./export-json"
import { assertThemeHealth } from "./health"
import type { AntdTokenValue, ThemeOutput } from "./schema"

export type ProjectImportMode =
  | "persistent-project-contract"
  | "full-reproducible-package"

export type ProjectComponentSystem = "shadcn" | "antd"

export type ProjectImportPromptOptions = {
  mode: ProjectImportMode
  componentSystem?: ProjectComponentSystem
  userDesignRules?: string
  theme: ThemeOutput
}

const componentSystemLabels: Record<ProjectComponentSystem, string> = {
  shadcn: "shadcn/ui",
  antd: "Ant Design",
}

function resolveComponentSystem(
  options: ProjectImportPromptOptions
): ProjectComponentSystem {
  return options.componentSystem ?? "shadcn"
}

function rawSourceUrl(path: string): string {
  return `${themeLabDesignRuleLibrary.rawBaseUrl}/${path}`
}

function splitModeValues<T extends string | number | boolean>(
  light: Record<string, T>,
  dark: Record<string, T>
): {
  common: Record<string, T>
  light: Record<string, T>
  dark: Record<string, T>
} {
  const common: Record<string, T> = {}
  const lightOnly: Record<string, T> = {}
  const darkOnly: Record<string, T> = {}
  const names = new Set([...Object.keys(light), ...Object.keys(dark)])

  for (const name of names) {
    const lightValue = light[name]
    const darkValue = dark[name]

    if (lightValue !== undefined && lightValue === darkValue) {
      common[name] = lightValue
      continue
    }

    if (lightValue !== undefined) {
      lightOnly[name] = lightValue
    }

    if (darkValue !== undefined) {
      darkOnly[name] = darkValue
    }
  }

  return {
    common,
    light: lightOnly,
    dark: darkOnly,
  }
}

function compactTokenPackage(
  options: ProjectImportPromptOptions
): string {
  const componentSystem = resolveComponentSystem(options)
  const theme = options.theme

  if (componentSystem === "shadcn") {
    assertThemeHealth(theme, "Compact project Token package")
  } else {
    assertAntdThemeHealth(theme, "Compact Ant Design Token package")
  }

  const compiled =
    componentSystem === "shadcn"
      ? {
          map: theme.mapTokens,
          semantic: splitModeValues(
            theme.semanticTokens,
            theme.darkSemanticTokens
          ),
        }
      : {
          token: splitModeValues<AntdTokenValue>(
            theme.antdTheme.light.token,
            theme.antdTheme.dark.token
          ),
          algorithm: {
            light: theme.antdTheme.light.algorithm,
            dark: theme.antdTheme.dark.algorithm,
          },
          componentSize: theme.antdTheme.componentSize,
          cssVar: theme.antdTheme.cssVar,
        }

  return JSON.stringify({
    schemaVersion: 8,
    kind: "theme-lab-token-package",
    componentSystem,
    sourceOfTruth: "seed",
    algorithmVersion: themeLabManifestAlgorithmVersion,
    seed: theme.seed,
    compiled,
  })
}

function rawSources(
  componentSystem: ProjectComponentSystem
): string {
  const adapterSources =
    componentSystem === "shadcn"
      ? [
          `- Adapter mapping: ${rawSourceUrl("lib/theme/shadcn-adapter.ts")}`,
          `- Runtime CSS reference: ${rawSourceUrl("lib/theme/export-css.ts")}`,
        ]
      : [
          `- Adapter mapping: ${rawSourceUrl("lib/theme/antd-adapter.ts")}`,
          `- ThemeConfig and optional Tailwind bridge: ${rawSourceUrl("lib/theme/export-antd.ts")}`,
        ]

  return [
    `- Rule index: ${themeLabDesignRuleLibrary.rawEntrypoint}`,
    `- Token installation: ${rawSourceUrl("design-rules/core/token-system.md")}`,
    `- Token binding: ${rawSourceUrl("design-rules/core/token-binding.md")}`,
    `- Blocks-first: ${rawSourceUrl("design-rules/core/registry-block-mapping.md")}`,
    ...adapterSources,
  ].join("\n")
}

function runtimeInstallInstruction(
  componentSystem: ProjectComponentSystem
): string {
  if (componentSystem === "shadcn") {
    return `Build one marker-delimited runtime block in the existing global stylesheet from the package below:
- \`:root\` = \`compiled.map\` + \`compiled.semantic.common\` + \`compiled.semantic.light\`.
- \`.dark\` overrides = \`compiled.semantic.dark\`.
- Read the raw shadcn adapter mapping and add the canonical official shadcn variables and Design System Lab extension variables for both modes.
- Preserve the project's existing Tailwind/shadcn exposure block; use the raw runtime CSS reference only when an exposure is missing.
- Do not add or replace components during Token installation.`
  }

  return `Build or update the project's existing Ant Design theme module, or create \`theme-lab.antd.ts\` when absent, from the package below:
- Light token = \`compiled.token.common\` + \`compiled.token.light\`.
- Dark token = \`compiled.token.common\` + \`compiled.token.dark\`.
- Apply the supplied algorithms, \`componentSize\`, and \`cssVar\` through the existing ConfigProvider and Ant Design App context.
- Add the raw Tailwind bridge only when Tailwind v4 is already present.
- Do not add a second component system.`
}

export function compileProjectImportPrompt(
  options: ProjectImportPromptOptions
): string {
  const componentSystem = resolveComponentSystem(options)
  const tokenPackage = compactTokenPackage(options)
  const agentsMarker = exportAgentsThemeRulesFromOutput(
    options.theme,
    componentSystem,
    options.userDesignRules
  )

  return `# Install Design System Lab Tokens

Component system: ${componentSystemLabels[componentSystem]}

Install the Token system only. Keep the current framework, build setup, components, routes, behavior, and existing UI unchanged.

## Steps

1. Detect the current theme entry and one existing tool-native AI instruction file; use \`AGENTS.md\` only when none exists.
2. Write the JSON package below to \`theme-lab.json\` exactly. The Seed is the only editable visual source; compiled values are generated output.
3. ${runtimeInstallInstruction(componentSystem)}
4. Replace or append the marker-delimited AI instruction block below in that one instruction file.
5. Verify Token references and available typecheck/build checks. Stop after installation.

## Raw Sources

${rawSources(componentSystem)}

## Token Package

\`\`\`json
${tokenPackage}
\`\`\`

## AI Instruction Block

\`\`\`md
${agentsMarker}
\`\`\`

After successful writes and verification, ask the user in their language whether to semantically map the existing UI to these Tokens. Do not start before an explicit yes. Approved mapping must infer responsibility, hierarchy, surface, interaction, and state; it is not literal value replacement.
`
}

export function exportPersistentProjectContractFromOutput(
  theme: ThemeOutput
): string {
  return compileProjectImportPrompt({
    mode: "persistent-project-contract",
    componentSystem: "shadcn",
    theme,
  })
}

export function exportThemePromptFromOutput(theme: ThemeOutput): string {
  return exportPersistentProjectContractFromOutput(theme)
}
