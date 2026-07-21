# Completion Compliance Gate

Choose the active task mode before declaring completion.

## Token Installation

Required evidence:

- selected component system
- runtime theme entry changed
- `theme-lab.json` written
- one tool-native AI instruction file updated
- Token health result
- available typecheck/build result
- confirmation that existing pages and components were not changed

After successful verification, ask whether the user wants to map the existing
interface to the Token system. Do not begin mapping in the installation task.

Installation fails when:

- the runtime adapter is incomplete
- required Tokens or references are missing
- light/dark contrast or generated scale checks fail
- a parallel Token system is introduced
- existing product UI is restyled or replaced
- every supported AI instruction file is created
- local `design-rules/` files are copied without an explicit request

## New UI Creation

Required evidence:

- page type and user job
- raw or local rule index used
- matched Block loaded before component rules
- component system used
- Block slots mapped to semantic Tokens
- real product content and behavior connected
- responsive and interaction states checked
- Token audit and available typecheck/build result

Creation fails when:

- page-level UI was composed from isolated primitives without considering a
  matching Block
- demo content remains
- raw structural colors, typography, radius, or shadows bypass Tokens
- filled surfaces lack matching foreground roles
- business behavior or responsive states are missing

## Existing UI Mapping

Required evidence:

- explicit user approval
- mapped scope
- matched Block and component rules loaded
- semantic reasoning record for commands, selection, navigation, input,
  feedback, surfaces, and data roles
- preserved routes, APIs, data, handlers, validation, permissions,
  accessibility, and responsive behavior
- Token audit and available typecheck/build result

Mapping fails when:

- it started without explicit approval
- literal values were replaced one-to-one without inferring semantic roles
- command, selection, status, and category meanings were conflated
- component structure or workflow changed without a separate request
- unresolved raw structural values are ignored

## Final Report

Keep the report proportional to the active mode. Do not include Registry scores,
coverage calculations, page inventories, or migration plans in a Token
Installation report. Do not claim a rule was read unless its local file or raw
URL was actually opened.
