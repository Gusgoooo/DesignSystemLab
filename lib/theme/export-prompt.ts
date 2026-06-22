import { exportThemeAlgorithmFromOutput } from "./export-algorithm"
import { exportThemeCssFromOutput } from "./export-css"
import {
  exportVibeJsonFromOutput,
  themeLabAiCodingRules,
  themeLabAiInstructionTargets,
  themeLabDesignRuleLibrary,
  themeLabTokenContract,
} from "./export-json"
import type { ThemeOutput } from "./schema"

export type ProjectImportMode =
  | "one-shot-page-polish"
  | "persistent-project-contract"
  | "full-reproducible-package"

export type ProjectImportTask =
  | "install-theme-contract"
  | "refactor-selected-scope"
  | "refactor-product-wide"
  | "visual-review"

export type ProjectImportPromptOptions = {
  mode: ProjectImportMode
  task: ProjectImportTask
  targetScope?: string
  userDesignRules?: string
  theme: ThemeOutput
}

const taskLabels: Record<ProjectImportTask, string> = {
  "install-theme-contract": "Install theme contract",
  "refactor-selected-scope": "Normalize selected page/component UI with existing content preserved",
  "refactor-product-wide": "Align the product UI system across pages without redesigning from scratch",
  "visual-review": "Visual review only",
}

const modeLabels: Record<ProjectImportMode, string> = {
  "one-shot-page-polish": "One-shot selected-scope UI normalization",
  "persistent-project-contract": "Persistent project visual contract",
  "full-reproducible-package": "Full reproducible Theme Lab package",
}

function markdownList(values: readonly string[]): string {
  return values.map((value) => `- ${value}`).join("\n")
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

The third persistent touchpoint is the target tool's native AI instruction file, not always \`AGENTS.md\`.

${aiInstructionTargetList()}

Rules: use the named tool's file; if a supported file already exists, update it; if several exist, update each with the same Theme Lab section; if the tool is unknown and none exist, use \`AGENTS.md\`. Do not create every file by default. Only the filename changes — the section content stays the same.`
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
- designRuleRouter: \`${themeLabDesignRuleLibrary.entrypoint}\` (raw: ${themeLabDesignRuleLibrary.rawEntrypoint})`
}

const oneShotThemeTokenNames = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--border",
  "--input",
  "--ring",
  "--radius",
  "--radius-control",
  "--radius-card",
  "--radius-panel",
  "--control-height-sm",
  "--control-height-md",
  "--control-height-lg",
  "--panel-padding",
  "--section-gap",
  "--elevation-card",
  "--elevation-popover",
  "--duration-base",
  "--ease-standard",
] as const

function pickThemeVariables(
  source: ThemeOutput["cssVariables"],
  names: readonly string[]
): Record<string, string> {
  return names.reduce<Record<string, string>>((result, name) => {
    const value = source[name]

    if (value) {
      result[name] = value
    }

    return result
  }, {})
}

function oneShotThemeReferenceJson(theme: ThemeOutput): string {
  return JSON.stringify(
    {
      source: "Theme Lab compact UI normalization reference",
      name: theme.vibe.name,
      keywords: theme.vibe.keywords,
      visualIntent: theme.vibe.visualContract.summary,
      prefer: theme.vibe.visualContract.prefer.slice(0, 6),
      avoid: theme.vibe.visualContract.avoid.slice(0, 6),
      seedSnapshot: {
        primary: theme.seed.color.primary.hex,
        background: theme.seed.color.background.hex,
        foreground: theme.seed.color.foreground.hex,
        neutral: theme.seed.color.neutral.hex,
        radius: theme.seed.shape.radius,
        radiusRatio: theme.seed.shape.radiusRatio,
        density: theme.seed.density.mode,
        controlHeight: theme.seed.density.controlHeight,
        elevation: theme.seed.material.elevation,
        motion: theme.seed.motion.level,
      },
      tokens: {
        light: pickThemeVariables(theme.cssVariables, oneShotThemeTokenNames),
        dark: pickThemeVariables(
          theme.darkCssVariables,
          oneShotThemeTokenNames
        ),
      },
    },
    null,
    2
  )
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
        avoid: theme.vibe.avoid,
      },
      tokenContract: themeLabTokenContract,
      designRuleLibrary: themeLabDesignRuleLibrary,
      userAuthoredDesignRules: normalizedUserDesignRules
        ? {
            source: "Theme Lab export panel",
            format: "markdown",
            body: normalizedUserDesignRules,
          }
        : undefined,
      aiCoding: {
        defaultProjectMode: "existing-product-project",
        rules: themeLabAiCodingRules,
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

function designRuleRawUrl(file: string): string {
  return `${themeLabDesignRuleLibrary.rawBaseUrl}/${file}`
}

function designRuleRawFileList(): string {
  return themeLabDesignRuleLibrary.files
    .map((value) => `- \`${value}\` -> ${designRuleRawUrl(value)}`)
    .join("\n")
}

function colorTokenVocabularySection(): string {
  return `## Color & Token Vocabulary

This is the complete sanctioned vocabulary for structural UI. Everything you need is here, so do not reach for raw Tailwind palette colors or hex.

Canonical structural classes (shadcn semantic — the primary vocabulary):

- Surfaces: \`bg-background\`, \`bg-card\`, \`bg-popover\`, \`bg-muted\`, \`bg-secondary\`, \`bg-sidebar\`
- Text: \`text-foreground\`, \`text-muted-foreground\`, and each surface's matching \`*-foreground\`
- Borders / focus: \`border-border\`, \`ring-ring\`
- Actions: \`bg-primary text-primary-foreground\`, \`bg-secondary text-secondary-foreground\`, \`bg-destructive text-destructive-foreground\`
- Radius: \`rounded-[var(--radius-control)]\`, \`rounded-[var(--radius-card)]\`, \`rounded-[var(--radius-panel)]\`
- Spacing / density: \`h-[var(--control-height-sm)]\` / \`-md\` / \`-lg\`, \`p-[var(--panel-padding)]\`, \`gap-[var(--section-gap)]\`
- Elevation: \`[box-shadow:var(--elevation-card)]\`, \`[box-shadow:var(--elevation-popover)]\`
- Motion: \`duration-[var(--duration-base)]\`, \`ease-[var(--ease-standard)]\`

Status color (use only for real success / warning / info / danger meaning):

- soft: \`bg-success-bg text-success-foreground\` (same for warning / info / danger)
- solid: \`bg-success text-success-foreground\` (same for warning / info / danger)

Categorical color (non-status types, chart and legend series): \`bg-chart-1\`..\`bg-chart-5\`, \`text-chart-1\`..\`text-chart-5\`, \`border-chart-1\`..\`border-chart-5\`

- Assign a stable category-to-index mapping; the same category always uses the same chart color across tables, charts, and legends.
- Keep to about five meaningful hues; group or neutralize the long tail.

Neutral by default: tags, badges, and labels stay neutral (\`bg-muted\` or the \`outline\` variant) unless they carry real status, type, priority, or category meaning. Do not give every label its own color — that is the rainbow failure to avoid.

Pairing rule (mandatory): every filled background uses its matching \`-foreground\` token (e.g. \`bg-primary text-primary-foreground\`, \`bg-success text-success-foreground\`). Never use a same-role pair such as \`bg-primary text-primary\`.

Optional finer tokens: \`var(--surface-canvas|panel|raised|overlay)\` and \`var(--content-primary|secondary|tertiary)\` exist for finer hierarchy but are not required. Prefer the shadcn classes above and do not duplicate them.

Forbidden for structural UI:

- raw Tailwind palette classes (e.g. \`text-pink-600\`, \`bg-emerald-100\`)
- hardcoded hex or arbitrary OKLCH values
- one-off shadows, one-off border colors, mixed or legacy radius scales
- random gradient utilities
- new color scales beyond the sanctioned \`--status-*\` and \`--chart-1..5\` families

See \`design-rules/patterns/semantic-color.md\` for when to apply color versus staying neutral.`
}

function craftParadigmSection(theme: ThemeOutput): string {
  return `## Craft Paradigm

Normalization makes the UI consistent; craft makes it look good. Do both. Beauty here comes from hierarchy, spacing, restraint, and consistency — not decoration.

Good looks like:

- A calm, mostly neutral canvas with one confident brand accent on the primary action.
- Clear type hierarchy: one dominant page title, obvious section headings, quiet supporting text.
- Generous, even spacing and aligned edges; whitespace groups content before borders do.
- A few strong groups instead of many shallow cards.
- Status and category color used sparingly and meaningfully (status tokens, chart palette), never as rainbow decoration.
- Scannable tables and lists: aligned columns, restrained dividers, steady row rhythm.
- Consistent radius, elevation, and motion across every surface.

Theme-specific craft directives for this seed:

${markdownList(theme.vibe.visualContract.craft)}

Do not add decorative gradients, glassmorphism, random shadows, or ornament. The aesthetic is the result of disciplined hierarchy and token consistency, not added effects.`
}

function preservationContractSection(): string {
  return `## Preservation Contract

This is existing-product work. Preserve, across every file you touch:

- routes, navigation model, and information architecture
- APIs, data loading, mutations, event handlers, and state
- form schemas, validation, permissions, feature flags, and business logic
- workflow order and required domain copy

Do not:

- scaffold a new app, replace the component library, or create a parallel design-system folder
- overwrite global CSS wholesale or rewrite unrelated pages
- change APIs or data contracts, or leave handlers, validation, or state disconnected
- install dependencies without approval

After normalizing UI, reconnect existing APIs, data, handlers, validation, permissions, and state. This prompt is not the source of truth — the seed, the runtime CSS variables, and \`theme-lab.json\` are.`
}

function designRulesSection(): string {
  return `## Design Rules

Detailed rules live in separate files; this packet only routes to them. Do not inline or invent rules.

- Entrypoint: \`${themeLabDesignRuleLibrary.entrypoint}\` (raw fallback: ${themeLabDesignRuleLibrary.rawEntrypoint}).
- Load every \`requiredAlways\` rule: rule-router, ui-normalization, token-system, token-binding, visual-qa, completion-compliance.
- Detect page structure, inventory elements by type, then open only matched files from \`rules[].source\` (local first, raw URL otherwise).
- Apply matched rules before generic taste. Do not browse or imitate external visual references unless the user explicitly provides one. If a needed rule is missing, make the smallest safe normalization and report it.

Before editing, output a Rule Read Confirmation listing \`ruleIndexRead\`, \`requiredRuleFilesLoaded\`, \`matchedRuleFilesLoaded\` (each with \`source\`, \`elementType\`, \`firstHeading\`), and \`missingRuleFiles\`. Do not claim a rule was applied unless its file was opened.

Raw rule URLs:

${designRuleRawFileList()}`
}

function criticalRuleNotesSection(): string {
  return `## Critical Rule Notes

Easy-to-miss behaviors — follow them when the element appears:

- Sidebar: if the scope contains a sidebar, normalize the whole sidebar in the same task. Do not ask an open-ended "should I also update the sidebar?"; include it by default and add: "Direct Confirmation: The selected scope contains a sidebar, so sidebar normalization/replacement is included by default. Please confirm the full plan if you want me to proceed." Preserve nav data, routes, permissions, and active states. See \`design-rules/components/sidebar.md\`.
- Page heading: reuse the project's heading / action-bar composition with real product metadata. See \`design-rules/components/page-heading.md\`.
- Cards & tables: open \`design-rules/components/card.md\` and \`table.md\` before changing them; show scannable previews, not dense paragraphs.
- Forms & inputs: open \`design-rules/components/forms-and-inputs.md\`; preserve labels, validation, default values, submission, disabled/read-only, loading, success, and error behavior.
- Tabs & switches: open \`design-rules/components/tabs.md\`; use Tabs for single-select view/state switching instead of primary/secondary button rows.
- Overlays: open \`design-rules/components/overlays.md\`; preserve trigger, controlled open state, focus return, dismissal, form state, and destructive confirmation behavior.
- Badges & alerts: open \`design-rules/components/badges-and-alerts.md\` plus \`design-rules/patterns/semantic-color.md\`; keep labels neutral unless real status/category/priority meaning exists.
- Metrics & charts: open \`design-rules/components/metrics-and-charts.md\`; preserve calculations, units, filters, date ranges, chart transforms, and stable series color mapping.
- Page background: only a quiet top ambient wash per \`design-rules/patterns/page-background.md\`; never tint structural surfaces.
- Tags & status: see \`design-rules/patterns/semantic-color.md\` — neutral by default, status/chart tokens for meaning.`
}

function workflowSection(
  mode: ProjectImportMode,
  isProductWideTask: boolean
): string {
  const isPersistent = mode !== "one-shot-page-polish"

  const planTokenLine = isPersistent
    ? "- Plan the persistent contract install (the three touchpoints in stage 3)."
    : "- Plan the minimal complete one-shot token bridge (no persistent files)."

  const implementSetup = isPersistent
    ? `- Install exactly three persistent touchpoints, updating only marker blocks when they already exist:
  1. Runtime CSS variables in the existing global CSS file (\`/* theme-lab:runtime:start|end */\`).
  2. \`theme-lab.json\` at the project root.
  3. The target tool's native AI instruction file Theme Lab section (\`<!-- theme-lab:agents:start|end -->\`); resolve the file via the AI Instruction Target Resolver.
- Do not create \`theme.seed.json\`, \`vibe.manifest.json\`, \`theme.algorithm.ts\`, prompt files, or a design-system folder. Do not install local \`design-rules/\` files unless explicitly requested; read raw URLs instead.${
        isProductWideTask
          ? "\n- Establish one product layout grammar (app shell, header rhythm, content width, action placement, state design, responsive behavior) before normalizing individual pages."
          : ""
      }`
    : `- Do not create persistent files (no \`theme-lab.json\`, no AI instruction file, no design-system folder, no \`design-rules/\`). Modify only the selected scope.
- Ensure tokens are available: prefer the project's existing token system; otherwise add the smallest complete runtime CSS variable bridge to the existing global CSS, covering every touched family (surfaces, text, borders, focus, radius, control height, spacing, elevation, status, motion). No partial primary-only bridge.`

  const analyzeScope = isPersistent
    ? "route/page inventory"
    : "selected scope"

  return `## Workflow

Work in four stages. Do not start by swapping class values.

### 1. Analyze

- Inspect the repo: framework, CSS strategy, component system, global CSS path, existing tokens/shadcn, and the ${analyzeScope}. Output a compact Project Mode record (\`projectMode\`, \`framework\`, \`cssStrategy\`, \`componentSystem\`, \`globalCssPath\`, \`hasExistingTokens\`, \`hasShadcn\`, \`safeFilesToChange\`, \`filesNotToTouch\`).
- Global CSS detection order: \`components.json\` tailwind.css path -> \`app/globals.css\` -> \`src/app/globals.css\` -> \`styles/globals.css\` -> \`src/styles/globals.css\` -> root-imported global CSS. Never create a new global CSS file when one exists.
- Load the design rules and emit the Rule Read Confirmation.
- Inventory UI by element type: cards, tables, buttons/actions, filters, sidebar/nav, page heading, forms/inputs, tabs/dialogs/popovers, badges/status/alerts, states, metrics/charts, page canvas.
- Extract the business logic and data flows named in the Preservation Contract.

### 2. Beautify Plan

- Name the top problems (hierarchy, component consistency, token/state/contrast).
- State the normalization boundary: what content and workflow stay unchanged, which components/classes get standardized, which token pairs apply.
- Apply the Craft Paradigm: heading hierarchy, spacing rhythm, surface/elevation, restrained accent, stable categorical color mapping.
${planTokenLine}

### 3. Implement

${implementSetup}
- Normalize components with existing project components and shadcn/ui primitives; keep the product recognizable.
- Bind surfaces, text, borders, focus, states, radius, spacing, elevation, and motion to tokens; apply status and chart color per the vocabulary.
- Reconnect existing APIs, data, handlers, validation, permissions, and state.

### 4. Review

- Token audit on changed files: no raw palette / hex / arbitrary OKLCH; matching foreground/background pairs; token-backed radius, elevation, spacing, focus, and motion; status and chart color used correctly.
- Beauty review (before -> after): is it calmer, clearer, and more scannable? Is hierarchy stronger and the primary action obvious? Were the craft directives applied? If a change added noise, simplify it before finishing.
- Run the \`design-rules/core/completion-compliance.md\` gate and available checks (typecheck, lint, build).`
}

function finalReportSection(mode: ProjectImportMode): string {
  if (mode === "one-shot-page-polish") {
    return `## Final Report

\`\`\`md
## Files Changed
## Rule Read Confirmation (index, required, matched, missing)
## Preservation (logic/APIs/data/state preserved + reconnected)
## Normalization (top hierarchy / consistency / token problems solved; components standardized)
## Beautify (craft directives applied; hierarchy/spacing/color decisions)
## Token Bridge & Audit (bridge created/reused; fg/bg pairs; radius/elevation/spacing/focus/motion; status/chart)
## Better-Than-Before (calmer / clearer / more scannable; simplifications made)
## QA (typecheck / lint / build / manual)
## Risks
\`\`\``
  }

  return `## Final Report

\`\`\`md
## Project Mode
## Files Changed
## Rule Read Confirmation (index, required, matched, missing)
## Contract Installed (global CSS block / theme-lab.json / AI instruction file)
## Preservation (logic/APIs/data/state preserved + reconnected)
## Normalization (components standardized; shadcn/primitives used; product layout grammar)
## Beautify (craft directives applied; hierarchy/spacing/color decisions)
## Token Audit (fg/bg pairs; radius/elevation/spacing/focus/motion; status/chart)
## Visual QA (before -> after: calmer / clearer / scannable; pages still needing alignment)
## QA (typecheck / lint / build / manual)
## Risks / Follow-ups
\`\`\``
}

function agentsMarkerBlock(userDesignRules?: string): string {
  return `<!-- theme-lab:agents:start -->

# Theme Lab Contract

This project uses a Theme Lab generated visual system.

## Language Rule

All AI-facing instructions, theme manifests, vibe descriptors, task packets, and final implementation reports must be written in English. Preserve code identifiers, file paths, route paths, API names, and user-provided business copy literally when needed.

## Source of Truth

- \`theme-lab.json\` contains the theme DNA, algorithm version, vibe, token contract, and AI coding rules.
- \`design-rules/index.json\` routes element types to detailed markdown rule files.
- The global CSS file contains the runtime CSS variables.
- One-time prompts are not the source of truth.

## Theme Change Rule

Do not invent new structural visual values. When changing UI, consume the compiled CSS variables and token classes. When changing theme direction, update the Theme Lab seed in \`theme-lab.json\` and regenerate the compiled CSS variables.

${userDesignRulesSection(userDesignRules)}## UI Normalization Rule

Before UI changes, read \`design-rules/index.json\` when it exists, load \`requiredAlways\` rules, inventory the scope by element type, and open only matched files from \`rules[].source\`. Output a Rule Read Confirmation before editing; do not claim a rule was applied unless its file was opened.

Treat redesign/optimize/rebuild/refactor requests as UI normalization by default, not a full redesign. Preserve existing content, information architecture, workflow order, routes, APIs, state, validation, permissions, and domain copy. Do not wipe the UI tree or move major content regions unless the user asks for a full redesign. Prefer existing project components and shadcn/ui primitives. Do not browse external visual references unless the user provides one. Reconnect APIs, data, handlers, validation, navigation, permissions, and state after normalizing.

## Styling Rule

Allowed:

- shadcn semantic classes and token-backed Tailwind utilities
- the \`--status-*\` families (\`bg-success-bg text-success-foreground\`, \`bg-success text-success-foreground\`, and warning/info/danger)
- the categorical palette \`bg-chart-1..5\` / \`text-chart-1..5\` with a stable category-to-index mapping
- token-backed radius such as \`rounded-[var(--radius-card)]\`, \`rounded-[var(--radius-control)]\`, \`rounded-[var(--radius-panel)]\`

Tags and labels stay neutral unless they carry real status or category meaning. Every filled background uses its matching \`-foreground\` token; never use same-role pairs such as \`bg-primary text-primary\`.

Forbidden for structural UI:

- raw Tailwind palette classes, hardcoded hex, arbitrary OKLCH values
- one-off shadows or border colors, legacy/mixed radius scales, random gradients
- new color scales beyond the sanctioned \`--status-*\` and \`--chart-1..5\` families

## Workflow

1. Read \`theme-lab.json\` and \`design-rules/index.json\` (when present); load required and matched rules.
2. Locate the global CSS theme block and the selected scope.
3. Preserve business logic, API contracts, data loading, handlers, validation, and permissions.
4. Normalize the scope with project components, shadcn/ui primitives, matched rules, and Theme Lab tokens.
5. Verify semantic foreground/background pairs and reconnect APIs and interactions.
6. Report files changed, rule files loaded, QA, and risks.

<!-- theme-lab:agents:end -->`
}

function themeArtifactsSection(
  options: ProjectImportPromptOptions,
  targetScope: string
): string {
  const theme = options.theme
  const compactVibe = {
    name: theme.vibe.name,
    keywords: theme.vibe.keywords,
    visualContract: theme.vibe.visualContract,
  }

  if (options.mode === "one-shot-page-polish") {
    return `Selected scope: ${targetScope || "(not provided)"}

Runtime CSS variables / compact theme.css reference:
\`\`\`css
${runtimeCssBlock(theme)}
\`\`\`

Vibe summary:
\`\`\`json
${JSON.stringify(compactVibe, null, 2)}
\`\`\`

Token contract:
\`\`\`json
${JSON.stringify(themeLabTokenContract, null, 2)}
\`\`\``
  }

  const persistentArtifacts = `Runtime CSS variables / theme.css:
\`\`\`css
${runtimeCssBlock(theme)}
\`\`\`

\`theme-lab.json\` content:
\`\`\`json
${projectImportManifestJson(theme, options.userDesignRules)}
\`\`\`

Target AI instruction file Theme Lab section content:
\`\`\`md
${agentsMarkerBlock(options.userDesignRules)}
\`\`\`

Vibe summary:
\`\`\`json
${JSON.stringify(compactVibe, null, 2)}
\`\`\`

Token contract:
\`\`\`json
${JSON.stringify(themeLabTokenContract, null, 2)}
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

function compileOneShotPagePolishPrompt(
  options: ProjectImportPromptOptions,
  targetScope: string
): string {
  return `# One-Shot Selected-Scope UI Normalization Task

${promptRouteSection(options, targetScope, "one-shot-selected-scope-ui-normalization")}

## Language

Write all task instructions, plans, notes, and reports in English. Preserve code identifiers, file paths, route paths, API names, and user-provided business copy literally.

## Goal

Normalize and beautify one selected page or component, once, with no persistent files. Preserve its behavior, content, information architecture, and workflow order. This is neither a blind token swap nor a redesign from scratch: make the existing UI more consistent and more polished by standardizing components and binding styles to Theme Lab tokens.

${preservationContractSection()}

## Hard Scope

Selected scope: \`${targetScope || "(not provided)"}\`

If no scope is provided, inspect the project and ask for a route, page, component, or screenshot before editing. Modify only the selected scope; do not optimize other pages or broad cross-page consistency, and do not create \`theme-lab.json\`, any AI instruction file, \`theme.seed.json\`, \`vibe.manifest.json\`, \`theme.algorithm.ts\`, a design-system folder, or \`design-rules/\` files.

${colorTokenVocabularySection()}

## Compact Theme Lab Reference

Use this as token and visual-direction context. Do not persist it as a project contract.

\`\`\`json
${oneShotThemeReferenceJson(options.theme)}
\`\`\`

${craftParadigmSection(options.theme)}

${designRulesSection()}

${criticalRuleNotesSection()}

${workflowSection(options.mode, false)}

${finalReportSection(options.mode)}
`
}

export function compileProjectImportPrompt(
  options: ProjectImportPromptOptions
): string {
  const targetScope = options.targetScope?.trim() ?? ""

  if (options.mode === "one-shot-page-polish") {
    return compileOneShotPagePolishPrompt(options, targetScope)
  }

  const isProductWideTask = options.task === "refactor-product-wide"

  return `# Theme Lab AI Task Packet

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

This is an existing product project (assume so unless the repo is clearly empty or the user asks for a new one). Install the Theme Lab visual contract and ${
    isProductWideTask
      ? "align the product UI across routes into one coherent, token-bound system"
      : "normalize the selected scope into the token-bound system"
  } — normalizing inconsistent components and beautifying the result without redesigning workflows. Token replacement alone is not success. Inspect the project before changing any file; do not scaffold a new app.

${preservationContractSection()}

${colorTokenVocabularySection()}

## Theme Artifacts

${themeArtifactsSection(options, targetScope)}

${craftParadigmSection(options.theme)}

${designRulesSection()}

${criticalRuleNotesSection()}

${aiInstructionTargetResolverSection()}

${workflowSection(options.mode, isProductWideTask)}

${finalReportSection(options.mode)}
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
