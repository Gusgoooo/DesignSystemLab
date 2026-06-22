# Sidebars

Use this rule whenever the selected page, component scope, or product-wide scope
contains a sidebar, app navigation rail, or sidebar-like navigation shell.

## Intent

The sidebar is part of the product shell, not a decorative side panel. It should
preserve navigation, route logic, account/workspace context, permissions, and
responsive behavior while aligning with the Design System Lab token system.

## Approved Reference

The user explicitly approves this official shadcn/ui sidebar block reference:

https://ui.shadcn.com/blocks/sidebar

Use it for structure selection, not demo content.

## Scope Rule

If the selected page contains a sidebar, include the complete sidebar in the UI
normalization scope.

Do not polish only the main content while leaving an old bespoke sidebar beside
it.

For one-page optimization, replace or normalize the full sidebar used by that
page as part of the same task.

## Confirmation Rule

Do not ask an open-ended heuristic question such as "Should I also update the
sidebar?" when a sidebar is detected.

Default behavior:

- include the sidebar in the normalization plan automatically
- state that the sidebar is included because the selected scope contains it
- include a direct confirmation line in the execution plan
- ask for confirmation of the full plan only through that direct confirmation
  line when the environment or user workflow requires approval before editing

The execution plan must include this shape:

```md
Direct Confirmation:
The selected scope contains a sidebar, so sidebar normalization/replacement is
included by default. Please confirm the full plan if you want me to proceed.
```

Use direct confirmation language, not exploratory language:

```txt
I found a sidebar in the selected scope, so the plan includes sidebar
normalization/replacement according to the sidebar rule. Please confirm this
plan if you want me to proceed.
```

If the user already asked the agent to implement the change and the environment
does not require an approval step, proceed with the sidebar included. Do not
pause only to ask whether the sidebar should be part of the scope.

## Inspect First

Before replacement, inspect:

- navigation data
- route URLs
- active route logic
- collapse behavior
- permissions
- workspace or account switchers
- search
- badges and counts
- nested groups
- user menu
- keyboard behavior
- responsive behavior

## Replacement Rule

Choose the closest matching shadcn sidebar block based on the existing
navigation structure and density.

If no block clearly matches, install the fallback:

```bash
npx shadcn@latest add sidebar-08
```

Then adapt it to existing routes, labels, groups, data, permissions, and active
states.

Before running any shadcn command, inspect:

- `components.json`
- existing `components/ui`
- package manager
- aliases
- whether `components/ui/sidebar` already exists

Do not overwrite unrelated files.

## Preserve

- route URLs
- active route logic
- permissions
- badges and counts
- account or workspace context
- user menu actions
- collapse behavior
- mobile behavior

## Use Shadcn Sidebar Primitives

Use these when they fit the project setup:

- `SidebarProvider`
- `Sidebar`
- `SidebarInset`
- `SidebarHeader`
- `SidebarContent`
- `SidebarGroup`
- `SidebarMenu`
- `SidebarMenuItem`
- `SidebarMenuButton`
- `SidebarFooter`
- `SidebarRail`
- `SidebarTrigger`

## Token Binding

Use:

- `bg-sidebar text-sidebar-foreground`
- `bg-sidebar-primary text-sidebar-primary-foreground`
- `bg-sidebar-accent text-sidebar-accent-foreground`
- `border-sidebar-border` or `border-border`
- `ring-sidebar-ring` or `ring-ring`
- token-backed radius, spacing, and elevation

## States

Check:

- active
- hover
- focus-visible
- selected
- collapsed
- expanded
- mobile sheet or drawer
- disabled
- loading
- permission-hidden

## Do Not

- copy shadcn demo teams
- copy fake projects
- copy fake users
- copy placeholder routes
- leave navigation disconnected
- leave old sidebar styling beside a normalized main content area

## Final Report

State:

- sidebar regions found
- shadcn block or manual pattern used
- route, active, permission, workspace/account, user menu, and responsive
  behavior preserved
- token pairs and sidebar states checked
