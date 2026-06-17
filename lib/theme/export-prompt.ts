import { exportThemeAlgorithmFromOutput } from "./export-algorithm"
import { exportThemeCssFromOutput } from "./export-css"
import {
  exportVibeJsonFromOutput,
  themeLabAiCodingRules,
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
  | "visual-review"

export type ProjectImportPromptOptions = {
  mode: ProjectImportMode
  task: ProjectImportTask
  targetScope?: string
  theme: ThemeOutput
}

const taskLabels: Record<ProjectImportTask, string> = {
  "install-theme-contract": "Install theme contract",
  "refactor-selected-scope": "Refactor selected page/component scope",
  "visual-review": "Visual review only",
}

function markdownList(values: readonly string[]): string {
  return values.map((value) => `- ${value}`).join("\n")
}

function codeList(values: readonly string[]): string {
  return values.map((value) => `- \`${value}\``).join("\n")
}

function runtimeCssBlock(theme: ThemeOutput): string {
  return `/* theme-lab:runtime:start */
${exportThemeCssFromOutput(theme)}
/* theme-lab:runtime:end */`
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
      source: "Theme Lab compact UI polish reference",
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

function projectImportManifestJson(theme: ThemeOutput): string {
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
      aiCoding: {
        defaultProjectMode: "existing-product-project",
        rules: themeLabAiCodingRules,
      },
    },
    null,
    2
  )
}

function agentsMarkerBlock(): string {
  return `<!-- theme-lab:agents:start -->

# Theme Lab Contract

This project uses a Theme Lab generated visual system.

## Source of Truth

- \`theme-lab.json\` contains the theme DNA, algorithm version, vibe, token contract, and AI coding rules.
- The global CSS file contains the runtime CSS variables.
- One-time prompts are not the source of truth.

## Theme Change Rule

Do not manually invent new structural visual values.

When changing UI, consume the compiled CSS variables and token classes.

When changing the theme direction, update the Theme Lab seed in \`theme-lab.json\` and regenerate the compiled CSS variables.

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

## Styling Rule

Allowed:

- shadcn adapter tokens
- semantic CSS variables
- token-bound Tailwind classes
- existing component variants

Forbidden for structural UI:

- raw Tailwind palette classes
- hardcoded hex colors
- arbitrary OKLCH values
- one-off shadows
- one-off border colors
- unapproved color scales

## Workflow

Before UI changes:

1. Read \`theme-lab.json\`.
2. Locate the global CSS theme block.
3. Identify the selected page/component scope.
4. Preserve business logic.
5. Refactor only the selected scope unless broader rollout is approved.
6. Report files changed, QA, and risks.

<!-- theme-lab:agents:end -->`
}

function selectedStrategySection(mode: ProjectImportMode): string {
  if (mode === "one-shot-page-polish") {
    return `Mode: One-shot page polish

This is the smallest-change option.

File strategy:
- Do not create \`theme-lab.json\`.
- Do not create or update \`AGENTS.md\`.
- Do not create \`theme.seed.json\`.
- Do not create \`vibe.manifest.json\`.
- Do not create \`theme.algorithm.ts\`.
- Do not create a design-system folder.
- Do not install dependencies.
- Modify only the selected page/component scope.
- If no selected scope is provided, stop after project inspection and ask the user for a target scope.

Tradeoff:
This option has the smallest project footprint, but it does not persist the Theme Lab DNA or AI rules. Future AI coding tasks may not follow this visual system unless the user provides the prompt again.`
  }

  if (mode === "full-reproducible-package") {
    return `Mode: Full reproducible package

This is the advanced option for teams or long-term projects that want local theme regeneration.

File strategy:
Start with the persistent project contract:

1. Existing global CSS theme block
2. \`theme-lab.json\`
3. \`AGENTS.md\` Theme Lab section

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

File strategy:
Create or update exactly these persistent touchpoints:

1. Existing global CSS theme block
2. \`theme-lab.json\`
3. \`AGENTS.md\` Theme Lab section

Do not create additional theme files unless the user explicitly requests the full reproducible package.

Global CSS marker:

\`\`\`css
/* theme-lab:runtime:start */
/* generated runtime variables */
/* theme-lab:runtime:end */
\`\`\`

AGENTS.md marker:

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
3. \`AGENTS.md\` Theme Lab section.

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

Refactor only the selected page/component scope.
The selected scope is required for this task.
If the selected scope cannot be found, stop and ask the user before changing files.`
  }

  return `Task: ${taskLabels[task]}

Install the selected Theme Lab contract.
Target scope is optional for this task.
If no selected scope is provided, install the allowed contract files only and do not perform broad UI refactors.`
}

function selectedScopeSection(targetScope: string): string {
  return `Selected scope:
\`${targetScope || "(not provided)"}\`

If no selected scope is provided, inspect the project but do not perform broad UI changes. Ask the user to provide a route, page, component, or feature area before refactoring UI.`
}

function aiUiOptimizationSection(): string {
  return `## AI UI Optimization Guidance

This packet can be used with AI UI tools such as v0, Codex, Cursor, or Claude Code.

When optimizing UI:

- Be specific about the screen, component, user role, and desired interaction state.
- Treat uploaded screenshots, selected elements, or selected files as the target scope.
- Keep existing routes, data fetching, event handlers, validation, permissions, and business logic.
- Improve visual hierarchy, spacing, typography, responsive behavior, and interaction states before adding new features.
- Add or improve empty, loading, error, disabled, hover, focus, selected, and success states when relevant.
- Prefer existing project components and shadcn/ui primitives such as Button, Card, Dialog, Tabs, Table, DropdownMenu, Sheet, Tooltip, Badge, Input, and Label.
- Use standard product UI compositions: Settings = Tabs + Card + Form; dashboard = Card + Badge + Table; CRUD = Table + DropdownMenu + Sheet; auth/onboarding = Card + Label + Input + Button.
- Use the exported theme tokens for surfaces, text, borders, rings, radius, shadows, and states.
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
${projectImportManifestJson(theme)}
\`\`\`

\`AGENTS.md\` Theme Lab section content:
\`\`\`md
${agentsMarkerBlock()}
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
  return `# One-Shot UI Polish Task

## Goal

Optimize the selected page or component once. Make the current interface feel more polished, clearer, and easier to use without turning this into a long-term design-system migration.

## Vercel Skill Lens

Use a v0-style workflow for UI generation: selected files or screenshots define the target, the output is a scoped code change, and shadcn/ui + Tailwind tokens are the default implementation language.

Use shadcn/ui guidance for component composition: prefer existing Button, Card, Dialog, Tabs, Table, DropdownMenu, Sheet, Tooltip, Badge, Input, Label, Separator, and similar primitives before creating custom controls.

## Hard Scope

Selected scope:
\`${targetScope || "(not provided)"}\`

If no selected scope is provided, inspect the project and ask for a route, page, component, or screenshot target before editing.

Do not:

- create or update \`theme-lab.json\`
- create or update \`AGENTS.md\`
- create \`theme.seed.json\`
- create \`vibe.manifest.json\`
- create \`theme.algorithm.ts\`
- create a design-system folder
- install dependencies
- rewrite unrelated pages
- optimize other page styling or broad cross-page visual consistency
- change routes, APIs, data loading, state machines, validation, permissions, or business logic

## Compact Theme Lab Reference

Use this as visual direction and token context only. Do not persist it as a project contract.

\`\`\`json
${oneShotThemeReferenceJson(options.theme)}
\`\`\`

## Styling Work

Spend most effort on the current interface:

- Clarify hierarchy: make primary actions, section titles, active states, and supporting text obvious.
- Clean layout: align edges, normalize gaps, avoid cramped groups, and keep density consistent.
- Improve surfaces: use standard cards/panels/dialogs with restrained borders, radius, and elevation.
- Improve typography: use balanced headings, readable line-height, consistent caption/body sizes, and no orphaned labels.
- Improve controls: make buttons, tabs, menus, inputs, toggles, and cards feel like one system.
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
2. Identify the smallest set of files needed for the visual improvement.
3. Preserve behavior and data flow.
4. Make the scoped UI polish using existing components and the compact Theme Lab reference.
5. Run available typecheck, lint, build, or route-level checks.
6. Report changed files, visual improvements, checks run, and any risk.

## Final Response Format

\`\`\`md
## Files Changed

...

## UI Polish

...

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

  return `# Theme Lab AI Task Packet

## Mission

This is a Theme Lab AI Task Packet.

Default assumption: this is an existing product project unless the repository is clearly empty or the user explicitly asks for a new project.

Default task posture: existing project theme integration / UI refactor, not a new project scaffold.

First inspect the project. Do not create or modify any files until you understand the project mode, CSS strategy, component system, global CSS location, and selected scope.

${taskInstructionSection(options.task, targetScope)}

## Source of Truth

Do not treat this prompt as the source of truth. The source of truth is the Theme Lab seed, algorithm version, and exported runtime CSS variables.

- seed / \`theme-lab.json\` seed = portable design intent.
- algorithmVersion = deterministic generation reference.
- theme.css / global CSS variables = runtime styling source.
- vibe manifest = visual guidance, not CSS source.
- \`AGENTS.md\` = persistent AI coding rules when installed.

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
- selected target file or route

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
  "recommendedAction": "install-theme-bridge-and-refactor-selected-scope",
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
- selected page/component styling
- layout hierarchy
- surface hierarchy
- spacing / density
- borders / radius / elevation
- focus / hover / selected states
- empty / loading / error / success states
- responsive behavior
- component composition, only when safe

Forbidden by default:

- scaffold a new app
- overwrite global CSS wholesale
- install dependencies
- replace component library
- create a parallel design-system folder
- rewrite unrelated pages
- rewrite app shell globally
- remove business logic
- change APIs or data contracts
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
- keep existing shadcn component structure
- replace raw structural palette classes with theme tokens inside selected scope

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
- refactor repeated structural styles gradually
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
  "random gradient utilities",
  "unapproved new color scales",
])}

Raw Tailwind palette classes may be acceptable for non-structural one-off content only when explicitly justified, but they are forbidden for theme-bearing UI structure.

## Visual Contract

This theme is designed for product interfaces, not decorative marketing pages.

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

## Selected Scope

${selectedScopeSection(targetScope)}

## Execution Plan

1. Inspect project structure.
2. Detect project mode.
3. Find global CSS and token/component baseline.
4. Decide integration strategy.
5. Apply the selected file strategy.
6. Inspect selected scope if provided.
7. Preserve business logic.
8. Refactor visual structure to use tokens if task allows modifications.
9. Improve hierarchy, density, states, and responsive behavior if task allows modifications.
10. Run available checks.
11. Report changed files and risks.

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

## Business Logic Preservation

List preserved logic and any risky areas.

## Visual Changes

...

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
    task: "install-theme-contract",
    theme,
  })
}

export function exportThemePromptFromOutput(theme: ThemeOutput): string {
  return exportPersistentProjectContractFromOutput(theme)
}
