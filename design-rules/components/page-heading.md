# Page Headings

Use this rule for page headings, page headers, title/action bars, resource
headers, detail headers, list headers, and page-level metadata/action regions.

## Intent

The page heading explains where the user is, what object or workflow is in
scope, and which action matters most. It should provide orientation before
decoration.

The user-provided pattern is not optional inspiration. Reuse its composition as
closely as the product allows.

## Anatomy

Use this structure:

- outer responsive header row: `lg:flex lg:items-center lg:justify-between`
- left title area: `min-w-0 flex-1`
- title as strongest element
- metadata facts directly below title
- right action group aligned to heading
- primary action visible
- secondary actions quieter
- mobile secondary actions collapsed into `More`

## Metadata Row

Metadata should be compact icon + short text facts.

Use actual product fields:

- status
- type
- owner
- team
- location
- date
- amount
- role
- workspace
- lifecycle stage
- last updated
- due date

Do not invent demo content such as job titles, fake locations, fake salaries, or
fake dates.

## Dependencies

Do not add `@heroicons/react` unless the project already uses it.

Do not add `@headlessui/react` unless the project already uses it.

Map icons to the project's existing icon library. If the project uses
`lucide-react`, use suitable lucide icons.

Use project or shadcn components for actions and menus:

- `Button`
- `DropdownMenu`
- `DropdownMenuTrigger`
- `DropdownMenuContent`
- `DropdownMenuItem`

## Token Binding

Convert raw sample colors to Theme Lab tokens:

- `text-foreground`
- `text-muted-foreground`
- `bg-background`
- `bg-primary text-primary-foreground`
- `border-border`
- `ring-ring`
- existing button variants

Do not use:

- `text-gray-900`
- `text-gray-500`
- `text-gray-400`
- `bg-white`
- `bg-indigo-600`
- `hover:bg-indigo-500`
- raw inset-ring colors

## Layout

Keep the heading unframed by default.

Do not wrap the whole heading in a decorative card unless the product already
uses framed headers.

Keep metadata short. Move long detail copy into body content, cards, tabs, or
detail panels.

Long titles must use `min-w-0`, `truncate`, wrapping, or responsive stacking.

Actions must not collide with the title.

## Action Behavior

The primary action remains visible. Secondary actions can become quiet buttons,
icon buttons with accessible labels, or dropdown items. On small screens,
collapse secondary actions into a More menu when horizontal space is limited.

Do not demote the true primary command into a menu unless the existing product
workflow already does so.

## Reusable Skeleton

```tsx
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
    {/* secondary actions collapse into More on small screens */}
  </div>
</div>
```

## Do Not

- copy demo metadata
- add a new icon package for the heading alone
- frame every heading in a card by default
- let long titles collide with actions
- hide the primary action in a secondary menu
- use raw palette colors from copied examples

## Final Report

State:

- whether this pattern was reused
- which metadata facts were preserved
- which actions were preserved
- which secondary actions collapsed on mobile
- which heading, button, and menu token pairs were verified
