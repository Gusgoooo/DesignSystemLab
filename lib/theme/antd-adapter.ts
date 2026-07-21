import {
  requiredAntdAliasTokenNames,
  requiredAntdSeedTokenNames,
  type AntdThemeAdapter,
  type AntdThemeMode,
  type AntdTokens,
  type ThemeSeed,
} from "./schema"
import {
  clamp,
  normalizeHex,
  parseOklchColor,
} from "./algorithms/utils"

type ThemeMode = "light" | "dark"

type ColorTokenMapping = Readonly<Record<string, string>>

const sharedSemanticColorMapping: ColorTokenMapping = {
  colorText: "--content-primary",
  colorTextSecondary: "--content-secondary",
  colorTextTertiary: "--content-tertiary",
  colorTextQuaternary: "--content-disabled",
  colorTextHeading: "--content-primary",
  colorTextLabel: "--content-secondary",
  colorTextDescription: "--content-tertiary",
  colorTextDisabled: "--content-disabled",
  colorTextPlaceholder: "--content-tertiary",
  colorTextLightSolid: "--action-primary-fg",
  colorBgLayout: "--surface-canvas",
  colorBgContainer: "--surface-raised",
  colorBgElevated: "--surface-overlay",
  colorBgSpotlight: "--surface-inverse",
  colorBorder: "--border-default",
  colorBorderSecondary: "--border-subtle",
  colorSplit: "--border-subtle",
  colorPrimary: "--action-primary",
  colorPrimaryHover: "--action-primary-hover",
  colorPrimaryActive: "--action-primary-active",
  colorSuccess: "--status-success",
  colorSuccessBg: "--status-success-bg",
  colorSuccessBorder: "--status-success",
  colorSuccessText: "--status-success-fg",
  colorWarning: "--status-warning",
  colorWarningBg: "--status-warning-bg",
  colorWarningBorder: "--status-warning",
  colorWarningText: "--status-warning-fg",
  colorInfo: "--status-info",
  colorInfoBg: "--status-info-bg",
  colorInfoBorder: "--status-info",
  colorInfoText: "--status-info-fg",
  colorError: "--status-danger",
  colorErrorBg: "--status-danger-bg",
  colorErrorBorder: "--status-danger",
  colorErrorText: "--status-danger-fg",
  colorIcon: "--content-tertiary",
  colorIconHover: "--content-secondary",
  colorHighlight: "--status-danger",
  controlOutline: "--focus-ring",
  controlItemBgHover: "--action-secondary-hover",
}

const lightColorMapping: ColorTokenMapping = {
  colorBgBase: "--surface-canvas",
  colorTextBase: "--content-primary",
  colorFill: "--neutral-300",
  colorFillSecondary: "--neutral-200",
  colorFillTertiary: "--neutral-100",
  colorFillQuaternary: "--surface-panel",
  colorPrimaryBg: "--brand-50",
  colorPrimaryBgHover: "--brand-100",
  colorPrimaryBorder: "--brand-200",
  colorPrimaryBorderHover: "--brand-300",
  colorPrimaryText: "--brand-700",
  colorPrimaryTextHover: "--brand-800",
  colorPrimaryTextActive: "--brand-900",
  controlItemBgActive: "--brand-50",
  controlItemBgActiveHover: "--brand-100",
}

const darkColorMapping: ColorTokenMapping = {
  colorBgBase: "--surface-canvas",
  colorTextBase: "--content-primary",
  colorFill: "--neutral-700",
  colorFillSecondary: "--neutral-800",
  colorFillTertiary: "--neutral-900",
  colorFillQuaternary: "--surface-panel",
  colorPrimaryBg: "--brand-950",
  colorPrimaryBgHover: "--brand-900",
  colorPrimaryBorder: "--brand-800",
  colorPrimaryBorderHover: "--brand-700",
  colorPrimaryText: "--brand-300",
  colorPrimaryTextHover: "--brand-200",
  colorPrimaryTextActive: "--brand-100",
  controlItemBgActive: "--brand-950",
  controlItemBgActiveHover: "--brand-900",
}

export const antdColorTokenMapping = {
  shared: sharedSemanticColorMapping,
  light: lightColorMapping,
  dark: darkColorMapping,
} as const

function linearChannelToSrgb(value: number): number {
  const channel = clamp(value, 0, 1)
  return channel <= 0.0031308
    ? channel * 12.92
    : 1.055 * channel ** (1 / 2.4) - 0.055
}

function channelToHex(value: number): string {
  return Math.round(clamp(value, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0")
}

function oklchToHex(value: string): string | null {
  const color = parseOklchColor(value)

  if (!color) {
    return null
  }

  const hue = (color.hue * Math.PI) / 180
  const a = color.chroma * Math.cos(hue)
  const b = color.chroma * Math.sin(hue)
  const lPrime = color.lightness + 0.3963377774 * a + 0.2158037573 * b
  const mPrime = color.lightness - 0.1055613458 * a - 0.0638541728 * b
  const sPrime = color.lightness - 0.0894841775 * a - 1.291485548 * b
  const l = lPrime ** 3
  const m = mPrime ** 3
  const s = sPrime ** 3
  const red = linearChannelToSrgb(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  )
  const green = linearChannelToSrgb(
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  )
  const blue = linearChannelToSrgb(
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
  )

  return `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`
}

function rgbToHex(value: string): string | null {
  const match = value.match(
    /^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)$/i
  )

  if (!match) {
    return null
  }

  return `#${[match[1], match[2], match[3]]
    .map((channel) =>
      Math.round(clamp(Number(channel), 0, 255))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`
}

function resolveTokenValue(
  tokens: Record<string, string>,
  tokenName: string,
  seen = new Set<string>()
): string | null {
  if (seen.has(tokenName)) {
    return null
  }

  const value = tokens[tokenName]

  if (value === undefined) {
    return null
  }

  const reference = value.trim().match(/^var\((--[a-z0-9-]+)\)$/i)?.[1]

  if (!reference) {
    return value.trim()
  }

  const nextSeen = new Set(seen)
  nextSeen.add(tokenName)
  return resolveTokenValue(tokens, reference, nextSeen)
}

export function resolveAntdColorSource(
  tokens: Record<string, string>,
  tokenName: string
): string {
  const value = resolveTokenValue(tokens, tokenName)

  if (!value) {
    throw new Error(`Ant Design adapter cannot resolve ${tokenName}.`)
  }

  if (/^#[0-9a-f]{3,6}$/i.test(value)) {
    return normalizeHex(value)
  }

  const converted = oklchToHex(value) ?? rgbToHex(value)

  if (!converted) {
    throw new Error(
      `Ant Design adapter requires a supported opaque color at ${tokenName}.`
    )
  }

  return converted
}

function resolvePx(tokens: Record<string, string>, tokenName: string): number {
  const value = resolveTokenValue(tokens, tokenName)

  if (!value) {
    throw new Error(`Ant Design adapter cannot resolve ${tokenName}.`)
  }

  const remMatch = value.match(/^(-?[\d.]+)rem$/i)
  const pxMatch = value.match(/^(-?[\d.]+)px$/i)
  const resolved = remMatch
    ? Number(remMatch[1]) * 16
    : pxMatch
      ? Number(pxMatch[1])
      : Number(value)

  if (!Number.isFinite(resolved)) {
    throw new Error(`Ant Design adapter requires a size at ${tokenName}.`)
  }

  return Math.round(resolved)
}

function colorTokensForMode(
  mode: ThemeMode,
  tokens: Record<string, string>
): AntdTokens {
  const mappings = {
    ...sharedSemanticColorMapping,
    ...(mode === "light" ? lightColorMapping : darkColorMapping),
  }

  return Object.fromEntries(
    Object.entries(mappings).map(([antdToken, sourceToken]) => [
      antdToken,
      resolveAntdColorSource(tokens, sourceToken),
    ])
  )
}

function numericTokens(
  seed: ThemeSeed,
  tokens: Record<string, string>
): AntdTokens {
  const controlHeight = resolvePx(tokens, "--control-height-md")
  const controlHeightSM = resolvePx(tokens, "--control-height-sm")
  const controlHeightLG = resolvePx(tokens, "--control-height-lg")
  const fontSize = resolvePx(tokens, "--font-size-base")
  const controlGap = resolvePx(tokens, "--control-gap")
  const controlPadding = resolvePx(tokens, "--control-padding-x")
  const panelPadding = resolvePx(tokens, "--panel-padding")
  const sectionGap = resolvePx(tokens, "--section-gap")
  const radius = resolvePx(tokens, "--radius-base")
  const radiusControl = resolvePx(tokens, "--radius-control")
  const radiusCard = resolvePx(tokens, "--radius-card")
  const radiusPanel = resolvePx(tokens, "--radius-panel")

  return {
    fontSize,
    fontSizeSM: resolvePx(tokens, "--font-size-sm"),
    fontSizeLG: resolvePx(tokens, "--font-size-lg"),
    fontSizeXL: resolvePx(tokens, "--font-size-xl"),
    fontSizeHeading1: resolvePx(tokens, "--font-size-4xl"),
    fontSizeHeading2: resolvePx(tokens, "--font-size-3xl"),
    fontSizeHeading3: resolvePx(tokens, "--font-size-2xl"),
    fontSizeHeading4: resolvePx(tokens, "--font-size-xl"),
    fontSizeHeading5: resolvePx(tokens, "--font-size-lg"),
    fontWeightStrong: Math.round(seed.typography.headingWeight),
    lineHeight: 1.5,
    lineHeightSM: 1.45,
    lineHeightLG: 1.55,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.25,
    lineHeightHeading3: 1.3,
    lineHeightHeading4: 1.35,
    lineHeightHeading5: 1.4,
    lineWidth: 1,
    lineType: "solid",
    lineWidthFocus: 2,
    borderRadius: radius,
    borderRadiusXS: Math.max(2, Math.round(radiusControl * 0.4)),
    borderRadiusSM: Math.max(2, radiusControl),
    borderRadiusLG: Math.max(radius, radiusCard),
    borderRadiusOuter: Math.max(radiusCard, radiusPanel),
    sizeUnit: 4,
    sizeStep: seed.density.mode === "compact" ? 2 : 4,
    sizePopupArrow: 16,
    controlHeight,
    controlHeightXS: Math.max(16, controlHeightSM - 8),
    controlHeightSM,
    controlHeightLG,
    controlOutlineWidth: 2,
    paddingXXS: Math.max(2, Math.round(controlGap / 2)),
    paddingXS: controlGap,
    paddingSM: controlPadding,
    padding: panelPadding,
    paddingMD: Math.max(panelPadding, controlPadding + 4),
    paddingLG: sectionGap,
    paddingXL: sectionGap + panelPadding,
    zIndexBase: 0,
    zIndexPopupBase: 1000,
    opacityImage: 1,
    wireframe: false,
    motion: seed.motion.level !== "none",
  }
}

function createMode(
  mode: ThemeMode,
  seed: ThemeSeed,
  tokens: Record<string, string>
): AntdThemeMode {
  const compact =
    seed.density.mode === "compact" ? ["compactAlgorithm" as const] : []
  const algorithm =
    mode === "light"
      ? ["defaultAlgorithm" as const, ...compact]
      : ["darkAlgorithm" as const, ...compact]
  const colors = colorTokensForMode(mode, tokens)

  return {
    algorithm,
    token: {
      ...colors,
      ...numericTokens(seed, tokens),
      colorPrimary: colors.colorPrimary,
      colorSuccess: colors.colorSuccess,
      colorWarning: colors.colorWarning,
      colorError: colors.colorError,
      colorInfo: colors.colorInfo,
      colorLink: colors.colorInfo,
      fontFamily: seed.typography.sans,
      fontFamilyCode: seed.typography.mono,
      boxShadow: tokens["--elevation-dialog"],
      boxShadowSecondary: tokens["--elevation-popover"],
      boxShadowTertiary: tokens["--elevation-card"],
      motionDurationFast: tokens["--duration-fast"],
      motionDurationMid: tokens["--duration-base"],
      motionDurationSlow: tokens["--duration-slow"],
    },
  }
}

function assertRequiredAntdTokens(tokens: AntdTokens, mode: ThemeMode): void {
  const required = [
    ...requiredAntdSeedTokenNames,
    ...requiredAntdAliasTokenNames,
  ]
  const missing = required.filter((tokenName) => tokens[tokenName] === undefined)

  if (missing.length > 0) {
    throw new Error(
      `Ant Design ${mode} adapter is missing tokens: ${missing.join(", ")}`
    )
  }
}

export function deriveAntdThemeAdapter(
  seed: ThemeSeed,
  mapTokens: Record<string, string>,
  semanticTokens: Record<string, string>,
  darkSemanticTokens: Record<string, string>
): AntdThemeAdapter {
  const lightTokens = { ...mapTokens, ...semanticTokens }
  const darkTokens = { ...mapTokens, ...darkSemanticTokens }
  const light = createMode("light", seed, lightTokens)
  const dark = createMode("dark", seed, darkTokens)

  assertRequiredAntdTokens(light.token, "light")
  assertRequiredAntdTokens(dark.token, "dark")

  return {
    version: "antd-theme-config-v1",
    componentCoverage: "all-components-via-global-theme-tokens",
    componentSize:
      seed.density.mode === "compact"
        ? "small"
        : seed.density.mode === "comfortable"
          ? "large"
          : "middle",
    cssVar: {
      prefix: "ant",
      lightKey: "design-system-lab-light",
      darkKey: "design-system-lab-dark",
    },
    light,
    dark,
  }
}
