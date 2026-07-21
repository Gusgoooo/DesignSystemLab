import {
  registryCapabilityItems,
  registryInstallDiffGate,
  registryPageProfiles,
  registryResolverWeights,
  type RegistryCapabilityItem,
  type RegistryPageType,
  type RegistryPrimitiveEngine,
  type RegistryPrimitivePolicy,
  type RegistryProjectMode,
  type ResolvedRegistryPageType,
} from "./registry-capabilities"

export type RegistryResolverInput = {
  projectMode: RegistryProjectMode
  pageType: RegistryPageType
  targetScope?: string
  primitivePolicy: RegistryPrimitivePolicy
  detectedPrimitiveEngine?: RegistryPrimitiveEngine
  installedItems?: readonly string[]
  requiredSlots?: readonly string[]
  requiredStates?: readonly string[]
  limit?: number
}

export type RegistryCandidateScore = {
  capabilityId: string
  title: string
  kind: RegistryCapabilityItem["kind"]
  compositionMode: RegistryCapabilityItem["compositionMode"]
  sourceTier: RegistryCapabilityItem["sourceTier"]
  score: number
  breakdown: {
    pageTypeFit: number
    primitiveCompatibility: number
    slotCoverage: number
    stateCoverage: number
    sourceRisk: number
  }
  criticalSlotCoverage: number
  matchedSlots: readonly string[]
  missingSlots: readonly string[]
  matchedStates: readonly string[]
  missingStates: readonly string[]
  installItems: readonly string[]
  installPreviewCommands: readonly string[]
  tokenRoles: readonly string[]
  sourceUrl: string
  reason: string
}

export type RegistryResolverResult = {
  version: "registry-resolver-v1"
  status: "resolved" | "deferred" | "blocked"
  projectMode: RegistryProjectMode
  requestedPageType: RegistryPageType
  resolvedPageType: ResolvedRegistryPageType | null
  primitive: {
    policy: RegistryPrimitivePolicy
    detected: RegistryPrimitiveEngine
    resolved: RegistryPrimitiveEngine
    reason: string
  }
  scoring: {
    total: 100
    weights: typeof registryResolverWeights
    minimumRecommendationScore: 70
  }
  recommended: RegistryCandidateScore | null
  alternatives: readonly RegistryCandidateScore[]
  blockedGaps: readonly string[]
  decision: string
  diffGate: typeof registryInstallDiffGate
}

const scopeMatchers: readonly {
  pageType: ResolvedRegistryPageType
  patterns: readonly RegExp[]
}[] = [
  {
    pageType: "dashboard",
    patterns: [/dashboard/, /analytics/, /overview/, /admin/, /cockpit/],
  },
  {
    pageType: "settings",
    patterns: [
      /settings?/, /preferences?/, /billing/, /security/, /account/, /profile/,
    ],
  },
  {
    pageType: "auth",
    patterns: [/auth/, /login/, /sign-in/, /signin/, /signup/, /sign-up/, /invite/],
  },
  {
    pageType: "form-flow",
    patterns: [/wizard/, /onboarding/, /checkout/, /create/, /edit/, /new/, /form/],
  },
  {
    pageType: "ai-command",
    patterns: [/chat/, /assistant/, /copilot/, /ai-command/, /command/],
  },
  {
    pageType: "docs-spec",
    patterns: [/docs?/, /spec/, /reference/, /guide/],
  },
  {
    pageType: "marketing",
    patterns: [/marketing/, /landing/, /pricing/, /campaign/],
  },
  {
    pageType: "resource-index",
    patterns: [
      /resources?/, /index/, /table/, /list/, /users?/, /orders?/, /products?/,
    ],
  },
  {
    pageType: "detail",
    patterns: [/detail/, /\[[^\]]+\]/, /\:[a-z]/],
  },
]

function roundScore(value: number): number {
  return Math.round(value * 10) / 10
}

function coverage(
  available: readonly string[],
  required: readonly string[]
): number {
  if (required.length === 0) {
    return 1
  }

  const availableSet = new Set(available)
  return required.filter((item) => availableSet.has(item)).length / required.length
}

function intersection(
  available: readonly string[],
  required: readonly string[]
): string[] {
  const availableSet = new Set(available)
  return required.filter((item) => availableSet.has(item))
}

function difference(
  available: readonly string[],
  required: readonly string[]
): string[] {
  const availableSet = new Set(available)
  return required.filter((item) => !availableSet.has(item))
}

export function inferRegistryPageType(
  targetScope?: string
): ResolvedRegistryPageType | null {
  const normalizedScope = targetScope?.trim().toLowerCase()

  if (!normalizedScope) {
    return null
  }

  for (const matcher of scopeMatchers) {
    if (matcher.patterns.some((pattern) => pattern.test(normalizedScope))) {
      return matcher.pageType
    }
  }

  return null
}

function resolvePrimitive(
  input: RegistryResolverInput
): RegistryResolverResult["primitive"] {
  const detected = input.detectedPrimitiveEngine ?? "unknown"

  if (input.primitivePolicy !== "auto") {
    return {
      policy: input.primitivePolicy,
      detected,
      resolved: input.primitivePolicy,
      reason: `The user selected ${input.primitivePolicy} explicitly.`,
    }
  }

  if (detected !== "unknown") {
    return {
      policy: "auto",
      detected,
      resolved: detected,
      reason: `Preserve the detected ${detected} primitive engine.`,
    }
  }

  if (input.projectMode === "greenfield") {
    return {
      policy: "auto",
      detected,
      resolved: "radix",
      reason: "No primitive engine was detected in a greenfield project, so Radix is the default baseline.",
    }
  }

  return {
    policy: "auto",
    detected,
    resolved: "unknown",
    reason: "Inspect the existing project and preserve its Radix or Base UI engine before installation.",
  }
}

function primitiveCompatibilityScore(
  item: RegistryCapabilityItem,
  primitiveEngine: RegistryPrimitiveEngine
): number {
  if (primitiveEngine === "unknown") {
    return item.primitiveEngines.length > 1
      ? registryResolverWeights.primitiveCompatibility
      : registryResolverWeights.primitiveCompatibility * 0.4
  }

  return item.primitiveEngines.includes(primitiveEngine)
    ? registryResolverWeights.primitiveCompatibility
    : 0
}

function sourceRiskScore(item: RegistryCapabilityItem): number {
  if (item.risk === "high") {
    return 0
  }

  if (item.risk === "review") {
    return registryResolverWeights.sourceRisk * 0.5
  }

  if (item.sourceTier === "official") {
    return registryResolverWeights.sourceRisk
  }

  return registryResolverWeights.sourceRisk * 0.7
}

function installPreviewCommands(item: RegistryCapabilityItem): string[] {
  const items = item.installItems.join(" ")

  return [
    `npx shadcn@latest view ${items}`,
    `npx shadcn@latest add ${items} --dry-run`,
    `npx shadcn@latest add ${items} --diff`,
  ]
}

function scoreCapability(
  item: RegistryCapabilityItem,
  pageType: ResolvedRegistryPageType,
  primitiveEngine: RegistryPrimitiveEngine,
  requiredSlots: readonly string[],
  criticalSlots: readonly string[],
  requiredStates: readonly string[]
): RegistryCandidateScore | null {
  if (!item.pageTypes.includes(pageType)) {
    return null
  }

  const compatibility = primitiveCompatibilityScore(item, primitiveEngine)

  if (compatibility === 0) {
    return null
  }

  const matchedSlots = intersection(item.slots, requiredSlots)
  const missingSlots = difference(item.slots, requiredSlots)
  const matchedStates = intersection(item.states, requiredStates)
  const missingStates = difference(item.states, requiredStates)
  const criticalSlotCoverage = coverage(item.slots, criticalSlots)
  const breakdown = {
    pageTypeFit: registryResolverWeights.pageTypeFit,
    primitiveCompatibility: compatibility,
    slotCoverage: roundScore(
      coverage(item.slots, requiredSlots) * registryResolverWeights.slotCoverage
    ),
    stateCoverage: roundScore(
      coverage(item.states, requiredStates) * registryResolverWeights.stateCoverage
    ),
    sourceRisk: sourceRiskScore(item),
  }
  const score = roundScore(
    breakdown.pageTypeFit +
      breakdown.primitiveCompatibility +
      breakdown.slotCoverage +
      breakdown.stateCoverage +
      breakdown.sourceRisk
  )
  const modeReason =
    item.compositionMode === "adapt-block"
      ? "Adapt the block structure and replace its demonstration model."
      : "Compose the page from these official primitives without inventing a parallel component system."

  return {
    capabilityId: item.id,
    title: item.title,
    kind: item.kind,
    compositionMode: item.compositionMode,
    sourceTier: item.sourceTier,
    score,
    breakdown,
    criticalSlotCoverage: roundScore(criticalSlotCoverage),
    matchedSlots,
    missingSlots,
    matchedStates,
    missingStates,
    installItems: item.installItems,
    installPreviewCommands: installPreviewCommands(item),
    tokenRoles: item.tokenRoles,
    sourceUrl: item.sourceUrl,
    reason: `${modeReason} ${matchedSlots.length}/${requiredSlots.length} required slots and ${matchedStates.length}/${requiredStates.length} required states are covered by the indexed baseline.`,
  }
}

function compareCandidates(
  left: RegistryCandidateScore,
  right: RegistryCandidateScore,
  installedItems: ReadonlySet<string>
): number {
  if (right.score !== left.score) {
    return right.score - left.score
  }

  if (right.criticalSlotCoverage !== left.criticalSlotCoverage) {
    return right.criticalSlotCoverage - left.criticalSlotCoverage
  }

  const leftInstalled = left.installItems.some((item) => installedItems.has(item))
  const rightInstalled = right.installItems.some((item) => installedItems.has(item))

  if (leftInstalled !== rightInstalled) {
    return rightInstalled ? 1 : -1
  }

  if (left.sourceTier !== right.sourceTier) {
    return left.sourceTier === "official" ? -1 : 1
  }

  return left.capabilityId.localeCompare(right.capabilityId)
}

export function resolveRegistryBaseline(
  input: RegistryResolverInput
): RegistryResolverResult {
  const primitive = resolvePrimitive(input)
  const resolvedPageType =
    input.pageType === "auto"
      ? inferRegistryPageType(input.targetScope)
      : input.pageType

  if (!resolvedPageType) {
    return {
      version: "registry-resolver-v1",
      status: "deferred",
      projectMode: input.projectMode,
      requestedPageType: input.pageType,
      resolvedPageType: null,
      primitive,
      scoring: {
        total: 100,
        weights: registryResolverWeights,
        minimumRecommendationScore: 70,
      },
      recommended: null,
      alternatives: [],
      blockedGaps: [
        "A page archetype could not be inferred. Classify each route before selecting a registry baseline.",
      ],
      decision:
        "Defer block selection until a route or explicit page archetype is available. Do not install a generic dashboard baseline.",
      diffGate: registryInstallDiffGate,
    }
  }

  const profile = registryPageProfiles[resolvedPageType]
  const requiredSlots = input.requiredSlots ?? profile.requiredSlots
  const requiredStates = input.requiredStates ?? profile.requiredStates
  const installedItems = new Set(input.installedItems ?? [])
  const candidates = registryCapabilityItems
    .map((item) =>
      scoreCapability(
        item,
        resolvedPageType,
        primitive.resolved,
        requiredSlots,
        profile.criticalSlots,
        requiredStates
      )
    )
    .filter((candidate): candidate is RegistryCandidateScore => candidate !== null)
    .sort((left, right) => compareCandidates(left, right, installedItems))
  const recommended = candidates[0] ?? null
  const limit = Math.max(1, input.limit ?? 3)
  const alternatives = candidates.slice(1, limit)
  const belowThreshold = !recommended || recommended.score < 70
  const missingCriticalSlots = recommended
    ? difference(
        registryCapabilityItems.find(
          (item) => item.id === recommended.capabilityId
        )?.slots ?? [],
        profile.criticalSlots
      )
    : [...profile.criticalSlots]
  const blocked = belowThreshold || missingCriticalSlots.length > 0

  if (blocked) {
    return {
      version: "registry-resolver-v1",
      status: "blocked",
      projectMode: input.projectMode,
      requestedPageType: input.pageType,
      resolvedPageType,
      primitive,
      scoring: {
        total: 100,
        weights: registryResolverWeights,
        minimumRecommendationScore: 70,
      },
      recommended,
      alternatives,
      blockedGaps: [
        ...(belowThreshold
          ? ["No compatible capability reached the 70-point recommendation threshold."]
          : []),
        ...(missingCriticalSlots.length > 0
          ? [`Critical slots still need an explicit composition plan: ${missingCriticalSlots.join(", ")}.`]
          : []),
      ],
      decision:
        "Do not install yet. Keep the closest candidate only as a reference, fill the critical capability gaps, and rerun the diff gate.",
      diffGate: registryInstallDiffGate,
    }
  }

  return {
    version: "registry-resolver-v1",
    status: "resolved",
    projectMode: input.projectMode,
    requestedPageType: input.pageType,
    resolvedPageType,
    primitive,
    scoring: {
      total: 100,
      weights: registryResolverWeights,
      minimumRecommendationScore: 70,
    },
    recommended,
    alternatives,
    blockedGaps: recommended.missingSlots.map(
      (slot) => `Compose or preserve the missing non-critical slot: ${slot}.`
    ),
    decision:
      "Use the recommended capability as the implementation baseline, preserve product behavior, and install only after view, dry-run, and diff evidence pass review.",
    diffGate: registryInstallDiffGate,
  }
}
