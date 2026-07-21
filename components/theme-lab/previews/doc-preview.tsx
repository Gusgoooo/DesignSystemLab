"use client"

import { memo, useState, type ReactNode } from "react"
import { cn } from "../../../lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"

function ChapterTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[length:var(--text-display)] font-[var(--font-weight-heading)] leading-tight tracking-[var(--tracking-heading)] text-foreground">
      {children}
    </h1>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="pt-2 text-lg font-semibold leading-7 tracking-normal text-foreground">
      {children}
    </h2>
  )
}

function Lead({ children }: { children: ReactNode }) {
  return <p className="text-base leading-7 text-muted-foreground">{children}</p>
}

function P({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-7 text-foreground">{children}</p>
}

function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[var(--radius-control)] bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-muted-foreground">
      {children}
    </code>
  )
}

type ComparisonTableProps = {
  columns: readonly string[]
  rows: readonly string[][]
}

function ComparisonTable({ columns, rows }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card text-card-foreground">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead
                key={col}
                className={
                  index === 0
                    ? "whitespace-normal text-foreground"
                    : "whitespace-normal"
                }
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row[0]}>
              {row.map((cell, index) => (
                <TableCell
                  key={`${row[0]}-${index}`}
                  className={cn(
                    "whitespace-normal align-top text-[13px]",
                    index < 2
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const steps: Array<{ label: string; body: string }> = [
  {
    label: "定义。",
    body: "从预设开始，或直接调整颜色、形状、密度、字体、材质、动效和 Vibe，先把产品的视觉方向固化成 seed。",
  },
  {
    label: "验证。",
    body: "在组件和模块预览里检查品牌色、中性色、表面和状态差异；在 Spec 视图里核对 Blocks 与 Token 语义。",
  },
  {
    label: "接入。",
    body: "选择 shadcn 或 Ant Design，安装 Token、theme-lab.json 和一个 AI instruction block，不修改现有页面。",
  },
  {
    label: "创建或映射。",
    body: "新 UI 优先读取匹配的 Block；旧 UI 只有用户确认后，才按组件职责和状态做语义 Token 映射。",
  },
]

const shadcnColumns = ["维度", "shadcn 主要解决", "美中不足", "我的解法"]

const shadcnRows: string[][] = [
  [
    "组件来源",
    "高质量组件源码和 registry blocks",
    "registry 是材料库，不是长期设计治理系统",
    "把组件使用规则写成 spec，让 AI 知道何时用、怎么用、不能怎么用",
  ],
  [
    "视觉一致性",
    "CSS variables 和主题配置",
    "能统一基础样式，但不负责多轮 AI 修改后的漂移",
    "seed 到 token 确定性生成，形成可复现、可审计的视觉契约",
  ],
  [
    "AI 决策",
    "AI 可以引用 shadcn 组件",
    "仍可能机械套组件、复制 demo、把 Button 当 Tabs",
    "rule router 先识别元素，再加载匹配 spec 约束组件决策",
  ],
  [
    "长期项目",
    "适合作为实现材料",
    "不直接管理跨页面、跨时间的设计一致性",
    "契约写入 AGENTS.md / CLAUDE.md，让规则进入长期协作上下文",
  ],
  [
    "未来边界",
    "registry 列出已有组件",
    "AI 容易被限制在已有组件清单里做魔改",
    "只限定优解标准，不强制固定组件形态",
  ],
]

const antdColumns = ["维度", "Ant Design 能力", "平台接入方式", "结果"]

const antdRows: string[][] = [
  [
    "系统形态",
    "成熟企业级组件库和设计语言",
    "保留 Ant Design 作为完整组件体系，Tailwind 只处理布局与业务 UI",
    "不引入其它组件或 Primitive 系统",
  ],
  [
    "主题能力",
    "Seed、Map、Alias、Component Token 与明暗算法",
    "导出 ConfigProvider ThemeConfig，并启用 Ant CSS Variables",
    "所有 Ant 组件由同一套 Seed 驱动",
  ],
  [
    "Tailwind",
    "高效布局与自定义业务样式",
    "@theme inline 直接引用 --ant-* 变量",
    "bg-page、rounded-card 等语义工具类不会形成第二套主题",
  ],
  [
    "运行时上下文",
    "ConfigProvider、App、组件 Hooks",
    "保留 locale、direction、componentSize 与已有覆盖",
    "message、Modal、notification 可正确获得主题上下文",
  ],
  [
    "导出隔离",
    "Ant Design 组件体系",
    "接入包只安装 ThemeConfig 和长期指导",
    "不夹带 shadcn、Primitive 迁移或页面改造流程",
  ],
]

const solutionColumns = ["层", "限制什么漂移", "主要产物", "AI 如何执行"]

const solutionRows: string[][] = [
  [
    "Registry / Block Context",
    "结构与实现漂移",
    "raw Block rules、Registry Blocks、slot mapping",
    "创建页面先读最接近的 Block，再把真实业务逐项映射到槽位",
  ],
  [
    "Token Contract",
    "视觉漂移",
    "CSS 变量、semantic token、status token、chart token、shadcn adapter",
    "先安装再创建；旧 UI 未经确认不自动映射",
  ],
  [
    "Component Spec",
    "组件使用漂移",
    "cards、tables、forms、tabs、overlays、badges、metrics 等规则",
    "创建或确认映射时，按元素类型打开对应 raw spec",
  ],
  [
    "Block Spec",
    "页面逻辑漂移",
    "page shell、dashboard、page heading、sidebar 等规则",
    "Block 先于组件规则，提供页面结构和状态预期",
  ],
  [
    "Rule Router",
    "prompt 膨胀",
    "design-rules/index.json 与 raw GitHub URLs",
    "按安装、创建、旧 UI 映射三种任务模式读取规则",
  ],
  [
    "Project Contract",
    "长期上下文漂移",
    "theme-lab.json、全局 CSS、AGENTS.md / CLAUDE.md 区块",
    "保留 raw 规则入口、Blocks-first 与映射确认门槛",
  ],
]

function UsageChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>使用说明</ChapterTitle>
        <Lead>
          这套工具的用法不是生成一个酷炫页面，而是给长期 AI coding
          项目建立一套可执行的设计约束。
        </Lead>
      </header>
      <P>
        你先定义 token，再预览真实组件、模块和 Spec，最后导出一份 AI
        能执行的项目契约。之后 AI 修改页面时，不是凭感觉重做 UI，而是先识别页面结构，再读取匹配规则。
      </P>
      <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-7 text-foreground marker:font-medium marker:text-muted-foreground">
        {steps.map((step) => (
          <li key={step.label}>
            <span className="font-medium text-foreground">{step.label}</span>
            {step.body}
          </li>
        ))}
      </ol>
      <P>
        导出给的是两种模式。
        <span className="font-medium text-foreground">「一次性优化页面」</span>
        适合快速规整某个 scope；
        <span className="font-medium text-foreground">「长期项目契约」</span>
        会把规则写入 <Code>theme-lab.json</Code>、全局 CSS 和{" "}
        <Code>AGENTS.md</Code> / <Code>CLAUDE.md</Code>，让一致性持续生效。
      </P>
    </div>
  )
}

function MarketGapChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>行业缺口</ChapterTitle>
        <Lead>
          组件库和主题系统都很有价值，但它们主要解决材料和库内一致性，不直接解决长期
          AI coding 的设计治理。
        </Lead>
      </header>
      <P>
        shadcn 给了很好的组件材料，antd 给了成熟的企业组件体系。它们解决的是“怎么更快搭出稳定
        UI”。而长期 AI coding 项目还会遇到另一个问题：页面被持续生成和修改之后，视觉、组件用法、交互状态和页面逻辑会逐渐漂移。
      </P>
      <SectionTitle>和 shadcn 的不同</SectionTitle>
      <ComparisonTable columns={shadcnColumns} rows={shadcnRows} />
      <SectionTitle>Ant Design + Tailwind 支持</SectionTitle>
      <ComparisonTable columns={antdColumns} rows={antdRows} />
      <P>
        所以我并不是反对组件库。相反，组件库是很好的实现材料。只是我的目标层级更靠上：管理 AI
        如何长期使用这些材料，如何在每次修改页面时仍然回到同一套设计系统。
      </P>
    </div>
  )
}

function NormalizationChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>接入与映射</ChapterTitle>
        <Lead>
          先把 Token 作为基础设施接入，再让新 UI 从 Blocks 和语义 Token
          开始；旧 UI 映射是安装后的可选任务。
        </Lead>
      </header>
      <P>
        第一层是 Token 安装：只写入运行时主题、theme-lab.json 和一个 AI
        指令区块。新项目在创建第一块 UI 前完成接入，旧项目接入时不修改现有页面。
      </P>
      <P>
        第二层是 Blocks-first 创建：AI 按页面任务读取最接近的 Block，再把真实业务、
        状态和响应式行为映射到命名槽位。shadcn 优先检查 Registry Blocks，Ant Design
        使用同一套 Block 结构指导官方组件组合。
      </P>
      <P>
        第三层是可选语义映射：安装成功后先询问用户。得到确认后，大模型按组件职责、
        信息层级、表面、交互和状态选择 Token 与 variant，而不是把旧色值机械替换成新色值。
      </P>
      <P>
        第四层是 raw 规则路由：AI 读取 <Code>design-rules/index.json</Code>
        ，先选择安装、创建或映射模式，再只读取匹配的 Block 与组件规则，不把所有规则塞进一个 prompt。
      </P>
      <ComparisonTable columns={solutionColumns} rows={solutionRows} />
      <P>
        最终目标是让 Token 成为默认基础设施，让新 UI 天然一致；旧 UI 是否映射、映射到什么范围，则始终由用户决定。
      </P>
    </div>
  )
}

function VisionChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>GenUI 愿景</ChapterTitle>
        <Lead>
          Registry 先给 AI 足够具体的实现上下文，Spec 与 Token 再保证它不会退化成模板复制。
        </Lead>
      </header>
      <blockquote className="border-l-2 border-[var(--primary)] pl-5 text-base leading-7 text-foreground">
        Registry 提供可执行上下文，Spec 与 Token 提供长期设计治理。
      </blockquote>
      <P>
        我不认为 GenUI 能靠一次性生成解决。真实产品里的 UI
        不是一个孤立页面，而是长期演进的界面系统。与其把 AI
        在没有具体组件上下文时直接生成 UI，通常会从结构层就开始漂移。因此创建页面时应该先读取与任务最接近的 Block，并把真实产品逻辑映射进去。随后视觉 Token 负责一致性，component / block spec 负责交互语义、页面职责和信息层级。
      </P>
      <P>
        Block 是创建 UI 的第一上下文，但不能单独成为设计系统。组件槽位仍要回到同一套 semantic Token；进入旧项目时先安装 Token，只有用户确认后才映射现有内容，并保留 API、数据、状态和权限。
      </P>
      <P>
        所以我的方向不是做一个新的组件货架，而是做一个基于 Spec 的 AI
        设计系统：把设计判断沉淀成可被 AI 读取、路由和执行的规则，让 AI
        在长期 coding 中保持一致，同时保留生成最适合当前产品场景 UI 的自由度。
      </P>
    </div>
  )
}

const chapters = [
  { id: "usage", label: "使用说明", render: UsageChapter },
  { id: "market-gap", label: "行业缺口", render: MarketGapChapter },
  { id: "normalization", label: "接入与映射", render: NormalizationChapter },
  { id: "vision", label: "GenUI 愿景", render: VisionChapter },
] as const

type ChapterId = (typeof chapters)[number]["id"]

export const DocPreview = memo(function DocPreview() {
  const [active, setActive] = useState<ChapterId>("usage")
  const ActiveChapter =
    chapters.find((chapter) => chapter.id === active)?.render ?? UsageChapter

  return (
    <div className="mx-auto flex w-full max-w-7xl min-w-0 flex-col gap-8 px-[var(--page-padding)] pt-12 pb-16 md:flex-row md:gap-12">
      <nav className="shrink-0 md:sticky md:top-12 md:h-max md:w-48">
        <ul className="flex gap-1 overflow-x-auto md:flex-col [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => setActive(chapter.id)}
                className={cn(
                  "w-full whitespace-nowrap rounded-[var(--radius-control)] px-3 py-2 text-left text-sm transition-colors",
                  active === chapter.id
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {chapter.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 max-w-5xl flex-1">
        <ActiveChapter />
      </div>
    </div>
  )
})
