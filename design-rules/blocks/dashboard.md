# Dashboard Block

Use this rule when the selected scope is a standard dashboard, analytics overview,
admin home, reporting workspace, operations cockpit, or product console landing
page.

## Standard Dashboard Default

If the page is a standard dashboard, use the official shadcn dashboard block as
the implementation baseline:

```txt
npx shadcn@latest add dashboard-01
```

Treat `dashboard-01` as the shell and composition reference, not as final
product content.

## Before Running The Command

Inspect the project first:

- package manager and lockfile
- `components.json`
- aliases
- existing `components/ui` files
- existing sidebar, header, chart, card, table, and layout components
- whether `components/ui/sidebar` already exists
- whether generated files would overwrite meaningful local files

If the command would overwrite important local components, stop and adapt the
block manually from the generated pattern instead of destroying local work.

## Content Mapping

Replace the block's demo content one by one with the user's existing dashboard
content.

Map existing content into the dashboard structure:

- existing navigation -> `AppSidebar`
- existing top bar, breadcrumbs, workspace switcher, search, or user menu -> `SiteHeader`
- existing KPI cards or summary modules -> `SectionCards`
- existing charts -> chart section
- existing tables, queues, lists, or recent activity -> table/list sections
- existing filters, date ranges, view switches, or export controls -> toolbar or section header
- existing empty, loading, error, and permission states -> matched state components

Do not copy demo users, fake teams, placeholder routes, sample chart data,
sample table rows, or generic marketing copy from the shadcn block.

## Preserve Product Behavior

The dashboard shell may change, but product behavior must not.

Preserve:

- route URLs
- active route logic
- API calls and loaders
- mutations
- filters and query params
- date range behavior
- chart data transforms
- table sorting, filtering, pagination, selection, and row actions
- permissions and hidden states
- feature flags
- refresh behavior
- loading, empty, error, and success flows
- domain copy

## Layout Rules

Use the `dashboard-01` rhythm:

- persistent app shell with sidebar when the product already has navigation
- clear site header above page content
- content area using consistent horizontal padding
- vertical rhythm between dashboard sections
- top summary cards before deeper analytical content
- chart or main insight section before dense data tables when the workflow allows it
- dense tables/lists lower on the page unless they are the primary workflow

Use container-aware spacing where possible. Avoid mixing unrelated widths,
random section gaps, and nested page cards.

## Dashboard UI/UX Rules

The dashboard should answer, in order:

1. What is happening?
2. What changed?
3. What needs attention?
4. What can the user do next?

Design for scanning before exploration:

- put the most important metric, status, or operational signal first
- keep section titles specific to the user's data
- use short subtitles only when they clarify time range, scope, or calculation
- group related cards together
- avoid equal visual weight for every module
- make the primary action visible without making every action loud
- keep secondary actions in quiet buttons, menus, or section toolbars
- expose filters near the data they affect
- avoid making the dashboard feel like a wall of unrelated cards

Each dashboard section should have a job:

- overview: summarize status and trend
- chart: explain movement or comparison
- table/list: support follow-up and investigation
- activity: show recency and accountability
- alert/risk block: tell the user what needs action

## Token Binding

Every structural part of the dashboard must use Theme Lab tokens:

- page shell: `bg-background text-foreground`
- sidebar: `bg-sidebar text-sidebar-foreground`
- cards: `bg-card text-card-foreground`
- popovers/menus: `bg-popover text-popover-foreground`
- primary actions: `bg-primary text-primary-foreground`
- secondary/accent states: `bg-secondary text-secondary-foreground` or `bg-accent text-accent-foreground`
- borders: `border-border`
- focus: `ring-ring`
- muted captions: `text-muted-foreground`
- radius: token-backed radius values
- elevation: token-backed shadow/elevation values

Do not keep the old dashboard radius, shadows, palette classes, or custom
surface colors after replacing the shell.

## Hard Failure Cases

The dashboard replacement is incomplete if:

- the command was run but demo content remains
- the old dashboard content was not mapped into the new shell
- sidebar/header/table/chart behavior was disconnected
- the page only received token class replacements
- raw palette colors remain in structural UI
- filled buttons use `bg-primary text-primary` or another same-role pair
- cards and tables keep old radius/shadow values while only colors changed
- loading, empty, error, or permission states were dropped
- mobile sidebar, collapsed sidebar, and responsive content padding were not checked

## Final Report

Report:

- whether `dashboard-01` was installed or manually adapted
- original dashboard modules found
- how each original module was mapped into the new shell
- business behavior preserved
- token pairs checked
- responsive states checked
- any dashboard modules still needing migration
