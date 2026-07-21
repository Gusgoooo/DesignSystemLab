import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import ts from "typescript"
import { deriveTheme } from "../lib/theme/derive-theme"
import {
  exportCoreThemeCssFromOutput,
  exportThemeCssFromOutput,
} from "../lib/theme/export-css"
import {
  exportAntdTailwindCssFromOutput,
  exportAntdThemeTsFromOutput,
} from "../lib/theme/export-antd"
import { compileProjectImportPrompt } from "../lib/theme/export-prompt"
import {
  createCoreThemeHealthReport,
  createThemeHealthReport,
} from "../lib/theme/health"
import { createAntdThemeHealthReport } from "../lib/theme/antd-health"
import { defaultThemeSeed } from "../lib/theme/defaults"
import { themePresets } from "../lib/theme/presets"
import { deriveSemanticTokens } from "../lib/theme/semantic"
import {
  hexAlphaToCssColor,
  hexAlphaToOklch,
  parseOklchColor,
} from "../lib/theme/algorithms/utils"
import {
  densityPercentFromSeed,
  densitySeedFromPercent,
} from "../lib/theme/algorithms/density"
import {
  registryPageTypes,
  registryResolverContract,
  type ResolvedRegistryPageType,
} from "../lib/theme/registry-capabilities"
import { resolveRegistryBaseline } from "../lib/theme/registry-resolver"
import {
  requiredMapTokenNames,
  requiredAntdAliasTokenNames,
  requiredAntdSeedTokenNames,
  requiredSemanticTokenNames,
  requiredShadcnExtensionTokenNames,
  requiredShadcnOfficialTokenNames,
  requiredShadcnTokenNames,
  type ThemeSeed,
} from "../lib/theme/schema"

const root = process.cwd()
const failures: string[] = []
let assertions = 0
const presetPrimaryValues = new Set<string>()
const presetMutedValues = new Set<string>()
const fontScaleTokenNames = [
  "--font-size-xs",
  "--font-size-sm",
  "--font-size-base",
  "--font-size-lg",
  "--font-size-xl",
  "--font-size-2xl",
  "--font-size-3xl",
  "--font-size-4xl",
  "--font-size-5xl",
  "--font-size-6xl",
] as const

function check(condition: boolean, message: string): void {
  assertions += 1
  if (!condition) {
    failures.push(message)
  }
}

function hasCssDeclaration(css: string, tokenName: string): boolean {
  return css.includes(`  ${tokenName}:`)
}

for (const preset of themePresets) {
  const theme = deriveTheme(preset.seed)
  const health = createThemeHealthReport(theme)
  const coreHealth = createCoreThemeHealthReport(theme)
  const antdHealth = createAntdThemeHealthReport(theme)
  const css = exportThemeCssFromOutput(theme)
  const coreCss = exportCoreThemeCssFromOutput(theme)
  const antdThemeTs = exportAntdThemeTsFromOutput(theme)
  const antdTailwindCss = exportAntdTailwindCssFromOutput(theme)
  const antdThemeSyntax = ts.transpileModule(antdThemeTs, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    reportDiagnostics: true,
  })
  const themeOnlyTaskPacket = compileProjectImportPrompt({
    mode: "persistent-project-contract",
    componentSystem: "shadcn",
    theme,
  })
  presetPrimaryValues.add(theme.semanticTokens["--action-primary"])
  presetMutedValues.add(theme.semanticTokens["--surface-panel"])
  const captionRem = Number.parseFloat(theme.mapTokens["--text-caption"])
  const fontScaleRem = fontScaleTokenNames.map((tokenName) =>
    Number.parseFloat(theme.mapTokens[tokenName])
  )
  const bodyRem = fontScaleRem[2]
  const titleRem = fontScaleRem[5]
  const displayRem = fontScaleRem[7]

  for (const [key, maximumChroma] of [
    ["background", 0.001],
    ["foreground", 0.001],
    ["neutral", 0.001],
  ] as const) {
    const seedColor = preset.seed.color[key]
    const chroma = hexAlphaToOklch(seedColor).chroma

    check(
      chroma <= maximumChroma,
      `${preset.id}: ${key} seed chroma ${chroma.toFixed(4)} exceeds ${maximumChroma}`
    )
    check(
      theme.mapTokens[`--seed-color-${key}`] ===
        hexAlphaToCssColor(seedColor),
      `${preset.id}: ${key} seed color is not preserved as the map source`
    )
  }

  check(
    health.healthy,
    `${preset.id}: ${health.issues
      .map(
        (issue) =>
          `${issue.mode}/${issue.code}/${issue.tokens.join("+")}${
            issue.actual === undefined ? "" : `=${issue.actual}`
          }`
      )
      .join(", ")}`
  )
  check(
    coreHealth.healthy,
    `${preset.id}/core: ${coreHealth.issues
      .map(
        (issue) =>
          `${issue.mode}/${issue.code}/${issue.tokens.join("+")}${
            issue.actual === undefined ? "" : `=${issue.actual}`
          }`
      )
      .join(", ")}`
  )
  check(
    antdHealth.healthy,
    `${preset.id}: ${antdHealth.issues
      .map(
        (issue) =>
          `${issue.mode}/${issue.code}/${issue.tokens.join("+")}${
            issue.actual === undefined ? "" : `=${issue.actual}`
          }`
      )
      .join(", ")}`
  )
  for (const tokenName of [
    ...requiredAntdSeedTokenNames,
    ...requiredAntdAliasTokenNames,
  ]) {
    check(
      theme.antdTheme.light.token[tokenName] !== undefined &&
        theme.antdTheme.dark.token[tokenName] !== undefined,
      `${preset.id}: Ant Design adapter is missing ${tokenName}`
    )
  }

  for (const tokenName of [
    ...requiredMapTokenNames,
    ...requiredSemanticTokenNames,
  ]) {
    check(
      hasCssDeclaration(coreCss, tokenName),
      `${preset.id}: core Token CSS is missing ${tokenName}`
    )
  }
  check(
    !coreCss.includes("official shadcn") &&
      !hasCssDeclaration(coreCss, "--background") &&
      !coreCss.includes("@theme inline") &&
      !coreCss.includes("--ant-"),
    `${preset.id}: core Token CSS contains a component-system adapter`
  )
  check(
    theme.antdTheme.light.algorithm[0] === "defaultAlgorithm" &&
      theme.antdTheme.dark.algorithm[0] === "darkAlgorithm",
    `${preset.id}: Ant Design light/dark algorithms are incorrect`
  )
  check(
    theme.antdTheme.light.token.colorTextLightSolid === "#ffffff" &&
      theme.antdTheme.dark.token.colorTextLightSolid === "#ffffff",
    `${preset.id}: Ant Design filled component foreground is not white`
  )
  check(
    Number.isInteger(theme.antdTheme.light.token.fontSize as number) &&
      Number.isInteger(theme.antdTheme.light.token.controlHeight as number) &&
      Number.isInteger(theme.antdTheme.light.token.borderRadius as number),
    `${preset.id}: Ant Design size adapter contains fractional values`
  )
  check(
    antdThemeTs.includes('import type { ThemeConfig } from "antd"') &&
      antdThemeTs.includes("antdTheme.defaultAlgorithm") &&
      antdThemeTs.includes("antdTheme.darkAlgorithm") &&
      antdThemeTs.includes("getAntdConfigProviderProps") &&
      antdThemeTs.includes("<App>{children}</App>"),
    `${preset.id}: Ant Design TypeScript export is incomplete`
  )
  check(
    (antdThemeSyntax.diagnostics ?? []).length === 0,
    `${preset.id}: Ant Design TypeScript export contains syntax errors`
  )
  check(
    antdTailwindCss.includes("@theme inline") &&
      antdTailwindCss.includes("--color-page: var(--ant-color-bg-layout)") &&
      antdTailwindCss.includes("--radius-card: var(--ant-border-radius-lg)") &&
      antdTailwindCss.includes("--spacing-control: var(--ant-control-height)") &&
      !antdTailwindCss.toLowerCase().includes("shadcn") &&
      !antdTailwindCss.includes("Radix"),
    `${preset.id}: Ant Design Tailwind bridge is incomplete or contains unrelated framework content`
  )
  check(
    bodyRem === preset.seed.typography.baseSize / 16,
    `${preset.id}: base font size does not drive --text-body`
  )
  check(
    captionRem >= 0.75 && captionRem <= 0.875,
    `${preset.id}: caption/control text must stay between 12px and 14px`
  )
  check(
    captionRem < bodyRem && bodyRem < titleRem && titleRem < displayRem,
    `${preset.id}: typography scale order is unhealthy`
  )
  check(
    fontScaleRem.every(
      (value, index) => index === 0 || fontScaleRem[index - 1] < value
    ),
    `${preset.id}: generated xs-through-6xl font scale is not monotonic`
  )
  check(
    [captionRem, ...fontScaleRem].every((value) =>
      Number.isInteger(Math.round(value * 16 * 10_000) / 10_000)
    ),
    `${preset.id}: generated typography contains fractional pixel values`
  )
  check(
    theme.mapTokens["--text-body"] === "var(--font-size-base)" &&
      theme.mapTokens["--text-title"] === "var(--font-size-2xl)" &&
      theme.mapTokens["--text-display"] === "var(--font-size-4xl)",
    `${preset.id}: semantic typography roles drifted from the generated scale`
  )

  for (const tokenName of [
    ...requiredMapTokenNames,
    ...requiredSemanticTokenNames,
    ...requiredShadcnOfficialTokenNames,
    ...requiredShadcnExtensionTokenNames,
  ]) {
    check(
      hasCssDeclaration(css, tokenName),
      `${preset.id}: exported CSS is missing ${tokenName}`
    )
  }

  check(
    css.indexOf("official shadcn adapter tokens") <
      css.indexOf("Design System Lab shadcn extensions"),
    `${preset.id}: project shadcn extensions are emitted before the official baseline`
  )
  check(
    css.indexOf("--color-destructive:") <
      css.indexOf("--color-destructive-foreground:"),
    `${preset.id}: project Tailwind extensions are emitted before official shadcn exposure`
  )
  check(
    theme.shadcnTokens["--sidebar-accent"] ===
      "var(--action-secondary-hover)" &&
      theme.shadcnTokens["--sidebar-accent-foreground"] ===
        "var(--action-secondary-fg)",
    `${preset.id}: sidebar state tokens bypass the existing secondary action state`
  )
  for (const tokenName of [
    "--neutral-50",
    "--neutral-100",
    "--neutral-200",
    "--neutral-300",
    "--neutral-400",
    "--neutral-500",
    "--neutral-600",
    "--neutral-700",
    "--neutral-800",
    "--neutral-900",
    "--neutral-950",
    "--surface-canvas",
    "--surface-panel",
    "--surface-raised",
    "--surface-overlay",
    "--border-subtle",
    "--border-default",
    "--border-strong",
    "--action-secondary",
    "--action-secondary-hover",
  ] as const) {
    const tokenValue =
      theme.mapTokens[tokenName] ?? theme.semanticTokens[tokenName]
    const tokenColor = tokenValue ? parseOklchColor(tokenValue) : null

    check(
      tokenColor !== null && tokenColor.chroma <= 0.001,
      `${preset.id}: ${tokenName} is not a low-saturation neutral`
    )
  }

  for (const exposure of [
    "--color-background",
    "--color-primary-foreground",
    "--color-destructive-foreground",
    "--color-sidebar-primary-foreground",
    "--color-success-solid-foreground",
    "--color-warning-solid-foreground",
    "--color-info-solid-foreground",
    "--color-danger-solid-foreground",
    "--shadow-control",
    "--text-xs",
    "--text-xs--line-height",
    "--text-sm",
    "--text-base",
    "--text-lg",
    "--text-xl",
    "--text-2xl",
    "--text-3xl",
    "--text-4xl",
    "--text-5xl",
    "--text-6xl",
  ]) {
    check(
      hasCssDeclaration(css, exposure),
      `${preset.id}: Tailwind exposure is missing ${exposure}`
    )
  }

  check(
    !["var(--green-600)", "var(--amber-600)", "var(--red-600)"].some(
      (statusReference) =>
        [
          theme.mapTokens["--data-1"],
          theme.mapTokens["--data-2"],
          theme.mapTokens["--data-3"],
          theme.mapTokens["--data-4"],
          theme.mapTokens["--data-5"],
        ].includes(statusReference)
    ),
    `${preset.id}: chart categories reuse status token references`
  )
  check(
    themeOnlyTaskPacket.includes("Install Design System Lab Tokens") &&
      themeOnlyTaskPacket.includes('"schemaVersion":8') &&
      themeOnlyTaskPacket.includes('"kind":"theme-lab-token-package"') &&
      themeOnlyTaskPacket.includes('"sourceOfTruth":"seed"') &&
      themeOnlyTaskPacket.includes('"map"') &&
      themeOnlyTaskPacket.includes('"semantic"') &&
      themeOnlyTaskPacket.includes("--font-size-xs") &&
      themeOnlyTaskPacket.includes("--text-caption"),
    `${preset.id}: default theme-only task packet is incomplete`
  )
  check(
    theme.semanticTokens["--action-primary-fg"] === "oklch(1 0 0)" &&
      theme.darkSemanticTokens["--action-primary-fg"] === "oklch(1 0 0)",
    `${preset.id}: primary action foreground is not white in both modes`
  )
}

check(themePresets.length === 5, "The curated preset set must stay focused at five")
check(
  themePresets.map((preset) => preset.id).join(",") ===
    "cobalt,graphite,verdant,terracotta,orchid",
  "The curated preset identities or ordering changed unexpectedly"
)
check(
  presetPrimaryValues.size === themePresets.length &&
    presetMutedValues.size === themePresets.length,
  "Curated presets must have distinct primary and muted surface outputs"
)

const edgeSeeds: readonly { id: string; seed: ThemeSeed }[] = [
  {
    id: "white-translucent-primary",
    seed: {
      ...defaultThemeSeed,
      color: {
        ...defaultThemeSeed.color,
        primary: { hex: "#ffffff", alpha: 0.2 },
      },
    },
  },
  {
    id: "black-primary",
    seed: {
      ...defaultThemeSeed,
      color: {
        ...defaultThemeSeed.color,
        primary: { hex: "#000000", alpha: 1 },
      },
    },
  },
  {
    id: "yellow-primary",
    seed: {
      ...defaultThemeSeed,
      color: {
        ...defaultThemeSeed.color,
        primary: { hex: "#ffff00", alpha: 1 },
      },
    },
  },
  {
    id: "invalid-light-seed-pair",
    seed: {
      ...defaultThemeSeed,
      color: {
        ...defaultThemeSeed.color,
        background: { hex: "#111111", alpha: 0.5 },
        foreground: { hex: "#eeeeee", alpha: 0.5 },
        neutral: { hex: "#ffffff", alpha: 0.4 },
      },
    },
  },
  {
    id: "info-matches-primary",
    seed: {
      ...defaultThemeSeed,
      color: {
        ...defaultThemeSeed.color,
        info: { ...defaultThemeSeed.color.primary },
        infoMatchesPrimary: true,
      },
    },
  },
]

for (const edgeCase of edgeSeeds) {
  const edgeTheme = deriveTheme(edgeCase.seed)
  const health = createThemeHealthReport(edgeTheme)
  const antdHealth = createAntdThemeHealthReport(edgeTheme)
  check(
    health.healthy,
    `${edgeCase.id}: ${health.issues
      .map(
        (issue) =>
          `${issue.mode}/${issue.code}/${issue.tokens.join("+")}${
            issue.actual === undefined ? "" : `=${issue.actual}`
          }`
      )
      .join(", ")}`
  )
  check(
    antdHealth.healthy,
    `${edgeCase.id}/antd: ${antdHealth.issues
      .map(
        (issue) =>
          `${issue.mode}/${issue.code}/${issue.tokens.join("+")}${
            issue.actual === undefined ? "" : `=${issue.actual}`
          }`
      )
      .join(", ")}`
  )
}

const representativeTaskPacket = compileProjectImportPrompt({
  mode: "persistent-project-contract",
  componentSystem: "shadcn",
  theme: deriveTheme(themePresets[0].seed),
})

check(
  representativeTaskPacket.length <= 12_000,
  `Representative shadcn Token packet exceeds the 12k character budget: ${representativeTaskPacket.length}`
)
check(
  representativeTaskPacket.includes('"schemaVersion":8') &&
    representativeTaskPacket.includes('"kind":"theme-lab-token-package"') &&
    representativeTaskPacket.includes('"sourceOfTruth":"seed"') &&
    representativeTaskPacket.includes('"componentSystem":"shadcn"') &&
    representativeTaskPacket.includes('"compiled":{"map"') &&
    representativeTaskPacket.includes('"semantic":{"common"') &&
    representativeTaskPacket.includes(
      "https://raw.githubusercontent.com/Gusgoooo/DesignSystemLab/"
    ),
  "shadcn Token packet lost its compact Token payload or raw sources"
)
check(
  representativeTaskPacket.includes(
    "After successful writes and verification"
  ) &&
    representativeTaskPacket.includes("Do not start before an explicit yes") &&
    representativeTaskPacket.includes("it is not literal value replacement"),
  "Token installation packet lost post-install semantic mapping consent"
)
check(
  !representativeTaskPacket.includes("refactor-selected-scope") &&
    !representativeTaskPacket.includes("refactor-product-wide") &&
    !representativeTaskPacket.includes("scopeDetection") &&
    !representativeTaskPacket.includes("Project mode:") &&
    !representativeTaskPacket.includes('"registryResolver"') &&
    !representativeTaskPacket.includes('"registryContract"') &&
    !representativeTaskPacket.includes('"tokenHealth"') &&
    !representativeTaskPacket.includes('"tokenHealthContract"') &&
    !representativeTaskPacket.includes('"tokenUsageContract"'),
  "Token installation packet still embeds removed workflow or static contracts"
)

const antDesignTaskPacket = compileProjectImportPrompt({
  mode: "persistent-project-contract",
  componentSystem: "antd",
  theme: deriveTheme(themePresets[0].seed),
})

check(
  antDesignTaskPacket.length <= 10_000,
  `Representative Ant Design Token packet exceeds the 10k character budget: ${antDesignTaskPacket.length}`
)
check(
  antDesignTaskPacket.includes("Component system: Ant Design") &&
    antDesignTaskPacket.includes("theme-lab.antd.ts") &&
    antDesignTaskPacket.includes("ConfigProvider") &&
    antDesignTaskPacket.includes('"schemaVersion":8') &&
    antDesignTaskPacket.includes('"kind":"theme-lab-token-package"') &&
    antDesignTaskPacket.includes('"componentSystem":"antd"') &&
    antDesignTaskPacket.includes('"token":{"common"') &&
    antDesignTaskPacket.includes('"algorithm":{"light"') &&
    antDesignTaskPacket.includes("lib/theme/export-antd.ts") &&
    antDesignTaskPacket.includes("Do not start before an explicit yes"),
  "Ant Design task packet is missing its compact Token or runtime instructions"
)
check(
  !antDesignTaskPacket.toLowerCase().includes("shadcn") &&
    !antDesignTaskPacket.includes("Radix") &&
    !antDesignTaskPacket.includes("add --dry-run") &&
    !antDesignTaskPacket.includes('"registryContract"') &&
    !antDesignTaskPacket.includes('"antdHealth"') &&
    !antDesignTaskPacket.includes('"antdContract"') &&
    !antDesignTaskPacket.includes('"antdAdapter"') &&
    !antDesignTaskPacket.includes("@theme inline") &&
    !antDesignTaskPacket.includes("npx shadcn") &&
    !antDesignTaskPacket.includes("components.json") &&
    !antDesignTaskPacket.includes("refactor-selected-scope"),
  "Ant Design task packet still includes an unrelated component-system workflow"
)

const expectedOfficialShadcnTokens = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--border",
  "--input",
  "--ring",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
  "--sidebar",
  "--sidebar-foreground",
  "--sidebar-primary",
  "--sidebar-primary-foreground",
  "--sidebar-accent",
  "--sidebar-accent-foreground",
  "--sidebar-border",
  "--sidebar-ring",
  "--radius",
] as const

check(
  requiredShadcnOfficialTokenNames.join(",") ===
    expectedOfficialShadcnTokens.join(","),
  "The official shadcn compatibility baseline drifted from the current theme vocabulary"
)
check(
  requiredShadcnTokenNames === requiredShadcnOfficialTokenNames,
  "The backward-compatible shadcn token alias no longer points to the official baseline"
)
check(
  requiredShadcnExtensionTokenNames.join(",") ===
    "--destructive-foreground",
  "shadcn-compatible project extensions are not explicitly separated"
)

const seedDrivenTheme = deriveTheme(defaultThemeSeed)
const expectedDefaultFontScale = {
  "--font-size-xs": "0.75rem",
  "--font-size-sm": "0.875rem",
  "--font-size-base": "1rem",
  "--font-size-lg": "1.125rem",
  "--font-size-xl": "1.25rem",
  "--font-size-2xl": "1.5rem",
  "--font-size-3xl": "1.875rem",
  "--font-size-4xl": "2.25rem",
  "--font-size-5xl": "3rem",
  "--font-size-6xl": "3.75rem",
} as const

for (const [tokenName, expectedValue] of Object.entries(
  expectedDefaultFontScale
)) {
  check(
    seedDrivenTheme.mapTokens[tokenName] === expectedValue,
    `${tokenName} no longer matches the Tailwind-compatible default scale`
  )
}

const changedSeedTheme = deriveTheme({
  ...defaultThemeSeed,
  color: {
    ...defaultThemeSeed.color,
    primary: {
      hex: "#0f766e",
      alpha: 1,
    },
  },
  shape: {
    ...defaultThemeSeed.shape,
    radius: 0.875,
  },
  density: {
    ...defaultThemeSeed.density,
    controlHeight: 2.75,
  },
  typography: {
    ...defaultThemeSeed.typography,
    baseSize: 17,
    scaleRatio: 1.26,
  },
  material: {
    ...defaultThemeSeed.material,
    shadowAlpha: 0.14,
  },
  motion: {
    ...defaultThemeSeed.motion,
    durationBase: 240,
  },
})
for (const tokenName of [
  "--brand-600",
  "--radius-base",
  "--control-height-md",
  "--font-size-sm",
  "--font-size-base",
  "--font-size-4xl",
  "--text-caption",
  "--elevation-card",
  "--duration-base",
] as const) {
  check(
    changedSeedTheme.mapTokens[tokenName] !==
      seedDrivenTheme.mapTokens[tokenName],
    `${tokenName} is not derived from its ThemeSeed family`
  )
}
check(
  changedSeedTheme.semanticTokens["--action-primary"] !==
    seedDrivenTheme.semanticTokens["--action-primary"] &&
    changedSeedTheme.shadcnTokens["--primary"] ===
      "var(--action-primary)",
  "ThemeSeed color changes do not propagate through map, semantic, and official shadcn layers"
)
const remappedSemanticTokens = deriveSemanticTokens(defaultThemeSeed, {
  ...seedDrivenTheme.mapTokens,
  "--brand-600": "oklch(0.4 0.12 140 / 1)",
})
check(
  remappedSemanticTokens["--action-primary"] !==
    seedDrivenTheme.semanticTokens["--action-primary"],
  "Semantic colors bypass the algorithmic map layer"
)
check(
  seedDrivenTheme.shadcnTokens["--destructive-foreground"] === undefined &&
    seedDrivenTheme.shadcnExtensionTokens["--destructive-foreground"] ===
      "var(--status-danger-solid-fg)",
  "The destructive foreground extension leaked into the official shadcn adapter"
)

const densitySamples = [84, 100, 116] as const
const densitySampleModes = ["compact", "default", "comfortable"] as const
const densitySampleThemes = densitySamples.map((densityPercent, index) => {
  const density = densitySeedFromPercent(densityPercent)

  check(
    densityPercentFromSeed(density) === densityPercent,
    `${densityPercent}% density does not round-trip as an integer seed`
  )
  check(
    density.mode === densitySampleModes[index],
    `${densityPercent}% density resolved to the wrong semantic mode`
  )
  check(
    Number.isInteger(density.controlHeight * 16),
    `${densityPercent}% density produced a fractional control-height pixel`
  )

  return deriveTheme({
    ...defaultThemeSeed,
    density,
  })
})

for (let index = 1; index < densitySampleThemes.length; index += 1) {
  const previous = densitySampleThemes[index - 1]
  const current = densitySampleThemes[index]

  for (const tokenName of [
    "--control-padding-x",
    "--section-gap",
    "--panel-padding",
  ] as const) {
    check(
      Number.parseFloat(current.mapTokens[tokenName]) >
        Number.parseFloat(previous.mapTokens[tokenName]),
      `${tokenName} is not monotonic across the integer density control`
    )
  }
}

const resolvedPageTypes = registryPageTypes.filter(
  (pageType): pageType is ResolvedRegistryPageType => pageType !== "auto"
)

for (const primitivePolicy of ["radix", "base-ui"] as const) {
  for (const pageType of resolvedPageTypes) {
    const resolution = resolveRegistryBaseline({
      projectMode: "existing-product",
      pageType,
      primitivePolicy,
    })

    check(
      resolution.status === "resolved",
      `${pageType}/${primitivePolicy}: registry resolver returned ${resolution.status}`
    )
    check(
      (resolution.recommended?.score ?? 0) >= 70,
      `${pageType}/${primitivePolicy}: no registry candidate reached 70 points`
    )
    check(
      resolution.recommended?.criticalSlotCoverage === 1,
      `${pageType}/${primitivePolicy}: critical registry slots are incomplete`
    )
  }
}

check(
  registryResolverContract.coverageGate.minimumRatio >= 0.8,
  "Registry coverage gate must require at least 80 percent coverage"
)

const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8")
) as {
  dependencies?: Record<string, string>
}
const componentsJson = JSON.parse(
  readFileSync(join(root, "components.json"), "utf8")
) as {
  tailwind?: { css?: string; cssVariables?: boolean }
}

check(Boolean(packageJson.dependencies?.["radix-ui"]), "radix-ui is not installed")
check(
  componentsJson.tailwind?.cssVariables === true,
  "components.json must keep shadcn CSS variables enabled"
)
check(
  componentsJson.tailwind?.css === "app/globals.css",
  "components.json must point shadcn to app/globals.css"
)

const globalsCss = readFileSync(join(root, "app/globals.css"), "utf8")
const generatedDefaultCss = exportThemeCssFromOutput(
  deriveTheme(defaultThemeSeed)
)
check(
  globalsCss.includes(generatedDefaultCss),
  "app/globals.css is out of sync; run npm run theme:sync"
)

const requiredUiFiles = [
  "alert-dialog.tsx",
  "avatar.tsx",
  "button.tsx",
  "checkbox.tsx",
  "collapsible.tsx",
  "dialog.tsx",
  "dropdown-menu.tsx",
  "label.tsx",
  "popover.tsx",
  "progress.tsx",
  "radio-group.tsx",
  "select.tsx",
  "separator.tsx",
  "sheet.tsx",
  "sidebar.tsx",
  "slider.tsx",
  "switch.tsx",
  "tabs.tsx",
  "tooltip.tsx",
]

for (const fileName of requiredUiFiles) {
  check(
    existsSync(join(root, "components/ui", fileName)),
    `Missing Radix-compatible shadcn primitive: components/ui/${fileName}`
  )
}

const uiSourceEntries = readdirSync(join(root, "components/ui"))
  .filter((fileName) => fileName.endsWith(".tsx"))
  .map((fileName) => ({
    fileName: `components/ui/${fileName}`,
    source: readFileSync(join(root, "components/ui", fileName), "utf8"),
  }))

const previewSourceEntries = [
  ...readdirSync(join(root, "components/theme-lab/previews"))
    .filter((fileName) => fileName.endsWith(".tsx"))
    .map((fileName) => ({
      fileName: `components/theme-lab/previews/${fileName}`,
      source: readFileSync(
        join(root, "components/theme-lab/previews", fileName),
        "utf8"
      ),
    })),
  {
    fileName: "components/theme-lab/preview-frame.tsx",
    source: readFileSync(
      join(root, "components/theme-lab/preview-frame.tsx"),
      "utf8"
    ),
  },
]

const checkboxSource = readFileSync(
  join(root, "components/ui/checkbox.tsx"),
  "utf8"
)
const buttonSource = readFileSync(
  join(root, "components/ui/button.tsx"),
  "utf8"
)
check(
  buttonSource.includes("text-[length:var(--text-caption)]"),
  "Default Button labels are not bound to --text-caption"
)
check(
  checkboxSource.includes("rounded-[4px]") &&
    !checkboxSource.includes("radius-control"),
  "Checkbox geometry must stay fixed instead of following the global radius"
)

const blocksPreviewSource = readFileSync(
  join(root, "components/theme-lab/previews/blocks-preview.tsx"),
  "utf8"
)
check(
  blocksPreviewSource.includes("@container/dashboard") &&
    blocksPreviewSource.includes("@[560px]/main:grid-cols-2") &&
    !blocksPreviewSource.includes("bg-gradient-to-t from-primary/5"),
  "Blocks preview must use local container breakpoints without structural metric gradients"
)

const forbiddenThemeableClass =
  /(?:bg|text|border|ring)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}|oklch\(|rounded(?:-[trbl]{1,2})?-(?:sm|md|lg|xl|2xl|3xl)|shadow-(?:none|xs|sm|md|lg|xl|2xl)|duration-(?:75|100|150|200|300|500|700|1000)/g

for (const entry of [...uiSourceEntries, ...previewSourceEntries]) {
  const legacyUsages = entry.source.match(forbiddenThemeableClass)
  check(
    legacyUsages === null,
    `${entry.fileName}: bypasses semantic tokens with ${[
      ...new Set(legacyUsages ?? []),
    ].join(", ")}`
  )
}

check(
  uiSourceEntries.every((entry) => !entry.source.includes('from "@base-ui')),
  "The local Radix component foundation is mixed with Base UI imports"
)
check(
  uiSourceEntries.filter((entry) => entry.source.includes('from "radix-ui"'))
    .length >= 18,
  "The local shadcn component set is not consistently backed by radix-ui"
)

if (failures.length > 0) {
  console.error(`Theme system verification failed (${failures.length} failures):`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exitCode = 1
} else {
  console.log(
    `Theme system verification passed: ${assertions} assertions, ${themePresets.length} presets, ${edgeSeeds.length} edge seeds, ${resolvedPageTypes.length} page types, automatic shadcn primitive resolution, isolated Ant Design exports, and portable framework-neutral core Token exports.`
  )
}
