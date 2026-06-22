"use client"

import { memo, useEffect, useState } from "react"
import { Badge } from "../../ui/badge"
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet"

type SpecCard = {
  title: string
  source: string
  essence: string
  useWhen: string
  aiRule: string
  avoid: string
}

type SpecGroup = {
  eyebrow: string
  title: string
  description: string
  cards: SpecCard[]
}

type SelectedSpec = SpecCard & {
  groupEyebrow: string
  groupTitle: string
}

type RawSpecState = {
  source: string
  status: "idle" | "loading" | "ready" | "error"
  content: string
  error?: string
}

const rawGithubRuleBase =
  "https://raw.githubusercontent.com/Gusgoooo/DesignSystemLab/codex/distributed-design-rules"

const rawSpecCache = new Map<string, string>()

function getRawSpecUrl(source: string): string {
  return `${rawGithubRuleBase}/${source}`
}

const specGroups: SpecGroup[] = [
  {
    eyebrow: "Routing",
    title: "规则读取与执行入口",
    description:
      "先识别页面结构，再读取匹配 spec。它解决 prompt 太长、规则一次性塞满、AI 凭感觉套组件的问题。",
    cards: [
      {
        title: "Rule Router",
        source: "design-rules/core/rule-router.md",
        essence: "把规则库变成按需读取的路由系统。",
        useWhen:
          "任何 UI normalization、主题落地、页面调整、组件规则解释任务开始前。",
        aiRule:
          "先读 index，加载 requiredAlways，再盘点元素类型，最后只打开匹配文件。",
        avoid: "不要一次读完整个规则库，也不要声称应用了没打开过的规则。",
      },
      {
        title: "Token Binding",
        source: "design-rules/core/token-binding.md",
        essence: "限制视觉漂移，让结构性 UI 只消费语义 token。",
        useWhen:
          "任何涉及颜色、圆角、阴影、focus、状态、density、motion 的 UI 修改。",
        aiRule:
          "检查 filled surface 必须有 matching foreground，半径和 elevation 使用 Design System Lab 变量。",
        avoid: "不要用 raw palette、hex、一次性 shadow 或同角色前景/背景错配。",
      },
      {
        title: "Completion Gate",
        source: "design-rules/core/completion-compliance.md",
        essence: "把 AI 的收尾变成可审计证据，而不是一句“已完成”。",
        useWhen: "每一次 UI normalization 或 Design System Lab token 任务结束前。",
        aiRule:
          "报告打开的规则、保留的业务行为、检查过的状态、token audit 和风险。",
        avoid: "不要只总结视觉变化，不说明规则读取、行为保留和验证结果。",
      },
    ],
  },
  {
    eyebrow: "Page Logic",
    title: "页面骨架与模块职责",
    description:
      "这组 spec 不处理某个具体控件，而是规定页面的结构、信息层级和主要工作流应该如何稳定。",
    cards: [
      {
        title: "Page Shell",
        source: "design-rules/blocks/page-shell.md",
        essence: "页面骨架是工作流容器，不是装饰外壳。",
        useWhen:
          "改 route layout、app shell、管理页、详情页、设置页、表单页、工具页时。",
        aiRule:
          "先识别 sidebar、header、heading、toolbar、content section、primary action 和状态区域。",
        avoid: "不要先改卡片和按钮，忽略页面信息架构、内容顺序和业务边界。",
      },
      {
        title: "Dashboard Block",
        source: "design-rules/blocks/dashboard.md",
        essence: "Dashboard 要回答发生了什么、什么变化、哪里需要行动。",
        useWhen:
          "analytics overview、admin home、operations cockpit、reporting workspace 等页面。",
        aiRule:
          "保留数据、过滤、图表 transform、表格行为，把 overview、chart、table、activity 分清职责。",
        avoid: "不要复制 shadcn demo 数据，也不要把 dashboard 做成一墙无关卡片。",
      },
      {
        title: "Page Heading",
        source: "design-rules/components/page-heading.md",
        essence: "页面标题区负责定位当前对象、元信息和主操作。",
        useWhen: "列表页、详情页、资源页、设置页或任何有 title/action bar 的页面。",
        aiRule:
          "左侧 title + metadata，右侧主操作和次级操作；移动端收起次级操作。",
        avoid: "不要把 heading 包进装饰卡片，也不要用假元信息替代真实业务字段。",
      },
      {
        title: "Sidebar",
        source: "design-rules/components/sidebar.md",
        essence: "Sidebar 是产品导航语法，不是可选视觉边栏。",
        useWhen: "页面或产品 scope 中存在 app navigation、workspace、account 或 nested nav。",
        aiRule:
          "保留 route、active state、permissions、badge count、collapse、mobile drawer 和 user menu。",
        avoid: "不要只美化主内容，把旧 sidebar 留在旁边；不要复制示例团队和假路由。",
      },
    ],
  },
  {
    eyebrow: "Interaction Logic",
    title: "组件背后的交互语义",
    description:
      "这组 spec 关心的不是“用哪个具体组件”，而是每类 UI 在产品里承担什么职责。",
    cards: [
      {
        title: "Cards",
        source: "design-rules/components/card.md",
        essence: "卡片是下一层内容的数据 preview，不是空装饰容器。",
        useWhen:
          "对象摘要、详情入口、metric summary、setting group、可点击 preview 或重复卡片网格。",
        aiRule:
          "从目标详情页拉出 title、status、owner、date、metric、latest activity、next action 等关键信息。",
        avoid: "不要只放 icon、标题和泛描述；不要嵌套卡片或让 secondary action 抢主内容。",
      },
      {
        title: "Tables",
        source: "design-rules/components/table.md",
        essence: "表格是调查入口，每行应帮助用户决定是否打开、选择、过滤或行动。",
        useWhen: "资源索引、数据表、list table、dense list、row grid、调查型列表。",
        aiRule:
          "列顺序从 identity、status、关键事实、latest signal 到 row actions。",
        avoid: "不要把所有后端字段都塞进列；不要移除 sorting、selection、pagination 和 row actions。",
      },
      {
        title: "Actions",
        source: "design-rules/components/actions-and-buttons.md",
        essence: "按钮执行命令，不表达单选状态。",
        useWhen: "create、save、export、delete、refresh、submit、cancel、row actions。",
        aiRule:
          "一个区域保持一个清晰 primary action；secondary 更安静，destructive 分离并确认。",
        avoid: "不要用 primary/secondary 按钮组模拟 tab、status switch 或 period switch。",
      },
      {
        title: "Filters And Controls",
        source: "design-rules/components/filters-and-controls.md",
        essence: "筛选控件改变数据范围，应靠近它影响的数据。",
        useWhen: "search、filters、sort、view switch、date range、table toolbar、bulk actions。",
        aiRule:
          "左侧放 search/filter/tabs，右侧放 create/export/refresh；同一行控件共享高度。",
        avoid: "不要把过滤条件散落在页面各处，也不要隐藏 active filter state。",
      },
      {
        title: "Forms And Inputs",
        source: "design-rules/components/forms-and-inputs.md",
        essence: "表单是数据变更契约，必须保留验证、默认值和提交状态。",
        useWhen: "settings、CRUD、auth、multi-step、field group、validation、date picker。",
        aiRule:
          "每个字段有 label、control、help、validation；提交、loading、error 和 success 状态必须接上。",
        avoid: "不要用 placeholder 代替 label，也不要为了美化断开 schema、handler 或 validation。",
      },
      {
        title: "Tabs",
        source: "design-rules/components/tabs.md",
        essence: "Tabs 是单选视图状态，不是命令按钮。",
        useWhen: "view、mode、status、period、section switch，或 sibling content panels。",
        aiRule:
          "保持一个 selected value、keyboard navigation、panel state 和 token-backed selected 样式。",
        avoid: "不要把 tabs 做得比 primary action 更响，也不要用 tabs 执行 save/export/delete。",
      },
      {
        title: "Overlays",
        source: "design-rules/components/overlays.md",
        essence: "Overlay 是上下文内的焦点工作流。",
        useWhen: "dialog、sheet、drawer、popover、dropdown、command palette、combobox、date picker。",
        aiRule:
          "保留 trigger、controlled open state、focus trap/return、dismiss、scroll、form state 和 async error。",
        avoid: "不要把小菜单做成 dialog，也不要把多步工作流塞进小 popover。",
      },
      {
        title: "Badges And Alerts",
        source: "design-rules/components/badges-and-alerts.md",
        essence: "Badge 表示紧凑意义，Alert 承载需要注意的信息。",
        useWhen: "status、priority、category、filter chip、notice、banner、validation summary。",
        aiRule:
          "默认中性；只有真实 status/category/priority/permission 才使用语义色。",
        avoid: "不要每个 tag 随机上色，也不要把普通 helper text 做成 alert。",
      },
      {
        title: "Metrics And Charts",
        source: "design-rules/components/metrics-and-charts.md",
        essence: "指标和图表回答产品问题，不是填充空间。",
        useWhen: "KPI、stat row、chart、legend、progress、sparkline、trend、dashboard summary。",
        aiRule:
          "保留 calculation、unit、filter、date range、transform、series mapping 和 tooltip state。",
        avoid: "不要用示例数据替换真实数据；不要隐藏单位、分母或时间范围。",
      },
    ],
  },
  {
    eyebrow: "Meaning And State",
    title: "状态、颜色与反馈语义",
    description:
      "这组 spec 让状态表达稳定：颜色只表达意义，状态必须可见，空/错/加载不能破坏布局。",
    cards: [
      {
        title: "Semantic Color",
        source: "design-rules/patterns/semantic-color.md",
        essence: "颜色是意义，不是装饰。",
        useWhen: "status badge、category label、legend、chart series、priority、state color。",
        aiRule:
          "status 使用 success/warning/info/danger；category 使用 chart-1..5 并保持稳定映射。",
        avoid: "不要给每个 tag 随机颜色，也不要把 active/selected 当 category color。",
      },
      {
        title: "UI States",
        source: "design-rules/patterns/states.md",
        essence: "状态是产品反馈的一部分，不是组件附属品。",
        useWhen: "empty、loading、error、success、disabled、selected、hover、focus、permission-hidden。",
        aiRule:
          "保留布局稳定性和可读性；focus-visible 必须存在，error 要给出可执行下一步。",
        avoid: "不要移除 outline，也不要用 toast-only 隐藏关键错误。",
      },
      {
        title: "Page Background",
        source: "design-rules/patterns/page-background.md",
        essence: "页面背景只能轻微支持氛围，不能替代信息设计。",
        useWhen: "页面 canvas 过于平、需要安静 top ambient wash 时。",
        aiRule:
          "只在内容后方放非常轻的顶部环境层，真实 UI surfaces 仍然 token-bound。",
        avoid: "不要 tint sidebar、卡片或结构表面；不要用强渐变制造视觉噪声。",
      },
    ],
  },
]

function SpecCardView({
  card,
  group,
  onSelect,
}: {
  card: SpecCard
  group: SpecGroup
  onSelect: (spec: SelectedSpec) => void
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onSelect({
          ...card,
          groupEyebrow: group.eyebrow,
          groupTitle: group.title,
        })
      }
      aria-label={`查看 ${card.title} spec 详情`}
      className="flex min-h-[calc(var(--list-row-height)*2.35)] w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-card py-[var(--panel-padding)] text-left text-card-foreground [box-shadow:var(--elevation-card)] transition-[background-color,border-color,box-shadow,transform] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-standard)] hover:-translate-y-0.5 hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <CardHeader className="w-full gap-[var(--field-gap)]">
        <div className="flex flex-wrap items-start justify-between gap-[var(--control-gap)]">
          <div className="min-w-0">
            <CardTitle className="text-base leading-6">{card.title}</CardTitle>
          </div>
          <Badge variant="outline">{group.eyebrow}</Badge>
        </div>
      </CardHeader>
      <CardContent className="w-full flex-1 text-[13px] leading-5">
        <p className="line-clamp-2 text-foreground">{card.essence}</p>
      </CardContent>
    </button>
  )
}

function SpecDetailDrawer({
  selectedSpec,
  onOpenChange,
}: {
  selectedSpec: SelectedSpec | null
  onOpenChange: (open: boolean) => void
}) {
  const [rawSpec, setRawSpec] = useState<RawSpecState>({
    source: "",
    status: "idle",
    content: "",
  })
  const rawSpecUrl = selectedSpec ? getRawSpecUrl(selectedSpec.source) : ""
  const rawSpecCode =
    rawSpec.status === "ready"
      ? rawSpec.content
      : rawSpec.status === "loading"
        ? "Loading raw spec..."
        : rawSpec.status === "error"
          ? `Failed to load raw spec.\n${rawSpec.error ?? ""}`
          : ""

  useEffect(() => {
    if (!selectedSpec) {
      setRawSpec({
        source: "",
        status: "idle",
        content: "",
      })
      return
    }

    const source = selectedSpec.source
    const cachedContent = rawSpecCache.get(source)

    if (cachedContent) {
      setRawSpec({
        source,
        status: "ready",
        content: cachedContent,
      })
      return
    }

    let cancelled = false

    setRawSpec({
      source,
      status: "loading",
      content: "",
    })

    fetch(getRawSpecUrl(source))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return response.text()
      })
      .then((content) => {
        rawSpecCache.set(source, content)

        if (!cancelled) {
          setRawSpec({
            source,
            status: "ready",
            content,
          })
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setRawSpec({
            source,
            status: "error",
            content: "",
            error:
              error instanceof Error
                ? error.message
                : "Unknown raw spec fetch error",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedSpec])

  return (
    <Sheet open={Boolean(selectedSpec)} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[min(92vw,640px)] overflow-y-auto border-border bg-popover text-popover-foreground [box-shadow:var(--elevation-popover)] sm:max-w-none"
      >
        {selectedSpec ? (
          <>
            <SheetHeader className="border-b border-border px-[var(--panel-padding)] py-[var(--panel-padding)]">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{selectedSpec.groupEyebrow}</Badge>
                <Badge variant="outline">{selectedSpec.groupTitle}</Badge>
              </div>
              <SheetTitle className="text-2xl leading-8">
                {selectedSpec.title}
              </SheetTitle>
              <SheetDescription className="break-words font-mono text-xs">
                {selectedSpec.source}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-[var(--section-gap)] px-[var(--panel-padding)] pb-[var(--panel-padding)] text-sm leading-6">
              <section className="space-y-[var(--field-gap)]">
                <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                  交互本质
                </p>
                <p className="text-foreground">{selectedSpec.essence}</p>
              </section>

              <section className="space-y-[var(--field-gap)]">
                <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                  什么条件下引用
                </p>
                <p className="text-foreground">{selectedSpec.useWhen}</p>
              </section>

              <section className="space-y-[var(--field-gap)]">
                <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                  AI 执行重点
                </p>
                <p className="text-foreground">{selectedSpec.aiRule}</p>
              </section>

              <section className="space-y-[var(--field-gap)]">
                <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                  避免
                </p>
                <p className="text-foreground">{selectedSpec.avoid}</p>
              </section>

              <section className="space-y-[var(--field-gap)]">
                <div className="flex flex-wrap items-center justify-between gap-[var(--control-gap)]">
                  <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
                    Spec 原文
                  </p>
                  <a
                    href={rawSpecUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[var(--radius-control)] text-xs font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Raw GitHub
                  </a>
                </div>
                <pre className="max-h-[420px] overflow-auto rounded-[var(--radius-card)] border border-border bg-muted p-[var(--panel-padding)] text-xs leading-5 text-foreground [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <code>{`Raw URL: ${rawSpecUrl}\nSource: ${rawSpec.source || selectedSpec.source}\n\n${rawSpecCode}`}</code>
                </pre>
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export const SpecPreview = memo(function SpecPreview() {
  const [selectedSpec, setSelectedSpec] = useState<SelectedSpec | null>(null)

  return (
    <div className="mx-auto w-full max-w-6xl min-w-0 space-y-[calc(var(--section-gap)*1.75)] px-[var(--page-padding)] py-[calc(var(--page-padding)*1.5)]">
      <header className="max-w-3xl space-y-[var(--field-gap)]">
        <Badge variant="secondary">Design Rule Library</Badge>
        <h1 className="text-[length:var(--text-display)] font-[var(--font-weight-heading)] leading-tight tracking-[var(--tracking-heading)] text-foreground">
          Component / Block Spec
        </h1>
      </header>

      {specGroups.map((group) => (
        <section key={group.title} className="space-y-[var(--section-gap)]">
          <div className="max-w-3xl space-y-[var(--field-gap)]">
            <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
              {group.eyebrow}
            </p>
            <h2 className="text-2xl font-semibold tracking-normal text-foreground">
              {group.title}
            </h2>
            <p className="text-sm leading-6 text-muted-foreground">
              {group.description}
            </p>
          </div>
          <div className="grid gap-[var(--section-gap)] md:grid-cols-2 xl:grid-cols-3">
            {group.cards.map((card) => (
              <SpecCardView
                key={card.source}
                card={card}
                group={group}
                onSelect={setSelectedSpec}
              />
            ))}
          </div>
        </section>
      ))}

      <SpecDetailDrawer
        selectedSpec={selectedSpec}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSpec(null)
          }
        }}
      />
    </div>
  )
})
