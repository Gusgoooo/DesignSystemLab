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

const steps: Array<{ label: string; body: string }> = [
  {
    label: "起步。",
    body: "从九套场景预设里挑一个最贴近你产品气质的——AI 工具、SaaS、后台、金融、内容、客服、电商、营销、开发——或者直接从默认种子开始。",
  },
  {
    label: "调参。",
    body: "在左侧面板拨动七个维度的种子：颜色、形状、密度、字体、材质、动效，以及定义整体气质的 Vibe。右侧预览实时更新；随时切换明暗，切换「模块」与「组件」两种粒度，确认它在真实布局里立得住。",
  },
  {
    label: "导出。",
    body: "满意之后，在导出面板把这套系统复制出来。CSS 变量、JSON 之外，真正的关键是那段面向 AI 编码工具的可执行契约。",
  },
  {
    label: "落地。",
    body: "把复制出来的指令喂进你的 AI 工具——Codex、Cursor、Claude Code 都行。它会先读你的项目、分析现有页面与组件，再在不动业务逻辑的前提下，把设计规范化、美化，并引入这套 token。",
  },
]

const comparisonColumns = [
  "维度",
  "Design System Lab",
  "antd 主题",
  "shadcn preset",
  "手写规范文档",
]

const comparisonRows: Array<[string, string, string, string, string]> = [
  ["一致性来源", "算法 · 确定性纯函数", "算法 · 组件库内", "预设固定值", "人的纪律"],
  ["色彩空间", "OKLCH（感知均匀）", "HSV", "固定调色板", "因人而异"],
  [
    "产物 / 消费",
    "CSS 变量＋可执行契约，不绑运行时",
    "运行时主题，绑 antd",
    "复制主题片段",
    "文档，需人读后转述",
  ],
  ["技术栈", "任意 Tailwind（shadcn 最佳）", "绑定 antd", "绑定 shadcn", "无绑定"],
  ["面向对象", "AI 编码工具", "人类开发者", "人类开发者", "人类"],
  ["AI 长期约束", "契约写进 CLAUDE.md / AGENTS.md", "无", "无", "靠人转述"],
  ["长期一致性", "可复现 · 可审计 · 算法保证", "库内一致", "一次性，易漂移", "依赖纪律，易漂移"],
]

function UsageChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>使用说明</ChapterTitle>
        <Lead>
          在左边定义一套设计系统，把它导出成一份契约，再交给你的 AI
          编码工具去执行——整个用法就这么短。
        </Lead>
      </header>
      <P>流程一共四步，重心在最后导出的那份契约——它决定了 AI 之后怎么执行。</P>
      <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-7 text-foreground marker:font-medium marker:text-muted-foreground">
        {steps.map((step) => (
          <li key={step.label}>
            <span className="font-medium text-foreground">{step.label}</span>
            {step.body}
          </li>
        ))}
      </ol>
      <P>
        导出给的是两种契约，对应两种场景。
        <span className="font-medium text-foreground">「长期项目契约」</span>
        会落成文件——把规则写进 <Code>CLAUDE.md</Code> / <Code>AGENTS.md</Code>
        ，连同 <Code>theme-lab.json</Code> 和一段带标记的全局
        CSS，让这套系统在之后每一次协作里持续生效，这是为想长期保持一致的项目准备的。
        <span className="font-medium text-foreground">「一次性优化页面」</span>
        则轻得多，不写任何文件，只把你定义的核心 token 交给
        AI，让它给现有页面换上主题、逐处拉齐，适合你只想快速规整某个页面的时候。
      </P>
    </div>
  )
}

function PainChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>解决的痛点</ChapterTitle>
        <Lead>AI 能写好一个页面，却不保证几十个页面还是同一个系统。</Lead>
      </header>
      <P>
        用 AI
        写界面，最先解决的是「好看」，最难解决的是「统一」。一个产品几十个页面，分散在不同的人、不同的时间、不同的措辞里生成，每一个单独看都成立，凑在一起却开始互相矛盾：主色在相邻两页之间偏移，状态色今天是绿明天是青，间距和圆角各执一词。没有谁犯了错，可那个本该贯穿始终的「系统」消失了。
      </P>
      <P>
        直觉的解法，是把规范写进提示词、让模型遵守。它在单次对话里有效，放到时间线上就开始漏——因为模型每一次生成都是重新推理一遍，带着采样的偶然，并随版本、上下文、措辞悄悄漂移。你能让它这一次输出某个圆角值，却没法让它三个月后在另一段对话里复现同一个决定。而一致性要的恰恰是后者：可重复、可预期、跨时间稳定。
      </P>
      <P>
        所以问题不在于规范写得够不够细，而在于把确定性托付给了一个本质上概率化的系统。Design
        System Lab
        的整个设计，就是把这份确定性从模型里取出来，固化成模型之外、可以被反复精确调用的工件——这是后面一切的前提。
      </P>
    </div>
  )
}

function CompareChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>对比</ChapterTitle>
        <Lead>我借鉴了谁，又在哪条线上和它们分道扬镳。</Lead>
      </header>
      <P>
        它的内核——颜色可以被算法派生，而不是一个个手挑——最早是 Ant Design
        让我看见的。我借走了这个判断：派生是一种架构，不是手感。但我们走向了不同方向：antd
        的派生绑在它自己的组件库、发生在运行时；我要的是一份不绑运行时、能被任意 AI
        工具消费的产物，所以它落成 CSS 变量加一份契约。底层我用感知均匀的 OKLCH 而非
        HSV，面向的是模型而不是人——因为今天写下大部分界面的，已经是模型。
      </P>
      <P>把几条常见的路并排放在一起，差别会更清楚：</P>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {comparisonColumns.map((col, index) => (
                <TableHead
                  key={col}
                  className={
                    index === 1
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
            {comparisonRows.map((row) => (
              <TableRow key={row[0]}>
                <TableCell className="whitespace-normal align-top text-[13px] font-medium text-foreground">
                  {row[0]}
                </TableCell>
                <TableCell className="whitespace-normal align-top text-[13px] font-medium text-foreground">
                  {row[1]}
                </TableCell>
                <TableCell className="whitespace-normal align-top text-[13px] text-muted-foreground">
                  {row[2]}
                </TableCell>
                <TableCell className="whitespace-normal align-top text-[13px] text-muted-foreground">
                  {row[3]}
                </TableCell>
                <TableCell className="whitespace-normal align-top text-[13px] text-muted-foreground">
                  {row[4]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <P>
        我最在意的是底下两行：是否面向模型，以及能否长期不漂移。这几乎决定了一套设计系统在
        AI 时代还算不算数。
      </P>
    </div>
  )
}

function VisionChapter() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 border-b border-border pb-6">
        <ChapterTitle>愿景</ChapterTitle>
        <Lead>我为什么相信，模型越强，这套约束越值钱。</Lead>
      </header>
      <blockquote className="border-l-2 border-[var(--primary)] pl-5 text-base leading-7 text-foreground">
        不加约束的强模型，给你的不是一致，而是更高级的不一致。
      </blockquote>
      <P>
        我做的不是又一个主题或规则，而是一层约束——它不替你决定界面长成什么样，而是确保任意一个模型都被收束到同一套系统里。这也是我不担心模型变强的原因：生成和审美是模型的天赋，我不跟它比；模型越强、能生成的越多越杂，就越需要有东西把这些可能性收回到一个系统里，否则得到的只是更高级的不一致。约束的价值，是随被约束者的能力一起上涨的。
      </P>
      <P>
        说到底，我手里的东西很轻：一组种子、一个纯函数、一份不长的契约。但我想用它撬起的事并不轻——一个产品几十个页面、横跨数月的一致性，几乎只花一次定义的成本。再往远处看，我真正期待的，是「如何从种子派生出一套设计系统」本身能沉淀成一个被普遍接受的协议；到那一天，这件事的分量就会从「我有一套别人没有的算法」，变成「我定义了那个标准」。这条路不短，但我已经一步一步，走到了一个站得住的起点。
      </P>
    </div>
  )
}

const chapters = [
  { id: "usage", label: "使用说明", render: UsageChapter },
  { id: "pain", label: "解决的痛点", render: PainChapter },
  { id: "compare", label: "对比", render: CompareChapter },
  { id: "vision", label: "愿景", render: VisionChapter },
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
