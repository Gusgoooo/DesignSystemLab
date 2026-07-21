# Rule Router

Read `design-rules/index.json` or its raw GitHub URL before UI work. Choose one
task mode before loading detailed rules.

## 1. Token Installation

Use this mode when Design System Lab is first connected to a project.

Load:

- `design-rules/core/token-system.md`
- `design-rules/core/completion-compliance.md`

Rules:

- install and verify the selected shadcn or Ant Design token adapter
- write `theme-lab.json` and one tool-native AI instruction section
- do not change existing pages, component structure, or current style values
- in a new project, finish Token installation before creating the first UI
- after successful installation, ask whether the user wants to map the existing
  interface to the Token system
- do not begin mapping until the user explicitly approves

Token installation does not require page classification, Registry scoring,
component inventory, or UI normalization.

## 2. New UI Creation

Use this mode when the user asks to create a page or substantial component after
the Token system is installed.

Load:

- `design-rules/core/page-type-workflow.md`
- `design-rules/core/project-context.md`
- `design-rules/core/token-binding.md`
- `design-rules/core/registry-block-mapping.md`
- the matched page shell or block rule
- only the component and pattern rules matched by the requested UI
- `design-rules/core/visual-qa.md`
- `design-rules/core/completion-compliance.md`

Required order:

1. classify the page type and user job
2. load the closest matching block rule before individual component rules
3. use the installed Tokens from the first implementation
4. for shadcn, inspect matching official or configured Registry Blocks before
   composing from primitives
5. for Ant Design, use the matched block structure and compose it from official
   Ant components
6. replace all demo content with real product content and behavior
7. verify states, responsiveness, token pairs, and business behavior

Blocks are guidance and implementation baselines, not permission to copy demo
data or force unrelated layouts.

## 3. Existing UI Mapping

Use this mode only after the user explicitly approves mapping existing UI.

Load:

- every rule required by New UI Creation
- `design-rules/core/ui-normalization.md`
- matched rules for every existing block and component being mapped

Mapping is a model-reasoned semantic task. For each element, infer:

- product responsibility
- information hierarchy
- surface layer
- command, selection, navigation, input, feedback, or data role
- default, hover, focus, selected, disabled, loading, success, warning, or
  destructive state
- the correct semantic Token and component variant

Do not replace literal colors or values one-to-one. A legacy blue value may
represent a primary command, selected navigation, information status, a chart
category, or decoration; those roles require different Tokens.

Preserve routes, APIs, data, handlers, forms, validation, permissions,
accessibility, responsive behavior, and domain copy. Mapping does not authorize
a component-system migration or broad layout redesign unless the user asks for
that separately.

## Raw Rule Loading

Use local rule files when they exist. Otherwise:

1. read the raw GitHub `design-rules/index.json`
2. resolve matched `rules[].source` paths against the raw repository base
3. load only the task-mode rules and matched block/component rules
4. never hallucinate a rule that could not be opened

External Impeccable or UIUXPROMAX assets are loaded only when the user explicitly
requests external design intelligence.

## Rule Read Confirmation

Before editing UI, report only the rules actually opened:

```json
{
  "taskMode": "token-installation | new-ui-creation | existing-ui-mapping",
  "ruleIndexRead": "local path or raw URL",
  "rulesLoaded": [
    {
      "elementType": "page-shell",
      "source": "local path or raw URL",
      "firstHeading": "Page Shell And Layout"
    }
  ],
  "missingRules": []
}
```

For Token Installation, this confirmation may contain only token-system and
completion-compliance. For new UI and approved mapping, list the matched block
before component rules.
