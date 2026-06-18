import type { ThemeOutput } from "./schema"

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

function normalizeUserDesignRules(userDesignRules?: string): string {
  return userDesignRules?.trim() ?? ""
}

export const themeLabDesignRuleLibrary = {
  entrypoint: "design-rules/index.json",
  basePath: "design-rules",
  routing:
    "Load requiredAlways rules, inventory the selected UI by element type, then open only matched files from rules[].source.",
  readConfirmation:
    "Before editing, list ruleIndexRead, requiredRuleFilesLoaded, matchedRuleFilesLoaded with elementType/source/firstHeading, and missingRuleFiles. Do not claim a rule was applied unless the file was actually opened.",
  files: [
    "design-rules/index.json",
    "design-rules/core/rule-router.md",
    "design-rules/core/ui-normalization.md",
    "design-rules/core/token-binding.md",
    "design-rules/core/visual-qa.md",
    "design-rules/core/product-alignment.md",
    "design-rules/components/card.md",
    "design-rules/components/table.md",
    "design-rules/components/page-heading.md",
    "design-rules/components/sidebar.md",
    "design-rules/components/actions-and-buttons.md",
    "design-rules/components/filters-and-controls.md",
    "design-rules/patterns/page-background.md",
    "design-rules/patterns/states.md",
  ],
} as const

export const themeLabTokenContract = {
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
    "ring-ring",
    "bg-[var(--surface-canvas)]",
    "bg-[var(--surface-panel)]",
    "bg-[var(--surface-raised)]",
    "text-[var(--content-primary)]",
    "text-[var(--content-secondary)]",
    "text-[var(--content-tertiary)]",
    "border-[var(--border-subtle)]",
    "border-[var(--border-default)]",
    "rounded-[var(--radius-control)]",
    "rounded-[var(--radius-card)]",
    "rounded-[var(--radius-panel)]",
    "rounded-[var(--radius)]",
    "h-[var(--control-height-sm)]",
    "h-[var(--control-height-md)]",
    "h-[var(--control-height-lg)]",
    "gap-[var(--section-gap)]",
    "p-[var(--panel-padding)]",
    "[box-shadow:var(--elevation-card)]",
    "[box-shadow:var(--elevation-popover)]",
    "duration-[var(--duration-base)]",
    "ease-[var(--ease-standard)]",
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
    "unapproved new color scales",
  ],
} as const

export const themeLabAiCodingRules = [
  "Write all AI-facing instructions, theme manifests, vibe descriptors, task packets, and final implementation reports in English.",
  "Read theme-lab.json before UI changes.",
  "Global CSS variables are the runtime source for styling.",
  "One-time prompts are not the source of truth.",
  "Preserve routes, APIs, data loading, state, handlers, forms, validation, permissions, feature flags, and business logic.",
  "Do not scaffold a new app inside an existing project.",
  "Do not create a parallel design system.",
  "Do not install dependencies unless approved.",
  "The exactly-three persistent touchpoints rule applies only to theme contract files; UI normalization may modify existing route, layout, app shell, and component files that are part of the approved normalization plan.",
  "Do not use raw Tailwind palette classes for structural UI.",
  "Do not use hardcoded hex colors for structural UI.",
  "Do not use arbitrary OKLCH values for structural UI.",
  "When changing UI, consume the existing compiled CSS variables and token contract.",
  "Use design-rules/index.json as the distributed design rule router when it exists.",
  "Before UI normalization, load requiredAlways rule files, inventory the selected scope by element type, and open only matched files from rules[].source.",
  "Before editing, output a Rule Read Confirmation listing the exact rule files actually opened, including first headings for matched files.",
  "If the selected scope contains cards, design-rules/components/card.md must be opened and listed before card UI is changed; do not claim the card rule was applied if the file could not be opened.",
  "If a tool cannot access local files or raw URLs, say so explicitly and ask the user to provide the rule files or accessible raw URLs; do not hallucinate rule contents.",
  "Do not compress all component rules into one prompt; detailed design rules live in separate design-rules/**/*.md files.",
  "If a matching design rule file is missing, make the smallest safe normalization and report the missing rule file.",
  "When asked to redesign, optimize, rebuild, or refactor a selected UI scope, treat it as UI normalization by default rather than a redesign from scratch.",
  "Preserve existing page content, information architecture, workflow order, business rules, routes, APIs, data loading, state, handlers, forms, validation, permissions, feature flags, and domain copy.",
  "Do not discard the old visible UI tree by default; normalize components, repeated style fragments, token usage, spacing, radius, elevation, and states around the existing product structure.",
  "Prefer existing project components and shadcn/ui primitives for controls and repeated patterns when behavior can be preserved.",
  "Use user-authored Theme Lab design rules as the design source; do not browse, import, or imitate external visual references unless the user explicitly asks.",
  "Before editing, identify which user-authored design rule applies to the selected UI pattern; if no rule exists, make the smallest safe normalization and report the missing rule.",
  "Decorative exceptions explicitly defined by user-authored rules may use non-token colors or values only for non-structural ambient layers, never for text, primary surfaces, borders, focus rings, or actionable states.",
  "For plain page canvases, a very subtle page-top ambient wash may be added as a non-structural background layer behind content.",
  "Page-top ambient wash should occupy only the top fifth of the page or viewport, fade fully into bg-background or transparent, and never create layout height or become an interactive layer.",
  "Page-top ambient wash is a decorative exception: it may use non-token colors, opacity, blur, and gradient stops, but all real UI surfaces, text, borders, focus rings, actions, states, radius, and elevation must remain token-bound.",
  "Page-top ambient wash must stay extremely quiet: low opacity, low saturation, high lightness, broad softness, no hard edge, no bokeh, no blobs, no rainbow gradients, and no strong brand-color bands.",
  "Page-top ambient wash must not reduce contrast, tint cards heavily, hide dividers, compete with the page header, affect sidebars by default, or make primary actions less obvious.",
  "Do not use external references unless the user explicitly provides or requests them; never copy brand styling, demo content, paid/proprietary source code, or unrelated product patterns.",
  "Do not merely place shadcn primitives one by one; normalize the existing product UI with complete, behavior-preserving component patterns.",
  "Use one primary user-authored rule or existing local pattern per page or scope; do not mix multiple systems or invented patterns unless the workflow truly requires it.",
  "Do not introduce extra cards, nested panels, borders, shadows, badges, icons, or toolbars just to make the UI look more shadcn.",
  "Preserve any existing information architecture or workflow order that is already clear, and normalize only the problematic visible UI layer around it.",
  "When the selected scope contains a page heading, page header, title/action bar, resource header, detail header, or list header, reuse the Page Heading pattern: left title and metadata facts, right primary and secondary actions, responsive stacking, and mobile More menu for secondary actions.",
  "Page headings should use a responsive layout equivalent to lg:flex lg:items-center lg:justify-between, with a min-w-0 flex-1 title area and a mt-5 action group that aligns on large screens.",
  "Page heading metadata should be compact icon + short text facts below the title, using actual product fields such as status, type, owner, team, location, date, amount, workspace, lifecycle stage, last updated, or due date.",
  "Do not copy page heading demo content such as job titles, fake locations, fake salaries, or fake dates; preserve the product's real title, metadata, breadcrumbs, status, filters, and action semantics.",
  "Do not add @heroicons/react or @headlessui/react for page headings unless the project already uses them; map icons to the existing icon library and menus/actions to existing shadcn or project components.",
  "Convert page heading raw sample colors to Theme Lab tokens: text-foreground, text-muted-foreground, bg-background, bg-primary text-primary-foreground, border-border, ring-ring, and existing button variants.",
  "Keep page headings unframed by default; do not wrap the whole heading in a decorative card unless the product already uses framed headers.",
  "Page heading actions must preserve behavior: keep the primary action visible, make secondary actions quieter, and collapse secondary actions into a More dropdown on small screens when horizontal space is limited.",
  "Page headings must avoid overflow: long titles should use min-w-0, truncate, wrapping, or responsive stacking, and actions must not collide with the title.",
  "Before final report, verify that the normalized UI is calmer, clearer, more readable, and more internally consistent than the previous UI.",
  "Normalize bespoke, non-shadcn, or non-shadcn-like visible components inside the selected scope when behavior can be preserved.",
  "If a needed shadcn component file is missing, inspect the existing shadcn setup and add local component files through the project's established shadcn workflow when that does not introduce new production dependencies.",
  "Reconnect existing API calls, data loaders, mutations, event handlers, validation, navigation, permissions, and state to the normalized UI.",
  "When the selected page or product scope contains a sidebar, include the complete sidebar in the UI normalization scope; do not polish only the main content while leaving the old bespoke sidebar in place.",
  "For sidebar replacement, the user explicitly approves the official shadcn sidebar blocks reference: https://ui.shadcn.com/blocks/sidebar.",
  "Choose the closest matching shadcn sidebar block based on the existing navigation structure, density, grouping, collapse behavior, account/workspace switchers, search, badges, nested groups, and responsive behavior.",
  "If no shadcn sidebar block clearly matches the existing navigation structure, install the fallback block with npx shadcn@latest add sidebar-08, then adapt it to the existing routes, labels, groups, data, permissions, and active states.",
  "Before running a shadcn sidebar command, inspect components.json, the existing components/ui directory, aliases, package manager, and whether components/ui/sidebar already exists; do not overwrite unrelated files.",
  "Do not copy shadcn demo content, fake teams, fake projects, fake users, or placeholder routes into the product; the block is only an implementation pattern.",
  "Sidebar replacement must preserve existing route URLs, active route logic, permissions, badges/counts, account or workspace context, user menu actions, collapse behavior, and responsive behavior unless the user explicitly changes them.",
  "Sidebar replacement must use shadcn sidebar primitives such as SidebarProvider, Sidebar, SidebarInset, SidebarHeader, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarRail, and SidebarTrigger when they fit the project setup.",
  "Sidebar styling must connect to Theme Lab tokens: use bg-sidebar text-sidebar-foreground, bg-sidebar-primary text-sidebar-primary-foreground, bg-sidebar-accent text-sidebar-accent-foreground, border-sidebar-border or border-border, ring-sidebar-ring or ring-ring, and token-backed radius, spacing, and elevation where applicable.",
  "After replacing a sidebar, verify active, hover, focus-visible, selected, collapsed, expanded, mobile sheet/drawer, disabled, loading, and permission-hidden states.",
  "For long-term projects, treat the work as product-wide UI alignment: preserve existing page workflows while unifying component grammar, page-header rhythm, content width system, action placement, state design, and responsive behavior.",
  "Do not deliver isolated page makeovers in a long-term project; similar page types must share component and token patterns while preserving their workflows.",
  "Do not produce a generic shadcn SaaS look; use shadcn primitives as implementation materials while creating product-specific rhythm through page headers, density, surface contrast, card grouping, navigation emphasis, primary action placement, state tone, and restrained brand color.",
  "Before the final report, compare normalized UI against previous UI and explicitly report preserved content/workflow, unified component patterns, reduced UI debt, semantic token pairs checked, responsive states checked, and pages still needing alignment.",
  "Normalize component hierarchy, responsive behavior, and interaction states before or while applying tokens.",
  "Reject token-only outcomes when obvious ad hoc controls or inconsistent component patterns remain.",
  "Cards and tables must follow progressive disclosure: they should preview useful destination/detail content, not act as empty decorative containers.",
  "Clickable cards must pull a meaningful subset from their destination/detail content, such as title, status, owner, date, latest activity, key metric, next action, and 2-4 important facts.",
  "Card content should be rich but scannable: avoid long paragraphs, use compact facts, labels, values, chips, short snippets, and clear text hierarchy.",
  "Cards may use a very subtle semantic ambient tint only when it communicates status, category, priority, or domain.",
  "Card ambient tint is a decorative exception: it does not have to use token colors, token opacity, token blur, or token gradient values, but saturation, brightness, opacity, and visual weight must remain restrained.",
  "Prefer a top ambient wash for cards: anchor the color to the upper edge inside the card, clip it to the card radius, and fade it downward into the normal bg-card surface.",
  "Card top ambient wash should occupy only the upper 20-35% of the card and become fully transparent before it reaches the main content area.",
  "Card top ambient wash should feel like pale morning haze or soft overhead light, not a full-card gradient; keep the strongest color near the top edge or upper corners and keep the center and lower body visually clean.",
  "Card top ambient wash should be horizontally broad and soft, with low saturation, high lightness, low opacity, no hard edge, and only one gentle hue or two adjacent hues when needed.",
  "Card top ambient wash may use non-token color values, opacity, blur, and gradient stops only as non-structural decoration; the card shell, text, border, focus state, actions, badges, metric cells, radius, spacing, and elevation must remain token-bound.",
  "Card ambient tint must sit behind card content, use pointer-events-none, and never reduce text contrast, hide dividers, wash over metrics, compete with primary actions, or become a decorative blob, bokeh field, rainbow gradient, or strong brand-color strip.",
  "Use card ambient tint sparingly where it communicates status, category, priority, product domain, or an important preview state; do not apply it to every basic card just to decorate the page.",
  "Number-heavy cards should group related values into small token-backed sub-sections or mini cells with labels, units, trends/status when available, and consistent alignment.",
  "Tables are card-like previews without card background rendering: each row should expose enough identity, status, key facts, latest signal, and action context for progressive exploration.",
  "Tables should avoid dumping every field into columns; keep rows scannable and move deeper information into row expansion, sheets, detail pages, popovers, or tooltips when appropriate.",
  "Table hierarchy should come from typography, alignment, spacing, dividers, badges, and row states rather than decorative backgrounds.",
  "Semantic token pairs are mandatory for filled surfaces: use bg-primary text-primary-foreground, bg-secondary text-secondary-foreground, bg-card text-card-foreground, bg-popover text-popover-foreground, bg-accent text-accent-foreground, bg-destructive text-destructive-foreground, bg-sidebar text-sidebar-foreground, bg-sidebar-primary text-sidebar-primary-foreground, and bg-sidebar-accent text-sidebar-accent-foreground.",
  "Never use same-role filled background/text pairs such as bg-primary text-primary, bg-secondary text-secondary, bg-accent text-accent, bg-destructive text-destructive, bg-card text-card, or bg-popover text-popover.",
  "When changing theme direction, update the seed in theme-lab.json, then regenerate compiled CSS variables through Theme Lab or the available theme generation pipeline.",
] as const

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
  const normalizedUserDesignRules = normalizeUserDesignRules(userDesignRules)

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
        summary: theme.vibe.visualContract.summary,
        keywords: theme.vibe.keywords,
        avoid: theme.vibe.visualContract.avoid,
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
