import { exportThemeAlgorithmFromOutput } from "./export-algorithm"
import { exportThemeCssFromOutput } from "./export-css"
import {
  exportVibeJsonFromOutput,
  themeLabAiInstructionTargets,
  themeLabDesignRuleLibrary,
} from "./export-json"
import type { ThemeOutput } from "./schema"

export type ProjectImportMode =
  | "persistent-project-contract"
  | "full-reproducible-package"

export type ProjectImportTask =
  | "refactor-selected-scope"
  | "refactor-product-wide"

export type ProjectImportPromptOptions = {
  mode: ProjectImportMode
  task: ProjectImportTask
  targetScope?: string
  userDesignRules?: string
  theme: ThemeOutput
}

const taskLabels: Record<ProjectImportTask, string> = {
  "refactor-selected-scope": "Normalize selected page/component UI with existing content preserved",
  "refactor-product-wide": "Align the product UI system across pages without redesigning from scratch",
}

const modeLabels: Record<ProjectImportMode, string> = {
  "persistent-project-contract": "Persistent project design system contract",
  "full-reproducible-package": "Full reproducible Design System Lab package",
}

function aiInstructionTargetList(): string {
  return themeLabAiInstructionTargets
    .map((target) => {
      const fallback = "fallbackFile" in target ? `; fallback: \`${target.fallbackFile}\`` : ""
      return `- ${target.tool}: \`${target.primaryFile}\`${fallback}`
    })
    .join("\n")
}

function aiInstructionTargetResolverSection(): string {
  return `## AI Instruction Target Resolver

Install the AI instruction block into the target tool's native file, not every supported file.

${aiInstructionTargetList()}

Use an existing supported file when present. If the tool is unknown and none exists, use \`AGENTS.md\`.`
}

function runtimeCssBlock(theme: ThemeOutput): string {
  return `/* theme-lab:runtime:start */
${exportThemeCssFromOutput(theme)}
/* theme-lab:runtime:end */`
}

function promptRouteSection(
  options: ProjectImportPromptOptions,
  targetScope: string,
  promptTemplate: string
): string {
  return `## Prompt Route

- promptTemplate: \`${promptTemplate}\`
- selectedMode: \`${options.mode}\` (${modeLabels[options.mode]})
- selectedTask: \`${options.task}\` (${taskLabels[options.task]})
- targetScope: \`${targetScope || "(not provided)"}\`
- designRuleRouter: \`${themeLabDesignRuleLibrary.entrypoint}\` (raw: ${themeLabDesignRuleLibrary.rawEntrypoint})
- externalKnowledgeManifest: \`${themeLabDesignRuleLibrary.externalKnowledgeManifest}\``
}

function normalizeUserDesignRules(userDesignRules?: string): string {
  return userDesignRules?.trim() ?? ""
}

function projectImportManifestJson(
  theme: ThemeOutput,
  userDesignRules?: string
): string {
  const normalizedUserDesignRules = normalizeUserDesignRules(userDesignRules)

  return JSON.stringify(
    {
      schemaVersion: 1,
      kind: "theme-lab-manifest",
      theme: {
        name: theme.vibe.name,
        sourceOfTruth: "seed-and-algorithm",
        algorithmVersion: "theme-lab-seed-algorithm-v1",
        cssTarget: "detected-global-css-file",
        generatedAt: new Date().toISOString(),
        seed: theme.seed,
      },
      vibe: {
        summary: `${theme.vibe.name}: ${theme.vibe.keywords.join(", ")}`,
        keywords: theme.vibe.keywords,
        visualContract: theme.vibe.visualContract.summary,
      },
      designRuleLibrary: {
        entrypoint: themeLabDesignRuleLibrary.entrypoint,
        rawEntrypoint: themeLabDesignRuleLibrary.rawEntrypoint,
        externalKnowledgeManifest:
          themeLabDesignRuleLibrary.externalKnowledgeManifest,
      },
      tokenContract:
        "Use runtime CSS variables plus shadcn semantic classes; see the AI instruction block for binding rules.",
      componentSource:
        "Use shadcn/ui and Radix UI as mandatory component foundations; use the closest fitting registry primitive/block as implementation and repair baseline; map product logic into registry slots.",
      userAuthoredDesignRules: normalizedUserDesignRules
        ? {
            source: "Design System Lab export panel",
            format: "markdown",
            body: normalizedUserDesignRules,
          }
        : undefined,
      aiCoding: {
        defaultProjectMode: "existing-product-project",
        rules: [
          "Preserve routes, data, handlers, validation, permissions, and workflow order.",
          "Install exactly three persistent touchpoints: runtime CSS block, theme-lab.json, and one AI instruction file.",
          "Before product UI edits, choose component source and registry baseline, then map product logic into registry slots.",
          "Bind structural UI to shadcn semantic classes and Design System Lab runtime variables.",
          "Load design rules through design-rules/index.json or the raw rule index; do not inline every rule.",
        ],
      },
    },
    null,
    2
  )
}

function userDesignRulesSection(userDesignRules?: string): string {
  const normalizedUserDesignRules = normalizeUserDesignRules(userDesignRules)

  if (!normalizedUserDesignRules) {
    return ""
  }

  return `## User-Authored Design Rules

\`\`\`md
${normalizedUserDesignRules}
\`\`\`

Treat these as higher priority than generic UI taste.

`
}

function colorTokenVocabularySection(): string {
  return `## Color & Token Vocabulary

Use shadcn semantic classes as the main vocabulary: \`bg-background\`, \`text-foreground\`, \`bg-card text-card-foreground\`, \`bg-primary text-primary-foreground\`, \`bg-muted text-muted-foreground\`, \`border-border\`, and \`ring-ring\`.

Use Design System Lab variables for system details: radius variables (\`--radius-control\`, \`--radius-card\`, \`--radius-panel\`), control-height variables, \`--control-padding-x\`, \`--control-gap\`, elevation variables, and \`--duration-base\`.

Status uses soft pairs only: \`bg-success-bg text-success-foreground\`, plus warning/info/danger. Categories and charts use \`chart-1..5\` with a stable mapping.

Forbidden for structural UI: raw Tailwind palette colors, hex, arbitrary OKLCH, one-off shadows/borders, mixed radius scales, random gradients, same-role pairs like \`bg-primary text-primary\`, and new color scales.`
}

function craftParadigmSection(theme: ThemeOutput): string {
  return `## Craft Paradigm

${theme.vibe.visualContract.summary}

Make the UI calmer, clearer, and more scannable through registry-backed component structure, hierarchy, spacing, restrained accent color, stable status/category mapping, and consistent radius/elevation/motion. Do not add decoration to compensate for weak component structure.`
}

function preservationContractSection(): string {
  return `## Preservation Contract

Preserve routes, information architecture, APIs, data loading, handlers, state, forms, validation, permissions, feature flags, workflow order, and domain copy. Do not scaffold a new app or overwrite unrelated pages. Do not install dependencies without approval; shadcn/Radix setup changes still require the project's established workflow.`
}

function componentSourceContractSection(): string {
  return `## Component Source Contract

Tokens are not a component system. shadcn/ui and Radix UI are mandatory component foundations for product UI. Before product UI edits, inspect \`components.json\`, package manager, aliases, existing component folders, installed UI libraries, and registry workflow.

Reuse existing project components only when they are already built on shadcn/Radix primitives or can wrap them without preserving a parallel component system. Otherwise, refactor the touched UI to shadcn/Radix. Choose the closest fitting shadcn registry primitive/block as the implementation baseline and repair reference. Map product logic into registry slots before styling: routes, navigation, page title, actions, filters, tables, forms, charts, dialogs, permissions, loading/empty/error states, and responsive behavior.

When a user adopts Design System Lab in the middle of an existing project, treat non-shadcn/Radix UI inside the approved scope as refactor work, not as a token-only skinning task. Do not hand-write fake shadcn components, copy demo data, or invent a broad custom component suite. If no reliable shadcn/Radix registry baseline exists, install the theme contract and report the blocked component gap instead of fabricating UI.`
}

function designRulesSection(): string {
  return `## Design Rules

Use \`${themeLabDesignRuleLibrary.entrypoint}\`; raw fallback: ${themeLabDesignRuleLibrary.rawEntrypoint}. Load requiredAlways rules and only matched component/block rules. Read \`PRODUCT.md\` and \`DESIGN.md\` when present. Output a short Rule Read Confirmation before editing.`
}

function workflowSection(
  isProductWideTask: boolean
): string {
  const implementSetup = `- Install exactly three persistent touchpoints, updating only marker blocks when they already exist:
  1. Runtime CSS variables in the existing global CSS file (\`/* theme-lab:runtime:start|end */\`).
  2. \`theme-lab.json\` at the project root.
  3. The target tool's native AI instruction file Design System Lab section (\`<!-- theme-lab:agents:start|end -->\`); resolve the file via the AI Instruction Target Resolver.
- Do not create \`theme.seed.json\`, \`vibe.manifest.json\`, \`theme.algorithm.ts\`, prompt files, or a design-system folder. Do not install local \`design-rules/\` files unless explicitly requested; read raw URLs instead.${
        isProductWideTask
          ? "\n- Establish one product layout grammar (app shell, header rhythm, content width, action placement, state design, responsive behavior) before normalizing individual pages."
          : ""
      }`

  return `## Workflow

1. Inspect: framework, global CSS, component system, registry workflow, route/page inventory, and business logic. Output Project Mode plus Component Source Plan (\`registryBaseline\` and \`logicToRegistryMapping\` included).
2. Install contract:
${implementSetup}
3. Normalize UI only after component source is clear. Use shadcn/Radix primitives and approved registry blocks; map product logic into registry slots; bind styling to tokens.
4. Verify: component source audit, token audit, preserved logic/data/handlers, responsive states, and available checks (typecheck, lint, build).`
}

function finalReportSection(): string {
  return `## Final Report

\`\`\`md
## Project Mode
## Files Changed
## Contract Installed (global CSS block / theme-lab.json / AI instruction file)
## Component Source (registry baseline / logic-to-registry mapping / local primitives reused / registry additions / blocked gaps / custom leaf UI justification)
## Preservation (logic/APIs/data/state preserved + reconnected)
## UI + Token Audit
## QA (typecheck / lint / build / manual)
## Risks / Follow-ups
\`\`\``
}

function agentsMarkerBlock(userDesignRules?: string): string {
  return `<!-- theme-lab:agents:start -->

# Design System Lab Contract

This project uses a Design System Lab generated design system.

## Language Rule

All AI-facing instructions, theme manifests, vibe descriptors, task packets, and final implementation reports must be written in English. Preserve code identifiers, file paths, route paths, API names, and user-provided business copy literally when needed.

## Source of Truth

- \`theme-lab.json\` contains the theme DNA, algorithm version, vibe, token contract, and AI coding rules.
- \`design-rules/index.json\` routes element types to detailed markdown rule files.
- The global CSS file contains the runtime CSS variables.
- One-time prompts are not the source of truth.

## Theme Change Rule

Do not invent new structural visual values. When changing UI, consume the compiled CSS variables and token classes. When changing theme direction, update the Design System Lab seed in \`theme-lab.json\` and regenerate the compiled CSS variables.

${userDesignRulesSection(userDesignRules)}## UI Normalization Rule

Before UI changes, read \`design-rules/index.json\` when it exists, load \`requiredAlways\` rules, inventory the scope by element type, and open only matched files from \`rules[].source\`. Output a Rule Read Confirmation before editing; do not claim a rule was applied unless its file was opened.

Read local \`PRODUCT.md\` and \`DESIGN.md\` when present. Classify page type before changing visual design, then normalize shell/background/max-width/grid/spacing, audit tokens, tune typography/density, and apply radius/elevation/motion/decoration last.

Treat redesign/optimize/rebuild/refactor requests as UI normalization by default, not a full redesign. Preserve existing content, information architecture, workflow order, routes, APIs, state, validation, permissions, and domain copy. Do not wipe the UI tree or move major content regions unless the user asks for a full redesign. shadcn/ui and Radix UI are mandatory for touched product UI; reuse local components only when they are shadcn/Radix-based, otherwise refactor the scope to shadcn/Radix. Do not browse external visual references unless the user provides one or explicitly asks for Impeccable/UIUXPROMAX/raw GitHub design assets. When external knowledge is requested, use \`${themeLabDesignRuleLibrary.externalKnowledgeManifest}\`, load only relevant raw GitHub files, and map decisions through local tokens. Reconnect APIs, data, handlers, validation, navigation, permissions, and state after normalizing.

## Component Source Rule

Before product UI edits, inspect \`components.json\`, package manager, aliases, component folders, installed UI libraries, and registry workflow. shadcn/ui and Radix UI are mandatory. Reuse local components only when they are shadcn/Radix-based; otherwise refactor touched UI to shadcn/Radix. Use the closest fitting registry primitive/block as implementation baseline and repair reference. Map real routes, data, permissions, actions, states, and responsive behavior into registry slots; strip demo content. If no reliable shadcn/Radix registry baseline exists, do not invent a broad custom component system.

## Styling Rule

Allowed:

- shadcn semantic classes and token-backed Tailwind utilities
- the \`--status-*\` families (\`bg-success-bg text-success-foreground\`, and warning/info/danger)
- the categorical palette \`bg-chart-1..5\` / \`text-chart-1..5\` with a stable category-to-index mapping
- token-backed radius such as \`rounded-[var(--radius-card)]\`, \`rounded-[var(--radius-control)]\`, \`rounded-[var(--radius-panel)]\`

Tags and labels stay neutral unless they carry real status or category meaning. Every filled background uses its matching \`-foreground\` token; never use same-role pairs such as \`bg-primary text-primary\`.

Forbidden for structural UI:

- raw Tailwind palette classes, hardcoded hex, arbitrary OKLCH values
- one-off shadows or border colors, legacy/mixed radius scales, random gradients
- new color scales beyond the sanctioned \`--status-*\` and \`--chart-1..5\` families

## Workflow

1. Read \`theme-lab.json\` and \`design-rules/index.json\` (when present); load required and matched rules.
2. Read \`PRODUCT.md\` and \`DESIGN.md\` when present; classify page type and choose registry baseline.
3. Install or update the runtime CSS block, \`theme-lab.json\`, and this AI instruction block.
4. Normalize with shadcn/Radix primitives or approved registry blocks, then bind styles to tokens.
5. Preserve and reconnect business logic, API contracts, data loading, handlers, validation, permissions, and states.
6. Report component source, files changed, QA, and risks.

<!-- theme-lab:agents:end -->`
}

function themeArtifactsSection(
  options: ProjectImportPromptOptions,
  targetScope: string
): string {
  const theme = options.theme

  const persistentArtifacts = `Runtime CSS variables / theme.css:
\`\`\`css
${runtimeCssBlock(theme)}
\`\`\`

\`theme-lab.json\` content:
\`\`\`json
${projectImportManifestJson(theme, options.userDesignRules)}
\`\`\`

Target AI instruction file Design System Lab section content:
\`\`\`md
${agentsMarkerBlock(options.userDesignRules)}
\`\`\``

  if (options.mode === "persistent-project-contract") {
    return persistentArtifacts
  }

  return `${persistentArtifacts}

\`theme.seed.json\` content:
\`\`\`json
${JSON.stringify(theme.seed, null, 2)}
\`\`\`

\`vibe.manifest.json\` content:
\`\`\`json
${exportVibeJsonFromOutput(theme)}
\`\`\`

\`theme.algorithm.ts\` handoff:
\`\`\`ts
${exportThemeAlgorithmFromOutput(theme)}
\`\`\``
}

export function compileProjectImportPrompt(
  options: ProjectImportPromptOptions
): string {
  const targetScope = options.targetScope?.trim() ?? ""
  const isProductWideTask = options.task === "refactor-product-wide"

  return `# Design System Lab AI Task Packet

${promptRouteSection(
  options,
  targetScope,
  isProductWideTask
    ? "persistent-product-wide-ui-alignment"
    : "persistent-selected-scope-ui-normalization"
)}

## Language

Write all task instructions, plans, notes, and reports in English. Preserve code identifiers, file paths, route paths, API names, and user-provided business copy literally.

## Mission

This is an existing product project (assume so unless the repo is clearly empty or the user asks for a new one). Install the Design System Lab design system contract and ${
    isProductWideTask
      ? "align the product UI across routes into one coherent, token-bound system"
      : "normalize the selected scope into the token-bound system"
  } — normalizing inconsistent components and beautifying the result without redesigning workflows. Token replacement alone is not success. Inspect the project before changing any file; do not scaffold a new app.

${preservationContractSection()}

${componentSourceContractSection()}

${colorTokenVocabularySection()}

## Theme Artifacts

${themeArtifactsSection(options, targetScope)}

${craftParadigmSection(options.theme)}

${designRulesSection()}

${aiInstructionTargetResolverSection()}

${workflowSection(isProductWideTask)}

${finalReportSection()}
`
}

export function exportPersistentProjectContractFromOutput(
  theme: ThemeOutput
): string {
  return compileProjectImportPrompt({
    mode: "persistent-project-contract",
    task: "refactor-product-wide",
    theme,
  })
}

export function exportThemePromptFromOutput(theme: ThemeOutput): string {
  return exportPersistentProjectContractFromOutput(theme)
}
