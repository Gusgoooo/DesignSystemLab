# Page Type Workflow

Use this file before changing visible UI. It turns "make it look better" into a
stable sequence that preserves product behavior while improving visual quality.

## Required Sequence

### 1. Classify Page Type

Name the primary page type before touching component styles.

Common page types:

- `dashboard`: KPI overview, analytics, reporting, admin home, product console.
- `theme-lab`: token controls, generated previews, export tools, spec browser.
- `marketing`: product entry, landing page, launch page, brand narrative.
- `settings`: account, workspace, preferences, integrations, billing, security.
- `resource-index`: table/list view for objects, search, filtering, bulk action.
- `detail`: one object, its metadata, activity, related records, next action.
- `form-flow`: create/edit, onboarding, auth, invite, multi-step data mutation.
- `ai-command`: chat, command palette, generation console, prompt/workflow UI.
- `docs-spec`: documentation, rule browser, implementation guidance.

Output a compact page type record in the plan:

```json
{
  "primaryType": "dashboard | theme-lab | marketing | settings | ...",
  "secondaryTypes": ["table", "filters", "charts"],
  "routeOrComponent": "app/dashboard/page.tsx",
  "userGoal": "what the user is trying to accomplish",
  "density": "compact | standard | spacious",
  "shell": "public | app | tool | docs",
  "contentWidth": "narrow | standard | wide | full",
  "matchedRules": ["design-rules/blocks/page-shell.md"]
}
```

### 2. Normalize Structural Page Shell

Normalize the page container before polishing components:

- shell type: public, app, tool, docs, modal, or embedded preview
- page background and any approved ambient layer
- maximum width and responsive constraints
- grid and section rhythm
- page heading placement
- toolbar placement
- sidebar/nav relationship
- empty, loading, error, and permission states

Do not start by changing card shadows, button colors, gradients, or radius.

### 3. Audit Token Usage

Replace structural raw values with semantic tokens:

- surfaces: `bg-background`, `bg-card`, `bg-popover`, `bg-muted`
- text: `text-foreground`, `text-muted-foreground`, matching foreground tokens
- actions: `bg-primary text-primary-foreground`
- borders and focus: `border-border`, `ring-ring`
- status: success, warning, info, danger token families
- category/chart: stable `chart-1..5` mappings

Raw palette, hex, arbitrary OKLCH, one-off shadows, and one-off radius values
are allowed only for approved non-structural ambient decoration.

### 4. Tune Typography And Density

Adjust information hierarchy before ornament:

- one clear page title
- section headings that reveal structure
- compact labels and metadata
- body copy line length appropriate to page type
- table/list row height aligned with density
- controls in the same row sharing token-backed height
- meaningful hierarchy through spacing, type weight, and alignment before color

Product surfaces usually use a fixed rem scale and tighter type ratio. Marketing
surfaces may use stronger scale contrast when the brand register calls for it.

### 5. Apply Shape, Elevation, Motion, And Decoration Last

Only after structure, tokens, and density are correct:

- radius follows the token scale
- elevation follows the token scale
- motion supports state changes and feedback
- decoration is sparse, intentional, and subordinate to user goals

If the UI still feels wrong after this stage, return to page type, hierarchy, or
spacing. Do not keep adding ornament.

## Route Defaults For This Product

- `app/page.tsx`: classify as `marketing` unless it is converted into a product
  tool entry.
- `app/theme-lab/page.tsx`: classify as `theme-lab` with tool and docs-spec
  subtypes.
- `app/dashboard/page.tsx`: classify as `dashboard`.
- `components/theme-lab/previews/spec-preview.tsx`: classify as `docs-spec`
  plus resource-index behavior.

## Completion Evidence

Final reports for UI work should include:

- page type record
- shell, background, width, grid, and spacing decisions
- token audit result
- typography and density changes
- shape/elevation/motion/decorative changes, if any
