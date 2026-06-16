import { defaultThemeSeed } from "./defaults"
import type { ThemeSeed } from "./schema"

export type ThemePreset = {
  id: string
  name: string
  description: string
  seed: ThemeSeed
}

type ThemeSeedOverrides = {
  [Key in keyof ThemeSeed]?: Partial<ThemeSeed[Key]>
}

function createThemeSeed(overrides: ThemeSeedOverrides): ThemeSeed {
  return {
    color: {
      ...defaultThemeSeed.color,
      ...overrides.color,
    },
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
    id: "calm-ai-workspace",
    name: "AI 场景",
    description: "助手、对话与生成式界面",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#6366f1", alpha: 1 },
        neutral: { hex: "#6366f1", alpha: 1 },
      },
      shape: { radius: 1, radiusRatio: 1.25 },
      density: { mode: "comfortable", controlHeight: 2.75, densityRatio: 1.08 },
      typography: { scaleRatio: 1.28, headingWeight: 620 },
      material: {
        elevation: "soft",
        shadowAlpha: 0.1,
        borderContrast: 0.8,
        surfaceContrast: 1,
      },
      motion: { level: "expressive", durationBase: 240 },
      vibe: {
        temperature: "cool",
        expression: "expressive",
        domain: "ai",
        tone: "calm",
      },
    }),
  },
  {
    id: "clean-saas-dashboard",
    name: "SaaS 场景",
    description: "通用仪表盘与控制台",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#0891b2", alpha: 1 },
        neutral: { hex: "#0891b2", alpha: 1 },
      },
      shape: { radius: 0.625, radiusRatio: 1 },
      density: { mode: "default", controlHeight: 2.5, densityRatio: 1 },
      typography: { scaleRatio: 1.2, headingWeight: 650 },
      material: {
        elevation: "soft",
        shadowAlpha: 0.07,
        borderContrast: 1,
        surfaceContrast: 1.05,
      },
      motion: { level: "subtle", durationBase: 180 },
      vibe: {
        temperature: "cool",
        expression: "balanced",
        domain: "saas",
        tone: "calm",
      },
    }),
  },
  {
    id: "dense-data-admin",
    name: "后台场景",
    description: "数据表格与管理后台",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#2563eb", alpha: 1 },
        neutral: { hex: "#2563eb", alpha: 1 },
      },
      shape: { radius: 0.25, radiusRatio: 0.85 },
      density: { mode: "compact", controlHeight: 2, densityRatio: 0.85 },
      typography: { scaleRatio: 1.13, headingWeight: 600, trackingBias: -0.005 },
      material: {
        elevation: "flat",
        shadowAlpha: 0.03,
        borderContrast: 1.4,
        surfaceContrast: 1.2,
      },
      motion: { level: "subtle", durationBase: 130 },
      vibe: {
        temperature: "cool",
        expression: "minimal",
        domain: "saas",
        tone: "precise",
      },
    }),
  },
  {
    id: "finance-terminal",
    name: "金融场景",
    description: "行情、交易与终端",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#1e3a8a", alpha: 1 },
        success: { hex: "#059669", alpha: 1 },
        neutral: { hex: "#1e3a8a", alpha: 1 },
      },
      shape: { radius: 0.125, radiusRatio: 0.8 },
      density: { mode: "compact", controlHeight: 1.9, densityRatio: 0.8 },
      typography: { scaleRatio: 1.1, headingWeight: 640, trackingBias: -0.01 },
      material: {
        elevation: "flat",
        shadowAlpha: 0,
        borderContrast: 1.5,
        surfaceContrast: 1.3,
      },
      motion: { level: "none", durationBase: 120 },
      vibe: {
        temperature: "cool",
        expression: "minimal",
        domain: "finance",
        tone: "precise",
      },
    }),
  },
  {
    id: "editorial-workspace",
    name: "内容场景",
    description: "写作、编辑与排版",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#0d9488", alpha: 1 },
        neutral: { hex: "#0d9488", alpha: 1 },
        background: { hex: "#fffdf9", alpha: 1 },
      },
      shape: { radius: 0.875, radiusRatio: 1.15 },
      density: { mode: "comfortable", controlHeight: 2.875, densityRatio: 1.12 },
      typography: { scaleRatio: 1.32, headingWeight: 700, trackingBias: 0.005 },
      material: {
        elevation: "soft",
        shadowAlpha: 0.09,
        borderContrast: 0.85,
        surfaceContrast: 0.95,
      },
      motion: { level: "subtle", durationBase: 200 },
      vibe: {
        temperature: "warm",
        expression: "balanced",
        domain: "editorial",
        tone: "friendly",
      },
    }),
  },
  {
    id: "support-desk",
    name: "客服场景",
    description: "会话、工单与队列",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#16a34a", alpha: 1 },
        neutral: { hex: "#16a34a", alpha: 1 },
      },
      shape: { radius: 0.75, radiusRatio: 1.05 },
      density: { mode: "default", controlHeight: 2.625, densityRatio: 1.02 },
      typography: { scaleRatio: 1.22, headingWeight: 660 },
      material: {
        elevation: "soft",
        shadowAlpha: 0.06,
        borderContrast: 0.9,
        surfaceContrast: 1.02,
      },
      motion: { level: "subtle", durationBase: 190 },
      vibe: {
        temperature: "neutral",
        expression: "balanced",
        domain: "consumer",
        tone: "friendly",
      },
    }),
  },
  {
    id: "commerce-ops",
    name: "电商场景",
    description: "商品、订单与营销活动",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#d97706", alpha: 1 },
        neutral: { hex: "#d97706", alpha: 1 },
        background: { hex: "#fffdf8", alpha: 1 },
      },
      shape: { radius: 0.5, radiusRatio: 0.95 },
      density: { mode: "default", controlHeight: 2.375, densityRatio: 0.95 },
      typography: { scaleRatio: 1.18, headingWeight: 680 },
      material: {
        elevation: "floating",
        shadowAlpha: 0.13,
        borderContrast: 1.1,
        surfaceContrast: 1.08,
      },
      motion: { level: "expressive", durationBase: 220 },
      vibe: {
        temperature: "warm",
        expression: "expressive",
        domain: "consumer",
        tone: "friendly",
      },
    }),
  },
  {
    id: "marketing-analytics",
    name: "营销场景",
    description: "图表、看板与数据洞察",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#7c3aed", alpha: 1 },
        neutral: { hex: "#7c3aed", alpha: 1 },
      },
      shape: { radius: 0.9375, radiusRatio: 1.1 },
      density: { mode: "comfortable", controlHeight: 2.55, densityRatio: 1.05 },
      typography: { scaleRatio: 1.26, headingWeight: 670, trackingBias: 0.005 },
      material: {
        elevation: "floating",
        shadowAlpha: 0.11,
        borderContrast: 0.95,
        surfaceContrast: 1.12,
      },
      motion: { level: "expressive", durationBase: 230 },
      vibe: {
        temperature: "cool",
        expression: "expressive",
        domain: "consumer",
        tone: "premium",
      },
    }),
  },
  {
    id: "developer-console",
    name: "开发场景",
    description: "开发者工具与控制台",
    seed: createThemeSeed({
      color: {
        primary: { hex: "#475569", alpha: 1 },
        neutral: { hex: "#475569", alpha: 1 },
      },
      shape: { radius: 0.375, radiusRatio: 0.9 },
      density: { mode: "compact", controlHeight: 2.1, densityRatio: 0.9 },
      typography: { scaleRatio: 1.16, headingWeight: 580, trackingBias: -0.005 },
      material: {
        elevation: "flat",
        shadowAlpha: 0.01,
        borderContrast: 1.25,
        surfaceContrast: 0.88,
      },
      motion: { level: "none", durationBase: 150 },
      vibe: {
        temperature: "cool",
        expression: "minimal",
        domain: "tooling",
        tone: "precise",
      },
    }),
  },
]
