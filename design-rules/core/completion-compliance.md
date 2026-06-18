# Completion Compliance Gate

Use this rule before final response for every UI normalization or Theme Lab
token task.

## Required Evidence

Final work must report evidence, not only a summary.

Include:

- page structure detected
- rule index source used, local or raw URL
- required rule files opened
- matched rule files opened
- missing or inaccessible rule files
- token system source used
- token bridge or persistent contract files changed
- component/block rules applied
- business workflows preserved
- APIs/data/handlers/validation/permissions/state preserved
- responsive states checked
- token audit results
- unresolved risks

## Rule Loading Compliance

The task is non-compliant if:

- the agent changed cards without opening the card rule
- the agent changed tables without opening the table rule
- the agent changed a sidebar without opening the sidebar rule
- the agent changed a dashboard without opening the dashboard rule
- the agent changed page structure without opening the page-shell rule
- the agent changed token-bearing UI without opening token-system and
  token-binding rules
- the agent claims a rule was applied without listing the exact file or raw URL
  opened

## Token Compliance

Check changed product UI for:

- raw Tailwind palette classes in structural UI
- hardcoded hex/color functions in structural UI
- old radius utilities or arbitrary radius values
- one-off shadows or old elevation values
- same-role filled pairs such as `bg-primary text-primary`
- missing `*-foreground` token on filled surfaces
- missing focus-visible state
- incomplete one-shot token bridge
- missing persistent contract files in long-term mode

## UI Compliance

Check that:

- the page still looks like the same product
- content and workflow order are preserved
- primary action is still visible
- secondary actions are quieter
- filters/controls are near the data they affect
- horizontal control rows use consistent heights
- cards/tables/states follow their matched rule files
- responsive layouts do not overflow
- empty/loading/error/disabled/selected states are readable

## Final Response Gate

Do not mark the task complete if:

- required rule files could not be read and the work depended on them
- token bridge is incomplete for the changed UI
- APIs, handlers, validation, or permissions were disconnected
- changed UI uses unsafe token pairs
- the final response does not list rule files or raw URLs actually opened
- no typecheck/build/lint/manual check was run and no reason was given

If blocked, report the blocker and the smallest safe next step.
