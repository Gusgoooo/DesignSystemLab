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
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
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
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-border">
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
    body: "在组件和模块预览里看真实 UI 场景：按钮、表单、卡片、表格、图表、dashboard、AI chat、设置页等是否仍然像同一个系统。",
  },
  {
    label: "导出。",
    body: "把 token、theme-lab.json、AI instruction block 和 project import prompt 导出到目标项目。",
  },
  {
    label: "归一化。",
    body: "AI 先识别页面结构，再按需读取本地或 raw GitHub spec，在保留业务逻辑的前提下统一视觉、组件使用和页面结构。",
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

const antdColumns = ["维度", "antd 主要解决", "美中不足", "我的解法"]

const antdRows: string[][] = [
  [
    "系统形态",
    "成熟企业级组件库和设计语言",
    "设计决策主要绑定 antd 组件体系",
    "token 与 spec 独立存在，可迁移到任意 Tailwind / shadcn-like 项目",
  ],
  [
    "主题能力",
    "库内主题算法和组件 token",
    "主要服务 antd runtime 和固定组件实现",
    "输出 CSS variables、JSON、AI rules，不绑定运行时组件库",
  ],
  [
    "组件选择",
    "给出固定组件和交互默认值",
    "AI 容易围绕固定组件适配，而不是为当前问题生成最优结构",
    "spec 描述设计优解，允许 AI 自己生成符合规则的实现",
  ],
  [
    "使用对象",
    "主要面向人类开发者",
    "AI 长期执行规则不是核心目标",
    "面向 Codex / Cursor / Claude Code 导出可执行契约",
  ],
  [
    "prompt 管理",
    "不是 prompt 路由系统",
    "无法解决大 prompt 一次性塞满的问题",
    "index.json 路由规则，本地优先，缺失时读取 raw GitHub spec",
  ],
]

const solutionColumns = ["层", "限制什么漂移", "主要产物", "AI 如何执行"]

const solutionRows: string[][] = [
  [
    "Token Contract",
    "视觉漂移",
    "CSS 变量、semantic token、status token、chart token、shadcn adapter",
    "消费已有 token，不重新发明颜色、圆角、阴影、状态和明暗主题",
  ],
  [
    "Component Spec",
    "组件使用漂移",
    "cards、tables、forms、tabs、overlays、badges、metrics 等规则",
    "按元素类型打开对应 spec，保留行为后再规范组件结构",
  ],
  [
    "Block Spec",
    "页面逻辑漂移",
    "page shell、dashboard、page heading、sidebar 等规则",
    "先识别页面结构，再处理局部组件，避免只换 token 不改系统问题",
  ],
  [
    "Rule Router",
    "prompt 膨胀",
    "design-rules/index.json 与 raw GitHub URLs",
    "先分析页面，再分散读取匹配文件，不把所有规则塞进一个 prompt",
  ],
  [
    "Project Contract",
    "长期上下文漂移",
    "theme-lab.json、全局 CSS、AGENTS.md / CLAUDE.md 区块",
    "让设计规则进入项目记忆，而不是停留在一次性对话里",
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
        你先定义 token，再预览真实组件和模块，最后导出一份 AI
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
      <SectionTitle>和 antd 的不同</SectionTitle>
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
        <ChapterTitle>归一化解法</ChapterTitle>
        <Lead>
          我用 token 限制视觉一致性，用 component / block spec
          限制交互逻辑和页面逻辑，再用 rule router 分散加载 prompt。
        </Lead>
      </header>
      <P>
        第一层是 token 归一化：颜色、语义色、圆角、密度、字体、阴影、动效、状态色和明暗主题都由
        seed 确定性生成。AI 不需要重新挑样式，只需要消费这套视觉契约。
      </P>
      <P>
        第二层是 spec 归一化：Button 是命令，不是单选切换；Tabs 才适合 view / mode / status
        switch；Card 是下一层内容预览；Table 要保留身份、状态、关键事实和行操作；Overlay
        要保留 trigger、open state、focus return、dismiss 和提交状态。
      </P>
      <P>
        第三层是规则路由：AI 先读取 <Code>design-rules/index.json</Code>
        ，识别页面里到底有哪些元素，再分别读取本地规则或 raw GitHub spec。这样不会出现一上来就塞一个超长
        prompt 的情况，而是先分析，再按需加载。
      </P>
      <ComparisonTable columns={solutionColumns} rows={solutionRows} />
      <P>
        最终目标是 UI normalization：保留业务逻辑、API、数据加载、状态、权限、验证和交互流程，同时把视觉、组件用法和页面结构收敛到同一套系统。
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
          未来不应该依赖固定组件库清单，而应该让 AI 在设计约束内生成当前问题的最优组件。
        </Lead>
      </header>
      <blockquote className="border-l-2 border-[var(--primary)] pl-5 text-base leading-7 text-foreground">
        组件库是材料，不是未来 GenUI 的边界。
      </blockquote>
      <P>
        传统前端里，人类开发者在组件库里选择组件、组合组件、魔改组件。AI coding
        早期也会自然依赖 registry：antd、shadcn、Tailwind UI、各种 blocks 都是很好的材料。但长期看，AI
        一定可以根据当前产品、当前数据结构、当前交互约束，写出更贴合当前问题的组件。
      </P>
      <P>
        所以我不想把设计系统做成另一个固定组件库。我要限定的是设计优解，而不是限定 AI
        必须从某个清单里选一个组件。一个未来的 GenUI 组件，可以来自 shadcn，可以来自项目已有组件，也可以由
        AI 临场生成；只要它符合 token、组件语义、页面职责、状态规则、可访问性和长期一致性，它就是可接受的解。
      </P>
      <P>
        这也是这套系统的价值：它不和模型比“谁更会生成”。模型越强，越能写出丰富的实现；设计约束越清楚，这些实现就越容易被收束到同一个产品系统里。AI
        负责生成可能性，我负责定义哪些可能性是长期可维护的优解。
      </P>
    </div>
  )
}

const chapters = [
  { id: "usage", label: "使用说明", render: UsageChapter },
  { id: "market-gap", label: "行业缺口", render: MarketGapChapter },
  { id: "normalization", label: "归一化解法", render: NormalizationChapter },
  { id: "vision", label: "GenUI 愿景", render: VisionChapter },
] as const

type ChapterId = (typeof chapters)[number]["id"]

export const DocPreview = memo(function DocPreview() {
  const [active, setActive] = useState<ChapterId>("usage")
  const ActiveChapter =
    chapters.find((chapter) => chapter.id === active)?.render ?? UsageChapter

  return (
    <div className="mx-auto flex w-full max-w-5xl min-w-0 flex-col gap-8 px-[var(--page-padding)] pt-12 pb-16 md:flex-row md:gap-10">
      <nav className="shrink-0 md:sticky md:top-12 md:h-max md:w-44">
        <ul className="flex gap-1 overflow-x-auto md:flex-col [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <button
                type="button"
                onClick={() => setActive(chapter.id)}
                className={cn(
                  "w-full whitespace-nowrap rounded-[var(--radius-control)] px-3 py-2 text-left text-sm transition-colors",
                  active === chapter.id
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                {chapter.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 max-w-2xl flex-1">
        <ActiveChapter />
      </div>
    </div>
  )
})
