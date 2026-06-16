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
    id: "calm-saas",
    name: "冷静 SaaS",
    description:
      "冷色、平衡的 SaaS 主题：中等圆角、适度品牌色、默认密度和柔和层级。",
    seed: createThemeSeed({
      color: {
        primary: {
          hex: "#6366f1",
          alpha: 1,
        },
      },
      shape: {
        radius: 0.75,
        radiusRatio: 1,
      },
      density: {
        mode: "default",
        densityRatio: 1,
      },
      material: {
        elevation: "soft",
      },
      vibe: {
        temperature: "cool",
        expression: "balanced",
        domain: "saas",
        tone: "calm",
      },
    }),
  },
  {
    id: "technical-tooling",
    name: "技术工具",
    description:
      "偏冷的工具型主题：低圆角、紧凑密度、低彩度、平面材质和精准语气。",
    seed: createThemeSeed({
      color: {
        primary: {
          hex: "#475569",
          alpha: 1,
        },
        neutral: {
          hex: "#737373",
          alpha: 1,
        },
      },
      shape: {
        radius: 0.375,
        radiusRatio: 0.9,
      },
      density: {
        mode: "compact",
        controlHeight: 2.25,
        densityRatio: 0.94,
      },
      material: {
        elevation: "flat",
        shadowAlpha: 0.04,
        borderContrast: 1.15,
        surfaceContrast: 0.85,
      },
      motion: {
        durationBase: 150,
      },
      vibe: {
        temperature: "cool",
        expression: "minimal",
        domain: "tooling",
        tone: "precise",
      },
    }),
  },
  {
    id: "premium-minimal",
    name: "高级极简",
    description:
      "克制的高级主题：低彩度、舒展密度、柔和层级和略大的圆角。",
    seed: createThemeSeed({
      color: {
        primary: {
          hex: "#18181b",
          alpha: 1,
        },
        neutral: {
          hex: "#737373",
          alpha: 1,
        },
      },
      shape: {
        radius: 0.875,
        radiusRatio: 1.1,
      },
      density: {
        mode: "comfortable",
        controlHeight: 2.75,
        densityRatio: 1.04,
      },
      material: {
        elevation: "soft",
        shadowAlpha: 0.07,
      },
      vibe: {
        temperature: "neutral",
        expression: "minimal",
        tone: "premium",
      },
    }),
  },
  {
    id: "ai-workspace",
    name: "AI 工作台",
    description:
      "偏冷的 AI 工作台主题：更高品牌彩度、中大圆角和更具表现力的动效。",
    seed: createThemeSeed({
      color: {
        primary: {
          hex: "#7c3aed",
          alpha: 1,
        },
      },
      shape: {
        radius: 0.95,
        radiusRatio: 1.15,
      },
      material: {
        elevation: "soft",
        glassOpacity: 0.08,
      },
      motion: {
        level: "expressive",
        durationBase: 220,
      },
      vibe: {
        temperature: "cool",
        expression: "expressive",
        domain: "ai",
        tone: "experimental",
      },
    }),
  },
  {
    id: "editorial-warm",
    name: "温暖内容",
    description:
      "温暖的内容型主题：舒展密度、柔和到浮层的表面，以及友好的字体节奏。",
    seed: createThemeSeed({
      color: {
        primary: {
          hex: "#b45309",
          alpha: 1,
        },
        warning: {
          hex: "#ca8a04",
          alpha: 1,
        },
        background: {
          hex: "#fffefc",
          alpha: 1,
        },
        neutral: {
          hex: "#737373",
          alpha: 1,
        },
      },
      shape: {
        radius: 0.9,
        radiusRatio: 1.1,
      },
      density: {
        mode: "comfortable",
        controlHeight: 2.75,
        densityRatio: 1.05,
      },
      typography: {
        scaleRatio: 1.24,
        headingWeight: 700,
      },
      material: {
        elevation: "floating",
        shadowAlpha: 0.1,
        surfaceContrast: 1.1,
        noiseOpacity: 0.03,
      },
      vibe: {
        temperature: "warm",
        expression: "balanced",
        domain: "editorial",
        tone: "friendly",
      },
    }),
  },
  {
    id: "finance-dense",
    name: "金融密集",
    description:
      "冷静密集的金融主题：低圆角、低彩度、紧凑控件和清晰材质对比。",
    seed: createThemeSeed({
      color: {
        primary: {
          hex: "#1e3a8a",
          alpha: 1,
        },
        success: {
          hex: "#059669",
          alpha: 1,
        },
        neutral: {
          hex: "#737373",
          alpha: 1,
        },
      },
      shape: {
        radius: 0.25,
        radiusRatio: 0.85,
      },
      density: {
        mode: "compact",
        controlHeight: 2.25,
        densityRatio: 0.92,
      },
      material: {
        elevation: "soft",
        shadowAlpha: 0.05,
        borderContrast: 1.2,
        surfaceContrast: 0.9,
      },
      motion: {
        durationBase: 140,
      },
      vibe: {
        temperature: "cool",
        expression: "minimal",
        domain: "finance",
        tone: "precise",
      },
    }),
  },
]
