# Token System Installation

Use this rule when Design System Lab is connected to a project.

## Goal

Install one complete, seed-driven Token contract before new UI is created.
Installation is not a UI refactor task.

```txt
ThemeSeed
-> Algorithmic Map Tokens
-> Semantic Tokens
-> Selected Adapter
   -> shadcn Tokens and extensions
   -> Ant Design Seed/Alias Tokens and ThemeConfig
```

`ThemeSeed` is the only editable visual source. Regenerate every downstream
layer after a seed change. Do not maintain a second hand-authored palette,
typography scale, radius system, or shadow system.

Keep the primary installation prompt Token-first and compact. Its
`theme-lab.json` payload contains only the Seed, compiler version, selected
component system, and compiled Token values. Do not serialize health reports,
health contracts, Registry contracts, long AI rules, or duplicated adapter
artifacts into the prompt. Validate health before export and route static
installation/adapter guidance through versioned raw Git sources.

The portable Map and Semantic CSS export remains available as a low-level
artifact, but the primary project connection flow asks only whether the
component system is shadcn or Ant Design.

## Installation Boundary

During installation:

- locate the project's current runtime theme or global style entry
- keep the current framework, directory structure, build setup, and unrelated
  styling tools
- install the selected adapter
- write `theme-lab.json`
- update one existing tool-native AI instruction file
- verify Token health and project compilation

Do not during installation:

- redesign or normalize pages
- replace components
- map existing literal values to Tokens
- run a product-wide migration
- install Registry Blocks
- copy the local `design-rules/` directory

For a new project, finish installation before creating the first page or
component. For an existing project, install the contract while leaving current
UI output unchanged.

## shadcn Adapter

Install the generated runtime CSS in the project's existing global style entry.
Keep the official shadcn vocabulary as the compatibility layer:

- background and foreground
- card and popover pairs
- primary, secondary, muted, accent, and destructive
- border, input, and ring
- chart-1 through chart-5
- the complete sidebar family
- radius

Keep Design System Lab extensions explicit:

- deterministic destructive foreground
- richer surface, content, border, action, and status roles
- generated typography
- density
- elevation
- motion

Do not add components or change the existing primitive engine during Token
installation. Registry and Blocks are used later when the user asks to create
UI or explicitly approves existing-UI mapping.

## Ant Design Adapter

Install the generated ThemeConfig through the project's Ant theme module and
`ConfigProvider`. Keep `App` context connected for feedback APIs.

```txt
ThemeSeed
-> Map Tokens
-> Semantic Tokens
-> Ant Seed/Alias Tokens
-> ConfigProvider ThemeConfig
-> Ant CSS Variables
```

Requirements:

- preserve the installed Ant Design version and existing provider composition
- keep light/dark algorithms and generated integer sizes
- keep structural colors opaque
- merge justified `theme.components` overrides after the generated global layer
- add the Tailwind v4 bridge only when Tailwind v4 already exists
- do not add shadcn, Radix, Registry files, or Tailwind solely for theme
  installation

Selecting Ant Design is approval to use the Ant adapter. It is not approval to
replace existing product UI during installation.

## Persistent Touchpoints

Install only three conceptual touchpoints by default:

1. runtime theme entry
   - shadcn: marker-delimited CSS in the existing global stylesheet
   - Ant Design: existing theme module or `theme-lab.antd.ts`
2. `theme-lab.json`
3. one detected tool-native AI instruction file

Use the existing native instruction file when present:

- Claude Code: `CLAUDE.md`
- Codex and generic agents: `AGENTS.md`
- Cursor: `.cursor/rules/theme-lab.mdc`, or `AGENTS.md` as fallback
- GitHub Copilot: `.github/copilot-instructions.md`
- Gemini CLI: `GEMINI.md`
- Windsurf/Cascade: `.windsurfrules`
- Qoder: `AGENTS.md`

Do not create every supported instruction file. Do not install local rule files
unless the user explicitly requests an offline or customized rule library.
Future component guidance reads the raw GitHub rule index.

## Post-Install Handoff

After all files are written and verification succeeds, ask:

> Token system is installed. Do you want me to semantically map all existing
> interface content to these tokens now?

Do not start mapping before an explicit yes.

If approved, start a separate Existing UI Mapping task. Load the raw rule index,
Token Binding, UI Normalization, the matched Block, and matched component rules.
Use model reasoning to infer each element's responsibility, hierarchy, surface,
interaction, and state before choosing a Token or component variant. Do not
perform literal value replacement alone.

## Health Gate

Installation is complete only when:

- every required Token exists
- all Token references resolve
- light and dark foreground pairs meet the configured contrast gate
- generated color scales and typography scales remain ordered
- generated sizes resolve to integers
- shadcn mappings remain canonical, or Ant ThemeConfig coverage is complete
- the runtime theme entry is connected
- available typecheck and build checks pass
- existing pages and components were not changed by the installation task

If verification fails, repair the Token installation only. Do not compensate by
editing product UI.
