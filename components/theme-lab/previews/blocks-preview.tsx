"use client"

import {
  memo,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react"
import { cn } from "../../../lib/utils"
import {
  Bell,
  BookOpen,
  Bot,
  CalendarDays,
  ChartBar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleCheck,
  CirclePlus,
  ClipboardList,
  Columns3,
  CreditCard,
  Database,
  FileText,
  Folder,
  GalleryVerticalEnd,
  GripVertical,
  HelpCircle,
  Headphones,
  Image as ImageIcon,
  Link2,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  MessageSquare,
  Mic,
  MoreVertical,
  PanelLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Paperclip,
  PlugZap,
  Plus,
  Puzzle,
  Rows3,
  Search,
  Send,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  TrendingDown,
  TrendingUp,
  UserRound,
  Users,
  Wand2,
  X,
  Zap,
} from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { AppSidebar } from "@/components/app-sidebar"
import { AssistantThread } from "@/components/assistant-ui/thread"
import { NavActions } from "@/components/nav-actions"

import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { Checkbox } from "../../ui/checkbox"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../ui/chart"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import {
  Field as FormField,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../../ui/field"
import { Input } from "../../ui/input"
import { Progress } from "../../ui/progress"
import { Separator } from "../../ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../../ui/sidebar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"
import { Textarea } from "../../ui/textarea"

type BlockSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

type BlockCardProps = {
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

type MiniButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive"
  size?: "sm" | "md"
  children: ReactNode
}

type StatusPillProps = {
  tone?: "success" | "warning" | "info" | "danger" | "neutral"
  children: ReactNode
}

type MetricCardProps = {
  label: string
  value: string
  delta?: string
  tone?: "success" | "warning" | "danger" | "neutral"
}

function BlockSection(props: BlockSectionProps) {
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

function BlockCard(props: BlockCardProps) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-[var(--radius-card)] border border-border bg-card p-[var(--panel-padding)] text-card-foreground [box-shadow:var(--elevation-card)]",
        props.className
      )}
    >
      {props.title || props.description ? (
        <div className="mb-4 min-w-0 space-y-1">
          {props.title ? (
            <h4 className="truncate font-[var(--font-weight-heading)]">
              {props.title}
            </h4>
          ) : null}
          {props.description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {props.description}
            </p>
          ) : null}
        </div>
      ) : null}
      {props.children}
    </div>
  )
}

function MiniButton(props: MiniButtonProps) {
  const variant = props.variant ?? "primary"
  const size = props.size ?? "md"
  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
    outline:
      "border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
  } satisfies Record<NonNullable<MiniButtonProps["variant"]>, string>
  const sizeClasses = {
    sm: "h-[var(--control-height-sm)] px-3 text-xs",
    md: "h-[var(--control-height-md)] px-4 text-sm",
  } satisfies Record<NonNullable<MiniButtonProps["size"]>, string>

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium ring-ring [transition-duration:var(--duration-base)] focus-visible:outline-none focus-visible:ring-2",
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {props.children}
    </button>
  )
}

function StatusPill(props: StatusPillProps) {
  const tone = props.tone ?? "neutral"
  const toneClasses = {
    success: "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
    warning: "bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]",
    info: "bg-[var(--status-info-bg)] text-[var(--status-info-fg)]",
    danger: "bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)]",
    neutral: "bg-muted text-muted-foreground",
  } satisfies Record<NonNullable<StatusPillProps["tone"]>, string>

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {props.children}
    </span>
  )
}

function MetricCard(props: MetricCardProps) {
  const toneClasses = {
    success: "text-[var(--status-success-fg)]",
    warning: "text-[var(--status-warning-fg)]",
    danger: "text-[var(--status-danger-fg)]",
    neutral: "text-muted-foreground",
  } satisfies Record<NonNullable<MetricCardProps["tone"]>, string>
  const tone = props.tone ?? "neutral"

  return (
    <BlockCard className="[box-shadow:none]">
      <p className="text-sm text-muted-foreground">{props.label}</p>
      <p className="mt-2 text-2xl font-[var(--font-weight-heading)]">
        {props.value}
      </p>
      {props.delta ? (
        <p className={cn("mt-1 text-sm font-medium", toneClasses[tone])}>
          {props.delta}
        </p>
      ) : null}
    </BlockCard>
  )
}

function Field(props: {
  label: string
  value?: string
  type?: string
  placeholder?: string
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{props.label}</span>
      <input
        className="h-[var(--control-height-md)] w-full rounded-[var(--radius-control)] border border-border bg-background px-3 text-sm text-foreground outline-none ring-ring placeholder:text-muted-foreground focus-visible:ring-2"
        type={props.type ?? "text"}
        defaultValue={props.value}
        placeholder={props.placeholder}
      />
    </label>
  )
}

function StaticSwitch(props: { checked: boolean; label: string }) {
  return (
    <div className="flex min-h-[var(--list-row-height)] items-center justify-between gap-3 border-border border-t">
      <span className="text-sm">{props.label}</span>
      <div
        role="switch"
        aria-checked={props.checked}
        className={cn(
          "flex h-6 w-11 items-center rounded-full p-1",
          props.checked ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "h-4 w-4 rounded-full border border-border bg-background",
            props.checked && "ml-auto"
          )}
        />
      </div>
    </div>
  )
}

const dashboardChartConfig = {
  desktop: {
    label: "桌面端",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "移动端",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const dashboardChartData = [
  { month: "1月", desktop: 186, mobile: 80 },
  { month: "2月", desktop: 305, mobile: 200 },
  { month: "3月", desktop: 237, mobile: 120 },
  { month: "4月", desktop: 73, mobile: 190 },
  { month: "5月", desktop: 209, mobile: 130 },
  { month: "6月", desktop: 214, mobile: 140 },
  { month: "7月", desktop: 248, mobile: 168 },
  { month: "8月", desktop: 321, mobile: 226 },
  { month: "9月", desktop: 276, mobile: 192 },
  { month: "10月", desktop: 352, mobile: 248 },
  { month: "11月", desktop: 198, mobile: 160 },
  { month: "12月", desktop: 286, mobile: 214 },
]

type DashboardIcon = ComponentType<{ className?: string }>
type DashboardColumnKey = "type" | "status" | "target" | "limit" | "owner"

type DashboardRow = {
  id: number
  name: string
  type: string
  status: keyof typeof dashboardStatusTone
  target: string
  limit: string
  owner: string
  updated: string
}

type DashboardSidebarItem = {
  icon: DashboardIcon
  label: string
  meta?: string
  active?: boolean
}

const dashboardRows = [
  {
    id: 1,
    name: "概览页重构",
    type: "页面",
    status: "已完成",
    target: "4,200",
    limit: "6,000",
    owner: "沈予",
    updated: "今天",
  },
  {
    id: 2,
    name: "账单流程",
    type: "流程",
    status: "进行中",
    target: "2,180",
    limit: "3,500",
    owner: "林可",
    updated: "昨天",
  },
  {
    id: 3,
    name: "模型用量",
    type: "指标",
    status: "待复核",
    target: "8,910",
    limit: "10,000",
    owner: "陈舟",
    updated: "2 天前",
  },
  {
    id: 4,
    name: "权限矩阵",
    type: "配置",
    status: "草稿",
    target: "1,020",
    limit: "2,000",
    owner: "周宁",
    updated: "上周",
  },
  {
    id: 5,
    name: "导出任务",
    type: "队列",
    status: "已完成",
    target: "6,540",
    limit: "8,000",
    owner: "许安",
    updated: "3 天前",
  },
  {
    id: 6,
    name: "异常提醒",
    type: "规则",
    status: "进行中",
    target: "3,360",
    limit: "5,000",
    owner: "孟然",
    updated: "今天",
  },
  {
    id: 7,
    name: "关键人员",
    type: "人员",
    status: "待复核",
    target: "1,840",
    limit: "2,400",
    owner: "高远",
    updated: "4 天前",
  },
  {
    id: 8,
    name: "焦点文档",
    type: "文档",
    status: "草稿",
    target: "760",
    limit: "1,500",
    owner: "苏棠",
    updated: "上月",
  },
] satisfies DashboardRow[]

const dashboardStatusTone = {
  已完成: "success",
  进行中: "info",
  待复核: "warning",
  草稿: "neutral",
} satisfies Record<string, NonNullable<StatusPillProps["tone"]>>

const dashboardMainNav: DashboardSidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", meta: "活跃", active: true },
  { icon: Rows3, label: "Lifecycle", meta: "8 阶段" },
  { icon: ChartBar, label: "Analytics", meta: "报告" },
  { icon: Folder, label: "Projects", meta: "14 个" },
  { icon: Users, label: "Team", meta: "权限" },
]

const dashboardDocuments: DashboardSidebarItem[] = [
  { icon: Database, label: "Data Library", meta: "12 个连接" },
  { icon: FileText, label: "Reports", meta: "月度" },
  { icon: BookOpen, label: "Word Assistant", meta: "草稿" },
]

const dashboardSecondaryNav: DashboardSidebarItem[] = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Get Help" },
  { icon: Search, label: "Search" },
]

const dashboardColumns = [
  { key: "type", label: "类型" },
  { key: "status", label: "状态" },
  { key: "target", label: "目标" },
  { key: "limit", label: "限制" },
  { key: "owner", label: "负责人" },
] satisfies Array<{ key: DashboardColumnKey; label: string }>

const signupControlClass =
  "h-[var(--control-height-md)] rounded-[var(--radius-control)] bg-background data-[size=default]:h-[var(--control-height-md)]"

function DashboardSidebarButton(props: {
  item: DashboardSidebarItem
  collapsed?: boolean
}) {
  const Icon = props.item.icon

  return (
    <button
      type="button"
      title={props.collapsed ? props.item.label : undefined}
      className={cn(
        "flex min-h-[var(--list-row-height)] w-full min-w-0 items-center gap-3 rounded-[var(--radius-control)] text-left text-sm ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2",
        props.collapsed ? "justify-center px-0" : "px-3",
        props.item.active
          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)]"
          : "text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!props.collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{props.item.label}</span>
          {props.item.meta ? (
            <span className="truncate text-xs opacity-70">
              {props.item.meta}
            </span>
          ) : null}
        </>
      ) : null}
    </button>
  )
}

function DashboardSidebarGroup(props: {
  label?: string
  items: DashboardSidebarItem[]
  collapsed?: boolean
}) {
  return (
    <div className="space-y-2">
      {props.label && !props.collapsed ? (
        <p className="px-3 text-xs font-medium text-muted-foreground">
          {props.label}
        </p>
      ) : null}
      <nav className="space-y-1">
        {props.items.map((item) => (
          <DashboardSidebarButton
            key={item.label}
            collapsed={props.collapsed}
            item={item}
          />
        ))}
      </nav>
    </div>
  )
}

function DashboardSidebarPanel(props: {
  collapsed?: boolean
  mobile?: boolean
  onMobileOpenChange?: (next: boolean) => void
}) {
  return (
    <>
      <div
        className={cn(
          "flex min-h-14 items-center gap-3 border-[var(--sidebar-border)] border-b",
          props.collapsed ? "justify-center px-3" : "px-4"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)]">
          <GalleryVerticalEnd className="size-4" />
        </div>
        {!props.collapsed ? (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-[var(--font-weight-heading)]">
              Alibaba Inc.
            </p>
            <p className="truncate text-xs text-muted-foreground">企业版</p>
          </div>
        ) : null}
        {props.mobile ? (
          <Button
            aria-label="关闭侧栏"
            className="ml-auto"
            onClick={() => props.onMobileOpenChange?.(false)}
            size="icon-sm"
            variant="ghost"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <div
        className={cn(
          "min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          props.collapsed && "px-2"
        )}
      >
        <div className={cn("flex gap-2", props.collapsed && "flex-col")}>
          <Button
            aria-label="新建项目"
            className={cn(
              "min-w-0 bg-[var(--sidebar-primary)] text-[var(--sidebar-primary-foreground)] hover:bg-[var(--sidebar-primary)]/90",
              props.collapsed ? "w-full px-0" : "flex-1 justify-start"
            )}
            size={props.collapsed ? "icon-sm" : "sm"}
          >
            <CirclePlus className="size-4" />
            {!props.collapsed ? <span>Quick Create</span> : null}
          </Button>
          <Button
            aria-label="收件箱"
            className={props.collapsed ? "w-full" : ""}
            size="icon-sm"
            variant="outline"
          >
            <Mail className="size-4" />
          </Button>
        </div>

        <DashboardSidebarGroup
          collapsed={props.collapsed}
          items={dashboardMainNav}
        />
        <DashboardSidebarGroup
          collapsed={props.collapsed}
          items={dashboardDocuments}
          label="Documents"
        />
        <DashboardSidebarGroup
          collapsed={props.collapsed}
          items={dashboardSecondaryNav}
          label="Support"
        />
      </div>

      <div
        className={cn(
          "flex items-center gap-3 border-[var(--sidebar-border)] border-t p-3",
          props.collapsed && "justify-center"
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          林
        </div>
        {!props.collapsed ? (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">林安娜</p>
              <p className="truncate text-xs text-muted-foreground">
                anna@alibaba.com
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="更多账户操作" size="icon-sm" variant="ghost">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="right" className="w-48">
                <DropdownMenuLabel>林安娜</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  账户设置
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="size-4" />
                  通知偏好
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="size-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : null}
      </div>
    </>
  )
}

function DashboardSidebar(props: {
  collapsed: boolean
  mobileOpen: boolean
  onCollapsedChange: (next: boolean) => void
  onMobileOpenChange: (next: boolean) => void
}) {
  return (
    <>
      {props.mobileOpen ? (
        <div className="absolute inset-0 z-30 md:hidden">
          <button
            aria-label="关闭侧栏遮罩"
            className="absolute inset-0 bg-background/70"
            onClick={() => props.onMobileOpenChange(false)}
            type="button"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[18rem] max-w-[86vw] flex-col border-[var(--sidebar-border)] border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] shadow-[var(--elevation-dialog)]">
            <DashboardSidebarPanel
              mobile
              onMobileOpenChange={props.onMobileOpenChange}
            />
          </aside>
        </div>
      ) : null}

      <aside
        className={cn(
          "hidden shrink-0 flex-col border-[var(--sidebar-border)] border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] transition-[width] [transition-duration:var(--duration-base)] md:flex",
          props.collapsed ? "w-[4.75rem]" : "w-[17rem]"
        )}
      >
        <DashboardSidebarPanel
          collapsed={props.collapsed}
        />
      </aside>
    </>
  )
}

function DashboardSiteHeader(props: {
  collapsed: boolean
  onCollapsedChange: (next: boolean) => void
  onMobileOpenChange: (next: boolean) => void
}) {
  return (
    <header className="flex min-h-14 items-center gap-2 border-border border-b bg-background/95 px-4 lg:px-6">
      <Button
        aria-label="打开移动侧栏"
        className="md:hidden"
        onClick={() => props.onMobileOpenChange(true)}
        size="icon-sm"
        variant="ghost"
      >
        <PanelLeft className="size-4" />
      </Button>
      <Button
        aria-label={props.collapsed ? "展开侧栏" : "收起侧栏"}
        className="hidden md:inline-flex"
        onClick={() => props.onCollapsedChange(!props.collapsed)}
        size="icon-sm"
        variant="ghost"
      >
        {props.collapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
      </Button>
      <div className="mx-1 h-5 w-px bg-border" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Documents</p>
      </div>
      <div className="relative hidden w-56 lg:block">
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
        <Input
          aria-label="搜索"
          className="pl-9"
          defaultValue="搜索文档..."
          readOnly
        />
      </div>
      <Button aria-label="通知" size="icon-sm" variant="ghost">
        <Bell className="size-4" />
      </Button>
      <Button className="hidden sm:inline-flex" size="sm" variant="outline">
        GitHub
      </Button>
    </header>
  )
}

function DashboardSectionCards() {
  const metrics = [
    ["总收入", "$1,250.00", "+12.5%", "较上月提升", "success"],
    ["新增客户", "1,234", "-20%", "本期采集口径", "warning"],
    ["活跃账户", "45,678", "+12.5%", "强留存队列", "success"],
    ["增长率", "4.5%", "+4.5%", "稳定增长", "success"],
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:px-6 xl:grid-cols-4">
      {metrics.map(([label, value, delta, caption, tone]) => {
        const isDown = delta.startsWith("-")
        const Icon = isDown ? TrendingDown : TrendingUp

        return (
          <Card
            key={label}
            className="@container/card min-w-0 gap-2 overflow-hidden bg-gradient-to-t from-primary/5 to-card"
          >
            <CardHeader className="min-w-0 gap-3">
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
                <CardDescription className="min-w-0">{label}</CardDescription>
                <Badge
                  className={cn(
                    "max-w-full",
                    tone === "success" &&
                      "border-[var(--status-success)] text-[var(--status-success-fg)]",
                    tone === "warning" &&
                      "border-[var(--status-warning)] text-[var(--status-warning-fg)]"
                  )}
                  variant="outline"
                >
                  <Icon className="size-3" />
                  {delta}
                </Badge>
              </div>
              <CardTitle className="min-w-0 truncate text-2xl font-semibold tabular-nums @[280px]/card:text-3xl">
                {value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                {caption}
                <Icon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                最近 6 个月访问数据
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

function DashboardAreaChart() {
  const [timeRange, setTimeRange] = useState("90d")
  const filteredData = useMemo(() => {
    if (timeRange === "7d") {
      return dashboardChartData.slice(-4)
    }

    if (timeRange === "30d") {
      return dashboardChartData.slice(-8)
    }

    return dashboardChartData
  }, [timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>访问趋势</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            桌面端和移动端访问量对比，按时间范围过滤。
          </span>
          <span className="@[540px]/card:hidden">访问量对比</span>
        </CardDescription>
        <CardAction className="col-start-1 row-start-3 mt-2 justify-self-start @[620px]/card:col-start-2 @[620px]/card:row-start-1 @[620px]/card:mt-0 @[620px]/card:justify-self-end">
          <Tabs value={timeRange} onValueChange={setTimeRange}>
            <TabsList className="h-[var(--control-height-sm)] max-w-full">
              <TabsTrigger
                className="px-[calc(var(--control-padding-x)*0.75)] text-xs"
                value="90d"
              >
                90 天
              </TabsTrigger>
              <TabsTrigger
                className="px-[calc(var(--control-padding-x)*0.75)] text-xs"
                value="30d"
              >
                30 天
              </TabsTrigger>
              <TabsTrigger
                className="px-[calc(var(--control-padding-x)*0.75)] text-xs"
                value="7d"
              >
                7 天
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer
          className="aspect-auto h-64 w-full md:h-72"
          config={dashboardChartConfig}
          initialDimension={{ width: 900, height: 288 }}
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient
                id="dashboardFillDesktop"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <linearGradient
                id="dashboardFillMobile"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.06}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="month"
              minTickGap={24}
              tickLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={false}
            />
            <Area
              dataKey="mobile"
              fill="url(#dashboardFillMobile)"
              stackId="a"
              stroke="var(--color-mobile)"
              type="natural"
            />
            <Area
              dataKey="desktop"
              fill="url(#dashboardFillDesktop)"
              stackId="a"
              stroke="var(--color-desktop)"
              type="natural"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function DashboardDataTablePreview() {
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([1, 3])
  const [visibleColumns, setVisibleColumns] = useState<
    Record<DashboardColumnKey, boolean>
  >({
    type: true,
    status: true,
    target: true,
    limit: true,
    owner: true,
  })
  const [openRowId, setOpenRowId] = useState<number | null>(1)
  const openRow = dashboardRows.find((row) => row.id === openRowId)
  const selectedCount = selectedRowIds.length
  const allSelected = selectedCount === dashboardRows.length

  function toggleRow(rowId: number, checked: boolean) {
    setSelectedRowIds((current) =>
      checked
        ? Array.from(new Set([...current, rowId]))
        : current.filter((id) => id !== rowId)
    )
  }

  function toggleAllRows(checked: boolean) {
    setSelectedRowIds(checked ? dashboardRows.map((row) => row.id) : [])
  }

  return (
    <Tabs className="w-full gap-4 px-4 lg:px-6" defaultValue="outline">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Button className="md:hidden" size="sm" variant="outline">
            <Rows3 className="size-4" />
            目录
            <ChevronDown className="size-4" />
          </Button>
          <TabsList className="hidden max-w-full md:inline-flex">
            <TabsTrigger value="outline">目录</TabsTrigger>
            <TabsTrigger value="performance">
              绩效
              <Badge className="ml-1 size-5 rounded-full px-1" variant="secondary">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="people">
              人员
              <Badge className="ml-1 size-5 rounded-full px-1" variant="secondary">
                2
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="documents">焦点文档</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button className="hidden sm:inline-flex" size="sm" variant="outline">
            <SlidersHorizontal className="size-4" />
            筛选
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Columns3 className="size-4" />
                <span className="hidden sm:inline">自定义列</span>
                <span className="sm:hidden">列</span>
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>显示列</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {dashboardColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  checked={visibleColumns[column.key]}
                  key={column.key}
                  onCheckedChange={(checked) =>
                    setVisibleColumns((current) => ({
                      ...current,
                      [column.key]: checked === true,
                    }))
                  }
                >
                  {column.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline">
            <Plus className="size-4" />
            <span className="hidden sm:inline">添加章节</span>
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-card)] border border-border bg-card">
        <Table className="min-w-[920px]">
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-9" />
              <TableHead className="w-9">
                <Checkbox
                  aria-label="选择全部行"
                  checked={
                    allSelected
                      ? true
                      : selectedCount > 0
                        ? "indeterminate"
                        : false
                  }
                  onCheckedChange={(checked) => toggleAllRows(checked === true)}
                />
              </TableHead>
              <TableHead>章节</TableHead>
              {visibleColumns.type ? <TableHead>类型</TableHead> : null}
              {visibleColumns.status ? <TableHead>状态</TableHead> : null}
              {visibleColumns.target ? (
                <TableHead className="text-right">目标</TableHead>
              ) : null}
              {visibleColumns.limit ? (
                <TableHead className="text-right">限制</TableHead>
              ) : null}
              {visibleColumns.owner ? <TableHead>负责人</TableHead> : null}
              <TableHead>更新</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {dashboardRows.map((row) => (
              <TableRow
                data-state={selectedRowIds.includes(row.id) ? "selected" : undefined}
                key={row.id}
              >
                <TableCell className="text-muted-foreground">
                  <GripVertical className="size-4" />
                </TableCell>
                <TableCell>
                  <Checkbox
                    aria-label={`选择 ${row.name}`}
                    checked={selectedRowIds.includes(row.id)}
                    onCheckedChange={(checked) =>
                      toggleRow(row.id, checked === true)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Button
                    className="h-auto justify-start px-0 text-left text-foreground"
                    onClick={() => setOpenRowId(row.id)}
                    size="sm"
                    variant="link"
                  >
                    {row.name}
                  </Button>
                </TableCell>
                {visibleColumns.type ? (
                  <TableCell className="text-muted-foreground">
                    <Badge className="px-1.5" variant="outline">
                      {row.type}
                    </Badge>
                  </TableCell>
                ) : null}
                {visibleColumns.status ? (
                  <TableCell>
                    <StatusPill tone={dashboardStatusTone[row.status]}>
                      {row.status}
                    </StatusPill>
                  </TableCell>
                ) : null}
                {visibleColumns.target ? (
                  <TableCell className="text-right tabular-nums">
                    {row.target}
                  </TableCell>
                ) : null}
                {visibleColumns.limit ? (
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {row.limit}
                  </TableCell>
                ) : null}
                {visibleColumns.owner ? (
                  <TableCell>{row.owner}</TableCell>
                ) : null}
                <TableCell className="text-muted-foreground">
                  {row.updated}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-label="更多操作" size="icon-xs" variant="ghost">
                        <MoreVertical className="size-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem>编辑</DropdownMenuItem>
                      <DropdownMenuItem>复制</DropdownMenuItem>
                      <DropdownMenuItem>收藏</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {openRow ? (
        <div className="grid gap-4 rounded-[var(--radius-card)] border border-border bg-[var(--surface-panel)] p-[var(--panel-padding)] lg:grid-cols-[1fr_auto]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <CircleCheck className="size-4 text-muted-foreground" />
              <p className="truncate text-sm font-medium">{openRow.name}</p>
              <StatusPill tone={dashboardStatusTone[openRow.status]}>
                {openRow.status}
              </StatusPill>
            </div>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              显示所选章节最近 6 个月的目标、限制和负责人信息，用作官方
              dashboard detail drawer 的预览替代。
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm lg:min-w-72">
            <div>
              <p className="text-xs text-muted-foreground">目标</p>
              <p className="mt-1 font-medium tabular-nums">{openRow.target}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">限制</p>
              <p className="mt-1 font-medium tabular-nums">{openRow.limit}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">负责人</p>
              <p className="mt-1 font-medium">{openRow.owner}</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">
          已选中 {selectedCount} 行，共 {dashboardRows.length} 行。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 lg:flex">
            <span className="text-sm text-muted-foreground">每页行数</span>
            <Button size="sm" variant="outline">
              10
              <ChevronDown className="size-4" />
            </Button>
          </div>
          <span className="text-sm font-medium">第 1 / 10 页</span>
          <Button
            aria-label="第一页"
            className="hidden lg:inline-flex"
            size="icon-sm"
            variant="outline"
          >
            <ChevronsLeft className="size-4" />
          </Button>
          <Button aria-label="上一页" size="icon-sm" variant="outline">
            <ChevronLeft className="size-4" />
          </Button>
          <Button aria-label="下一页" size="icon-sm" variant="outline">
            <ChevronRight className="size-4" />
          </Button>
          <Button
            aria-label="最后一页"
            className="hidden lg:inline-flex"
            size="icon-sm"
            variant="outline"
          >
            <ChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </Tabs>
  )
}

function DashboardBlock() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-background text-foreground [box-shadow:var(--elevation-card)]">
      <div className="relative flex min-h-[720px] w-full min-w-0">
        <DashboardSidebar
          collapsed={isSidebarCollapsed}
          mobileOpen={isMobileSidebarOpen}
          onCollapsedChange={setIsSidebarCollapsed}
          onMobileOpenChange={setIsMobileSidebarOpen}
        />
        <main className="@container/main flex min-w-0 flex-1 flex-col">
          <DashboardSiteHeader
            collapsed={isSidebarCollapsed}
            onCollapsedChange={setIsSidebarCollapsed}
            onMobileOpenChange={setIsMobileSidebarOpen}
          />
          <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DashboardSectionCards />
            <div className="px-4 lg:px-6">
              <DashboardAreaChart />
            </div>
            <DashboardDataTablePreview />
          </div>
        </main>
      </div>
    </section>
  )
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M12.15 6.9c-.95 0-2.42-1.08-3.96-1.04-2.04.03-3.91 1.18-4.96 3.01-2.12 3.68-.55 9.1 1.52 12.09 1.01 1.45 2.21 3.09 3.79 3.04 1.52-.07 2.09-.99 3.94-.99 1.83 0 2.35.99 3.96.95 1.64-.03 2.68-1.48 3.68-2.95 1.16-1.69 1.64-3.33 1.66-3.42-.04-.01-3.18-1.22-3.22-4.86-.03-3.04 2.48-4.49 2.6-4.56-1.43-2.09-3.62-2.32-4.39-2.38-2-.16-3.68 1.09-4.61 1.09zM15.53 3.83c.84-1.01 1.4-2.43 1.25-3.83-1.21.05-2.66.81-3.53 1.82-.78.9-1.45 2.34-1.27 3.71 1.34.1 2.72-.69 3.56-1.7"
        fill="currentColor"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.19-1.79 4.13-1.15 1.15-2.93 2.4-6.05 2.4-4.83 0-8.6-3.89-8.6-8.72s3.77-8.72 8.6-8.72c2.6 0 4.51 1.03 5.91 2.35l2.31-2.31C18.75 1.44 16.13 0 12.48 0 5.87 0 .31 5.39.31 12s5.56 12 12.17 12c3.57 0 6.27-1.17 8.37-3.36 2.16-2.16 2.84-5.21 2.84-7.67 0-.76-.05-1.47-.17-2.05z"
        fill="currentColor"
      />
    </svg>
  )
}

function MetaIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M6.92 4.03c-1.97 0-3.68 1.28-4.87 3.11C.7 9.21 0 11.88 0 14.45c0 .71.07 1.37.21 1.97.14.61.35 1.15.64 1.62.7 1.16 1.82 1.93 3.59 1.93 1.5 0 2.63-.67 3.97-2.44.76-1.01 1.14-1.63 2.66-4.32l.76-1.34.19-.33.18.3 2.15 3.6c.72 1.21 1.67 2.56 2.47 3.31 1.05.99 1.99 1.22 3.06 1.22s1.88-.36 2.45-.84c.34-.29.61-.62.81-.97.54-.94.86-2.13.86-3.75 0-2.72-.68-5.36-2.08-7.45-1.28-1.91-2.96-2.93-4.72-2.93-1.05 0-2.09.47-3.05 1.31-.65.57-1.26 1.29-1.82 2.05-.69-.88-1.34-1.55-1.96-2.06-1.18-.97-2.32-1.3-3.45-1.3zm10.16 2.05c1.15 0 2.19.76 2.99 2 1.13 1.75 1.65 4.2 1.65 6.4 0 1.55-.37 2.9-1.84 2.9-.58 0-1.03-.23-1.66-1-.5-.6-1.34-1.88-2.83-4.36l-.62-1.03c-.46-.77-.89-1.42-1.26-1.98.07-.11.14-.22.21-.33 1.12-1.67 2.12-2.6 3.36-2.6zm-10.2.55c1.27 0 2.06.79 2.68 1.45.31.33.74.87 1.23 1.58l-1.02 1.57c-.76 1.16-1.88 3.02-2.84 4.34-1.19 1.65-1.81 1.82-2.49 1.82-.52 0-1.04-.24-1.38-.79-.26-.43-.46-1.13-.46-2.05 0-2.22.63-4.54 1.66-6.09.45-.69.96-1.23 1.53-1.53.34-.19.7-.29 1.09-.29z"
        fill="currentColor"
      />
    </svg>
  )
}

function SignupBlock() {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-muted text-foreground [box-shadow:var(--elevation-card)]">
      <div className="flex min-h-[760px] flex-col items-center justify-center p-6 md:p-10">
        <div className="flex w-full max-w-xl flex-col gap-6">
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <form
                className="p-[var(--page-padding)]"
                onSubmit={(event) => event.preventDefault()}
              >
                <FieldGroup className="gap-[var(--section-gap)]">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h3 className="text-2xl font-[var(--font-weight-heading)]">
                      创建你的账号
                    </h3>
                    <p className="text-balance text-sm text-muted-foreground">
                      输入以下信息，开通 Alibaba 主题工作区。
                    </p>
                  </div>

                  <FormField>
                    <FieldLabel htmlFor="signup-preview-full-name">
                      姓名
                    </FieldLabel>
                    <Input
                      className={signupControlClass}
                      id="signup-preview-full-name"
                      placeholder="林安娜"
                      type="text"
                    />
                  </FormField>

                  <FormField>
                    <FieldLabel htmlFor="signup-preview-email">
                      工作邮箱
                    </FieldLabel>
                    <Input
                      className={signupControlClass}
                      id="signup-preview-email"
                      placeholder="anna@alibaba.com"
                      type="email"
                    />
                    <FieldDescription>
                      我们会使用此邮箱联系你，不会与其他人共享。
                    </FieldDescription>
                  </FormField>

                  <FormField className="grid gap-[var(--field-gap)] sm:grid-cols-2">
                    <FormField>
                      <FieldLabel htmlFor="signup-preview-workspace">
                        工作区名称
                      </FieldLabel>
                      <Input
                        className={signupControlClass}
                        id="signup-preview-workspace"
                        placeholder="Alibaba Design"
                        type="text"
                      />
                    </FormField>
                    <FormField>
                      <FieldLabel htmlFor="signup-preview-role">
                        你的角色
                      </FieldLabel>
                      <Select defaultValue="designer">
                        <SelectTrigger
                          className={`${signupControlClass} w-full`}
                          id="signup-preview-role"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="designer">设计师</SelectItem>
                          <SelectItem value="engineer">工程师</SelectItem>
                          <SelectItem value="pm">产品经理</SelectItem>
                          <SelectItem value="lead">团队负责人</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </FormField>

                  <FormField className="grid gap-[var(--field-gap)] sm:grid-cols-2">
                    <FormField>
                      <FieldLabel htmlFor="signup-preview-team-size">
                        团队规模
                      </FieldLabel>
                      <Select defaultValue="medium">
                        <SelectTrigger
                          className={`${signupControlClass} w-full`}
                          id="signup-preview-team-size"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">1-10 人</SelectItem>
                          <SelectItem value="medium">11-50 人</SelectItem>
                          <SelectItem value="large">51-200 人</SelectItem>
                          <SelectItem value="enterprise">200+ 人</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                    <FormField>
                      <FieldLabel htmlFor="signup-preview-region">
                        区域
                      </FieldLabel>
                      <Select defaultValue="cn">
                        <SelectTrigger
                          className={`${signupControlClass} w-full`}
                          id="signup-preview-region"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cn">中国大陆</SelectItem>
                          <SelectItem value="apac">亚太</SelectItem>
                          <SelectItem value="emea">欧洲 / 中东</SelectItem>
                          <SelectItem value="global">全球</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </FormField>

                  <FormField>
                    <FormField className="grid gap-[var(--field-gap)] sm:grid-cols-2">
                      <FormField>
                        <FieldLabel htmlFor="signup-preview-password">
                          密码
                        </FieldLabel>
                        <Input
                          className={signupControlClass}
                          id="signup-preview-password"
                          type="password"
                        />
                      </FormField>
                      <FormField>
                        <FieldLabel htmlFor="signup-preview-confirm-password">
                          确认密码
                        </FieldLabel>
                        <Input
                          className={signupControlClass}
                          id="signup-preview-confirm-password"
                          type="password"
                        />
                      </FormField>
                    </FormField>
                    <FieldDescription>
                      密码长度至少 8 个字符。
                    </FieldDescription>
                  </FormField>

                  <FormField>
                    <FieldLabel htmlFor="signup-preview-invite">
                      邀请码
                    </FieldLabel>
                    <Input
                      className={signupControlClass}
                      id="signup-preview-invite"
                      placeholder="ALIBABA-TEAM"
                      type="text"
                    />
                    <FieldDescription>没有邀请码也可以先创建试用工作区。</FieldDescription>
                  </FormField>

                  <FormField>
                    <Button type="submit">创建账号</Button>
                  </FormField>

                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    或继续使用
                  </FieldSeparator>

                  <FormField className="grid grid-cols-3 gap-[var(--field-gap)]">
                    <Button aria-label="使用 Apple 注册" type="button" variant="outline">
                      <AppleIcon />
                    </Button>
                    <Button aria-label="使用 Google 注册" type="button" variant="outline">
                      <GoogleIcon />
                    </Button>
                    <Button aria-label="使用 Meta 注册" type="button" variant="outline">
                      <MetaIcon />
                    </Button>
                  </FormField>

                  <FieldDescription className="text-center">
                    已有账号？ <a href="#">登录</a>
                  </FieldDescription>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            点击继续即表示你同意我们的 <a href="#">服务条款</a> 和{" "}
            <a href="#">隐私政策</a>。
          </FieldDescription>
        </div>
      </div>
    </section>
  )
}

function SettingsBlock() {
  return (
    <BlockSection
      title="设置模块"
      description="资料字段、偏好设置、API 访问和危险区域用来验证表单密度与破坏性语义。"
    >
      <BlockCard>
        <div className="mb-5 flex flex-col gap-3 border-border border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h4 className="text-xl font-[var(--font-weight-heading)]">
              设置
            </h4>
            <p className="text-sm text-muted-foreground">
              管理工作区资料和访问权限。
            </p>
          </div>
          <MiniButton>保存修改</MiniButton>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <BlockCard title="资料" className="[box-shadow:none]">
              <div className="grid gap-3">
                <Field label="姓名" value="林安娜" />
                <Field label="邮箱" type="email" value="olivia@example.com" />
                <MiniButton size="sm">保存资料</MiniButton>
              </div>
            </BlockCard>

            <BlockCard title="API 访问" className="[box-shadow:none]">
              <div className="space-y-3">
                <div className="flex min-h-[var(--list-row-height)] min-w-0 items-center justify-between gap-3 rounded-[var(--radius-control)] border border-border bg-background px-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">sk_live_****82d</p>
                    <p className="text-xs text-muted-foreground">
                      今天使用过
                    </p>
                  </div>
                  <MiniButton size="sm" variant="outline">
                    重新生成
                  </MiniButton>
                </div>
              </div>
            </BlockCard>
          </div>

          <div className="space-y-4">
            <BlockCard title="偏好设置" className="[box-shadow:none]">
              <div className="space-y-2">
                <StaticSwitch checked label="邮件通知" />
                <StaticSwitch checked={false} label="周报摘要" />
                <label className="block space-y-2 pt-3">
                  <span className="text-sm font-medium">默认角色</span>
                  <select className="h-[var(--control-height-md)] w-full rounded-[var(--radius-control)] border border-border bg-background px-3 text-sm text-foreground outline-none ring-ring focus-visible:ring-2">
                    <option>编辑者</option>
                    <option>管理员</option>
                    <option>查看者</option>
                  </select>
                </label>
              </div>
            </BlockCard>

            <BlockCard
              title="危险区域"
              description="破坏性操作需要保持清晰的语义区分。"
              className="border-[var(--status-danger)] bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)] [box-shadow:none]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm">
                  删除此工作区，并撤销所有已生成的 API key。
                </p>
                <MiniButton variant="destructive">删除工作区</MiniButton>
              </div>
            </BlockCard>
          </div>
        </div>
      </BlockCard>
    </BlockSection>
  )
}

function DataTableBlock() {
  const rows = [
    ["Alibaba 工作区", "活跃", "安娜", "82%", "今天", "success"],
    ["北极星 CRM", "待处理", "马可", "47%", "昨天", "warning"],
    ["Vertex AI 运维", "预警", "陈", "91%", "2 天前", "info"],
    ["Atlas 金融", "已停用", "诺拉", "13%", "上周", "neutral"],
    ["试点项目", "错误", "山姆", "66%", "上月", "danger"],
  ] as const

  return (
    <BlockSection
      title="数据表格模块"
      description="密集后台表格用来测试行节奏、弱化元信息、选中行、悬停态和状态可读性。"
    >
      <BlockCard>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <h4 className="font-[var(--font-weight-heading)]">
              工作区
            </h4>
            <p className="text-sm text-muted-foreground">
              用量、负责人、账单和生命周期状态。
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex h-[var(--control-height-md)] items-center rounded-[var(--radius-control)] border border-border bg-background px-3 text-sm text-muted-foreground">
              搜索工作区...
            </div>
            <MiniButton variant="outline">筛选</MiniButton>
            <MiniButton variant="outline">导出</MiniButton>
            <MiniButton>创建</MiniButton>
          </div>
        </div>

        <div className="overflow-hidden rounded-[var(--radius-card)] border border-border">
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-[var(--surface-panel)] text-muted-foreground">
                <tr>
                  {[
                    "",
                    "名称",
                    "状态",
                    "负责人",
                    "用量",
                    "更新",
                    "操作",
                  ].map((header) => (
                    <th
                      key={header || "check"}
                      className="border-border border-b px-4 py-3 text-left font-medium"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(([name, status, owner, usage, updated, tone], index) => (
                  <tr
                    key={name}
                    className={cn(
                      "border-border border-b last:border-b-0",
                      index === 1 && "bg-accent",
                      index === 2 && "bg-[var(--surface-panel)]"
                    )}
                  >
                    <td className="px-4 py-3">
                      <div
                        aria-hidden="true"
                        className={cn(
                          "h-4 w-4 rounded-[var(--radius-control)] border border-border bg-background",
                          index === 1 && "bg-primary"
                        )}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        工作区
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill tone={tone}>{status}</StatusPill>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{owner}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: usage }}
                          />
                        </div>
                        <span className="font-mono text-xs">{usage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {updated}
                    </td>
                    <td className="px-4 py-3">
                      <MiniButton size="sm" variant="ghost">
                        打开
                      </MiniButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted-foreground">已选中 128 行中的 5 行</p>
          <div className="flex gap-2">
            <MiniButton size="sm" variant="outline">
              上一页
            </MiniButton>
            <MiniButton size="sm" variant="outline">
              下一页
            </MiniButton>
          </div>
        </div>
      </BlockCard>
    </BlockSection>
  )
}

function AuthBlock() {
  return (
    <BlockSection
      title="认证模块"
      description="紧凑登录界面用来测试主要动作清晰度、卡片质感、字体和低密度构图。"
    >
      <BlockCard className="flex min-h-[420px] items-center justify-center bg-[var(--surface-panel)]">
        <div className="w-full max-w-sm rounded-[var(--radius-panel)] border border-border bg-card p-[var(--panel-padding)] text-card-foreground [box-shadow:var(--elevation-dialog)]">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] bg-primary font-[var(--font-weight-heading)] text-primary-foreground">
              TL
            </div>
            <h4 className="text-xl font-[var(--font-weight-heading)]">
              欢迎回来
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              登录后继续进入你的工作区。
            </p>
          </div>
          <div className="space-y-3">
            <Field label="邮箱" type="email" placeholder="you@example.com" />
            <Field label="密码" type="password" value="********" />
            <MiniButton>继续</MiniButton>
            <MiniButton variant="outline">使用 SSO 继续</MiniButton>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
                或
              <span className="h-px flex-1 bg-border" />
            </div>
            <p className="text-center text-xs leading-5 text-muted-foreground">
              继续即表示你同意工作区政策。
            </p>
          </div>
        </div>
      </BlockCard>
    </BlockSection>
  )
}

type AssistantTone =
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "inverse"

type AssistantRailItem = {
  icon: DashboardIcon
  label: string
  active?: boolean
  badge?: string
}

type AssistantSavedAgent = {
  icon: DashboardIcon
  name: string
  meta: string
  tone: AssistantTone
}

type AssistantThreadGroup = {
  label: string
  items: string[]
}

type AssistantAction = {
  icon: DashboardIcon
  label: string
  tone: AssistantTone
}

const assistantToneClasses = {
  primary: "bg-primary text-primary-foreground",
  info: "bg-[var(--status-info-bg)] text-[var(--status-info-fg)]",
  success: "bg-[var(--status-success-bg)] text-[var(--status-success-fg)]",
  warning: "bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]",
  danger: "bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)]",
  neutral: "bg-muted text-muted-foreground",
  inverse: "bg-[var(--surface-inverse)] text-[var(--content-inverse)]",
} satisfies Record<AssistantTone, string>

const assistantRailItems = [
  { icon: MessageSquare, label: "对话", active: true },
  { icon: Headphones, label: "语音支持" },
  { icon: Zap, label: "自动化" },
  { icon: Puzzle, label: "插件" },
  { icon: CreditCard, label: "账单" },
  { icon: ListChecks, label: "任务" },
  { icon: Users, label: "成员", badge: "新" },
] satisfies AssistantRailItem[]

const assistantSavedAgents = [
  {
    icon: Bot,
    name: "ChatAI",
    meta: "通用助手",
    tone: "info",
  },
  {
    icon: ImageIcon,
    name: "太阳图像",
    meta: "图像生成",
    tone: "warning",
  },
  {
    icon: ChartBar,
    name: "数据分析师",
    meta: "经营洞察",
    tone: "primary",
  },
] satisfies AssistantSavedAgent[]

const assistantThreadGroups = [
  {
    label: "今天",
    items: [
      "如何提升我的时间管理效率？",
      "学习一项新技能的最佳方式是什么？",
      "如何开始配置企业知识库？",
    ],
  },
  {
    label: "昨天",
    items: [
      "每日运动有哪些核心收益？",
      "UI 设计系统和组件库有什么区别？",
    ],
  },
] satisfies AssistantThreadGroup[]

const assistantTaskItems = [
  "回答 RFP 文档",
  "进行竞品分析",
  "优化沟通反馈",
] as const

const assistantQuickActions = [
  { icon: CalendarDays, label: "连接日历", tone: "danger" },
  { icon: ClipboardList, label: "演示任务", tone: "info" },
  { icon: PlugZap, label: "浏览集成", tone: "warning" },
  { icon: Link2, label: "共享到笔记", tone: "success" },
] satisfies AssistantAction[]

const assistantContextSources = [
  ["客户通话纪要", "12 篇", "success"],
  ["RFP 文档库", "8 份", "info"],
  ["品牌规则", "已锁定", "warning"],
] as const

function AssistantIconBubble(props: {
  icon: DashboardIcon
  tone?: AssistantTone
  className?: string
}) {
  const Icon = props.icon

  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
        assistantToneClasses[props.tone ?? "neutral"],
        props.className
      )}
    >
      <Icon className="size-4" />
    </span>
  )
}

function AssistantRailButton(props: { item: AssistantRailItem }) {
  const Icon = props.item.icon

  return (
    <button
      aria-label={props.item.label}
      type="button"
      className={cn(
        "relative flex size-9 items-center justify-center rounded-[var(--radius-control)] ring-ring transition-colors focus-visible:outline-none focus-visible:ring-2",
        props.item.active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="size-4" />
      {props.item.badge ? (
        <span className="absolute -right-1 -top-1 rounded-[var(--radius-pill)] bg-primary px-1.5 py-0.5 text-[10px] font-medium leading-none text-primary-foreground">
          {props.item.badge}
        </span>
      ) : null}
    </button>
  )
}

function AssistantWorkspaceBlock() {
  return (
    <section className="@container/assistant w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-muted p-3 text-foreground [box-shadow:var(--elevation-card)] sm:p-4">
      <div
        className="grid min-h-[820px] min-w-0 grid-cols-1 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-background @[760px]/assistant:grid-cols-[4.25rem_minmax(0,1fr)] @[1100px]/assistant:grid-cols-[4.25rem_17rem_minmax(0,1fr)]"
        data-assistant-ui-thread-list
      >
        <aside className="hidden min-h-0 flex-col items-center border-border border-r bg-background px-3 py-4 @[760px]/assistant:flex">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground [box-shadow:var(--elevation-popover)]">
            <Sparkles className="size-5" />
          </div>
          <nav className="mt-7 flex flex-1 flex-col items-center gap-2">
            {assistantRailItems.map((item) => (
              <AssistantRailButton item={item} key={item.label} />
            ))}
          </nav>
          <div className="flex flex-col items-center gap-2">
            <Button aria-label="外观设置" size="icon-sm" variant="ghost">
              <Sun className="size-4" />
            </Button>
            <Button
              aria-label="个人中心"
              className="rounded-full"
              size="icon-sm"
              variant="outline"
            >
              <UserRound className="size-4" />
            </Button>
          </div>
        </aside>

        <aside className="hidden min-h-0 flex-col border-border border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)] @[1100px]/assistant:flex">
          <div className="flex items-center gap-3 px-5 py-4">
            <p className="flex-1 text-sm font-[var(--font-weight-heading)]">
              对话
            </p>
            <Button aria-label="搜索对话" size="icon-sm" variant="ghost">
              <Search className="size-4" />
            </Button>
          </div>
          <div className="px-5">
            <Button className="w-full bg-[var(--surface-inverse)] text-[var(--content-inverse)] hover:bg-[var(--surface-inverse)]/90">
              <Plus className="size-4" />
              新建对话
              <Sparkles className="size-3" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="size-3.5" />
                已收藏
              </div>
              <div className="space-y-1">
                {assistantSavedAgents.map((agent) => (
                  <button
                    className="flex min-h-[var(--list-row-height)] w-full min-w-0 items-center gap-3 rounded-[var(--radius-control)] px-2 text-left text-sm hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                    key={agent.name}
                    type="button"
                  >
                    <AssistantIconBubble
                      icon={agent.icon}
                      tone={agent.tone}
                      className="size-6"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {agent.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {agent.meta}
                      </span>
                    </span>
                    <MoreVertical className="size-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            <Separator className="my-5" />

            <div className="space-y-5">
              {assistantThreadGroups.map((group) => (
                <div className="space-y-2" key={group.label}>
                  <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span>{group.label}</span>
                    <ChevronDown className="size-3.5" />
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <button
                        className="block w-full truncate rounded-[var(--radius-control)] px-2 py-1.5 text-left text-xs text-muted-foreground hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                        key={item}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-border border-t p-5">
            <Button className="w-full" variant="outline">
              升级到专业版
            </Button>
          </div>
        </aside>

        <main
          className="@container/thread flex min-w-0 flex-col bg-[var(--surface-panel)]"
          data-assistant-ui-thread
        >
          <header className="flex flex-col gap-3 border-border border-b bg-background/95 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h3 className="truncate font-[var(--font-weight-heading)]">
                  灵犀 GPT
                </h3>
                <Badge variant="secondary">企业版</Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground @[1100px]/assistant:hidden">
                中文 assistant-ui 工作台
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline">
                <SlidersHorizontal className="size-4" />
                配置
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="size-4" />
                分享
              </Button>
              <Button size="sm">
                新建对话
                <Sparkles className="size-3.5" />
              </Button>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6 xl:p-8">
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
              <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6">
                <AssistantIconBubble
                  icon={Wand2}
                  tone="primary"
                  className="size-12"
                />
                <div className="max-w-2xl text-center">
                  <h4 className="text-2xl font-[var(--font-weight-heading)] tracking-[var(--tracking-heading)]">
                    你好，欢迎回来
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    告诉我你需要什么，剩下的交给我。
                  </p>
                </div>

                <div className="grid w-full gap-3 @[740px]/thread:grid-cols-[1fr_1.1fr_1fr]">
                  <div className="min-w-0 rounded-[var(--radius-card)] bg-[var(--surface-inverse)] p-4 text-[var(--content-inverse)] [box-shadow:var(--elevation-popover)]">
                    <div className="flex min-w-0 items-center gap-2">
                      <AssistantIconBubble
                        icon={UserRound}
                        tone="info"
                        className="size-6"
                      />
                      <p className="min-w-0 flex-1 truncate text-sm font-medium">
                        李想
                      </p>
                      <Badge>数据助手</Badge>
                    </div>
                    <p className="mt-4 text-sm leading-6 opacity-90">
                      负责整理销售流程、客户互动和团队协作摘要。
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-[var(--radius-pill)] bg-background/10 px-2 py-1 text-xs">
                        CRM
                      </span>
                      <span className="rounded-[var(--radius-pill)] bg-background/10 px-2 py-1 text-xs">
                        会议纪要
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-card)] border border-border bg-card text-card-foreground [box-shadow:var(--elevation-card)]">
                    <div className="space-y-1 p-4">
                      {assistantTaskItems.map((item) => (
                        <button
                          className="flex min-h-9 w-full items-center gap-2 rounded-[var(--radius-control)] px-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                          key={item}
                          type="button"
                        >
                          <FileText className="size-4 text-muted-foreground" />
                          <span className="min-w-0 flex-1 truncate">{item}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center justify-between border-border border-t px-4 py-3 text-xs text-muted-foreground">
                      <span>任务</span>
                      <button className="text-primary" type="button">
                        查看全部
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-card)] border border-border bg-card text-card-foreground [box-shadow:var(--elevation-card)]">
                    <div className="flex items-start gap-3 p-4">
                      <p className="min-w-0 flex-1 text-sm font-medium leading-6">
                        我应该向潜在客户强调产品 1 的哪些核心优势？
                      </p>
                      <Button aria-label="更多提示" size="icon-xs" variant="ghost">
                        <MoreVertical className="size-3" />
                      </Button>
                    </div>
                    <div className="border-border border-t px-4 py-3 text-xs text-muted-foreground">
                      建议提示词
                    </div>
                  </div>
                </div>

                <div className="flex w-full flex-wrap justify-center gap-3">
                  {assistantQuickActions.map((action) => (
                    <Button
                      className="rounded-[var(--radius-pill)] bg-background px-4 [box-shadow:var(--elevation-card)]"
                      key={action.label}
                      variant="outline"
                    >
                      <AssistantIconBubble
                        icon={action.icon}
                        tone={action.tone}
                        className="size-7"
                      />
                      {action.label}
                    </Button>
                  ))}
                </div>

                <div className="grid w-full gap-3 @[780px]/thread:grid-cols-3">
                  <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">上下文来源</p>
                      <Badge variant="outline">3 个已选</Badge>
                    </div>
                    <div className="space-y-2">
                      {assistantContextSources.map(([name, meta, tone]) => (
                        <label
                          className="flex min-h-9 items-center gap-3 rounded-[var(--radius-control)] text-sm"
                          key={name}
                        >
                          <Checkbox defaultChecked />
                          <span className="min-w-0 flex-1 truncate">{name}</span>
                          <StatusPill tone={tone}>{meta}</StatusPill>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">工具队列</p>
                      <StatusPill tone="info">运行中</StatusPill>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <AssistantIconBubble icon={ShieldCheck} tone="success" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">安全检查</p>
                          <p className="truncate text-xs text-muted-foreground">
                            token 权限和知识库范围已确认
                          </p>
                        </div>
                        <Check className="size-4 text-[var(--status-success-fg)]" />
                      </div>
                      <Progress value={72} />
                      <p className="text-xs text-muted-foreground">
                        正在解析 8 份文档，预计 24 秒完成。
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[var(--radius-card)] border border-border bg-background p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">模型与输出</p>
                      <Badge variant="secondary">低延迟</Badge>
                    </div>
                    <div className="space-y-3">
                      <Select defaultValue="team">
                        <SelectTrigger
                          className="h-9 w-full rounded-[var(--radius-control)] bg-background pr-9"
                          size="sm"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="team">团队知识库</SelectItem>
                          <SelectItem value="crm">客户 CRM</SelectItem>
                          <SelectItem value="docs">产品文档</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-[var(--radius-control)] bg-muted p-3">
                          <p className="text-xs text-muted-foreground">语气</p>
                          <p className="mt-1 text-sm font-medium">专业</p>
                        </div>
                        <div className="rounded-[var(--radius-control)] bg-muted p-3">
                          <p className="text-xs text-muted-foreground">格式</p>
                          <p className="mt-1 text-sm font-medium">要点</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mx-auto w-full max-w-4xl space-y-3 pb-2">
                <div
                  className="rounded-[var(--radius-panel)] border border-border bg-background p-3 [box-shadow:var(--elevation-card)]"
                  data-assistant-ui-composer
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-1 size-4 shrink-0 text-muted-foreground" />
                    <Textarea
                      className="min-h-14 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                      placeholder="问我任何问题..."
                    />
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <Select defaultValue="workspace">
                      <SelectTrigger
                        className="h-8 w-full rounded-[var(--radius-pill)] bg-background pr-9 sm:w-40"
                        size="sm"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="workspace">选择来源</SelectItem>
                        <SelectItem value="files">文件</SelectItem>
                        <SelectItem value="notes">团队笔记</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <Paperclip className="size-4" />
                        附件
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mic className="size-4" />
                        语音
                      </Button>
                      <Button size="sm">
                        <Send className="size-4" />
                        发送
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs leading-5 text-muted-foreground">
                  灵犀可能会显示不准确的信息，请核对关键结果。你的隐私和
                  Alibaba GPT 受到工作区策略保护。
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  )
}

function AssistantChatBlock() {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[var(--radius-panel)] border border-border bg-background text-foreground [box-shadow:var(--elevation-card)]">
      <SidebarProvider className="relative min-h-[1120px] w-full overflow-hidden [&_[data-slot=sidebar-container]]:!absolute [&_[data-slot=sidebar-container]]:!inset-y-0 [&_[data-slot=sidebar-container]]:!h-full [&_[data-slot=sidebar-container]]:overflow-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0 overflow-hidden">
          <header className="flex h-14 shrink-0 items-center gap-2">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <div className="mr-2 h-4 w-px bg-border" />
              <div className="min-w-0 flex-1 truncate text-sm font-medium">
                Project Management & Task Tracking
              </div>
            </div>
            <div className="ml-auto px-3">
              <NavActions />
            </div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-6">
            <AssistantThread className="min-h-0 flex-1 rounded-[var(--radius-panel)]" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </section>
  )
}

function PricingMarketingBlock() {
  const plans = [
    ["入门版", "$19", "适合小型产品团队", false],
    ["专业版", "$49", "适合交付设计系统", true],
    ["规模版", "定制", "适合多品牌组织", false],
  ] as const

  return (
    <BlockSection
      title="定价 / 营销模块"
      description="营销构图用来测试大字号、CTA 对比、套餐层级和非后台场景友好度。"
    >
      <BlockCard>
        <div className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <StatusPill tone="info">主题生成器</StatusPill>
            <h4 className="text-[length:var(--text-display)] font-[var(--font-weight-heading)] tracking-[var(--tracking-heading)]">
              更快构建一致界面
            </h4>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              一个 seed 驱动的主题系统，把视觉方向转译成可直接应用的 token。
            </p>
            <div className="flex flex-wrap gap-2">
              <MiniButton>生成主题</MiniButton>
              <MiniButton variant="outline">查看预览</MiniButton>
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-border bg-[var(--surface-panel)] p-[var(--panel-padding)]">
            <p className="font-[var(--font-weight-heading)]">
              产品团队正在使用
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              “导出的规则让 AI 生成页面始终贴合设计系统。”
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {plans.map(([name, price, description, highlighted]) => (
            <div
              key={name}
              className={cn(
                "rounded-[var(--radius-card)] border p-[var(--panel-padding)]",
                highlighted
                  ? "border-primary bg-primary text-primary-foreground [box-shadow:var(--elevation-popover)]"
                  : "border-border bg-card text-card-foreground"
              )}
            >
              <p className="font-[var(--font-weight-heading)]">{name}</p>
              <p className="mt-3 text-3xl font-[var(--font-weight-heading)]">
                {price}
              </p>
              <p
                className={cn(
                  "mt-2 text-sm",
                  highlighted
                    ? "text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                {description}
              </p>
              <MiniButton
                variant={highlighted ? "secondary" : "outline"}
                size="sm"
              >
                选择 {name}
              </MiniButton>
            </div>
          ))}
        </div>
      </BlockCard>
    </BlockSection>
  )
}

function OperationalStatesBlock() {
  return (
    <BlockSection
      title="运行状态"
      description="在真实卡片里展示空、加载、错误、成功和警告状态，让状态色更容易判断。"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <BlockCard title="空状态" className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--radius-card)] bg-[var(--surface-panel)]">
            +
          </div>
          <p className="font-medium">暂无报告</p>
          <p className="mt-1 text-sm text-muted-foreground">
            从用量数据创建第一份报告。
          </p>
          <div className="mt-4">
            <MiniButton>创建报告</MiniButton>
          </div>
        </BlockCard>

        <BlockCard title="加载状态">
          <div className="space-y-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-4 animate-pulse rounded-[var(--radius-control)] bg-muted"
              />
            ))}
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 w-2/3 rounded-full bg-primary" />
            </div>
          </div>
        </BlockCard>

        <BlockCard className="bg-[var(--status-danger-bg)] text-[var(--status-danger-fg)]">
          <p className="font-[var(--font-weight-heading)]">同步失败</p>
          <p className="mt-1 text-sm">
            账单工作区无法更新。
          </p>
          <div className="mt-4">
            <MiniButton variant="destructive">重试</MiniButton>
          </div>
        </BlockCard>

        <BlockCard className="bg-[var(--status-success-bg)] text-[var(--status-success-fg)]">
          <p className="font-[var(--font-weight-heading)]">主题已导出</p>
          <p className="mt-1 text-sm">
            CSS 变量和 AI 规则已准备复制。
          </p>
        </BlockCard>

        <BlockCard className="md:col-span-2 bg-[var(--status-warning-bg)] text-[var(--status-warning-fg)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-[var(--font-weight-heading)]">
                对比度需要复核
              </p>
              <p className="mt-1 text-sm">
                部分状态表面接近最低对比度阈值。
              </p>
            </div>
            <MiniButton variant="outline">复核 token</MiniButton>
          </div>
        </BlockCard>
      </div>
    </BlockSection>
  )
}

function DensityStressBlock() {
  const items = [
    "邀请成员进入账单工作区",
    "部署前需要复核",
    "导出主题预设用于交付",
    "轮换生产环境 API key",
    "队列分析已完成",
    "用量报告等待处理",
    "留存提醒已确认",
    "工作区策略已更新",
  ]

  return (
    <BlockSection
      title="响应式 / 密度压力测试"
      description="嵌套卡片、紧凑列表、标签、行操作和截断用于验证不同密度模式是否仍然可用。"
    >
      <BlockCard>
        <div className="grid gap-[var(--field-gap)] xl:grid-cols-2">
          <div className="space-y-[var(--field-gap)] rounded-[var(--radius-panel)] border border-border bg-[var(--surface-panel)] p-[var(--panel-padding)]">
            {items.map((item, index) => (
              <div
                key={item}
                className="flex h-[var(--list-row-height)] min-w-0 items-center gap-3 rounded-[var(--radius-control)] border border-border bg-card px-3"
              >
                <span className="min-w-0 flex-1 truncate text-sm">{item}</span>
                <StatusPill
                  tone={
                    index % 4 === 0
                      ? "success"
                      : index % 4 === 1
                        ? "warning"
                        : index % 4 === 2
                          ? "info"
                          : "neutral"
                  }
                >
                  {index % 2 === 0 ? "就绪" : "打开"}
                </StatusPill>
                <MiniButton size="sm" variant="ghost">
                  查看
                </MiniButton>
              </div>
            ))}
          </div>

          <div className="grid gap-[var(--field-gap)] md:grid-cols-2">
            <BlockCard title="嵌套卡片" className="[box-shadow:none]">
              <p className="truncate text-sm">
                很长的工作区配置名称，带有溢出处理
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill tone="info">AI</StatusPill>
                <StatusPill tone="success">在线</StatusPill>
                <StatusPill>账单</StatusPill>
              </div>
            </BlockCard>
            <BlockCard title="小控件" className="[box-shadow:none]">
              <div className="flex flex-wrap gap-2">
                <MiniButton size="sm">接受</MiniButton>
                <MiniButton size="sm" variant="outline">
                  保留
                </MiniButton>
                <MiniButton size="sm" variant="ghost">
                  跳过
                </MiniButton>
              </div>
            </BlockCard>
            <BlockCard
              title="双列迷你布局"
              className="md:col-span-2 [box-shadow:none]"
            >
              <div className="grid gap-[var(--field-gap)] md:grid-cols-2">
                <div className="rounded-[var(--radius-card)] bg-[var(--surface-panel)] p-[var(--panel-padding)]">
                  <p className="text-sm font-medium">留存</p>
                  <p className="mt-1 text-2xl font-[var(--font-weight-heading)]">
                    78%
                  </p>
                </div>
                <div className="rounded-[var(--radius-card)] bg-[var(--surface-panel)] p-[var(--panel-padding)]">
                  <p className="text-sm font-medium">用量</p>
                  <p className="mt-1 text-2xl font-[var(--font-weight-heading)]">
                    91%
                  </p>
                </div>
              </div>
            </BlockCard>
          </div>
        </div>
      </BlockCard>
    </BlockSection>
  )
}

export const BlocksPreview = memo(function BlocksPreview() {
  return (
    <div className="w-full min-w-0 space-y-[var(--section-gap)] p-[var(--page-padding)]">
      <DashboardBlock />
      <AssistantChatBlock />
      <SignupBlock />
    </div>
  )
})
