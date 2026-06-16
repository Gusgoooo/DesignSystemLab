import type { ReactNode } from "react"
import type { ThemeOutput, ThemeSeed } from "../../../lib/theme/schema"
import { clamp, hexAlphaToOklch } from "../../../lib/theme/algorithms/utils"
import { cn } from "../../../lib/utils"

type AestheticPreviewProps = {
  seed: ThemeSeed
  theme: ThemeOutput
}

type AestheticSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

type VibeChipProps = {
  children: ReactNode
  tone?: "default" | "primary" | "muted" | "success" | "warning" | "danger"
}

type MoodCardProps = {
  title: string
  eyebrow?: string
  description: string
  variant?: "workspace" | "premium" | "editorial" | "technical" | "experimental" | "calm"
}

type MaterialTileProps = {
  title: string
  description: string
  className?: string
  children?: ReactNode
}

type AxisMeterProps = {
  label: string
  value: number
  leftLabel: string
  rightLabel: string
}

type CodePreviewProps = {
  title?: string
  code: string
}

const seedValueLabels: Record<string, string> = {
  cool: "冷静",
  neutral: "中性",
  warm: "温暖",
  minimal: "极简",
  balanced: "平衡",
  expressive: "表现型",
  saas: "SaaS",
  ai: "AI",
  editorial: "内容",
  finance: "金融",
  consumer: "消费",
  tooling: "工具",
  calm: "冷静",
  precise: "精准",
  friendly: "友好",
  premium: "高级",
  experimental: "实验",
}

function formatSeedValue(value: string): string {
  return seedValueLabels[value] ?? value
}

function AestheticSection(props: AestheticSectionProps) {
  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-[length:var(--text-title)] font-[var(--font-weight-heading)] tracking-[var(--tracking-heading)]">
          {props.title}
        </h3>
        {props.description ? (
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            {props.description}
          </p>
        ) : null}
      </div>
      {props.children}
    </section>
  )
}

function VibeChip(props: VibeChipProps) {
  const tone = props.tone ?? "default"
  const toneClasses = {
    default: "border border-border bg-card text-card-foreground",
    primary: "bg-primary text-primary-foreground",
    muted: "bg-muted text-muted-foreground",
    success: "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
    warning: "bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]",
    danger: "bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)]",
  } satisfies Record<NonNullable<VibeChipProps["tone"]>, string>

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {props.children}
    </span>
  )
}

function MaterialTile(props: MaterialTileProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[var(--radius-card)] border border-border p-[var(--panel-padding)]",
        props.className ?? "bg-card text-card-foreground"
      )}
    >
      <h4 className="font-[var(--font-weight-heading)]">{props.title}</h4>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {props.description}
      </p>
      {props.children ? <div className="mt-4">{props.children}</div> : null}
    </div>
  )
}

function AxisMeter(props: AxisMeterProps) {
  const value = clamp(props.value, 0, 100)

  return (
    <div className="space-y-2 rounded-[var(--radius-card)] border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium">{props.label}</span>
        <span className="font-mono text-xs text-muted-foreground">
          {Math.round(value)}
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-muted">
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${value}%` }}
        />
        <span
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-border bg-background"
          style={{ left: `calc(${value}% - 0.5rem)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{props.leftLabel}</span>
        <span>{props.rightLabel}</span>
      </div>
    </div>
  )
}

function CodePreview(props: CodePreviewProps) {
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-[var(--surface-panel)] p-[var(--panel-padding)]">
      {props.title ? (
        <p className="mb-3 text-sm font-medium">{props.title}</p>
      ) : null}
      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-foreground [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <code>{props.code}</code>
      </pre>
    </div>
  )
}

function MiniButton(props: {
  children: ReactNode
  variant?: "primary" | "secondary" | "outline"
}) {
  const variant = props.variant ?? "primary"
  const classes = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border bg-background text-foreground",
  } satisfies Record<NonNullable<Parameters<typeof MiniButton>[0]["variant"]>, string>

  return (
    <button
      type="button"
      className={cn(
        "h-[var(--control-height-md)] rounded-[var(--radius-control)] px-4 text-sm font-medium ring-ring focus-visible:outline-none focus-visible:ring-2",
        classes[variant]
      )}
    >
      {props.children}
    </button>
  )
}

function PreviewHeader() {
  return (
    <header className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">美学</p>
        <h2 className="text-[length:var(--text-display)] font-[var(--font-weight-heading)] tracking-[var(--tracking-heading)]">
          风格与视觉语言
        </h2>
        <p className="max-w-3xl text-[length:var(--text-body)] leading-7 text-muted-foreground">
          从当前 seed token 推导风格、材质、字体、构图和 AI 生成语言。
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "风格感知",
          "AI 就绪",
          "材质",
          "字体",
          "构图",
          "可提示",
        ].map((chip) => (
          <VibeChip key={chip} tone="muted">
            {chip}
          </VibeChip>
        ))}
      </div>
    </header>
  )
}

function VibeHero(props: AestheticPreviewProps) {
  const { seed, theme } = props

  return (
    <section className="overflow-hidden rounded-[var(--radius-panel)] border border-border bg-[linear-gradient(135deg,var(--surface-raised),var(--surface-panel))] p-[var(--panel-padding)] [box-shadow:var(--elevation-card)]">
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="min-w-0 space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            生成风格
          </p>
          <h3 className="text-[length:var(--text-display)] font-[var(--font-weight-heading)] tracking-[var(--tracking-heading)]">
            {theme.vibe.name}
          </h3>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
            面向 {formatSeedValue(seed.vibe.domain)} 产品的
            {formatSeedValue(seed.vibe.temperature)}、
            {formatSeedValue(seed.vibe.expression)}主题，整体语气为
            {formatSeedValue(seed.vibe.tone)}。
          </p>
          <div className="flex flex-wrap gap-2">
            {theme.vibe.keywords.map((keyword) => (
              <VibeChip key={keyword} tone="primary">
                {keyword}
              </VibeChip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <MiniButton>使用这个风格</MiniButton>
            <MiniButton variant="outline">复制 prompt</MiniButton>
          </div>
        </div>
        <div className="grid gap-3 rounded-[var(--radius-card)] border border-border bg-card p-[var(--panel-padding)] text-card-foreground">
          {[
            ["场景", formatSeedValue(seed.vibe.domain)],
            ["语气", formatSeedValue(seed.vibe.tone)],
            ["表达", formatSeedValue(seed.vibe.expression)],
            ["温度", formatSeedValue(seed.vibe.temperature)],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 border-border border-b pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function getNeutralTemperatureValue(hue: number): number {
  const normalized = ((hue % 360) + 360) % 360

  if (normalized >= 20 && normalized <= 80) {
    return 85
  }

  if (normalized >= 180 && normalized <= 280) {
    return 20
  }

  return 50
}

function getMaterialDepth(seed: ThemeSeed): number {
  const elevationBase = {
    flat: 12,
    soft: 48,
    floating: 76,
  } satisfies Record<ThemeSeed["material"]["elevation"], number>

  return clamp(elevationBase[seed.material.elevation] + seed.material.shadowAlpha * 100, 0, 100)
}

function getMotionEnergy(seed: ThemeSeed): number {
  const levelBase = {
    none: 0,
    subtle: 42,
    expressive: 76,
  } satisfies Record<ThemeSeed["motion"]["level"], number>

  return clamp(levelBase[seed.motion.level] + seed.motion.durationBase / 16, 0, 100)
}

function AestheticAxes(props: { seed: ThemeSeed; theme: ThemeOutput }) {
  const { seed, theme } = props
  const densityBase = seed.density.mode === "compact" ? 22 : seed.density.mode === "comfortable" ? 78 : 50
  const primary = hexAlphaToOklch(seed.color.primary)
  const neutral = hexAlphaToOklch(seed.color.neutral)

  return (
    <AestheticSection
      title="风格关键词与美学坐标"
      description="把 seed 值转译为设计师和 AI 编码工具都能理解的感知维度。"
    >
      <div className="flex flex-wrap gap-2">
        {theme.vibe.keywords.map((keyword) => (
          <VibeChip key={keyword}>{keyword}</VibeChip>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <AxisMeter
          label="色彩表现"
          value={(primary.chroma / 0.24) * 100}
          leftLabel="克制"
          rightLabel="鲜明"
        />
        <AxisMeter
          label="中性色温"
          value={getNeutralTemperatureValue(neutral.hue)}
          leftLabel="冷"
          rightLabel="暖"
        />
        <AxisMeter
          label="形状柔和度"
          value={(seed.shape.radius / 1.5) * 100}
          leftLabel="锐利"
          rightLabel="柔和"
        />
        <AxisMeter
          label="界面密度"
          value={clamp(densityBase + (seed.density.densityRatio - 1) * 45, 0, 100)}
          leftLabel="紧凑"
          rightLabel="舒展"
        />
        <AxisMeter
          label="材质深度"
          value={getMaterialDepth(seed)}
          leftLabel="平面"
          rightLabel="浮层"
        />
        <AxisMeter
          label="动效能量"
          value={getMotionEnergy(seed)}
          leftLabel="静止"
          rightLabel="表现型"
        />
      </div>
    </AestheticSection>
  )
}

function MoodCard(props: MoodCardProps) {
  const variant = props.variant ?? "workspace"
  const accentClasses = {
    workspace: "bg-[var(--surface-panel)]",
    premium: "bg-card [box-shadow:var(--elevation-popover)]",
    editorial: "bg-[linear-gradient(135deg,var(--surface-raised),var(--surface-panel))]",
    technical: "bg-background",
    experimental: "bg-[linear-gradient(135deg,var(--chart-1),var(--chart-3))]",
    calm: "bg-[var(--status-info-bg)] text-[var(--status-info-fg)]",
  } satisfies Record<NonNullable<MoodCardProps["variant"]>, string>

  return (
    <div className="min-w-0 rounded-[var(--radius-card)] border border-border bg-card p-[var(--panel-padding)] text-card-foreground [box-shadow:var(--elevation-card)]">
      {props.eyebrow ? (
        <p className="mb-2 text-xs font-medium uppercase tracking-[var(--tracking-body)] text-muted-foreground">
          {props.eyebrow}
        </p>
      ) : null}
      <h4 className="font-[var(--font-weight-heading)]">{props.title}</h4>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {props.description}
      </p>
      <div
        className={cn(
          "mt-4 rounded-[var(--radius-card)] border border-border p-3",
          accentClasses[variant]
        )}
      >
        <div className="mb-3 h-2 w-16 rounded-full bg-primary" />
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-muted" />
          <div className="h-2 w-2/3 rounded-full bg-muted" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <VibeChip tone={variant === "experimental" ? "primary" : "muted"}>
            token 驱动
          </VibeChip>
          <VibeChip tone="success">就绪</VibeChip>
        </div>
      </div>
    </div>
  )
}

function MoodCards() {
  const moods = [
    [
      "冷静工作台",
      "专注",
      "为持续注意力优化的安静工作区。",
      "calm",
    ],
    [
      "技术控制台",
      "运营",
      "面向复杂运营流程的精确控制界面。",
      "technical",
    ],
    [
      "高级面板",
      "深度",
      "克制且带有轻微层级的高级表面。",
      "premium",
    ],
    [
      "内容表面",
      "叙事",
      "用于解释产品价值的叙事型布局。",
      "editorial",
    ],
    [
      "AI 助手",
      "对话",
      "层级清晰、状态柔和的对话表面。",
      "workspace",
    ],
    [
      "实验强调",
      "表达",
      "不脱离语义 token 系统的受控表达。",
      "experimental",
    ],
  ] as const

  return (
    <AestheticSection
      title="情绪卡片"
      description="用同一套当前主题 token 展示不同表达。"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {moods.map(([title, eyebrow, description, variant]) => (
          <MoodCard
            key={title}
            title={title}
            eyebrow={eyebrow}
            description={description}
            variant={variant}
          />
        ))}
      </div>
    </AestheticSection>
  )
}

function MaterialSamples(props: { seed: ThemeSeed }) {
  return (
    <AestheticSection
      title="材质样张"
      description="由语义 token 生成的表面、层级、描边、反色和状态材质。"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MaterialTile title="画布" description="页面级基础表面。" className="bg-background text-foreground" />
        <MaterialTile title="面板" description="成组内容区域。" className="bg-[var(--surface-panel)] text-foreground" />
        <MaterialTile title="抬升" description="卡片级深度。" className="bg-card text-card-foreground [box-shadow:var(--elevation-card)]" />
        <MaterialTile title="浮层" description="悬浮表面。" className="bg-popover text-popover-foreground [box-shadow:var(--elevation-popover)]" />
        <MaterialTile title="弹窗" description="模态强调层。" className="bg-card text-card-foreground [box-shadow:var(--elevation-dialog)]" />
        <MaterialTile title="反色" description="高对比反转表面。" className="bg-[var(--surface-inverse)] text-[var(--content-inverse)]" />
        <MaterialTile title="描边语言" description="轻描边、默认描边和强描边。">
          <div className="grid gap-2">
            <div className="rounded-[var(--radius-control)] border border-[var(--border-subtle)] p-2 text-sm">轻描边</div>
            <div className="rounded-[var(--radius-control)] border border-border p-2 text-sm">默认描边</div>
            <div className="rounded-[var(--radius-control)] border border-[var(--border-strong)] p-2 text-sm">强描边</div>
          </div>
        </MaterialTile>
        <MaterialTile title="状态材质" description="柔和反馈表面。">
          <div className="grid gap-2">
            <div className="rounded-[var(--radius-control)] bg-[var(--status-success-bg)] p-2 text-sm text-[var(--status-success-fg)]">成功</div>
            <div className="rounded-[var(--radius-control)] bg-[var(--status-warning-bg)] p-2 text-sm text-[var(--status-warning-fg)]">警告</div>
            <div className="rounded-[var(--radius-control)] bg-[var(--status-info-bg)] p-2 text-sm text-[var(--status-info-fg)]">信息</div>
            <div className="rounded-[var(--radius-control)] bg-[var(--status-danger-bg)] p-2 text-sm text-[var(--status-danger-fg)]">危险</div>
          </div>
        </MaterialTile>
        <MaterialTile
          title="未来材质种子"
          description={`玻璃透明度 ${props.seed.material.glassOpacity} 和噪声透明度 ${props.seed.material.noiseOpacity} 预留给后续材质扩展。`}
          className="bg-[var(--surface-panel)] text-foreground"
        />
      </div>
    </AestheticSection>
  )
}

function TypographySamples() {
  return (
    <AestheticSection
      title="字体样张"
      description="在产品语言中展示生成的字号比例、字重、字距和等宽字体栈。"
    >
      <div className="rounded-[var(--radius-panel)] border border-border bg-card p-[var(--panel-padding)] text-card-foreground">
        <p
          className="font-[var(--font-weight-heading)]"
          style={{
            fontSize: "var(--text-display)",
            fontWeight: "var(--font-weight-heading)",
            letterSpacing: "var(--tracking-heading)",
          }}
        >
          有明确意图的设计系统
        </p>
        <p
          className="mt-4"
          style={{
            fontSize: "var(--text-title)",
            fontWeight: "var(--font-weight-heading)",
          }}
        >
          面向产品团队的主题智能
        </p>
        <p className="mt-4 max-w-3xl leading-7" style={{ fontSize: "var(--text-body)" }}>
          Seed token 定义方向，算法生成梯度，语义 token 在组件之间保留真实意图。
        </p>
        <p
          className="mt-4 text-muted-foreground"
          style={{ fontSize: "var(--text-caption)" }}
        >
          由字体 seed 值生成
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-4xl font-[var(--font-weight-heading)]">98.4%</p>
            <p className="text-sm text-muted-foreground">语义覆盖率</p>
          </div>
          <CodePreview
            code={`<Button className="bg-primary text-primary-foreground">
  生成主题
</Button>`}
          />
        </div>
      </div>
    </AestheticSection>
  )
}

function CompositionSamples() {
  return (
    <AestheticSection
      title="构图样张"
      description="用紧凑布局验证视觉语言是否能覆盖产品、营销、命令面板和 AI 场景。"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <MaterialTile title="首屏构图" description="大信息、短正文和 CTA 层级。">
          <h4 className="text-[length:var(--text-title)] font-[var(--font-weight-heading)]">构建更好的界面</h4>
          <p className="mt-2 text-sm text-muted-foreground">把少量 seed 选择转化为可用于生产的主题方向。</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <MiniButton>生成主题</MiniButton>
            <MiniButton variant="outline">查看预览</MiniButton>
          </div>
        </MaterialTile>
        <MaterialTile title="Bento 网格" description="带有克制强调的表面层级。">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="rounded-[var(--radius-card)] bg-[var(--surface-panel)] p-3">用量</div>
            <div className="rounded-[var(--radius-card)] bg-[var(--status-info-bg)] p-3 text-[var(--status-info-fg)]">洞察</div>
            <div className="rounded-[var(--radius-card)] bg-card p-3 md:col-span-2 [box-shadow:var(--elevation-card)]">语义映射就绪</div>
          </div>
        </MaterialTile>
        <MaterialTile title="命令表面" description="带选中行的命令面板式界面。">
          <div className="rounded-[var(--radius-card)] border border-border bg-popover p-2 [box-shadow:var(--elevation-popover)]">
            {["创建项目", "导出主题", "邀请成员"].map((item, index) => (
              <div key={item} className={cn("flex items-center justify-between rounded-[var(--radius-control)] px-3 py-2 text-sm", index === 0 && "bg-accent text-accent-foreground")}>
                <span>{item}</span>
                <span className="rounded-[var(--radius-control)] border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">K</span>
              </div>
            ))}
          </div>
        </MaterialTile>
        <MaterialTile title="浮层面板" description="带迷你表单的 overlay 深度。">
          <div className="rounded-[var(--radius-card)] border border-border bg-popover p-3 [box-shadow:var(--elevation-dialog)]">
            <p className="font-medium">发布预设</p>
            <div className="mt-3 h-[var(--control-height-md)] rounded-[var(--radius-control)] border border-border bg-background px-3 py-2 text-sm text-muted-foreground">主题名称</div>
            <div className="mt-3"><MiniButton>发布</MiniButton></div>
          </div>
        </MaterialTile>
        <MaterialTile title="密集工作区切片" description="紧凑节奏、标签和行操作。">
          {["API key 已轮换", "需要复核", "用量已导出"].map((item) => (
            <div key={item} className="flex h-[var(--list-row-height)] items-center justify-between gap-3 border-border border-b last:border-b-0">
              <span className="truncate text-sm">{item}</span>
              <VibeChip tone="muted">打开</VibeChip>
            </div>
          ))}
        </MaterialTile>
        <MaterialTile title="AI 消息堆栈" description="区分助手、用户和工具卡片。">
          <div className="space-y-2">
            <div className="rounded-[var(--radius-card)] bg-[var(--surface-panel)] p-3 text-sm">助手：我发现留存有所提升。</div>
            <div className="rounded-[var(--radius-card)] bg-[var(--status-info-bg)] p-3 text-sm text-[var(--status-info-fg)]">工具：正在分析队列数据</div>
            <div className="ml-auto rounded-[var(--radius-card)] bg-primary p-3 text-sm text-primary-foreground">整理成摘要。</div>
          </div>
        </MaterialTile>
      </div>
    </AestheticSection>
  )
}

function VisualLanguageReport(props: { theme: ThemeOutput }) {
  const visualLanguage = props.theme.vibe.visualLanguage
  const fields = [
    ["表面", visualLanguage.surface],
    ["形状", visualLanguage.shape],
    ["色彩", visualLanguage.color],
    ["密度", visualLanguage.density],
    ["动效", visualLanguage.motion],
    ["字体", visualLanguage.typography],
  ] as const

  return (
    <AestheticSection
      title="视觉语言报告"
      description="由当前风格描述器生成的设计方向摘要。"
    >
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-3 md:grid-cols-2">
          {fields.map(([label, description]) => (
            <MaterialTile key={label} title={label} description={description} />
          ))}
        </div>
        <MaterialTile title="原则" description="保持美学一致性的规则。">
          <ol className="space-y-2 text-sm text-muted-foreground">
            {props.theme.vibe.principles.map((principle, index) => (
              <li key={principle} className="flex gap-2">
                <span className="font-mono text-xs text-foreground">{index + 1}</span>
                <span>{principle}</span>
              </li>
            ))}
          </ol>
        </MaterialTile>
      </div>
    </AestheticSection>
  )
}

function AIGenerationGuidance(props: { theme: ThemeOutput }) {
  const preferred = [
    "bg-background",
    "text-foreground",
    "bg-card",
    "text-card-foreground",
    "bg-primary",
    "text-primary-foreground",
    "text-muted-foreground",
    "border-border",
    "ring-ring",
  ]
  const projectUtilities = [
    "bg-[var(--surface-panel)]",
    "bg-[var(--surface-raised)]",
    "text-[var(--content-secondary)]",
    "bg-[var(--status-success-bg)]",
    "text-[var(--status-success-fg)]",
  ]

  return (
    <AestheticSection
      title="AI 生成指导"
      description="面向 AI 编码工具的 prompt 与 class 指导。"
    >
      <CodePreview title="AI Prompt" code={props.theme.vibe.aiPrompt} />
      <div className="grid gap-4 xl:grid-cols-2">
        <MaterialTile title="优先使用的 class" description="优先使用这些 shadcn 语义 class。">
          <div className="flex flex-wrap gap-2">
            {preferred.map((item) => (
              <VibeChip key={item} tone="muted">{item}</VibeChip>
            ))}
          </div>
        </MaterialTile>
        <MaterialTile title="项目语义工具类" description="项目特定概念使用变量驱动的工具类。">
          <div className="flex flex-wrap gap-2">
            {projectUtilities.map((item) => (
              <VibeChip key={item}>{item}</VibeChip>
            ))}
          </div>
        </MaterialTile>
      </div>
      <MaterialTile title="避免事项" description="由风格描述器生成的约束。">
        <div className="flex flex-wrap gap-2">
          {props.theme.vibe.avoid.map((item) => (
            <VibeChip key={item} tone="warning">{item}</VibeChip>
          ))}
        </div>
      </MaterialTile>
    </AestheticSection>
  )
}

function DoDontExamples() {
  return (
    <AestheticSection
      title="推荐 / 避免示例"
      description="让生成 UI 保持在主题系统内的实践指导。"
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <MaterialTile title="推荐" description="保留语义系统。">
          <ul className="mb-4 space-y-2 text-sm text-muted-foreground">
            <li>为可主题化 UI 使用 shadcn 语义 token。</li>
            <li>优先选择低噪声表面和清晰层级。</li>
            <li>把主色留给关键动作。</li>
            <li>反馈状态使用柔和状态 token。</li>
            <li>使用密度变量控制节奏。</li>
          </ul>
          <CodePreview
            code={`<Card className="bg-card text-card-foreground border-border">
  <Button className="bg-primary text-primary-foreground" />
</Card>`}
          />
        </MaterialTile>
        <MaterialTile title="避免" description="不要绕过 token 链路。" className="bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]">
          <ul className="mb-4 space-y-2 text-sm">
            <li>不要使用 Tailwind 原始调色板颜色。</li>
            <li>不要在组件中硬编码品牌色。</li>
            <li>不要在组件里添加一次性的主题变量。</li>
            <li>除非风格明确需要，不要使用装饰性渐变。</li>
            <li>不要用组件专属样式绕过语义 token。</li>
          </ul>
          <CodePreview code={`<div className="raw-palette-class" />`} />
        </MaterialTile>
      </div>
    </AestheticSection>
  )
}

function GeneratedVibeJson(props: { theme: ThemeOutput }) {
  return (
    <AestheticSection
      title="生成的 vibe JSON"
      description="用于导出和 AI 交付的紧凑描述器。"
    >
      <CodePreview code={JSON.stringify(props.theme.vibe, null, 2)} />
    </AestheticSection>
  )
}

export function AestheticPreview(props: AestheticPreviewProps) {
  return (
    <div className="space-y-8 p-[var(--page-padding)]">
      <PreviewHeader />
      <VibeHero seed={props.seed} theme={props.theme} />
      <AestheticAxes seed={props.seed} theme={props.theme} />
      <MoodCards />
      <MaterialSamples seed={props.seed} />
      <TypographySamples />
      <CompositionSamples />
      <VisualLanguageReport theme={props.theme} />
      <AIGenerationGuidance theme={props.theme} />
      <DoDontExamples />
      <GeneratedVibeJson theme={props.theme} />
    </div>
  )
}
