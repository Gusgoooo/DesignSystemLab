import {
  requiredAntdAliasTokenNames,
  requiredAntdSeedTokenNames,
  requiredMapTokenNames,
  requiredSemanticTokenNames,
  requiredShadcnExtensionTokenNames,
  requiredShadcnOfficialTokenNames,
  type ThemeOutput,
} from "./schema"
import { registryResolverContract } from "./registry-capabilities"
import {
  assertCoreThemeHealth,
  assertThemeHealth,
  coreThemeHealthContract,
  createCoreThemeHealthReport,
  createThemeHealthReport,
  themeHealthContract,
} from "./health"
import {
  assertAntdThemeHealth,
  createAntdThemeHealthReport,
  antdThemeHealthContract,
} from "./antd-health"

const algorithmVersions = {
  color: "oklch-seed-v3",
  radius: "ratio-v1",
  density: "density-v1",
  typography: "type-v5",
  elevation: "elevation-v2",
  motion: "motion-v1",
  semantic: "map-driven-semantic-v6",
  shadcn: "official-plus-extensions-v4",
  antd: "config-provider-theme-v1",
  vibe: "descriptor-v1",
} as const

export const themeLabManifestAlgorithmVersion =
  "theme-lab-seed-algorithm-v12"

export const themeLabTokenArchitectureContract = {
  version: 2,
  sourceOfTruth: "ThemeSeed",
  generationOrder: [
    "ThemeSeed",
    "Algorithmic Map Tokens",
    "Semantic Tokens",
    "Selected Component-System Adapter: shadcn, Ant Design, or none",
    "Framework Runtime Exposure And Preview Components",
  ],
  mutationPolicy:
    "Change theme direction in ThemeSeed, then regenerate every downstream layer. Do not hand-edit generated map, semantic, adapter, or compiled CSS values.",
  layerRules: {
    map:
      "Algorithms expand seed color, shape, density, typography, material, and motion controls into deterministic scales and primitives.",
    semantic:
      "Semantic colors must consume algorithmic map colors. Seed material and vibe controls may influence semantic decisions, but must not create a second color-generation path.",
    shadcnOfficial:
      "This layer contains only the current official shadcn theme vocabulary.",
    shadcnExtensions:
      "Compatibility or product additions remain separate so official support can be audited without confusing project-specific capabilities.",
    antd:
      "The Ant Design adapter converts the same semantic source into opaque ConfigProvider ThemeConfig tokens. Global Seed, Map, and Alias tokens cover every Ant Design component; component overrides remain optional and local.",
    portableCore:
      "The portable core export stops after Map and Semantic Tokens and is available for custom adapters without becoming a third main application workflow.",
  },
  officialShadcnTokens: requiredShadcnOfficialTokenNames,
  shadcnExtensionTokens: requiredShadcnExtensionTokenNames,
  projectSemanticTokens: requiredSemanticTokenNames,
  antDesignSeedTokens: requiredAntdSeedTokenNames,
  antDesignAliasTokens: requiredAntdAliasTokenNames,
} as const

export const themeLabShadcnTokenArchitectureContract = {
  version: 2,
  sourceOfTruth: "ThemeSeed",
  generationOrder: [
    "ThemeSeed",
    "Algorithmic Map Tokens",
    "Semantic Tokens",
    "Official shadcn Adapter Tokens",
    "Design System Lab shadcn Extensions",
    "Tailwind Exposure And Preview Components",
  ],
  mutationPolicy:
    "Change theme direction in ThemeSeed, then regenerate every downstream layer. Do not hand-edit generated map, semantic, adapter, or compiled CSS values.",
  layerRules: {
    map:
      "Algorithms expand seed color, shape, density, typography, material, and motion controls into deterministic scales and primitives.",
    semantic:
      "Semantic colors must consume algorithmic map colors. Seed material and vibe controls may influence semantic decisions, but must not create a second color-generation path.",
    shadcnOfficial:
      "This layer contains only the current official shadcn theme vocabulary.",
    shadcnExtensions:
      "Compatibility or product additions remain separate so official support can be audited without confusing project-specific capabilities.",
  },
  officialShadcnTokens: requiredShadcnOfficialTokenNames,
  shadcnExtensionTokens: requiredShadcnExtensionTokenNames,
  projectSemanticTokens: requiredSemanticTokenNames,
} as const

export const themeLabCoreTokenArchitectureContract = {
  version: 1,
  sourceOfTruth: "ThemeSeed",
  generationOrder: [
    "ThemeSeed",
    "Algorithmic Map Tokens",
    "Semantic Tokens",
    "Detected Project Styling Adapter",
  ],
  mutationPolicy:
    "Change theme direction in ThemeSeed, regenerate map and semantic tokens, then bind the target project's existing components and styling layer to the generated CSS variables.",
  layerRules: {
    map:
      "Algorithms expand color, shape, density, typography, material, and motion seeds into deterministic framework-neutral primitives.",
    semantic:
      "Semantic roles describe product meaning without assuming shadcn, Ant Design, Radix, Base UI, Tailwind, or a specific framework.",
    projectAdapter:
      "Detect the existing styling mechanism and bind it to the semantic variables. Do not install, replace, or imply a component system.",
  },
  mapTokens: requiredMapTokenNames,
  semanticTokens: requiredSemanticTokenNames,
  excludedAdapters: [
    "official shadcn adapter tokens",
    "Design System Lab shadcn extensions",
    "Ant Design ThemeConfig tokens",
    "registry or primitive-engine assumptions",
  ],
} as const

export const themeLabAntdTokenArchitectureContract = {
  version: 1,
  sourceOfTruth: "ThemeSeed",
  generationOrder: [
    "ThemeSeed",
    "Algorithmic Map Tokens",
    "Semantic Tokens",
    "Ant Design Seed And Alias Tokens",
    "ConfigProvider ThemeConfig",
    "Ant CSS Variables",
    "Optional Detected Styling-Layer Exposure",
  ],
  mutationPolicy:
    "Change theme direction in ThemeSeed, regenerate ThemeConfig, then update an optional styling-layer bridge only when the target project already uses that styling layer.",
  layerRules: {
    map:
      "Algorithms expand color, shape, density, typography, material, and motion seeds into deterministic scales.",
    semantic:
      "Semantic roles decide product meaning before framework adaptation.",
    antDesign:
      "The adapter emits opaque Seed and Alias token values for ConfigProvider so every Ant Design component inherits one complete global theme.",
    stylingLayer:
      "Detect Tailwind, CSS Modules, CSS-in-JS, Less/SCSS, or plain CSS. Reuse Ant Design CSS variables when a custom styling layer exists; never add Tailwind solely for theme installation.",
    component:
      "Component token overrides are optional, preserved when already present, and used only for repeated concepts that the global Alias layer cannot express.",
  },
  antDesignSeedTokens: requiredAntdSeedTokenNames,
  antDesignAliasTokens: requiredAntdAliasTokenNames,
} as const

export const themeLabCoreTokenContract = {
  version: 1,
  componentSystem: "none",
  mapTokens: requiredMapTokenNames,
  semanticTokens: requiredSemanticTokenNames,
  runtime: "framework-neutral-css-variables",
  guarantees: [
    "one seed-driven map and semantic source of truth",
    "light and dark semantic values",
    "color, typography, radius, density, elevation, and motion variables",
    "no component library, primitive engine, registry, or framework dependency",
  ],
  limitations: [
    "does not replace inconsistent component markup",
    "does not add accessibility or interaction behavior",
    "does not guarantee visual consistency until existing components bind to the variables",
  ],
  forbidden: [
    "installing shadcn or Ant Design implicitly",
    "running a registry resolver",
    "migrating Radix or Base UI",
    "creating a second component system",
    "claiming component normalization from token installation alone",
  ],
} as const

export const themeLabAntdContract = {
  version: 2,
  officialArchitecture: [
    "Seed Token",
    "Map Token",
    "Alias Token",
    "Component Token",
  ],
  runtimeEntry: "ConfigProvider.theme",
  componentCoverage:
    "Every Ant Design component consumes the complete global ThemeConfig token layer. Use ThemeConfig.components only for repeated component-specific concepts that global tokens cannot express.",
  algorithms: {
    light: ["theme.defaultAlgorithm"],
    dark: ["theme.darkAlgorithm"],
    compact: ["theme.compactAlgorithm"],
    composition:
      "Compose compactAlgorithm with the light or dark algorithm only when the density seed is compact.",
  },
  cssVariables:
    "Enable ThemeConfig.cssVar with the ant prefix and a stable light/dark key. Do not enable zeroRuntime by default because it requires the target project's static style extraction setup.",
  provider:
    "Wrap the React root with ConfigProvider and App. Use App/useApp or component hooks instead of context-free static message, Modal, and notification calls.",
  componentOverrides:
    "Preserve existing component overrides. Merge them after the generated global token layer and audit every override against the semantic source.",
  installationBoundary:
    "Install and verify ThemeConfig without restyling or replacing existing UI. Ask for explicit approval before mapping current interface content.",
  existingUiMapping:
    "After approval, infer component responsibility, hierarchy, surface, interaction, and state before choosing Alias or Component Tokens and official component variants. Do not replace literal values one-to-one.",
  forbidden: [
    "parallel Less/SCSS color systems that bypass ConfigProvider",
    "global .ant-* selector overrides for normal theming",
    "hardcoded component colors when an Alias or Component Token exists",
    "replacing Ant Design with another component system during theme installation",
    "enabling zeroRuntime without the required Ant Design static style import workflow",
  ],
  officialDocs: [
    "https://ant.design/docs/react/customize-theme/",
    "https://ant.design/components/config-provider/",
  ],
} as const

function normalizeUserDesignRules(userDesignRules?: string): string {
  return userDesignRules?.trim() ?? ""
}

export const themeLabDesignRuleLibrary = {
  entrypoint: "design-rules/index.json",
  rawEntrypoint:
    "https://raw.githubusercontent.com/Gusgoooo/DesignSystemLab/codex/distributed-design-rules/design-rules/index.json",
  rawBaseUrl:
    "https://raw.githubusercontent.com/Gusgoooo/DesignSystemLab/codex/distributed-design-rules",
  basePath: "design-rules",
  routing:
    "Choose the task mode first: token installation, new UI creation, or approved existing-UI mapping. Installation stops after wiring and verification. Creation loads the matched block before component rules. Existing UI mapping requires explicit user approval and uses model-reasoned semantic token selection. If local rules are unavailable, read the raw GitHub URLs.",
  readConfirmation:
    "Before editing, list taskMode, ruleIndexRead, rulesLoaded with elementType/source/firstHeading, and missingRules. Do not claim a rule was applied unless the file was actually opened.",
  externalKnowledgeManifest: "design-rules/external/knowledge-assets.json",
  embeddedContractFallbacks: [
    "theme-lab.json.registryContract",
    "theme-lab.json.tokenUsageContract",
    "theme-lab.json.tokenHealthContract",
  ],
  files: [
    "design-rules/index.json",
    "design-rules/core/rule-router.md",
    "design-rules/core/page-type-workflow.md",
    "design-rules/core/project-context.md",
    "design-rules/core/external-knowledge-routing.md",
    "design-rules/core/ui-normalization.md",
    "design-rules/core/token-binding.md",
    "design-rules/core/token-system.md",
    "design-rules/core/registry-block-mapping.md",
    "design-rules/core/visual-qa.md",
    "design-rules/core/completion-compliance.md",
    "design-rules/core/product-alignment.md",
    "design-rules/blocks/page-shell.md",
    "design-rules/blocks/dashboard.md",
    "design-rules/components/card.md",
    "design-rules/components/table.md",
    "design-rules/components/page-heading.md",
    "design-rules/components/sidebar.md",
    "design-rules/components/actions-and-buttons.md",
    "design-rules/components/filters-and-controls.md",
    "design-rules/components/forms-and-inputs.md",
    "design-rules/components/tabs.md",
    "design-rules/components/overlays.md",
    "design-rules/components/badges-and-alerts.md",
    "design-rules/components/metrics-and-charts.md",
    "design-rules/patterns/page-background.md",
    "design-rules/patterns/states.md",
    "design-rules/patterns/semantic-color.md",
    "design-rules/external/knowledge-assets.md",
    "design-rules/external/knowledge-assets.json",
  ],
} as const

export const themeLabAiInstructionTargets = [
  {
    tool: "Claude Code",
    primaryFile: "CLAUDE.md",
    notes: "Use for Claude Code project memory and persistent project instructions.",
  },
  {
    tool: "OpenAI Codex",
    primaryFile: "AGENTS.md",
    notes: "Codex reads AGENTS.md for repository guidance.",
  },
  {
    tool: "Cursor",
    primaryFile: ".cursor/rules/theme-lab.mdc",
    fallbackFile: "AGENTS.md",
    notes: "Use Cursor project rules when present; AGENTS.md is acceptable for cross-agent compatibility.",
  },
  {
    tool: "GitHub Copilot",
    primaryFile: ".github/copilot-instructions.md",
    notes: "Use repository-wide Copilot custom instructions.",
  },
  {
    tool: "Gemini CLI",
    primaryFile: "GEMINI.md",
    notes: "Use Gemini CLI context files.",
  },
  {
    tool: "Windsurf/Cascade",
    primaryFile: ".windsurfrules",
    notes: "Use Windsurf project rules when the project already uses Windsurf.",
  },
  {
    tool: "Qoder",
    primaryFile: "AGENTS.md",
    notes: "Qoder is compatible with AGENTS.md; native Qoder rules may take precedence.",
  },
] as const

export const themeLabTokenContract = {
  officialShadcnBaseline: requiredShadcnOfficialTokenNames,
  shadcnCompatibleExtensions: requiredShadcnExtensionTokenNames,
  projectSemanticExtensions: requiredSemanticTokenNames,
  allowed: [
    "bg-background",
    "text-foreground",
    "bg-card",
    "text-card-foreground",
    "bg-popover",
    "text-popover-foreground",
    "bg-primary",
    "text-primary-foreground",
    "bg-secondary",
    "text-secondary-foreground",
    "bg-muted",
    "text-muted-foreground",
    "bg-accent",
    "text-accent-foreground",
    "bg-destructive",
    "text-destructive-foreground",
    "bg-sidebar",
    "text-sidebar-foreground",
    "bg-sidebar-primary",
    "text-sidebar-primary-foreground",
    "bg-sidebar-accent",
    "text-sidebar-accent-foreground",
    "border-border",
    "border-input",
    "border-sidebar-border",
    "ring-ring",
    "ring-sidebar-ring",
    "bg-surface-canvas",
    "bg-surface-panel",
    "bg-surface-raised",
    "bg-surface-overlay",
    "text-content-primary",
    "text-content-secondary",
    "text-content-tertiary",
    "bg-[var(--surface-canvas)]",
    "bg-[var(--surface-panel)]",
    "bg-[var(--surface-raised)]",
    "text-[var(--content-primary)]",
    "text-[var(--content-secondary)]",
    "text-[var(--content-tertiary)]",
    "border-[var(--border-subtle)]",
    "border-[var(--border-default)]",
    "rounded-[var(--radius-none)]",
    "rounded-[var(--radius-control)]",
    "rounded-[var(--radius-card)]",
    "rounded-[var(--radius-panel)]",
    "rounded-[var(--radius-pill)]",
    "rounded-[var(--radius)]",
    "h-[var(--control-height-sm)]",
    "h-[var(--control-height-md)]",
    "h-[var(--control-height-lg)]",
    "px-[var(--control-padding-x)]",
    "gap-[var(--control-gap)]",
    "gap-[var(--section-gap)]",
    "p-[var(--panel-padding)]",
    "px-[var(--table-cell-padding-x)]",
    "py-[var(--table-cell-padding-y)]",
    "[box-shadow:var(--elevation-none)]",
    "[box-shadow:var(--elevation-control)]",
    "[box-shadow:var(--elevation-card)]",
    "[box-shadow:var(--elevation-popover)]",
    "duration-[var(--duration-base)]",
    "ease-[var(--ease-standard)]",
    "bg-success-bg",
    "text-success-foreground",
    "bg-warning-bg",
    "text-warning-foreground",
    "bg-info-bg",
    "text-info-foreground",
    "bg-danger-bg",
    "text-danger-foreground",
    "bg-chart-1",
    "bg-chart-2",
    "bg-chart-3",
    "bg-chart-4",
    "bg-chart-5",
    "text-chart-1",
    "text-chart-2",
    "text-chart-3",
    "text-chart-4",
    "text-chart-5",
    "border-chart-1",
    "border-chart-2",
    "border-chart-3",
    "border-chart-4",
    "border-chart-5",
  ],
  forbiddenForStructuralUi: [
    "raw Tailwind palette classes",
    "hardcoded hex colors",
    "arbitrary OKLCH values",
    "one-off shadow values",
    "one-off border colors",
    "legacy non-token radius values",
    "arbitrary border-radius values",
    "mixed radius scales",
    "same-role filled background/text pairs such as bg-primary text-primary",
    "missing foreground tokens on filled semantic backgrounds",
    "random gradient utilities",
    "unapproved new color scales beyond the sanctioned --status-* and --chart-1..5 families",
  ],
  intrinsicPrimitiveGeometry: [
    "checkbox keeps a stable 4-6px corner instead of following the global control radius",
    "radio and avatar remain circular",
    "switch and progress tracks remain pill-shaped",
  ],
} as const

export const themeLabRegistryContract = {
  version: 3,
  boundary:
    "Blocks provide page-level structure and behavior guidance. Components provide implementation. Semantic tokens provide visual meaning. Token installation does not trigger block installation or existing-UI replacement.",
  requiredOrder: [
    "install and verify the token contract before UI creation",
    "classify the requested page or substantial component",
    "read the matched raw block rule before individual component rules",
    "for shadcn, inspect matching official or configured Registry Blocks before composing from primitives",
    "for Ant Design, compose the matched block structure from official Ant components",
    "replace demo content with real product responsibilities",
    "bind each block slot to semantic token roles",
    "verify behavior, states, responsiveness, and token usage",
  ],
  modes: {
    tokenInstallation: [
      "write the runtime token adapter, theme-lab.json, and one AI instruction file",
      "do not change current pages or components",
      "after successful verification, ask whether the user wants to map existing UI",
    ],
    newUiCreation: [
      "use tokens from the first implementation",
      "start from the closest matching block",
      "compose only the components required by real product behavior",
      "do not copy demo content",
    ],
    existingUiMapping: [
      "run only after explicit user approval",
      "infer semantic roles from responsibility, hierarchy, surface, interaction, and state",
      "select the correct token and component variant instead of replacing literal values one-to-one",
      "preserve routes, APIs, data, handlers, validation, permissions, accessibility, and behavior",
      "do not replace component structure unless the user separately requests it",
    ],
  },
  pageBaselines: {
    dashboard: ["dashboard shell", "sidebar", "site header", "summary", "chart", "table"],
    resourceIndex: ["page heading", "toolbar", "table/list", "row detail", "states"],
    settings: ["page heading", "field groups", "save/reset actions", "validation", "states"],
    formFlow: ["workflow header", "field groups", "validation", "submit actions", "states"],
    aiCommand: ["app shell", "context/navigation", "thread/results", "composer", "tool states"],
    docsSpec: ["docs shell", "section navigation", "content", "code/table", "detail overlay"],
    auth: ["auth shell", "credentials", "recovery", "validation", "submit", "states"],
    detail: ["page heading", "summary", "sections", "actions", "states"],
    marketing: ["page shell", "hero", "proof", "offer", "CTA", "states"],
  },
  shadcnInstallSafety:
    "Before an actual Registry Block write, inspect the item and file diff. Preserve the existing primitive engine and never use overwrite by default.",
  failureConditions: [
    "a page is built from isolated primitives without checking a matching block first",
    "demo content or routes remain",
    "component slots use raw structural values",
    "business behavior or responsive states are dropped",
    "existing UI is mapped before the user explicitly approves it",
    "token mapping is performed as literal value replacement without semantic reasoning",
    "a Registry Block write overwrites local work without diff review",
  ],
} as const

export const themeLabTokenUsageContract = {
  version: 1,
  decisionOrder: [
    "component responsibility",
    "interaction or product state",
    "surface layer",
    "matching background and foreground pair",
    "border and focus role",
    "radius, density, elevation, and motion role",
  ],
  slots: [
    {
      slot: "page.canvas",
      purpose: "base application or page surface",
      tokens: ["bg-background", "text-foreground"],
    },
    {
      slot: "card.raised",
      purpose: "object, module, or decision preview",
      tokens: [
        "bg-card",
        "text-card-foreground",
        "border-border",
        "rounded-[var(--radius-card)]",
        "[box-shadow:var(--elevation-card)]",
      ],
    },
    {
      slot: "overlay.floating",
      purpose: "menu, popover, dialog, sheet, or contextual workflow",
      tokens: [
        "bg-popover",
        "text-popover-foreground",
        "border-border",
        "ring-ring",
        "[box-shadow:var(--elevation-popover)]",
      ],
    },
    {
      slot: "navigation.sidebar",
      purpose: "persistent product navigation",
      tokens: [
        "bg-sidebar",
        "text-sidebar-foreground",
        "border-sidebar-border",
        "ring-sidebar-ring",
      ],
    },
    {
      slot: "navigation.sidebar-active",
      purpose: "current navigation destination",
      tokens: ["bg-sidebar-accent", "text-sidebar-accent-foreground"],
    },
    {
      slot: "action.primary",
      purpose: "highest-priority command",
      tokens: [
        "bg-primary",
        "text-primary-foreground",
        "text-[length:var(--text-caption)]",
        "ring-ring",
      ],
    },
    {
      slot: "action.secondary",
      purpose: "quiet filled command",
      tokens: [
        "bg-secondary",
        "text-secondary-foreground",
        "text-[length:var(--text-caption)]",
        "ring-ring",
      ],
    },
    {
      slot: "state.interactive",
      purpose: "hover, current selection, or active neutral state",
      tokens: ["bg-accent", "text-accent-foreground", "ring-ring"],
    },
    {
      slot: "content.muted",
      purpose: "passive region, helper copy, metadata, or skeleton",
      tokens: ["bg-muted", "text-muted-foreground"],
    },
    {
      slot: "control.input",
      purpose: "editable value and focus boundary",
      tokens: [
        "bg-background",
        "text-foreground",
        "border-input",
        "ring-ring",
        "rounded-[var(--radius-control)]",
        "[box-shadow:var(--elevation-control)]",
      ],
    },
    {
      slot: "action.destructive",
      purpose: "irreversible or high-risk command",
      tokens: [
        "bg-destructive",
        "text-destructive-foreground",
        "text-[length:var(--text-caption)]",
      ],
    },
    {
      slot: "feedback.status-soft",
      purpose: "success, warning, info, or danger feedback",
      tokens: [
        "bg-success-bg text-success-foreground",
        "bg-warning-bg text-warning-foreground",
        "bg-info-bg text-info-foreground",
        "bg-danger-bg text-danger-foreground",
      ],
    },
    {
      slot: "data.category",
      purpose: "stable non-status series or category identity",
      tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
    },
  ],
  requiredChecks: [
    "existing UI mapping runs only after explicit user approval",
    "mapping infers responsibility, hierarchy, surface, interaction, and state instead of matching literal values",
    "filled backgrounds declare matching foregrounds",
    "selected state does not impersonate a primary command",
    "focus-visible uses ring tokens",
    "radius, density, elevation, and motion use generated map tokens",
    "status and chart/category color meanings stay separate",
    "loading, empty, error, disabled, permission, and responsive states remain connected",
  ],
} as const

export const themeLabCoreTokenUsageContract = {
  version: 1,
  bindingMode: "existing-components",
  decisionOrder: [
    "existing component responsibility",
    "interaction or product state",
    "surface layer",
    "matching background and foreground pair",
    "border and focus role",
    "radius, density, elevation, typography, and motion role",
  ],
  slots: [
    {
      slot: "page.canvas",
      purpose: "base application or page surface",
      tokens: ["--surface-canvas", "--content-primary"],
    },
    {
      slot: "surface.panel",
      purpose: "passive grouped region",
      tokens: ["--surface-panel", "--content-primary", "--border-subtle"],
    },
    {
      slot: "surface.raised",
      purpose: "card, object, or module surface",
      tokens: [
        "--surface-raised",
        "--content-primary",
        "--border-default",
        "--radius-card",
        "--elevation-card",
      ],
    },
    {
      slot: "overlay.floating",
      purpose: "menu, popover, dialog, drawer, or contextual workflow",
      tokens: [
        "--surface-overlay",
        "--content-primary",
        "--border-default",
        "--focus-ring",
        "--elevation-popover",
      ],
    },
    {
      slot: "action.primary",
      purpose: "highest-priority command",
      tokens: [
        "--action-primary",
        "--action-primary-hover",
        "--action-primary-active",
        "--action-primary-fg",
        "--focus-ring",
      ],
    },
    {
      slot: "action.secondary",
      purpose: "quiet command or selected neutral state",
      tokens: [
        "--action-secondary",
        "--action-secondary-hover",
        "--action-secondary-fg",
        "--focus-ring",
      ],
    },
    {
      slot: "content.secondary",
      purpose: "helper copy, metadata, or secondary hierarchy",
      tokens: ["--content-secondary", "--content-tertiary"],
    },
    {
      slot: "control.input",
      purpose: "editable value and focus boundary",
      tokens: [
        "--surface-canvas",
        "--content-primary",
        "--border-default",
        "--focus-ring",
        "--radius-control",
        "--control-height-md",
        "--elevation-control",
      ],
    },
    {
      slot: "feedback.status",
      purpose: "success, warning, info, or danger feedback",
      tokens: [
        "--status-success-bg + --status-success-fg",
        "--status-warning-bg + --status-warning-fg",
        "--status-info-bg + --status-info-fg",
        "--status-danger-bg + --status-danger-fg",
      ],
    },
    {
      slot: "data.category",
      purpose: "stable non-status series or category identity",
      tokens: ["--data-1", "--data-2", "--data-3", "--data-4", "--data-5"],
    },
  ],
  requiredChecks: [
    "existing UI mapping runs only after explicit user approval",
    "mapping infers responsibility, hierarchy, surface, interaction, and state instead of matching literal values",
    "existing components remain the implementation source of truth unless a separate component change is requested",
    "filled backgrounds use matching foreground variables",
    "focus-visible uses --focus-ring",
    "raw structural values are replaced only in new UI or the approved mapping scope",
    "intrinsic primitive geometry is preserved",
    "loading, empty, error, disabled, permission, and responsive states remain connected",
  ],
} as const

export const themeLabAiCodingRules = [
  "Read theme-lab.json before creating or mapping UI. ThemeSeed is the only editable theme source; regenerate downstream tokens after seed changes.",
  "Token installation is installation-only. Do not restyle, replace, normalize, or map existing UI during the installation task.",
  "After successful installation and verification, ask whether the user wants to map the existing interface to the Token system. Do not continue without explicit approval.",
  "New pages and components must consume the installed tokens from their first implementation.",
  "Use the raw GitHub design-rules index as the guidance router. Load only the matched block and component rules.",
  "For page-level creation, start from the closest matching Block before composing individual components. Never copy demo content.",
  "For shadcn, inspect matching official or configured Registry Blocks before primitives. For Ant Design, use the matched block structure with official Ant components.",
  "Approved existing-UI mapping is a model-reasoned semantic task: infer responsibility, hierarchy, surface, interaction, and state before choosing tokens or component variants. Do not perform literal value replacement alone.",
  "Preserve routes, APIs, data, handlers, forms, validation, permissions, accessibility, responsive behavior, and domain copy.",
  "Use semantic token pairs and generated geometry, typography, elevation, and motion values. Do not invent raw structural colors or a parallel token system.",
  "Update one existing tool-native AI instruction file. Do not copy the local design-rules directory or create every instruction target by default.",
  "Use external knowledge assets only when explicitly requested; local product context and the installed Token contract remain authoritative.",
] as const

export function exportPresetJsonFromOutput(theme: ThemeOutput): string {
  assertThemeHealth(theme, "Theme preset export")
  assertAntdThemeHealth(theme, "Theme preset export")

  return JSON.stringify(
    {
      version: "0.4.0",
      name: theme.vibe.name,
      seed: theme.seed,
      algorithms: algorithmVersions,
      tokens: {
        map: theme.mapTokens,
        semantic: theme.semanticTokens,
        darkSemantic: theme.darkSemanticTokens,
        shadcnOfficial: theme.shadcnTokens,
        darkShadcnOfficial: theme.darkShadcnTokens,
        shadcnExtensions: theme.shadcnExtensionTokens,
        darkShadcnExtensions: theme.darkShadcnExtensionTokens,
        antd: theme.antdTheme,
      },
      vibe: theme.vibe,
    },
    null,
    2
  )
}

export function exportVibeJsonFromOutput(theme: ThemeOutput): string {
  return JSON.stringify(
    {
      name: theme.vibe.name,
      keywords: theme.vibe.keywords,
      visualContract: theme.vibe.visualContract,
    },
    null,
    2
  )
}

export function exportThemeLabManifestJsonFromOutput(
  theme: ThemeOutput,
  userDesignRules?: string
): string {
  assertCoreThemeHealth(theme, "Theme Lab manifest export")
  assertThemeHealth(theme, "Theme Lab manifest export")
  assertAntdThemeHealth(theme, "Theme Lab manifest export")
  const coreTokenHealth = createCoreThemeHealthReport(theme)
  const tokenHealth = createThemeHealthReport(theme)
  const antdHealth = createAntdThemeHealthReport(theme)
  const normalizedUserDesignRules = normalizeUserDesignRules(userDesignRules)

  return JSON.stringify(
    {
      schemaVersion: 7,
      kind: "theme-lab-manifest",
      applicationRoutes: {
        componentSystems: ["shadcn", "antd"],
        operation: "install-token-contract",
        frameworkPolicy: "use-current-project-without-migration",
        portableCoreTokenExport: true,
        existingUiMapping: "ask-after-successful-installation",
      },
      theme: {
        name: theme.vibe.name,
        sourceOfTruth: "theme-seed",
        algorithmVersion: themeLabManifestAlgorithmVersion,
        cssTarget: "existing-global-css-marker-block",
        seed: theme.seed,
      },
      vibe: {
        summary: theme.vibe.visualContract.summary,
        keywords: theme.vibe.keywords,
        avoid: theme.vibe.visualContract.avoid,
      },
      tokenContract: themeLabTokenContract,
      tokenArchitecture: themeLabTokenArchitectureContract,
      tokenUsageContract: themeLabTokenUsageContract,
      coreTokenContract: themeLabCoreTokenContract,
      coreTokenArchitecture: themeLabCoreTokenArchitectureContract,
      coreTokenUsageContract: themeLabCoreTokenUsageContract,
      coreTokenHealthContract: coreThemeHealthContract,
      coreTokenHealth,
      tokenHealthContract: themeHealthContract,
      tokenHealth,
      antdContract: themeLabAntdContract,
      antdHealthContract: antdThemeHealthContract,
      antdHealth,
      antdAdapter: theme.antdTheme,
      registryContract: themeLabRegistryContract,
      registryResolver: registryResolverContract,
      designRuleLibrary: themeLabDesignRuleLibrary,
      userAuthoredDesignRules: normalizedUserDesignRules
        ? {
            source: "Design System Lab export panel",
            format: "markdown",
            body: normalizedUserDesignRules,
          }
        : undefined,
      aiCoding: {
        instructionTargets: themeLabAiInstructionTargets,
        rules: themeLabAiCodingRules,
      },
    },
    null,
    2
  )
}
