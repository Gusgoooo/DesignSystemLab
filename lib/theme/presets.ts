import { defaultThemeSeed } from "./defaults"
import type { ThemeSeed } from "./schema"

export type ThemePreset = {
  id: string
  name: string
  seed: ThemeSeed
}

type ThemeSeedOverrides = {
  [Key in keyof ThemeSeed]?: Partial<ThemeSeed[Key]>
}

function createThemeSeed(overrides: ThemeSeedOverrides): ThemeSeed {
  const color = {
    ...defaultThemeSeed.color,
    ...overrides.color,
  }

  return {
    color,
    shape: {
      ...defaultThemeSeed.shape,
      ...overrides.shape,
    },
    density: {
      ...defaultThemeSeed.density,
      ...overrides.density,
    },
    typography: {
      ...defaultThemeSeed.typography,
      ...overrides.typography,
    },
    material: {
      ...defaultThemeSeed.material,
      ...overrides.material,
    },
    motion: {
      ...defaultThemeSeed.motion,
      ...overrides.motion,
    },
    vibe: {
      ...defaultThemeSeed.vibe,
      ...overrides.vibe,
    },
  }
}

export const themePresets: ThemePreset[] = [
  {
    id: "cobalt",
    name: "钴蓝",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#1d4ed8", alpha: 1 },
        success: { hex: "#15803d", alpha: 1 },
        warning: { hex: "#b45309", alpha: 1 },
        info: { hex: "#2563eb", alpha: 1 },
        infoMatchesPrimary: false,
        danger: { hex: "#dc2626", alpha: 1 },
        background: { hex: "#fafafa", alpha: 1 },
        foreground: { hex: "#171717", alpha: 1 },
        neutral: { hex: "#737373", alpha: 1 },
      },
      shape: { radius: 0.625, radiusRatio: 1 },
      density: { mode: "default", controlHeight: 2.375, densityRatio: 1 },
      typography: {
        scaleRatio: 1.2,
        bodyWeight: 400,
        headingWeight: 650,
        trackingBias: 0,
      },
      material: {
        elevation: "soft",
        shadowAlpha: 0.065,
        borderContrast: 1.05,
        surfaceContrast: 1.05,
        glassOpacity: 0,
        noiseOpacity: 0,
      },
      motion: { level: "subtle", durationBase: 170 },
      vibe: {
        temperature: "cool",
        expression: "balanced",
        domain: "saas",
        tone: "calm",
      },
    }),
  },
  {
    id: "graphite",
    name: "石墨",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#27272a", alpha: 1 },
        success: { hex: "#15803d", alpha: 1 },
        warning: { hex: "#b45309", alpha: 1 },
        info: { hex: "#1d4ed8", alpha: 1 },
        infoMatchesPrimary: false,
        danger: { hex: "#dc2626", alpha: 1 },
        background: { hex: "#f8f8f8", alpha: 1 },
        foreground: { hex: "#151515", alpha: 1 },
        neutral: { hex: "#707070", alpha: 1 },
      },
      shape: { radius: 0.375, radiusRatio: 0.9 },
      density: { mode: "compact", controlHeight: 2.125, densityRatio: 0.84 },
      typography: {
        scaleRatio: 1.14,
        bodyWeight: 400,
        headingWeight: 620,
        trackingBias: -0.004,
      },
      material: {
        elevation: "flat",
        shadowAlpha: 0.035,
        borderContrast: 1.3,
        surfaceContrast: 1.15,
      },
      motion: { level: "subtle", durationBase: 140 },
      vibe: {
        temperature: "neutral",
        expression: "minimal",
        domain: "tooling",
        tone: "precise",
      },
    }),
  },
  {
    id: "verdant",
    name: "森绿",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#047857", alpha: 1 },
        success: { hex: "#15803d", alpha: 1 },
        warning: { hex: "#a16207", alpha: 1 },
        info: { hex: "#0369a1", alpha: 1 },
        infoMatchesPrimary: false,
        danger: { hex: "#be123c", alpha: 1 },
        background: { hex: "#fbfbfb", alpha: 1 },
        foreground: { hex: "#181818", alpha: 1 },
        neutral: { hex: "#767676", alpha: 1 },
      },
      shape: { radius: 0.5, radiusRatio: 0.95 },
      density: { mode: "default", controlHeight: 2.375, densityRatio: 0.99 },
      typography: {
        scaleRatio: 1.18,
        bodyWeight: 400,
        headingWeight: 650,
        trackingBias: 0,
      },
      material: {
        elevation: "soft",
        shadowAlpha: 0.05,
        borderContrast: 1.1,
        surfaceContrast: 1.12,
      },
      motion: { level: "subtle", durationBase: 170 },
      vibe: {
        temperature: "neutral",
        expression: "balanced",
        domain: "saas",
        tone: "calm",
      },
    }),
  },
  {
    id: "terracotta",
    name: "赤陶",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#c2410c", alpha: 1 },
        success: { hex: "#15803d", alpha: 1 },
        warning: { hex: "#a16207", alpha: 1 },
        info: { hex: "#1d4ed8", alpha: 1 },
        infoMatchesPrimary: false,
        danger: { hex: "#be123c", alpha: 1 },
        background: { hex: "#fdfdfd", alpha: 1 },
        foreground: { hex: "#1a1a1a", alpha: 1 },
        neutral: { hex: "#7a7a7a", alpha: 1 },
      },
      shape: { radius: 0.75, radiusRatio: 1.05 },
      density: { mode: "comfortable", controlHeight: 2.625, densityRatio: 1.16 },
      typography: {
        scaleRatio: 1.24,
        bodyWeight: 400,
        headingWeight: 680,
        trackingBias: 0.002,
      },
      material: {
        elevation: "soft",
        shadowAlpha: 0.085,
        borderContrast: 0.9,
        surfaceContrast: 0.98,
      },
      motion: { level: "subtle", durationBase: 190 },
      vibe: {
        temperature: "warm",
        expression: "balanced",
        domain: "editorial",
        tone: "friendly",
      },
    }),
  },
  {
    id: "orchid",
    name: "兰紫",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#7e22ce", alpha: 1 },
        success: { hex: "#15803d", alpha: 1 },
        warning: { hex: "#b45309", alpha: 1 },
        info: { hex: "#2563eb", alpha: 1 },
        infoMatchesPrimary: false,
        danger: { hex: "#dc2626", alpha: 1 },
        background: { hex: "#fafafa", alpha: 1 },
        foreground: { hex: "#191919", alpha: 1 },
        neutral: { hex: "#757575", alpha: 1 },
      },
      shape: { radius: 0.875, radiusRatio: 1.08 },
      density: { mode: "comfortable", controlHeight: 2.625, densityRatio: 1.16 },
      typography: {
        scaleRatio: 1.26,
        bodyWeight: 400,
        headingWeight: 700,
        trackingBias: 0,
      },
      material: {
        elevation: "floating",
        shadowAlpha: 0.1,
        borderContrast: 0.9,
        surfaceContrast: 1.08,
      },
      motion: { level: "expressive", durationBase: 210 },
      vibe: {
        temperature: "cool",
        expression: "expressive",
        domain: "ai",
        tone: "premium",
      },
    }),
  },
]
