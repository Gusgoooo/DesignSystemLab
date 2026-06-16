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

function deriveVisualContract(
  seed: ThemeSeed
): VibeDescriptor["visualContract"] {
  const density = getDensityLabel(seed)
  const tone = toneLabels[seed.vibe.tone]
  const domain = domainLabels[seed.vibe.domain]

  return {
    summary: `面向${domain}产品内页的设计系统,以${tone}语气和${density}建立清晰、可复用的界面层级,而非装饰性表达。`,
    principles: [
      "视觉质量来自组件一致性、语义 token 与稳定的表面层级,而非装饰。",
      `保持${density},在重复组件间维持一致的间距与节奏。`,
      "克制使用品牌色,仅用于关键操作与状态,背景与表面保持中性。",
      "维持从 canvas 到 overlay 的清晰表面层级。",
      "保证可预期的交互状态与可访问的对比度,明暗主题保持一致。",
    ],
    prefer: [
      "shadcn 语义 class 与项目语义 token",
      "一致的组件样式与交互状态",
      "清晰的表面层级(canvas / panel / card / raised / overlay)",
      "可读的密度与排版节奏",
      "克制的品牌色强调",
    ],
    avoid: [
      "装饰性视觉效果(除非用户明确要求)",
      "用于结构性 UI 的 raw Tailwind 调色板 class",
      "硬编码 hex 颜色与任意 OKLCH 值",
      "装饰性渐变与随机阴影",
      "未经批准的玻璃拟态",
      "把 Theme Lab 预览示例直接复制进项目",
    ],
    tokenUsage: [
      "结构色用 bg-background / text-foreground / bg-card / border-border",
      "表面层级用 var(--surface-canvas|panel|raised|overlay)",
      "文本层级用 var(--content-primary|secondary|tertiary)",
      "边框用 var(--border-subtle|default|strong)",
      "阴影用 var(--elevation-card|popover|dialog)",
      "状态色用 var(--status-success|warning|info|danger) 及其 -bg / -fg",
    ],
  }
}

export function deriveVibeDescriptor(seed: ThemeSeed): VibeDescriptor {
  const name = deriveName(seed)
  const keywords = deriveKeywords(seed)
  const avoid = deriveAvoid(seed)

  return {
    name,
    keywords,
    avoid,
    visualLanguage: deriveVisualLanguage(seed),
    visualContract: deriveVisualContract(seed),
  }
}
