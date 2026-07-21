import {
  requiredAntdAliasTokenNames,
  requiredAntdSeedTokenNames,
  type AntdTokens,
  type ThemeOutput,
} from "./schema"

export type AntdThemeHealthIssue = {
  code:
    | "missing-token"
    | "invalid-color"
    | "fractional-size"
    | "algorithm"
    | "component-coverage"
    | "foreground-policy"
    | "css-variable"
    | "component-size"
  mode: "light" | "dark" | "shared"
  tokens: readonly string[]
  message: string
  actual?: string | number
}

export type AntdThemeHealthReport = {
  version: "antd-theme-health-v1"
  healthy: boolean
  checks: number
  issues: readonly AntdThemeHealthIssue[]
}

const integerTokenPrefixes = [
  "fontSize",
  "fontWeight",
  "controlHeight",
  "borderRadius",
  "padding",
  "lineWidth",
  "size",
  "zIndex",
] as const

export const antdThemeHealthContract = {
  version: "antd-theme-health-v1",
  adapterVersion: "antd-theme-config-v1",
  requiredSeedTokens: requiredAntdSeedTokenNames,
  requiredAliasTokens: requiredAntdAliasTokenNames,
  invariants: [
    "all Ant Design components inherit the global ConfigProvider theme",
    "light mode uses defaultAlgorithm and dark mode uses darkAlgorithm",
    "compactAlgorithm is composed only for the compact density seed",
    "all exported Ant Design color tokens are opaque hexadecimal colors",
    "generated Ant Design size tokens use integer pixel values",
    "filled Ant Design content uses a white colorTextLightSolid",
    "component-specific overrides remain optional and cannot replace the global token contract",
    "cssVar uses the ant prefix and distinct stable light and dark keys",
    "componentSize follows the density seed",
  ],
} as const

function checkModeTokens(
  issues: AntdThemeHealthIssue[],
  mode: "light" | "dark",
  tokens: AntdTokens
): number {
  const required = [
    ...requiredAntdSeedTokenNames,
    ...requiredAntdAliasTokenNames,
  ]
  let checks = required.length

  for (const tokenName of required) {
    if (tokens[tokenName] === undefined) {
      issues.push({
        code: "missing-token",
        mode,
        tokens: [tokenName],
        message: `Ant Design ${mode} theme is missing ${tokenName}.`,
      })
    }
  }

  for (const [tokenName, value] of Object.entries(tokens)) {
    if (tokenName.startsWith("color")) {
      checks += 1
      if (typeof value !== "string" || !/^#[0-9a-f]{6}$/i.test(value)) {
        issues.push({
          code: "invalid-color",
          mode,
          tokens: [tokenName],
          message: `${tokenName} must be an opaque hexadecimal color for Ant Design algorithms and CSS variables.`,
          actual: String(value),
        })
      }
    }

    if (
      integerTokenPrefixes.some((prefix) => tokenName.startsWith(prefix)) &&
      typeof value === "number"
    ) {
      checks += 1
      if (!Number.isInteger(value)) {
        issues.push({
          code: "fractional-size",
          mode,
          tokens: [tokenName],
          message: `${tokenName} must resolve to an integer pixel value.`,
          actual: value,
        })
      }
    }
  }

  checks += 1
  if (tokens.colorTextLightSolid !== "#ffffff") {
    issues.push({
      code: "foreground-policy",
      mode,
      tokens: ["colorTextLightSolid"],
      message: "Ant Design filled controls must keep a white solid foreground.",
      actual: String(tokens.colorTextLightSolid),
    })
  }

  return checks
}

export function createAntdThemeHealthReport(
  theme: ThemeOutput
): AntdThemeHealthReport {
  const issues: AntdThemeHealthIssue[] = []
  let checks = 0
  const adapter = theme.antdTheme

  checks += 4
  if (
    adapter.componentCoverage !== "all-components-via-global-theme-tokens"
  ) {
    issues.push({
      code: "component-coverage",
      mode: "shared",
      tokens: ["componentCoverage"],
      message:
        "The Ant Design adapter must cover every component through global theme tokens.",
      actual: adapter.componentCoverage,
    })
  }

  if (
    adapter.cssVar.prefix !== "ant" ||
    !adapter.cssVar.lightKey ||
    !adapter.cssVar.darkKey ||
    adapter.cssVar.lightKey === adapter.cssVar.darkKey
  ) {
    issues.push({
      code: "css-variable",
      mode: "shared",
      tokens: ["cssVar"],
      message:
        "Ant Design CSS variables require the ant prefix and distinct stable light/dark keys.",
      actual: JSON.stringify(adapter.cssVar),
    })
  }

  const expectedComponentSize =
    theme.seed.density.mode === "compact"
      ? "small"
      : theme.seed.density.mode === "comfortable"
        ? "large"
        : "middle"

  if (adapter.componentSize !== expectedComponentSize) {
    issues.push({
      code: "component-size",
      mode: "shared",
      tokens: ["componentSize"],
      message: "Ant Design componentSize must follow the density seed.",
      actual: adapter.componentSize,
    })
  }

  const expectedLightAlgorithm = [
    "defaultAlgorithm",
    ...(theme.seed.density.mode === "compact" ? ["compactAlgorithm"] : []),
  ]
  const expectedDarkAlgorithm = [
    "darkAlgorithm",
    ...(theme.seed.density.mode === "compact" ? ["compactAlgorithm"] : []),
  ]

  for (const [mode, actual, expected] of [
    ["light", adapter.light.algorithm, expectedLightAlgorithm],
    ["dark", adapter.dark.algorithm, expectedDarkAlgorithm],
  ] as const) {
    checks += 1
    if (actual.join(",") !== expected.join(",")) {
      issues.push({
        code: "algorithm",
        mode,
        tokens: ["algorithm"],
        message: `Ant Design ${mode} algorithm composition is incorrect.`,
        actual: actual.join(","),
      })
    }
  }

  checks += checkModeTokens(issues, "light", adapter.light.token)
  checks += checkModeTokens(issues, "dark", adapter.dark.token)

  return {
    version: "antd-theme-health-v1",
    healthy: issues.length === 0,
    checks,
    issues,
  }
}

export function assertAntdThemeHealth(
  theme: ThemeOutput,
  label: string
): void {
  const report = createAntdThemeHealthReport(theme)

  if (!report.healthy) {
    const details = report.issues
      .map((issue) => `${issue.mode}:${issue.code}:${issue.tokens.join("+")}`)
      .join(", ")
    throw new Error(`${label} failed Ant Design theme checks: ${details}`)
  }
}
