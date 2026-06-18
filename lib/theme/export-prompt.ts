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

function codeList(values: readonly string[]): string {
  return values.map((value) => `- \`${value}\``).join("\n")
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

The third persistent Theme Lab touchpoint is the target tool's native AI instruction file, not always \`AGENTS.md\`.

Use this mapping:

${aiInstructionTargetList()}

Resolution rules:

1. If the user names a target AI tool, use that tool's native instruction file.
2. If the target project already has one of the supported instruction files, update that existing file.
3. If multiple supported instruction files already exist, update each existing file with the same concise Theme Lab section unless the user asks to target only one tool.
4. If the target tool is unknown and no supported instruction file exists, use \`AGENTS.md\` as the cross-agent fallback.
5. Do not create every supported instruction file by default. Create multiple instruction files only when the user explicitly requests multi-tool compatibility.

The content should remain the same concise Theme Lab section. Only the filename/location changes by tool.`
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

Use this section as the explicit task-router record before editing.

- promptTemplate: \`${promptTemplate}\`
- selectedMode: \`${options.mode}\` (${modeLabels[options.mode]})
- selectedTask: \`${options.task}\` (${taskLabels[options.task]})
- targetScope: \`${targetScope || "(not provided)"}\`
- designRuleRouter: \`${themeLabDesignRuleLibrary.entrypoint}\`
- designRuleRawRouter: ${themeLabDesignRuleLibrary.rawEntrypoint}
- ruleLoading: detect page structure first, read requiredAlways rules, open matched page-structure/block rules, then open matched component/pattern/token rules from local files or raw GitHub URLs`
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

Use these user-authored rules as the project-specific UI judgment source before generic taste or external references.

`
}

function designRuleFileList(): string {
  return codeList(themeLabDesignRuleLibrary.files)
}

function designRuleRawUrl(file: string): string {
  return `${themeLabDesignRuleLibrary.rawBaseUrl}/${file}`
}

function designRuleRawFileList(): string {
  return themeLabDesignRuleLibrary.files
    .map((value) => `- \`${value}\` -> ${designRuleRawUrl(value)}`)
    .join("\n")
}

function designRuleFileRouterSection(): string {
  return `## Distributed Design Rule Router

This prompt is a detector and router. Detailed design rules live in separate
files. Do not compress component, block, page-structure, or token-system rules
into this prompt.

Rule library entrypoint:

- \`design-rules/index.json\`
- Raw GitHub fallback: ${themeLabDesignRuleLibrary.rawEntrypoint}

Routing workflow:

1. Read \`design-rules/index.json\` if it exists.
   - If local files are not available, read ${themeLabDesignRuleLibrary.rawEntrypoint}.
2. Load every rule marked \`requiredAlways\`, including token-system, token-binding, visual QA, and completion compliance.
3. Detect page structure first: app shell, dashboard, index/table, detail page, settings, form/CRUD, auth, onboarding, tool page, or other product surface.
4. Open the matched page-structure/block rule first, such as \`design-rules/blocks/page-shell.md\` or \`design-rules/blocks/dashboard.md\`.
5. Inventory components and blocks inside that structure: page heading, sidebar, cards, tables, actions, filters, forms, dialogs/sheets, states, and page canvas.
6. Match each element type against \`rules[].appliesTo\`.
7. Open only the matched files from \`rules[].source\`, using local files first or the corresponding raw GitHub URL when local files are unavailable.
8. Build the token system plan from \`design-rules/core/token-system.md\` before changing token-bearing UI.
9. Apply matched rules before generic UI judgment.
10. Before final response, verify completion with \`design-rules/core/completion-compliance.md\`.
11. If a needed rule file is missing, keep the change conservative and report the missing rule file.
12. Do not load unrelated rule files unless the user asks for a full rule audit.

Rule Read Confirmation is mandatory before editing:

\`\`\`json
{
  "ruleIndexRead": "design-rules/index.json",
  "requiredRuleFilesLoaded": [
    "design-rules/core/rule-router.md",
    "design-rules/core/ui-normalization.md",
    "design-rules/core/token-system.md",
    "design-rules/core/token-binding.md",
    "design-rules/core/visual-qa.md",
    "design-rules/core/completion-compliance.md"
  ],
  "matchedRuleFilesLoaded": [
    {
      "elementType": "page-shell",
      "source": "design-rules/blocks/page-shell.md",
      "firstHeading": "Page Shell And Layout"
    },
    {
      "elementType": "card",
      "source": "design-rules/components/card.md",
      "firstHeading": "Cards"
    }
  ],
  "missingRuleFiles": []
}
\`\`\`

If the selected scope contains cards, \`design-rules/components/card.md\` must be opened and listed before card UI is changed. If a rule file cannot be opened, do not claim the rule was applied. Ask the user to provide the local rule files or raw file URLs, or continue conservatively and report the missing file when the task allows it.

If the selected scope changes page structure, \`design-rules/blocks/page-shell.md\` must be opened and listed before page-shell/layout UI is changed.

If the task installs, bridges, or audits Theme Lab tokens, \`design-rules/core/token-system.md\` must be opened and listed before token-bearing UI is changed.

Before final response, \`design-rules/core/completion-compliance.md\` must be opened and used as the completion gate.

Known rule files:

${designRuleFileList()}

Raw GitHub rule URLs:

${designRuleRawFileList()}

User-authored rules in this task are still highest priority. The distributed files are the reusable project rule library.`
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

Do not manually invent new structural visual values.

When changing UI, consume the compiled CSS variables and token classes.

When changing the theme direction, update the Theme Lab seed in \`theme-lab.json\` and regenerate the compiled CSS variables.

${userDesignRulesSection(userDesignRules)}## UI Normalization Rule

## Distributed Design Rule Router

Before UI changes, read \`design-rules/index.json\` when it exists. Load required rules, inventory the selected scope by element type, then open only matched files from \`rules[].source\`.

Do not load every rule file by default. Do not compress the rule library into a single prompt. If a matching rule file is missing, make the smallest safe normalization and report the missing rule.

Before editing, output a Rule Read Confirmation with \`ruleIndexRead\`, \`requiredRuleFilesLoaded\`, \`matchedRuleFilesLoaded\`, and \`missingRuleFiles\`. For matched files, include exact \`source\`, matched \`elementType\`, and first markdown heading. Do not claim a rule was applied unless its file was actually opened.

When the user asks to redesign, optimize, rebuild, or refactor a selected UI scope, treat it as a UI normalization task by default, not a full redesign.

Preserve the user's existing page content, information architecture, workflow order, routes, APIs, state, validation, permissions, and domain copy.

Do not wipe out the visible UI tree, replace the page layout from scratch, or move major content regions unless the user explicitly asks for a full redesign or the current structure blocks usability.

Improve the existing page by standardizing components, removing ad hoc styling, aligning spacing/radius/elevation, improving hierarchy and states, and connecting the UI to the exported Theme Lab token system.

Prefer existing project components and shadcn/ui primitives for controls and repeated patterns, but keep the current product structure recognizable.

Use user-authored Theme Lab design rules first. Do not browse or use external visual references. Only make an exception when the user explicitly provides a reference or asks for one.

Before coding, state the normalization boundary: what content and workflow stay unchanged, which components/classes are being standardized, and which token pairs will be applied.

Semantic token pairs are mandatory. For filled surfaces, pair backgrounds with their matching foreground token, for example \`bg-primary text-primary-foreground\`, \`bg-secondary text-secondary-foreground\`, \`bg-card text-card-foreground\`, \`bg-popover text-popover-foreground\`, \`bg-accent text-accent-foreground\`, and \`bg-destructive text-destructive-foreground\`. Never use \`bg-primary text-primary\` or another same-role background/text pairing.

If the user provides a custom design rule, treat that rule as higher priority than generic UI taste. If no rule exists for a pattern, make the smallest safe normalization and state the gap instead of inventing a new style system.

Reconnect existing API calls, data loaders, mutations, event handlers, validation, navigation, permissions, and state after component normalization.

## Existing Project Rule

Default to existing-product-project unless the repository is clearly empty or the user explicitly requests a new project.

Preserve:

- routes
- API calls
- data loading
- state management
- event handlers
- form schemas
- validation
- permissions
- feature flags
- business logic
- domain copy

Do not:

- scaffold a new app inside this project
- replace the component system
- create a parallel design-system folder
- overwrite global CSS wholesale
- install dependencies unless explicitly approved
- rewrite unrelated pages
- change APIs or data contracts

The three-file Theme Lab contract limits only persistent theme contract files. UI normalization tasks may modify existing route, layout, app shell, and component files when those files are part of the approved normalization plan.

## Styling Rule

Allowed:

- shadcn adapter tokens
- semantic CSS variables
- token-bound Tailwind classes
- existing component variants
- token-backed radius values such as \`rounded-[var(--radius-card)]\`, \`rounded-[var(--radius-control)]\`, and \`rounded-[var(--radius-panel)]\`

Forbidden for structural UI:

- raw Tailwind palette classes
- hardcoded hex colors
- arbitrary OKLCH values
- one-off shadows
- one-off border colors
- legacy non-token radius values
- arbitrary border-radius values
- mixed radius scales
- same-role filled background/text pairs such as \`bg-primary text-primary\`
- filled semantic backgrounds without matching foreground tokens
- unapproved color scales

## Workflow

Before UI changes:

1. Read \`theme-lab.json\`.
2. Read \`design-rules/index.json\` if it exists.
3. Load only required and matched rule files.
4. Locate the global CSS theme block.
5. Identify the selected page/component scope.
6. Preserve business logic, API contracts, data loading, handlers, validation, and permissions.
7. Normalize the selected scope's existing UI with project components, shadcn/ui primitives, matched design rules, and Theme Lab semantic tokens.
8. Verify semantic foreground/background token pairs and reconnect APIs and interactions.
9. Report files changed, rule files loaded, QA, and risks.

<!-- theme-lab:agents:end -->`
}

function selectedStrategySection(mode: ProjectImportMode): string {
  if (mode === "one-shot-page-polish") {
    return `Mode: One-shot selected-scope UI normalization

This is the no-persistence option for improving one page or component without changing the product's structure. Keep the selected scope recognizable, preserve its content and workflow, and normalize the UI with project components and Theme Lab tokens.

File strategy:
- Do not create \`theme-lab.json\`.
- Do not create or update any AI instruction file such as \`AGENTS.md\`, \`CLAUDE.md\`, \`GEMINI.md\`, \`.cursor/rules/*.mdc\`, or \`.github/copilot-instructions.md\`.
- Do not create or update \`design-rules\` files unless the user explicitly provides the exported rule package for this task.
- Do not create \`theme.seed.json\`.
- Do not create \`vibe.manifest.json\`.
- Do not create \`theme.algorithm.ts\`.
- Do not create a design-system folder.
- Do not install dependencies.
- Modify only the selected page/component scope.
- Inside that scope, preserve existing content, information architecture, workflow order, and useful layout structure.
- Replace ad hoc controls and repeated style fragments with existing project components or shadcn/ui primitives when behavior can be preserved.
- Reconnect existing APIs, data loaders, mutations, handlers, validation, and state after normalizing the UI.
- If no selected scope is provided, stop after project inspection and ask the user for a target scope.

Token strategy:
- Create or reuse the smallest complete token bridge required for the selected scope.
- The bridge must cover every touched token family: surfaces, foregrounds, borders, focus rings, radius, control height, spacing/density, elevation, states, and motion.
- Do not ship a partial bridge with only primary/background colors.
- Use \`design-rules/core/token-system.md\` or its raw GitHub URL to build the token plan.
- Keep the bridge compatible with future optimization, so later pages can reuse the same semantic token names instead of inventing new values.

Tradeoff:
This option avoids persistent Theme Lab files. If \`design-rules/index.json\` already exists, read matched rule files. If it does not exist, read the raw GitHub rule index and matched raw rule URLs from this prompt.`
  }

  if (mode === "full-reproducible-package") {
    return `Mode: Full reproducible package

This is the advanced option for teams or long-term projects that want local theme regeneration.

File strategy:
Start with the persistent project contract:

1. Existing global CSS theme block
2. \`theme-lab.json\`
3. Target tool's native AI instruction file Theme Lab section

Then install or update the distributed design rule library when a rule package is provided:

- \`design-rules/index.json\`
- \`design-rules/**/*.md\`

Additionally, the AI may create:

- \`theme.seed.json\`
- \`vibe.manifest.json\`
- \`theme.algorithm.ts\` or a local \`deriveTheme\` file, depending on existing project structure

Rules:
- Do not add dependencies.
- Do not create a large enterprise design system.
- Do not create prompt files unless explicitly requested.
- Do not create a duplicate component library.
- Do not rewrite unrelated app files.
- If the project is not TypeScript/JavaScript based, ask before creating algorithm files.

## Theme Change Rule

When changing UI, consume the existing compiled CSS variables and token contract.

When changing theme direction, update the seed, then regenerate compiled CSS variables through Theme Lab or the available local theme generation pipeline.

Do not manually invent new structural visual values.

Limitation:
Do not invent algorithm internals. Use the provided seed, algorithmVersion, runtime CSS variables, and included algorithm handoff only when it fits the local project structure.`
  }

  return `Mode: Persistent project contract

This is the recommended option for existing projects.

This mode is not only a token-contract install. After the persistent contract is installed, align the product UI system across routes and major product screens.

Across the product, preserve existing page content, information architecture, workflow order, routes, API contracts, data loading, mutations, event handlers, validation, permissions, feature flags, state transitions, and required domain copy. Normalize inconsistent components and styling; do not redesign pages from scratch by default.

Use shadcn/ui primitives as implementation material for controls and repeated patterns. Keep the current product structure and connect it to Theme Lab tokens unless a user-authored rule says otherwise.

Keep the aligned product visually unified across pages. Similar page types must share layout structure, header rhythm, content width, action placement, table/form/detail patterns, state design, and responsive behavior.

File strategy:
For theme persistence, create or update exactly these persistent touchpoints:

1. Existing global CSS theme block
2. \`theme-lab.json\`
3. Target tool's native AI instruction file Theme Lab section

The "exactly three persistent touchpoints" rule applies to the Theme Lab
contract. The distributed \`design-rules/\` library is a separate rule reference
package and is raw-link based by default.

Do not create or update local \`design-rules/\` files unless the user explicitly
asks to install the rule library into the target project. Raw GitHub rule links
are the default way to read component, block, token-system, and compliance
rules.

The long-term project contract is complete when these three touchpoints are
landed:

- global CSS runtime token block in the existing global CSS file
- \`theme-lab.json\`
- target tool's native AI instruction file Theme Lab section

${aiInstructionTargetResolverSection()}

Do not create additional theme files unless the user explicitly requests the full reproducible package.

Global CSS marker:

\`\`\`css
/* theme-lab:runtime:start */
/* generated runtime variables */
/* theme-lab:runtime:end */
\`\`\`

AI instruction file marker:

\`\`\`md
<!-- theme-lab:agents:start -->
...
<!-- theme-lab:agents:end -->
\`\`\`

If marker blocks already exist, update only the marker block.
Do not rewrite entire files.

## Persistent Theme Contract

Use the stable three-file contract:

1. Runtime CSS variables in the existing global CSS file.
2. \`theme-lab.json\` at the project root.
3. Target tool's native AI instruction file Theme Lab section.
   - Use \`CLAUDE.md\` for Claude Code.
   - Use \`AGENTS.md\` for Codex, Qoder, and generic agents.
   - Use the AI Instruction Target Resolver for Cursor, Copilot, Gemini, and Windsurf.

Use the distributed design-rule library separately:

- \`design-rules/index.json\`
- matched \`design-rules/**/*.md\` files

Do not create:

- \`theme.seed.json\`
- \`vibe.manifest.json\`
- prompt files
- design-system folder
- duplicate component library
- \`theme.algorithm.ts\`

Exception:
Create \`theme.algorithm.ts\` only if the user explicitly requests local deterministic regeneration.`
}

function taskInstructionSection(
  task: ProjectImportTask,
  targetScope: string
): string {
  if (task === "visual-review") {
    return `Task: ${taskLabels[task]}

Do not modify files. Only inspect and report.
Do not create files.
Do not edit CSS.
Do not run formatters that change files.
You may read files, run non-mutating checks, and produce recommendations.`
  }

  if (task === "refactor-selected-scope") {
    return `Task: ${taskLabels[task]}

Normalize only the selected page/component scope's visible UI.
The selected scope is required for this task.
If the selected scope cannot be found, stop and ask the user before changing files.

This is a component normalization and token-connection task, not a full redesign and not a blind token swap.
Preserve business rules, data flow, handlers, validation, permissions, and domain copy.
Preserve the current page content, information architecture, workflow order, and useful layout structure.
Replace only ad hoc controls, inconsistent repeated wrappers, raw visual classes, broken spacing/radius/elevation, and unsafe token usage.
Use existing project components or shadcn/ui primitives where they improve consistency without changing behavior, then reconnect the existing APIs and interactions.`
  }

  if (task === "refactor-product-wide") {
    return `Task: ${taskLabels[task]}

This is a product-wide UI alignment task for an existing product, not a redesign-from-scratch and not a token-only swap.

Install the persistent Theme Lab contract, then align visible UI patterns across product routes and major product screens. Preserve existing content, information architecture, workflow order, routes, API contracts, data loading, mutations, event handlers, validation, permissions, feature flags, state transitions, and required domain copy.

Do not treat all visible UI as replaceable. Normalize inconsistent wrappers, bespoke controls, non-shadcn-like controls, spacing, radii, shadows, breakpoints, and page composition only where they create inconsistency, unreadability, or broken states.

Create a consistent product layout grammar before editing pages. The aligned product should feel like one coherent application while preserving each page's existing purpose and workflow: shared app shell, sidebar/header behavior, page header rhythm, content width rules, card/table/form/detail patterns, action placement, empty/loading/error states, and responsive behavior must remain consistent across pages.

Use shadcn/ui primitives as implementation material for controls and repeated patterns. Use user-authored Theme Lab design rules for visual judgment; do not browse external references unless explicitly requested by the user.

Do not deliver isolated page makeovers that each use a different layout style. Do not preserve legacy bespoke controls when they can be normalized safely. Reconnect all existing APIs and interactions after normalizing each page.`
  }

  return `Task: ${taskLabels[task]}

Install the selected Theme Lab contract.
Target scope is optional for this task.
${
  targetScope
    ? "After installing the contract, normalize the selected scope with existing project components, shadcn/ui primitives, semantic token pairs, and reconnect existing APIs."
    : "If no selected scope is provided, install the allowed contract files only and ask the user for a route, page, component, or feature area before doing UI normalization."
}`
}

function selectedScopeSection(targetScope: string): string {
  return `Selected scope:
\`${targetScope || "(not provided)"}\`

If no selected scope is provided, inspect the project but do not perform broad UI changes. Ask the user to provide a route, page, component, or feature area before normalizing UI.

The selected scope is a normalization boundary. Inside this boundary, preserve business behavior, API contracts, content, information architecture, and useful workflow structure while improving component consistency and token usage.`
}

function structuralRewriteMandateSection(): string {
  return `## Selected-Scope Normalization Mandate

This task is selected-scope UI normalization, not a redesign from scratch and not a blind token migration.

Non-negotiable requirements:

- Preserve business rules, routes, APIs, data loading, state, handlers, forms, validation, permissions, feature flags, and domain copy.
- Preserve existing page content, information architecture, workflow order, and useful layout structure.
- Reconnect existing API calls, data loaders, mutations, event handlers, validation, navigation, permissions, and state to the normalized UI.
- Do not change page regions, navigation model, primary workflow order, or content hierarchy unless the current structure is clearly broken or the user explicitly asks for a redesign.
- Prefer existing project components and shadcn/ui primitives for sidebars, buttons, inputs, selects, checkboxes, switches, tabs, tables, cards, dialogs, sheets, dropdowns, tooltips, badges, alerts, breadcrumbs, and forms.
- Replace bespoke, non-shadcn, or non-shadcn-like visible controls only when behavior can be preserved and the replacement reduces inconsistency.
- If a needed shadcn component file is missing, inspect the existing shadcn setup and add local component files through the project's established shadcn workflow when that does not introduce new production dependencies. Ask before installing new package dependencies.
- Use Theme Lab tokens through semantic classes and token-backed utilities after the existing UI structure is understood.

## Component Normalization Acceptance Gate

The normalized UI should look like the same product page made more consistent, not like a different product.

A valid result should satisfy these checks inside the selected scope:

- Existing content and workflow remain recognizable.
- Ad hoc sidebars, buttons, inputs, selects, toggles, tabs, tables, badges, alerts, cards, dialogs, or menus are replaced with existing project components or shadcn/ui primitives where safe.
- Repeated visual class strings are consolidated into component variants, helper functions, or consistent local patterns when useful.
- Raw palette colors, hardcoded hex values, arbitrary OKLCH values, one-off shadows, mixed radii, and unsafe arbitrary spacing are removed from theme-bearing UI.
- Theme Lab semantic tokens are applied through correct foreground/background pairs.
- Loading, error, disabled, selected, active, hover, focus-visible, and empty states remain connected and readable where present.
- Existing API/data/mutation/handler behavior remains connected.

Invalid outcomes:

- Replacing the page with a new layout when component normalization would solve the problem.
- Moving major sections or changing workflow order only to match an external reference or invented pattern.
- Applying background tokens without the matching foreground token.
- Using \`bg-primary text-primary\`, \`bg-secondary text-secondary\`, \`bg-accent text-accent\`, \`bg-destructive text-destructive\`, or any same-role filled background/text pairing.
- Keeping custom hand-written controls when equivalent project/shadcn components already exist and can preserve behavior.
- Disconnecting APIs, mutations, handlers, loading/error states, or form validation.
- Only editing global CSS, theme variables, or token mappings while leaving obvious component inconsistency untouched.

If you cannot safely normalize the UI or reconnect the APIs, stop and explain the blocker instead of delivering a disconnected patch.

Before editing, write a short normalization plan that states:

1. Which content, workflow, and data flows stay unchanged.
2. Which components or repeated class patterns will be standardized.
3. Which Theme Lab token pairs will be applied.
4. Which user-authored design rules apply, or which rule is missing.
5. How existing APIs, handlers, validation, permissions, and state will remain connected.
6. If a sidebar is detected: "Direct Confirmation: The selected scope contains a sidebar, so sidebar normalization/replacement is included by default. Please confirm the full plan if you want me to proceed."`
}

function productWideRebuildMandateSection(): string {
  return `## Product-Wide UI Alignment Mandate

This task is product-level UI alignment, not a redesign from scratch and not a page-by-page makeover.

Non-negotiable requirements:

- Preserve routes, page content, information architecture, workflow order, API contracts, data loading, mutations, event handlers, validation, permissions, feature flags, state transitions, and required domain copy.
- Do not replace visible UI structure across product pages by default. Normalize inconsistent wrappers, bespoke controls, non-shadcn-like controls, spacing, radii, shadows, breakpoints, and page composition where they create inconsistency or unreadability.
- Establish one consistent product layout grammar before editing pages. The product should use coherent page header rhythm, content width rules, app shell/sidebar/header behavior, section spacing, action placement, state design, and responsive behavior while preserving each page's workflow.
- Use existing project components and shadcn/ui primitives as implementation materials for repeated controls and surfaces.
- Use user-authored Theme Lab design rules for diagnosed page-type problems. Do not browse external references unless explicitly requested by the user.
- Reconnect existing API calls, data loaders, mutations, event handlers, validation, navigation, permissions, and state to the aligned product UI.
- Apply Theme Lab tokens through semantic foreground/background pairs and token-backed radius, elevation, spacing, focus, and state classes.

## Product Character Rule

Do not produce a generic shadcn SaaS look.

Use shadcn primitives as implementation materials, but create a product-specific visual rhythm through:

- page header hierarchy
- density
- surface contrast
- card grouping
- navigation emphasis
- primary action placement
- empty/loading/error state tone
- restrained brand color usage

The final UI should feel like this product using shadcn, not shadcn pasted onto this product.

Product-wide acceptance gate:

- The aligned pages share a consistent app shell and navigation model where such a shell already exists or is clearly needed.
- Similar page types use the same component grammar without forcing unrelated layouts to match.
- Page headers, primary/secondary actions, filters, tables, forms, detail panels, empty/loading/error states, and responsive behavior are consistent across the product.
- Legacy bespoke visible controls are normalized into project/shadcn-like components when behavior can be preserved.
- Existing API/data/mutation/handler behavior remains connected after alignment.
- Filled semantic surfaces use matching foreground tokens, especially buttons, badges, selected tabs, active nav items, alerts, and destructive actions.
- The result looks like the existing product made more coherent and readable, not like a different product.

## Visual QA Gate

Before final report, compare the aligned UI against the previous UI and explicitly report:

1. What content and workflow stayed unchanged.
2. What components or page patterns were unified.
3. What old UI debt was removed or reduced.
4. What user workflows remain unchanged.
5. What semantic token pairs and responsive states were checked.
6. Which pages still need alignment.

Before editing, write a product alignment plan that states:

1. The route/page inventory and page-type groups.
2. The existing app shell and layout grammar to preserve.
3. Which page/component patterns will be normalized.
4. Which user-authored design rules apply to each page type.
5. Which legacy visible controls will be normalized.
6. Which semantic token pairs will be used for filled surfaces.
7. How APIs, handlers, validation, permissions, state, and cross-page consistency will be verified.
8. If a sidebar is detected: "Direct Confirmation: The selected scope contains a sidebar, so sidebar normalization/replacement is included by default. Please confirm the full plan if you want me to proceed."`
}

function referenceFirstQualityGateSection(): string {
  return `## User-Authored Design Rules Gate

Do not browse, import, or imitate external visual references. The design source is the user's own Theme Lab rules, the current product workflow, and the exported token system.

Before editing, identify which user-authored rule applies to the selected UI pattern. If no rule exists, make the smallest safe normalization using existing project components and Theme Lab tokens, then state that a design rule is missing.

Rule selection:

- Token hookup, colors, radius, shadows, state classes: use Theme Lab token contract and semantic token pairs.
- Page canvas background: open \`design-rules/patterns/page-background.md\` or its raw GitHub URL when a plain page canvas needs a quiet atmospheric top wash.
- Page headings and page headers: open \`design-rules/components/page-heading.md\` or its raw GitHub URL.
- Cards: open \`design-rules/components/card.md\` or its raw GitHub URL.
- Tables: open \`design-rules/components/table.md\` or its raw GitHub URL.
- Sidebar and app navigation: open \`design-rules/components/sidebar.md\` or its raw GitHub URL when the selected page or product scope contains a sidebar.
- Ad hoc buttons, inputs, cards, tabs, dialogs, menus, or form controls: use existing project components first, then shadcn/ui primitives already present in the project.
- Layout, hierarchy, density, and spacing: preserve the existing product structure and normalize only inconsistent or unclear areas.
- Empty, loading, error, disabled, selected, hover, focus, and success states: use existing component variants and Theme Lab semantic tokens.
- Missing or ambiguous pattern rule: do not invent a new visual system; keep changes conservative and report the missing rule.
- Decorative exceptions explicitly defined by user-authored rules may use non-token colors or values only for non-structural ambient layers, never for text, primary surfaces, borders, focus rings, or actionable states.

Design Rule Check required before edits:

1. Diagnosed problem type.
2. User-authored rule applied.
3. Components/classes being normalized.
4. Content and workflow that must stay unchanged.
5. Token pairs or state rules that must be verified.

Invalid behavior:

- Browsing or citing external websites unless the user explicitly asks.
- Copying a demo layout, brand styling, content, paid/proprietary source code, or unrelated workflow.
- Mixing multiple design systems or invented patterns.
- Moving major product content without a user-authored rule requiring it.
- Treating shadcn/ui as a visual style to paste onto the product rather than an implementation material.
- Using external references as permission to ignore Theme Lab token pairs or user-authored design rules.`
}

function userAuthoredDesignRulesPromptSection(userDesignRules?: string): string {
  const normalizedUserDesignRules = normalizeUserDesignRules(userDesignRules)

  if (!normalizedUserDesignRules) {
    return `## User-Authored Design Rule Library

No extra user-authored rules were provided in this export.

Use the distributed Theme Lab rule router and raw rule links in this packet. If a page pattern has no matching rule, keep the change conservative, preserve the current workflow, and report the missing rule instead of inventing a new visual system.`
  }

  return `## User-Authored Design Rule Library

Use the following user-authored rules as the project-specific design reference. These rules override generic UI taste and external references.

\`\`\`md
${normalizedUserDesignRules}
\`\`\`

Do not rewrite, summarize away, or ignore these rules. Match page elements to the closest applicable rule before changing UI.`
}

function uiElementInventoryRuleMatchingSection(): string {
  return `## UI Element Inventory And Rule Matching

Before editing UI, inventory the selected page or product scope by element type:

- cards
- tables and table rows
- buttons and action groups
- filters, search, sort controls, and view controls
- page canvas, top background wash, and global content backdrop
- sidebar, navigation, breadcrumbs, page headings, and page headers
- forms, inputs, selects, checkboxes, switches, and validation messages
- tabs, segmented controls, dialogs, sheets, popovers, dropdowns, and tooltips
- badges, status indicators, alerts, empty/loading/error/success states
- metric blocks, charts, timelines, activity feeds, and detail panels

For each relevant element type, do this sequence:

1. Identify existing content, destination/detail content, data fields, actions, states, and workflow role.
2. Find the matching user-authored design rule from the Design Rule Library or built-in Theme Lab rules.
3. Preserve page content and workflow unless the rule explicitly says to change them.
4. Normalize the component structure with existing project components or shadcn/ui primitives.
5. Bind theme-bearing surfaces, text, borders, focus, states, radius, spacing, and elevation to Theme Lab tokens.
6. Apply documented exceptions only where allowed by the matched rule.
7. Report which elements were found, which rules were applied, and which elements had no matching rule.

Do not start by styling. Start by understanding what elements exist and what each element is supposed to preview, control, filter, submit, navigate to, or disclose.`
}

function designCoherenceGateSection(): string {
  return `## Design Coherence Gate

The goal is a better product UI, not maximum visual difference.

The normalized UI must be calmer, clearer, more readable, and more internally consistent than the previous UI. If a change creates more noise, ambiguity, or layout fragmentation, simplify it before finalizing.

Quality rules:

- Use one primary user-authored rule or existing local pattern per page or scope. Do not mix dashboard, settings, data-table, sidebar, command, and detail patterns unless the workflow truly requires them.
- Do not introduce a Sidebar/app-shell pattern into a single content page unless navigation or product structure is actually part of the scope.
- Do not add extra cards, nested panels, borders, shadows, badges, icons, or toolbars just to make the page look more "shadcn".
- Preserve any existing information architecture that is already clear. Normalize the visual layer around it instead of rearranging it for novelty.
- Prefer fewer, stronger groups over many small cards.
- Prefer predictable alignment, stable spacing, and clear action placement over decorative composition.
- Preserve successful workflow order. Improve presentation, states, hierarchy, and component quality without making the user relearn a working flow.
- A page is not improved if it has more visual noise, more competing surfaces, less obvious primary action, weaker scanability, or less consistent spacing than before.

Before final report, run a better-than-before check:

1. Is the primary task easier to find and complete?
2. Is the information hierarchy clearer?
3. Are there fewer arbitrary surfaces and visual effects?
4. Is spacing/radius/state behavior more consistent?
5. Did the selected design rule or local pattern improve the workflow rather than decorate it?

If the answer is no, revise toward a simpler, more coherent composition before finishing.`
}

function semanticTokenPairingGateSection(): string {
  return `## Semantic Token Pairing Gate

Semantic tokens are not interchangeable color names. Background and foreground tokens must be applied as pairs.

Required filled-surface pairs:

- \`bg-background text-foreground\`
- \`bg-card text-card-foreground\`
- \`bg-popover text-popover-foreground\`
- \`bg-primary text-primary-foreground\`
- \`bg-secondary text-secondary-foreground\`
- \`bg-muted text-muted-foreground\`
- \`bg-accent text-accent-foreground\`
- \`bg-destructive text-destructive-foreground\`
- \`bg-sidebar text-sidebar-foreground\`
- \`bg-sidebar-primary text-sidebar-primary-foreground\`
- \`bg-sidebar-accent text-sidebar-accent-foreground\`

Never use same-role foreground/background pairings on filled surfaces:

- Do not use \`bg-primary text-primary\`.
- Do not use \`bg-secondary text-secondary\`.
- Do not use \`bg-accent text-accent\`.
- Do not use \`bg-destructive text-destructive\`.
- Do not use \`bg-card text-card\`.
- Do not use \`bg-popover text-popover\`.

For primary buttons, selected tabs, active navigation, badges, alerts, destructive actions, and filled chips, verify the text remains visible in both light and dark mode. Prefer existing component variants such as \`Button variant="default"\`, \`Button variant="secondary"\`, \`Button variant="destructive"\`, and Badge/Alert variants because they already encode the correct token pairs.

Before final report, inspect changed class names and explicitly confirm that filled backgrounds use matching foreground tokens.`
}

function pageHeadingReuseSection(): string {
  return `## Page Heading Reuse Rule

Use this rule whenever the selected page or component scope contains a page heading, page header, title/action bar, resource header, detail header, or list header.

The user-provided page heading pattern is not optional inspiration. Reuse its composition as closely as the existing product allows:

- Outer layout: a responsive header row that becomes \`lg:flex lg:items-center lg:justify-between\`.
- Left side: \`min-w-0 flex-1\` with the page title as the strongest element.
- Title: a single clear heading, usually \`text-2xl/7 font-semibold text-foreground sm:truncate sm:text-3xl\` or the closest project heading scale.
- Metadata row: directly below the title, render compact metadata facts as icon + short text items. On mobile it may stack; from small screens upward it should wrap horizontally with comfortable gaps.
- Right side: primary and secondary actions aligned to the heading. Primary action is visually strongest. Secondary actions are quieter.
- Mobile behavior: keep the primary action visible; collapse secondary actions into a compact More dropdown when horizontal space is limited.

Adaptation rules:

- Preserve the existing page title, subtitle, breadcrumbs, status, filters, resource metadata, and action semantics. Do not invent job-posting demo content.
- Use actual product metadata: status, type, owner, team, location, date, amount, role, workspace, lifecycle stage, last updated, due date, or other fields already present in the page.
- Use the project's existing icon library. If the project uses lucide-react, map the sample icons to suitable lucide icons. Do not add \`@heroicons/react\` unless it already exists and the project already uses it.
- Use existing shadcn/project components for actions and menus: \`Button\`, \`DropdownMenu\`, \`DropdownMenuTrigger\`, \`DropdownMenuContent\`, \`DropdownMenuItem\`, and project icon-button variants. Do not add \`@headlessui/react\` unless it already exists and the project already uses it.
- Convert all raw sample colors to Theme Lab tokens: \`text-foreground\`, \`text-muted-foreground\`, \`bg-background\`, \`bg-primary text-primary-foreground\`, \`border-border\`, \`ring-ring\`, and existing button variants.
- Do not use sample classes such as \`text-gray-900\`, \`text-gray-500\`, \`text-gray-400\`, \`bg-white\`, \`bg-indigo-600\`, \`hover:bg-indigo-500\`, or raw inset-ring colors in the final implementation.
- Keep the header unframed by default. Do not put the whole page heading inside a decorative card unless the existing product pattern already frames headers.
- Keep metadata short. Avoid long paragraphs in the heading area; move detailed copy into the body, cards, tabs, or detail panels.
- The heading must preserve responsive behavior: no overflow, no clipped primary action, no title/action collision, and long titles should use \`min-w-0\`, \`truncate\`, wrapping, or responsive stacking.
- If the existing page already has a stronger local heading pattern that follows this structure, normalize it instead of replacing it wholesale.

Implementation skeleton to reuse, adapted to project components and tokens:

\`\`\`tsx
<div className="lg:flex lg:items-center lg:justify-between">
  <div className="min-w-0 flex-1">
    <h1 className="text-2xl/7 font-semibold text-foreground sm:truncate sm:text-3xl">
      {pageTitle}
    </h1>
    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:gap-x-6">
      {metadataItems.map((item) => (
        <div className="mt-2 flex items-center text-sm text-muted-foreground" key={item.label}>
          <item.icon className="mr-1.5 size-5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
          {item.label}
        </div>
      ))}
    </div>
  </div>
  <div className="mt-5 flex lg:ml-4 lg:mt-0">
    {/* quiet secondary actions on larger screens */}
    {/* primary action remains visible */}
    {/* secondary actions collapse into a More dropdown on small screens */}
  </div>
</div>
\`\`\`

Before final report, state whether the page heading pattern was reused, which metadata facts and actions were preserved, which secondary actions collapsed on mobile, and which heading/button/menu token pairs were verified.`
}

function shadcnSidebarBlockReplacementSection(): string {
  return `## Shadcn Sidebar Block Replacement Rule

Use this rule whenever the selected page, selected component scope, or product-wide scope contains a sidebar, app navigation rail, or sidebar-like navigation shell.

The user explicitly approves this official shadcn/ui reference for sidebar selection:

- https://ui.shadcn.com/blocks/sidebar

Rule:

- If the current UI scope contains a sidebar, include that sidebar in the UI normalization scope. Do not polish only the main content while leaving an old bespoke sidebar beside it.
- For one-page optimization, if the page includes a sidebar, replace or normalize the complete sidebar used by that page as part of the same task.
- Do not ask an open-ended question such as "Should I also update the sidebar?" when a sidebar is detected.
- When a sidebar is detected, include it by default in the execution plan and add this direct confirmation line: "Direct Confirmation: The selected scope contains a sidebar, so sidebar normalization/replacement is included by default. Please confirm the full plan if you want me to proceed."
- First inspect the existing sidebar's navigation data, active route logic, collapse behavior, permission gates, workspace/account switchers, search, badges, nested groups, user menu, keyboard behavior, responsive behavior, and route links.
- Choose the closest matching shadcn sidebar block from the official sidebar blocks page based on the product's navigation structure and density. Match structure, not demo content.
- Preserve the existing product navigation content, route URLs, permissions, active states, badges/counts, account/workspace context, user menu actions, and responsive behavior unless the user explicitly asks to change them.
- Replace bespoke sidebar markup with shadcn/sidebar primitives such as \`SidebarProvider\`, \`Sidebar\`, \`SidebarInset\`, \`SidebarHeader\`, \`SidebarContent\`, \`SidebarGroup\`, \`SidebarMenu\`, \`SidebarMenuItem\`, \`SidebarMenuButton\`, \`SidebarFooter\`, \`SidebarRail\`, and \`SidebarTrigger\` when they fit the project setup.
- If no sidebar block clearly matches the existing navigation structure, install the fallback block with \`npx shadcn@latest add sidebar-08\`, then adapt it to the existing routes, labels, groups, data, and permissions.
- Before running any shadcn CLI command, inspect \`components.json\`, the existing \`components/ui\` directory, package manager, aliases, and whether \`components/ui/sidebar\` already exists. Use the project's established shadcn workflow and do not overwrite unrelated files.
- Do not copy shadcn demo content, fake teams, fake projects, fake users, or placeholder routes into the product. The block is only an implementation pattern.
- Connect the sidebar to Theme Lab tokens: use \`bg-sidebar text-sidebar-foreground\`, \`bg-sidebar-primary text-sidebar-primary-foreground\`, \`bg-sidebar-accent text-sidebar-accent-foreground\`, \`border-sidebar-border\` or \`border-border\` when appropriate, \`ring-sidebar-ring\` or \`ring-ring\`, and token-backed radius/spacing/elevation where applicable.
- Verify active, hover, focus-visible, selected, collapsed, expanded, mobile sheet/drawer, disabled, loading, and permission-hidden states after replacement.
- Ensure \`SidebarInset\` or the app content wrapper preserves existing page content width, header rhythm, breadcrumbs, page actions, scroll behavior, and responsive layout.
- If the project cannot safely install or adapt the sidebar block, stop and report the blocker instead of leaving navigation disconnected.

Before final report, explicitly state which sidebar block was selected, why it matched, whether \`sidebar-08\` fallback was used, what navigation behavior was preserved, and which sidebar token pairs were verified.`
}

function pageTopAmbientBackgroundSection(): string {
  return `## Page Top Ambient Background Rule

Use this rule when a page has a plain canvas and would benefit from a quiet, product-specific atmosphere.

The intended effect is a barely visible, mist-like wash at the very top of the page, similar to a pale blue/green morning haze that fades into the normal page background.

Rules:

- Add the ambient layer only to the page canvas or main content canvas. Do not apply it inside cards, tables, dialogs, sidebars, or controls.
- The layer must sit behind content, use \`pointer-events-none\`, and must not create layout height, push content down, or become part of the interaction layer.
- The visible wash should occupy only the top fifth of the page or viewport. As a practical range, keep it around 18-22% of the page height or viewport height, then fade fully into \`bg-background\` / transparent.
- Keep it extremely subtle: low opacity, low saturation, high lightness, broad blur/softness, and no hard edge. It should feel like air or light, not a banner, hero background, colored section, blob, orb, or bokeh effect.
- The ambient layer is a decorative exception. It may use non-token colors, opacity, blur, and gradient stops because it is non-structural atmosphere. All real UI surfaces, text, borders, focus rings, actions, states, radius, and elevation must still use Theme Lab tokens.
- Prefer one gentle hue family, or at most two very close hues, usually cool/brand-adjacent. Do not create rainbow gradients or strong brand-color bands.
- The color must not reduce text contrast, tint cards heavily, hide dividers, compete with the page header, or make primary actions less obvious.
- If the product already has an intentional page background treatment, do not stack another decorative layer. Either skip this rule or replace/tone down the existing treatment.
- In dark mode, reduce the visual weight further or skip the layer if it creates haze, banding, or low contrast.
- In app-shell layouts, apply the layer to the main content canvas by default. Do not tint the sidebar unless the sidebar itself is the page canvas and the user-authored rules explicitly allow it.

Implementation guidance:

- Use an absolutely positioned page-level pseudo-element or child layer such as \`absolute inset-x-0 top-0 h-[20vh]\`, with a max height when needed.
- Use a vertical fade: strongest at the top, then gradually to transparent by the bottom of the layer.
- Keep the base page surface token-bound, for example \`bg-background text-foreground\`; the ambient layer sits above that background and below content.

Before final report, confirm that the ambient layer covers only the top fifth, remains behind content, does not affect contrast, and does not introduce structural non-token styling.`
}

function cardTableProgressiveDisclosureSection(): string {
  return `## Card And Table Rule Loading

Do not use summarized card/table rules embedded in this prompt as the source of truth.

If the selected scope contains cards:

- open \`design-rules/components/card.md\`
- if local files are unavailable, open ${designRuleRawUrl("design-rules/components/card.md")}
- list the loaded source in Rule Read Confirmation before changing card UI

If the selected scope contains tables:

- open \`design-rules/components/table.md\`
- if local files are unavailable, open ${designRuleRawUrl("design-rules/components/table.md")}
- list the loaded source in Rule Read Confirmation before changing table UI

If those files cannot be opened, do not claim the card/table rules were applied. Continue conservatively only when safe, and report the missing rule file or inaccessible raw URL.`
}

function oneShotTokenApplicationGateSection(): string {
  return `## One-Shot Token Application Gate

The selected scope must use the exported Theme Lab token system where it touches theme-bearing UI. Do not keep old raw color, radius, shadow, border, spacing, or motion values when a semantic token or existing component variant is available.

Read the token-system rule before editing token-bearing UI:

- local: \`design-rules/core/token-system.md\`
- raw: ${designRuleRawUrl("design-rules/core/token-system.md")}

Token availability:

- First check whether the project already exposes matching shadcn/theme CSS variables such as \`--radius\`, \`--radius-card\`, \`--radius-control\`, \`--background\`, \`--card\`, \`--border\`, \`--ring\`, and elevation variables.
- If the needed Theme Lab variables are missing, add the smallest complete runtime CSS variable bridge to the existing global CSS file or existing theme layer. This one-shot bridge may use the provided runtime CSS variables, but do not create \`theme-lab.json\`, any AI instruction file, prompt files, or a new design-system folder.
- If the target project already has a compatible token system, map the Theme Lab values into that system instead of inventing new values.

Mandatory token audit after normalization:

- Radius: replace old \`rounded-*\`, arbitrary radius values, inline \`borderRadius\`, and legacy component radius props with token-backed radius choices such as \`rounded-[var(--radius-card)]\`, \`rounded-[var(--radius-control)]\`, \`rounded-[var(--radius-panel)]\`, or existing shadcn radius tokens.
- Surfaces: use \`bg-background\`, \`bg-card\`, \`bg-popover\`, \`bg-muted\`, \`border-border\`, and project surface variables instead of old palette classes or hardcoded colors.
- Text: use \`text-foreground\`, \`text-muted-foreground\`, matching \`*-foreground\` tokens, and project content variables instead of old gray/zinc/slate classes.
- Foreground/background pairs: verify all filled surfaces use matching pairs such as \`bg-primary text-primary-foreground\`, never same-role pairs such as \`bg-primary text-primary\`.
- Focus and state: use \`ring-ring\`, semantic state tokens, and existing component state variants.
- Shadows/elevation: replace one-off shadows with \`[box-shadow:var(--elevation-card)]\`, \`[box-shadow:var(--elevation-popover)]\`, or existing token-backed elevation.
- Density/spacing: do not keep cramped or arbitrary spacing just because it existed. Use the exported density intent, \`--control-height-*\`, \`--panel-padding\`, \`--section-gap\`, and consistent shadcn block spacing.
- Motion: replace \`transition-all\` and arbitrary durations with explicit properties and \`var(--duration-base)\` / \`var(--ease-standard)\` where motion is used.

Invalid one-shot result:

- The normalized UI keeps the old \`rounded-*\` scale or old arbitrary radius.
- The selected scope still relies on old palette colors, hardcoded hex values, one-off shadows, or inline visual values.
- Filled buttons, badges, selected tabs, active nav items, alerts, or chips have invisible or low-contrast text because foreground tokens are mismatched.

Before the final report, inspect the changed files and explicitly confirm the radius, surface, text, shadow, spacing, focus/state, and motion token audit.`
}

function aiUiOptimizationSection(): string {
  return `## AI UI Optimization Guidance

This packet is tool-agnostic. Use it with any code-capable AI agent that can inspect files, edit code, and run checks.

When optimizing UI:

- Be specific about the screen, component, user role, and desired interaction state.
- Treat uploaded screenshots, selected elements, or selected files as the target scope.
- Keep existing routes, data fetching, event handlers, validation, permissions, and business logic.
- Treat the existing UI markup as the current product structure to preserve unless it is clearly broken.
- Normalize the selected scope's visible UI instead of replacing it from scratch.
- Reconnect existing APIs, data loaders, mutations, event handlers, forms, validation, and state to the normalized UI.
- Improve component consistency before styling: token replacement alone is not an acceptable final result when obvious ad hoc controls remain.
- Use user-authored Theme Lab design rules when there is a specific diagnosed UI problem.
- Create a compact Design Rule Check that names the problem, selected rule, and normalization boundary.
- Keep old layout/content choices when they support the workflow; replace only inconsistent, inaccessible, or ad hoc visual implementation details.
- Improve visual hierarchy, spacing, typography, responsive behavior, and interaction states before adding new features.
- Add or improve empty, loading, error, disabled, hover, focus, selected, and success states when relevant.
- Prefer existing project components and shadcn/ui primitives such as Sidebar, SidebarProvider, SidebarInset, SidebarTrigger, Button, Card, Dialog, Tabs, Table, DropdownMenu, Sheet, Tooltip, Badge, Input, and Label.
- Prefer conservative shadcn-style normalization: settings = Tabs/Card/Form controls; dashboard = Cards/Table/Chart components; CRUD = Table/DropdownMenu/Sheet/Dialog; auth/onboarding = Card/Label/Input/Button; AI/productivity = Command/Card/Scroll area.
- For Card and Table content, follow progressive disclosure: show a useful preview of the click-through/detail content with clear hierarchy, compact facts, semantic states, and no dense paragraph blocks.
- Replace fragile hand-written UI with these primitives when that preserves behavior.
- Use the exported theme tokens for surfaces, matching foreground text, borders, rings, radius, shadows, and states.
- Avoid decorative gradients, random shadows, raw palette classes, hardcoded colors, mixed radii, nested cards, and unrelated rewrites.
- After changes, normalize the output: replace ad-hoc controls with project components, align typography and density, and remove one-off visual effects.`
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

## Language Rule

Write all task instructions, plans, implementation notes, and final reports in English. Preserve code identifiers, file paths, route paths, API names, and user-provided business copy literally when needed.

## Goal

Normalize the selected page or component once. Preserve the business behavior, API contracts, data flow, page content, information architecture, and workflow order.

This is not a "replace colors with tokens" task and not a "redesign from scratch" task. The goal is to make the existing UI more consistent by standardizing components and connecting theme-bearing styles to Theme Lab tokens.

## Required Order

Work in this order:

1. Read the distributed rule index locally or from the raw GitHub fallback.
2. Detect the selected page structure first and open the matched page-structure/block rule file.
3. Detect components/blocks in the selected scope and open only the matched component/pattern rule files.
4. Open the token-system, token-binding, visual-qa, and completion-compliance rule files.
5. Extract the business rules, API calls, data loading, mutations, handlers, validation, permissions, state, domain copy, page content, and workflow order from the current UI.
6. Before editing, identify the top 3 UI normalization problems in the selected scope:
   - hierarchy problem
   - component consistency problem
   - token/state/contrast problem
7. Normalize specifically to solve those problems.
8. Preserve existing information architecture, page regions, workflow order, and useful layout structure.
9. Replace ad hoc controls and repeated visual fragments with existing project components or shadcn/ui primitives where behavior is preserved.
10. Keep the visible page recognizable and avoid increasing visual noise.
11. Reconnect the existing APIs, mutations, handlers, validation, permissions, and state to the normalized UI.
12. Ensure Theme Lab tokens are available through an existing token system or a minimal complete one-shot CSS variable bridge.
13. Apply Theme Lab semantic tokens and matching foreground/background pairs to surfaces, text, radius, shadow, spacing, focus/state, and motion.
14. Run the completion compliance gate before final response.

Do not start by swapping class values. Do not treat token replacement as the main work. The one-shot task is successful only when the selected UI remains recognizable, component inconsistency is reduced, API behavior is connected, and semantic token pairs are applied correctly.

## Component Composition Lens

Use a scoped UI normalization workflow: selected files, routes, components, or screenshots define the target, and the output should be a scoped code change that preserves existing behavior.

Use shadcn/ui guidance for component composition: prefer existing Sidebar, Button, Card, Dialog, Tabs, Table, DropdownMenu, Sheet, Tooltip, Badge, Input, Label, Separator, Breadcrumb, Command, Popover, Select, Checkbox, Switch, and similar primitives before creating custom controls.

## Hard Scope

Selected scope:
\`${targetScope || "(not provided)"}\`

If no selected scope is provided, inspect the project and ask for a route, page, component, or screenshot target before editing.

Do not:

- create or update \`theme-lab.json\`
- create or update any AI instruction file such as \`AGENTS.md\`, \`CLAUDE.md\`, \`GEMINI.md\`, \`.cursor/rules/*.mdc\`, or \`.github/copilot-instructions.md\`
- create \`theme.seed.json\`
- create \`vibe.manifest.json\`
- create \`theme.algorithm.ts\`
- create a design-system folder
- install dependencies
- rewrite unrelated pages
- optimize other page styling or broad cross-page visual consistency
- change routes, APIs, data loading, state machines, validation, permissions, or business logic

Inside the selected scope, preserve business rules, content, and clear information architecture. Normalize weak spacing, card structure, control markup, component variants, and arbitrary class values without replacing the whole page unless the user explicitly asks for a redesign.

${structuralRewriteMandateSection()}

${referenceFirstQualityGateSection()}

${userAuthoredDesignRulesPromptSection(options.userDesignRules)}

${designRuleFileRouterSection()}

${uiElementInventoryRuleMatchingSection()}

${pageHeadingReuseSection()}

${shadcnSidebarBlockReplacementSection()}

${semanticTokenPairingGateSection()}

${pageTopAmbientBackgroundSection()}

${cardTableProgressiveDisclosureSection()}

${designCoherenceGateSection()}

${oneShotTokenApplicationGateSection()}

## Compact Theme Lab Reference

Use this as token and visual-direction context for UI normalization. Do not persist it as a project contract.

\`\`\`json
${oneShotThemeReferenceJson(options.theme)}
\`\`\`

## Normalization Work

Spend most effort on the current interface:

- Preserve the selected scope's visible content, core layout, and workflow unless they are clearly broken.
- Reconnect existing API data, mutation actions, event handlers, validation, navigation, permissions, and state to the normalized UI.
- Replace fragile hand-written component markup with existing project components or shadcn/ui primitives when behavior can be preserved.
- Clarify hierarchy: make primary actions, section titles, active states, and supporting text obvious.
- Clean layout: align edges, normalize gaps, avoid cramped groups, and keep density consistent.
- Improve surfaces: use standard cards/panels/dialogs with restrained borders, radius, and elevation.
- Improve typography: use balanced headings, readable line-height, consistent caption/body sizes, and no orphaned labels.
- Improve controls: make buttons, tabs, menus, inputs, toggles, and cards feel like one system without changing their meaning.
- Improve states: add or refine hover, active, focus-visible, selected, disabled, loading, empty, error, and success states where relevant.
- Improve responsiveness: check mobile and desktop layouts, prevent overflow, and keep long text readable.
- Improve dark mode only if the selected scope already supports it or the issue is visible in the selected scope.

## Interface Quality Checklist

Apply this Web Interface Guidelines subset while editing:

- Use semantic interactive elements: \`button\` for actions and \`a\`/\`Link\` for navigation.
- Icon-only buttons need \`aria-label\`; decorative icons need \`aria-hidden="true"\`.
- Form controls need labels or \`aria-label\`; labels should share a comfortable hit target with their control.
- Every interactive element needs a visible \`focus-visible\` state.
- Do not use \`transition-all\`; list animated properties such as color, background-color, border-color, box-shadow, opacity, transform, or width.
- Prefer transform/opacity animation and respect reduced-motion when adding meaningful motion.
- Text containers should handle long content with \`min-w-0\`, \`truncate\`, \`line-clamp\`, or \`break-words\`.
- Use \`text-wrap: balance\` or \`text-pretty\` on prominent headings when supported by the existing stack.
- Avoid raw palette classes, hardcoded hex, arbitrary OKLCH, random gradients, and one-off shadows for structural UI.
- Keep copy concise, action-oriented, and specific.

## Execution

1. Inspect the selected files and nearby components.
2. Extract existing API calls, data contracts, state, handlers, validation, permissions, domain copy, visible content, and workflow order.
3. Read \`design-rules/index.json\` if available, load required rules, then load only rule files matched to the selected scope's element types.
4. Diagnose the top hierarchy, component consistency, and token/state/contrast problems in the selected scope.
5. Identify the selected-scope files that need component normalization, token hookup, or state/contrast fixes.
6. Create the normalization plan and Design Rule Check.
7. Normalize the scoped UI with existing project components, shadcn/ui primitives, matched design-rule files, and existing layout/content preserved.
8. Reconnect existing APIs, mutations, handlers, validation, permissions, and state.
9. Ensure the required Theme Lab token variables are available through an existing token system or a minimal one-shot CSS variable bridge.
10. Apply Theme Lab tokens and semantic foreground/background pairs to the normalized UI.
11. Audit radius, surface/text pairs, shadow, spacing, focus/state, motion, and contrast in the changed files.
12. Run available typecheck, lint, build, or route-level checks.
13. Report changed files, loaded rule files, diagnosed UI problems, design rule check, normalized components, reconnected APIs, token pairs, checks run, and any risk.

## Final Response Format

\`\`\`md
## Files Changed

...

## UI Normalization

...

## Design Rule Check

- problem type:
- user-authored rule applied:
- rule files loaded:
- missing rule, if any:
- components/classes normalized:
- content/workflow preserved:
- token/state checks:

## Normalized Scope

- preserved business rules:
- APIs/data/handlers reconnected:
- top hierarchy problem solved:
- top component consistency problem solved:
- top token/state/contrast problem solved:
- content/workflow preserved:
- components standardized:
- shadcn blocks/primitives used:
- acceptance-gate items satisfied:

## Token Application

- applied after component normalization:
- token bridge created/reused:
- radius tokens used:
- foreground/background token pairs verified:
- shadow/elevation tokens used:
- spacing/density tokens used:
- focus/state/motion tokens used:
- semantic classes/tokens used:
- old raw values removed:

## Better-Than-Before Check

- primary task easier:
- hierarchy clearer:
- visual noise reduced:
- spacing/radius/states more consistent:
- normalization preserved or improved workflow:
- simplifications made after review:

## Preserved

...

## QA

- typecheck:
- lint:
- build:
- manual/browser check:

## Risks

...
\`\`\`
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

## Language Rule

Write all task instructions, plans, implementation notes, and final reports in English. Preserve code identifiers, file paths, route paths, API names, and user-provided business copy literally when needed.

## Mission

This is a Theme Lab AI Task Packet.

Default assumption: this is an existing product project unless the repository is clearly empty or the user explicitly asks for a new project.

Default task posture: existing project theme integration plus ${isProductWideTask ? "product-wide UI alignment" : "selected-scope UI normalization"}, not a new project scaffold.

If UI changes are allowed, ${isProductWideTask ? "the product UI should be aligned into a coherent component and token system across routes and major screens" : "the selected scope should be normalized with existing content and workflow preserved"}. Token replacement alone is not a successful result when obvious component inconsistency or unsafe token pairing remains.

First inspect the project. Do not create or modify any files until you understand the project mode, CSS strategy, component system, global CSS location, and ${isProductWideTask ? "product route/page inventory" : "selected scope"}.

${taskInstructionSection(options.task, targetScope)}

${isProductWideTask ? productWideRebuildMandateSection() : structuralRewriteMandateSection()}

${referenceFirstQualityGateSection()}

${userAuthoredDesignRulesPromptSection(options.userDesignRules)}

${designRuleFileRouterSection()}

${uiElementInventoryRuleMatchingSection()}

${pageHeadingReuseSection()}

${shadcnSidebarBlockReplacementSection()}

${semanticTokenPairingGateSection()}

${pageTopAmbientBackgroundSection()}

${cardTableProgressiveDisclosureSection()}

${designCoherenceGateSection()}

## Source of Truth

Do not treat this prompt as the source of truth. The source of truth is the Theme Lab seed, algorithm version, and exported runtime CSS variables.

- seed / \`theme-lab.json\` seed = portable design intent.
- algorithmVersion = deterministic generation reference.
- theme.css / global CSS variables = runtime styling source.
- vibe manifest = visual guidance, not CSS source.
- target tool's native AI instruction file = persistent AI coding rules when installed.
- \`design-rules/index.json\` = distributed design rule router when installed.
- matched \`design-rules/**/*.md\` files = detailed component and pattern rules.

## Project Mode Gate

Before creating or modifying any files, inspect the repository and classify it as one of:

- \`new-project\`
- \`existing-small-project\`
- \`existing-product-project\`
- \`mature-product-project\`
- \`unknown\`

Default to \`existing-product-project\` unless the repository is clearly empty or the user explicitly requested a new project.

Check:

- \`package.json\`
- lockfile
- \`app/\`
- \`src/app/\`
- \`pages/\`
- \`src/pages/\`
- \`components/\`
- \`components/ui\`
- \`components.json\`
- global CSS file
- Tailwind setup
- existing CSS variables
- existing token files
- existing component library
- ${isProductWideTask ? "product route/page inventory" : "selected target file or route"}

Before edits, output:

\`\`\`json
{
  "projectMode": "existing-product-project",
  "framework": "Next.js",
  "cssStrategy": "Tailwind v4",
  "componentSystem": "shadcn/ui",
  "globalCssPath": "app/globals.css",
  "hasExistingTokens": true,
  "hasShadcn": true,
  "recommendedAction": "${isProductWideTask ? "install-theme-bridge-and-align-product-ui-system" : "install-theme-bridge-and-normalize-selected-scope-ui"}",
  "safeFilesToChange": [],
  "filesNotToTouch": [],
  "needsUserConfirmation": []
}
\`\`\`

Global CSS detection priority:

1. \`components.json\` \`tailwind.css\` path when available.
2. \`app/globals.css\`
3. \`src/app/globals.css\`
4. \`styles/globals.css\`
5. \`src/styles/globals.css\`
6. \`app/layout\` or root entry imported global CSS.

Do not create a new global CSS file when an existing one is present.
If marker blocks already exist, update only the marker block.
Do not rewrite the entire global CSS file.

## Selected Import Strategy

${selectedStrategySection(options.mode)}

## Existing Project Rules

For existing projects, preserve:

- routes
- API calls
- data loading
- state management
- event handlers
- form schemas
- validation
- permissions
- feature flags
- conditional rendering
- business copy
- domain logic

Allowed changes:

- theme variable mapping
- CSS token bridge
- ${isProductWideTask ? "product-wide page and component styling" : "selected page/component styling"}
- ${isProductWideTask ? "product-wide component and token alignment" : "selected page/component UI normalization"}
- product-wide app shell and layout grammar alignment
- cross-page layout consistency normalization
- API/data/handler reconnection to the normalized UI
- ${isProductWideTask ? "shadcn Sidebar, blocks, and primitive composition across product pages" : "shadcn Sidebar, blocks, and primitive composition inside the selected scope"}
- layout hierarchy
- surface hierarchy
- spacing / density
- borders / radius / elevation
- focus / hover / selected states
- empty / loading / error / success states
- responsive behavior
- ${isProductWideTask ? "component normalization across product pages, only when behavior is preserved" : "component normalization inside the selected scope, only when behavior is preserved"}

Forbidden by default:

- scaffold a new app
- overwrite global CSS wholesale
- install dependencies
- replace component library
- create a parallel design-system folder
- rewrite unrelated pages, unless this is the product-wide alignment task
- rewrite app shell globally, only for product-wide alignment or when explicitly approved
- remove business logic
- change APIs or data contracts
- leave API calls, mutations, handlers, validation, permissions, or state disconnected
- introduce raw Tailwind palette classes for structural UI
- introduce hardcoded hex colors
- introduce arbitrary OKLCH values

## New Project Rules

Only use these rules when the repository is clearly empty or the user explicitly requested a new project.

For new projects:

- create the minimum viable theme foundation
- use Theme Lab runtime variables as the styling source
- use shadcn-compatible tokens if shadcn exists or is explicitly requested
- do not create an enterprise-scale design system
- do not create unnecessary docs
- do not create broad component libraries unless requested
- keep file count small

## Theme Integration Strategy

If React + Tailwind + shadcn exists:

- map Theme Lab shadcn adapter tokens into existing global CSS
- keep the existing shadcn component library and preserve the existing product structure unless it is clearly broken
- ${isProductWideTask ? "normalize product pages with shadcn-first controls and semantic tokens" : "normalize the selected scope with shadcn-first controls and semantic tokens"}
- prefer SidebarProvider + Sidebar + SidebarInset layouts for app screens with navigation
- prefer shadcn-style dashboard, settings, data-table, form, CRUD, command/chat, sheet/dialog, and detail-panel blocks where appropriate
- replace hand-written ad hoc controls with existing shadcn/ui primitives when behavior can be preserved
- add missing local shadcn component files through the existing shadcn setup when needed and when no new production dependency is introduced
- reconnect existing APIs, data loaders, mutations, handlers, validation, permissions, and state to the normalized UI
- treat token bridge setup as preparation, not task completion

If React + Tailwind exists but shadcn does not:

- do not install shadcn by default
- use existing local components first
- map semantic CSS variables into global CSS only when selected strategy allows persistence
- ask before introducing shadcn

If MUI / Ant Design / Chakra / Mantine / other suite exists:

- do not replace the suite
- map Theme Lab tokens into existing theme provider or CSS variable bridge
- preserve existing suite components

If custom CSS / custom components exist:

- create a minimal CSS variable bridge only when selected strategy allows persistence
- ${isProductWideTask ? "normalize product-page visible UI and component composition when requested" : "normalize selected-scope visible UI and component composition when requested"}
- ${isProductWideTask ? "normalize repeated structural styles across product pages" : "refactor repeated structural styles gradually outside the selected scope"}
- do not create a second design system

## Token Contract

Allowed structural tokens/classes:

${codeList(themeLabTokenContract.allowed)}

Forbidden structural styling:

${markdownList([
  "bg-blue-600",
  "bg-zinc-950",
  "text-zinc-500",
  "border-gray-200",
  "hardcoded hex",
  "arbitrary OKLCH",
  "one-off shadow values",
  "one-off border colors",
  "legacy non-token radius values",
  "arbitrary border-radius values",
  "mixed radius scales",
  "same-role filled background/text pairs such as bg-primary text-primary",
  "filled semantic backgrounds without matching foreground tokens",
  "random gradient utilities",
  "unapproved new color scales",
])}

Raw Tailwind palette classes may be acceptable for non-structural one-off content only when explicitly justified, but they are forbidden for theme-bearing UI structure.

## Visual Contract

This theme is designed for product interfaces, not decorative marketing pages.

The visual contract requires preserving the existing product content and workflow while making the UI more coherent through component normalization, semantic token pairs, and consistent states.

Use the exported tokens to maintain:

- clear surface hierarchy
- consistent component styling
- readable density
- restrained brand emphasis
- predictable interaction states
- accessible contrast
- stable dark mode

Do not add decorative visual effects unless the user explicitly asks.

Avoid:

- raw Tailwind palette classes for structural UI
- hardcoded hex colors
- arbitrary OKLCH values
- decorative gradients
- random shadows
- unapproved glassmorphism
- copying Theme Lab preview fixtures into the user project

${aiUiOptimizationSection()}

## ${isProductWideTask ? "Product Alignment Scope" : "Selected Scope"}

${isProductWideTask ? `Align the product UI system across product routes and major product screens.

Do not ask for a single selected page before starting. First inspect the repository, inventory routes, group pages by product pattern, and define which component/token patterns should be normalized. If the product is too large to complete safely in one pass, propose a phased product-wide rollout that preserves layout consistency across phases.` : selectedScopeSection(targetScope)}

## Execution Plan

${isProductWideTask ? `1. Inspect project structure, route inventory, component libraries, global CSS, and existing token baseline.
2. Read \`design-rules/index.json\` locally or from the raw GitHub fallback.
3. Load requiredAlways rules, including rule-router, ui-normalization, token-system, token-binding, visual-qa, and completion-compliance.
4. Detect product page structures first: dashboard, management table, detail page, settings, form/CRUD, auth/onboarding, AI/productivity surface, or tool page.
5. Open matched page-structure/block rules from local files or raw GitHub URLs, such as page-shell and dashboard.
6. Detect components/blocks inside each page type: sidebar, page heading, cards, tables, actions, filters, forms, dialogs/sheets, states, and page canvas.
7. Open only matched component/pattern rule files from local files or raw GitHub URLs.
8. Install or update the persistent Theme Lab contract using exactly the three default touchpoints.
9. Build the token-system plan from \`design-rules/core/token-system.md\` or its raw GitHub URL; verify global CSS, \`theme-lab.json\`, the target AI instruction file, and semantic tokens are complete. Do not install local \`design-rules/\` unless explicitly requested.
10. Create a product-wide normalization plan and Design Rule Checks for relevant page types.
11. Define the existing app shell and cross-page layout grammar to preserve before editing pages.
12. Extract business logic, API calls, data contracts, handlers, validation, permissions, and state from existing pages.
13. Normalize product pages with existing project components, shadcn/ui primitives, matched design-rule files, semantic token pairs, and consistent layout grammar.
14. Reconnect existing APIs, mutations, handlers, validation, permissions, and state to normalized pages.
15. Run token audit and completion compliance gate.
16. Run available checks.
17. Report changed files, local/raw rule files loaded, design rule checks, product-wide layout grammar, API reconnection, token pair checks, compliance results, and risks.` : `1. Inspect project structure, selected scope, component libraries, global CSS, and existing token baseline.
2. Read \`design-rules/index.json\` locally or from the raw GitHub fallback.
3. Load requiredAlways rules, including rule-router, ui-normalization, token-system, token-binding, visual-qa, and completion-compliance.
4. Detect the selected page structure first: dashboard, management table, detail page, settings, form/CRUD, auth/onboarding, tool page, or other product surface.
5. Open the matched page-structure/block rule from local files or raw GitHub URLs, such as page-shell or dashboard.
6. Detect components/blocks inside the selected scope: sidebar, page heading, cards, tables, actions, filters, forms, dialogs/sheets, states, and page canvas.
7. Open only matched component/pattern rule files from local files or raw GitHub URLs.
8. Build a minimal but complete one-shot token bridge plan from \`design-rules/core/token-system.md\`.
9. Extract business logic, API calls, data contracts, handlers, validation, permissions, and state from the old UI.
10. Create a selected-scope normalization plan and Design Rule Check.
11. Normalize selected-scope visible UI with existing project components, shadcn/ui primitives, matched design-rule files, and semantic token pairs if task allows modifications.
12. Reconnect existing APIs, mutations, handlers, validation, permissions, and state to the normalized UI.
13. Apply the complete one-shot token bridge and semantic foreground/background pairs for the changed UI.
14. Run token audit and completion compliance gate.
15. Improve hierarchy, density, states, contrast, and responsive behavior if task allows modifications.
16. Run available checks.
17. Report changed files, local/raw rule files loaded, token bridge completeness, compliance results, and risks.`}

${options.task === "visual-review" ? "Do not modify files. Only inspect and report." : ""}

## Final Response Format

Use this final response structure:

\`\`\`md
## Project Mode Detected

...

## Files Inspected

...

## Files Changed

...

## File Strategy Applied

...

## Token Bridge

Created / reused / skipped.

## Component System

...

## Design Rule Check

- problem type:
- user-authored rule applied:
- rule files loaded:
- missing rule, if any:
- components/classes normalized:
- content/workflow preserved:
- token/state checks:

## Business Logic Preservation

List preserved logic and any risky areas.

## UI Normalization

- preserved business rules:
- APIs/data/handlers reconnected:
- content/workflow preserved:
- components standardized:
- shadcn/project primitives used:
- semantic token pairs verified:

## Visual Changes

...

## Visual QA

- content and workflow unchanged:
- page/component patterns unified:
- old UI debt reduced:
- workflows unchanged:
- foreground/background token pairs checked:
- responsive states checked:
- pages still needing alignment:

## QA

- typecheck:
- lint:
- build:
- browser/manual check:

## Dependencies

Added: none / list

## Risks / Follow-ups

...
\`\`\`

## Theme Artifacts

${themeArtifactsSection(options, targetScope)}
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
