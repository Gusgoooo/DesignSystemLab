import type { ThemeSeed, VibeDescriptor } from "./schema"
import { hexAlphaToOklch } from "./algorithms/utils"

function unique(values: string[]): string[] {
  return Array.from(new Set(values))
}

const temperatureLabels: Record<ThemeSeed["vibe"]["temperature"], string> = {
  cool: "冷静",
  neutral: "中性",
  warm: "温暖",
}

const expressionLabels: Record<ThemeSeed["vibe"]["expression"], string> = {
  minimal: "极简",
  balanced: "平衡",
  expressive: "表现型",
}

const domainLabels: Record<ThemeSeed["vibe"]["domain"], string> = {
  saas: "SaaS",
  ai: "AI",
  editorial: "内容",
  finance: "金融",
  consumer: "消费",
  tooling: "工具",
}

const toneLabels: Record<ThemeSeed["vibe"]["tone"], string> = {
  calm: "冷静",
  precise: "精准",
  friendly: "友好",
  premium: "高级",
  experimental: "实验",
}

function getRadiusLabel(radius: number): string {
  if (radius < 0.5) {
    return "低圆角"
  }

  if (radius > 1) {
    return "大圆角"
  }

  return "中等圆角"
}

function getDensityLabel(seed: ThemeSeed): string {
  if (seed.density.mode === "compact") {
    return "紧凑密度"
  }

  if (seed.density.mode === "comfortable") {
    return "舒展密度"
  }

  return "默认密度"
}

function getMotionLabel(seed: ThemeSeed): string {
  if (seed.motion.level === "none") {
    return "无动效"
  }

  if (seed.motion.level === "expressive") {
    return "表现型动效"
  }

  return "轻微动效"
}

function deriveName(seed: ThemeSeed): string {
  if (seed.vibe.domain === "ai") {
    return `${toneLabels[seed.vibe.tone]} AI 工作台`
  }

  if (seed.vibe.tone === "premium" && seed.vibe.expression === "minimal") {
    return "高级极简界面"
  }

  if (seed.vibe.domain === "saas" && seed.vibe.tone === "calm") {
    return "冷静技术型 SaaS"
  }

  return `${expressionLabels[seed.vibe.expression]}${toneLabels[seed.vibe.tone]}${domainLabels[seed.vibe.domain]}`
}

function deriveKeywords(seed: ThemeSeed): string[] {
  const primary = hexAlphaToOklch(seed.color.primary)
  const keywords = [
    toneLabels[seed.vibe.tone],
    expressionLabels[seed.vibe.expression],
    temperatureLabels[seed.vibe.temperature],
    domainLabels[seed.vibe.domain],
    getDensityLabel(seed),
    getRadiusLabel(seed.shape.radius),
    getMotionLabel(seed),
  ]

  if (primary.chroma < 0.08) {
    keywords.push("低噪声")
  }

  if (primary.chroma > 0.18) {
    keywords.push("高表现色彩")
  }

  if (seed.vibe.domain === "finance") {
    keywords.push("数据密集")
  }

  if (seed.vibe.domain === "tooling") {
    keywords.push("技术感")
  }

  return unique(keywords).slice(0, 8)
}

function deriveAvoid(seed: ThemeSeed): string[] {
  const avoid = [
    "避免使用 Tailwind 原始调色板颜色",
    "避免高饱和背景填充",
    "避免装饰性渐变",
    "避免过多描边噪声",
  ]

  if (seed.material.elevation !== "floating") {
    avoid.push("避免厚重阴影")
  }

  if (seed.vibe.expression !== "expressive") {
    avoid.push("避免玩具感装饰形状")
  }

  if (seed.density.mode !== "compact") {
    avoid.push("避免拥挤布局")
  }

  return avoid.slice(0, 8)
}

function deriveVisualLanguage(seed: ThemeSeed): VibeDescriptor["visualLanguage"] {
  return {
    surface:
      seed.material.elevation === "flat"
        ? "平面表面以清晰描边建立层级，尽量减少对阴影的依赖。"
        : "通过 canvas、panel、raised 和 overlay 建立清晰的表面层级。",
    shape: `${getRadiusLabel(seed.shape.radius)}，控件、卡片和面板使用 ${seed.shape.radiusRatio} 的圆角比例。`,
    color:
      seed.vibe.temperature === "warm"
        ? "中性色偏暖，动作与状态颜色通过语义 token 表达。"
        : "冷静到中性的色彩系统，以品牌色强调关键动作，并保持背景克制。",
    density: `${getDensityLabel(seed)}，控件高度约 ${seed.density.controlHeight}rem。`,
    motion: `${getMotionLabel(seed)}，使用确定性的 duration token。`,
    typography: `Sans 字体栈 ${seed.typography.sans}；标题字重 ${seed.typography.headingWeight}，正文字重 ${seed.typography.bodyWeight}。`,
  }
}

function derivePrinciples(seed: ThemeSeed): string[] {
  return [
    "优先使用 shadcn 语义 token，再添加项目级语义工具类。",
    "保持从 canvas 到 overlay 的清晰表面层级。",
    `保持${getDensityLabel(seed)}，避免重复组件中的间距漂移。`,
    `在控件和容器中一致使用${getRadiusLabel(seed.shape.radius)}。`,
    `保持${getMotionLabel(seed)}，让动效有明确目的。`,
  ]
}

export function deriveVibeDescriptor(seed: ThemeSeed): VibeDescriptor {
  const name = deriveName(seed)
  const keywords = deriveKeywords(seed)
  const avoid = deriveAvoid(seed)
  const radius = getRadiusLabel(seed.shape.radius)
  const density = getDensityLabel(seed)
  const motion = getMotionLabel(seed)

  return {
    name,
    keywords,
    avoid,
    visualLanguage: deriveVisualLanguage(seed),
    principles: derivePrinciples(seed),
    aiPrompt: `请生成具有「${keywords.join(
      "、"
    )}」气质的 UI。优先使用 shadcn 语义 token，保持清晰表面层级，使用${density}、${radius}、${motion}和明确的信息层级。除非明确要求，否则避免 Tailwind 原始调色板颜色、装饰性渐变、高饱和背景填充和厚重阴影。`,
  }
}
