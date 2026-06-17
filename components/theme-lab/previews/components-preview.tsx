"use client"

import type { ComponentType, ReactNode } from "react"
import { useMemo, useState } from "react"
import {
  Activity,
  AlertCircle,
  Archive,
  ArrowLeft,
  ArrowRight,
  Bell,
  Bot,
  Box,
  Bug,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock,
  Copy,
  CreditCard,
  File,
  GitBranch,
  HardDrive,
  Inbox,
  Minus,
  Monitor,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  Share2,
  ShoppingBag,
  Star,
  Trash2,
  Upload,
  Users,
  Wifi,
  Zap,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "../../ui/avatar"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "../../ui/chart"
import { Checkbox } from "../../ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "../../ui/field"
import { Input } from "../../ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../../ui/input-group"
import { Kbd } from "../../ui/kbd"
import { Progress } from "../../ui/progress"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { Separator } from "../../ui/separator"
import { Skeleton } from "../../ui/skeleton"
import { Slider } from "../../ui/slider"
import { Switch } from "../../ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import { Textarea } from "../../ui/textarea"
import { cn } from "../../../lib/utils"
import type { ThemeOutput, ThemeSeed } from "../../../lib/theme/schema"

type ComponentsPreviewProps = {
  seed: ThemeSeed
  theme: ThemeOutput
}

type PreviewCardProps = {
  children: ReactNode
  className?: string
}

type IconType = ComponentType<{ className?: string }>

const swatchVars = [
  "--background",
  "--foreground",
  "--primary",
  "--secondary",
  "--muted",
  "--accent",
  "--border",
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const

const trafficData = [
  { month: "1月", desktop: 124, mobile: 82 },
  { month: "2月", desktop: 186, mobile: 128 },
  { month: "3月", desktop: 148, mobile: 96 },
  { month: "4月", desktop: 92, mobile: 134 },
  { month: "5月", desktop: 156, mobile: 110 },
  { month: "6月", desktop: 168, mobile: 118 },
]

const chartConfig = {
  desktop: {
    label: "桌面端",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "移动端",
    color: "var(--chart-2)",
  },
  api: {
    label: "API",
    color: "var(--chart-3)",
  },
  jobs: {
    label: "任务",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

const vibeLabels: Record<string, string> = {
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
  minimal: "极简",
  balanced: "平衡",
  expressive: "表现型",
}

function formatVibeLabel(value: string): string {
  return vibeLabels[value] ?? value
}

function PreviewCard({ children, className }: PreviewCardProps) {
  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      {children}
    </Card>
  )
}

function CardMetric(props: { label: string; value: string; detail?: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase text-muted-foreground">{props.label}</p>
      <p className="font-semibold tabular-nums">{props.value}</p>
      {props.detail ? (
        <p className="truncate text-xs text-muted-foreground">{props.detail}</p>
      ) : null}
    </div>
  )
}

function Swatch({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0 space-y-2 text-center">
      <div
        className="aspect-square rounded-lg border border-border bg-background"
        style={{ background: `var(${value})` }}
      />
      <p className="truncate font-mono text-xs" title={value}>
        {label}
      </p>
    </div>
  )
}

function StyleOverview({ theme }: { theme: ThemeOutput }) {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle className="text-2xl">Design-anchor</CardTitle>
        <CardDescription className="line-clamp-2 text-base">
          {theme.vibe.visualLanguage.color} {theme.vibe.visualLanguage.surface}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-3">
          {swatchVars.map((token) => (
            <Swatch
              key={token}
              value={token}
              label={token.replace("--", "--").slice(0, 8)}
            />
          ))}
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function TypographySpecimen({ seed }: { seed: ThemeSeed }) {
  const [shared, setShared] = useState(false)

  return (
    <PreviewCard>
      <CardHeader>
        <p className="text-xs font-medium uppercase text-muted-foreground">
          {seed.vibe.tone} - {seed.typography.sans.split(",")[0]}
        </p>
        <CardTitle className="text-2xl leading-tight">
          用节奏和层级组织界面。
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          稳定的正文字体让长内容保持可读，同时平衡标题的视觉重量。
        </p>
        <p>
          克制的间距和节奏能帮助段落快速扫读，又不会显得拥挤。
        </p>
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShared((current) => !current)}
        >
          {shared ? "反馈已加入队列" : "分享反馈"}
        </Button>
      </CardFooter>
    </PreviewCard>
  )
}

function IconPreviewGrid() {
  const [active, setActive] = useState(0)
  const icons: Array<{ icon: IconType; label: string }> = [
    { icon: Copy, label: "复制" },
    { icon: AlertCircle, label: "提醒" },
    { icon: Trash2, label: "删除" },
    { icon: Share2, label: "分享" },
    { icon: ShoppingBag, label: "商品" },
    { icon: MoreHorizontal, label: "更多" },
    { icon: RefreshCw, label: "刷新" },
    { icon: Plus, label: "新增" },
    { icon: Minus, label: "减少" },
    { icon: ArrowLeft, label: "返回" },
    { icon: ArrowRight, label: "前进" },
    { icon: Check, label: "确认" },
    { icon: ChevronDown, label: "展开" },
    { icon: ChevronRight, label: "下一步" },
    { icon: Search, label: "搜索" },
    { icon: Settings, label: "设置" },
  ]

  return (
    <PreviewCard>
      <CardContent className="grid grid-cols-8 gap-3 pt-0">
        {icons.map((item, index) => {
          const Icon = item.icon

          return (
            <Button
              key={item.label}
              variant={active === index ? "default" : "outline"}
              size="icon"
              aria-label={item.label}
              onClick={() => setActive(index)}
            >
              <Icon />
            </Button>
          )
        })}
      </CardContent>
    </PreviewCard>
  )
}

function UIElements() {
  const [slider, setSlider] = useState([58])
  const [enabled, setEnabled] = useState(true)
  const [checked, setChecked] = useState(true)
  const [radio, setRadio] = useState("one")

  return (
    <PreviewCard>
      <CardContent className="space-y-5 pt-0">
        <div className="flex flex-wrap gap-2">
          <Button>主要按钮</Button>
          <Button variant="secondary">次要按钮</Button>
          <Button variant="outline">描边按钮</Button>
          <Button variant="ghost">幽灵按钮</Button>
        </div>

        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">双重验证</p>
              <p className="text-sm text-muted-foreground">
                通过邮箱或手机号完成验证。
              </p>
            </div>
            <Button size="sm" variant="secondary">
              开启
            </Button>
          </div>
        </div>

        <Slider value={slider} onValueChange={setSlider} max={100} step={1} />

        <InputGroup>
          <InputGroupInput placeholder="名称" />
          <InputGroupAddon align="inline-end">
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <InputGroup className="min-h-24">
          <InputGroupTextarea placeholder="消息" />
        </InputGroup>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>徽标</Badge>
          <Badge variant="secondary">次要</Badge>
          <Badge variant="outline">描边</Badge>
          <RadioGroup
            value={radio}
            onValueChange={setRadio}
            className="ml-1 flex gap-2"
          >
            <RadioGroupItem value="one" aria-label="第一个选项" />
            <RadioGroupItem value="two" aria-label="第二个选项" />
          </RadioGroup>
          <Checkbox checked={checked} onCheckedChange={(value) => setChecked(Boolean(value))} />
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">弹窗</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>预览弹窗</DialogTitle>
                <DialogDescription>
                  这个弹层会使用 Theme Lab 当前激活的主题变量。
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>确认</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                操作组
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>操作</DropdownMenuLabel>
              <DropdownMenuItem>复制</DropdownMenuItem>
              <DropdownMenuItem>归档</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">删除</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function CodespacesCard() {
  const [created, setCreated] = useState(false)

  return (
    <PreviewCard>
      <CardContent className="pt-0">
        <Tabs defaultValue="codespaces" className="gap-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="codespaces">Codespaces</TabsTrigger>
            <TabsTrigger value="local">本地</TabsTrigger>
          </TabsList>
          <TabsContent value="codespaces" className="space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold">Codespaces</h3>
                <p className="text-sm text-muted-foreground">
                  云端工作区
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="icon-sm" variant="ghost" onClick={() => setCreated(true)}>
                  <Plus />
                </Button>
                <Button size="icon-sm" variant="ghost">
                  <MoreHorizontal />
                </Button>
              </div>
            </div>
            <Separator />
            <div className="grid min-h-64 place-items-center text-center">
              <div className="space-y-4">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <HardDrive />
                </div>
                <div>
                  <p className="font-semibold">
                    {created ? "Codespace 已排队" : "暂无 Codespaces"}
                  </p>
                  <p className="mx-auto mt-2 max-w-52 text-sm text-muted-foreground">
                    {created
                      ? "带主题的工作区已准备创建。"
                      : "这个仓库还没有检出的 Codespaces。"}
                  </p>
                </div>
                <Button size="sm" onClick={() => setCreated(true)}>
                  创建 Codespace
                </Button>
                <Button variant="link" size="sm">
                  了解 Codespaces
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="local" className="space-y-4">
            <Tabs defaultValue="https">
              <TabsList variant="line">
                <TabsTrigger value="https">HTTPS</TabsTrigger>
                <TabsTrigger value="ssh">SSH</TabsTrigger>
                <TabsTrigger value="cli">GitHub CLI</TabsTrigger>
              </TabsList>
              <TabsContent value="https">
                <InputGroup>
                  <InputGroupInput
                    readOnly
                    value="https://github.com/alibaba/theme-lab.git"
                  />
                  <InputGroupButton size="icon-sm">
                    <Copy />
                  </InputGroupButton>
                </InputGroup>
              </TabsContent>
              <TabsContent value="ssh">
                <Input readOnly value="git@github.com:alibaba/theme-lab.git" />
              </TabsContent>
              <TabsContent value="cli">
                <Input readOnly value="gh repo clone alibaba/theme-lab" />
              </TabsContent>
            </Tabs>
            <div className="space-y-2 text-sm">
              <Button variant="ghost" className="w-full justify-start">
                <Monitor />
                使用 GitHub Desktop 打开
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Archive />
                导出压缩包
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </PreviewCard>
  )
}

function Invoice() {
  const rows = [
    ["Pro 席位", "$240.00"],
    ["AI 用量", "$89.00"],
    ["抵扣额度", "-$20.00"],
  ] as const

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>账单</CardTitle>
        <CardDescription>工作区计费摘要</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            {rows.map(([label, value]) => (
              <TableRow key={label}>
                <TableCell>{label}</TableCell>
                <TableCell className="text-right font-mono">{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-between border-t border-border pt-[var(--panel-padding)]">
        <span className="font-medium">合计</span>
        <span className="font-mono font-semibold">$309.00</span>
      </CardFooter>
    </PreviewCard>
  )
}

function EnvironmentVariables() {
  const [deploying, setDeploying] = useState(false)
  const rows = [
    ["DATABASE_URL", "••••••••"],
    ["NEXT_PUBLIC_API", "https://api.example.com"],
    ["STRIPE_SECRET", "••••••••"],
  ] as const

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>环境变量</CardTitle>
        <CardDescription>生产环境 - 8 个变量</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {rows.map(([name, value]) => (
          <InputGroup key={name}>
            <InputGroupAddon>
              <InputGroupText className="font-mono">{name}</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput readOnly value={value} className="text-right font-mono" />
          </InputGroup>
        ))}
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">编辑</Button>
        <Button onClick={() => setDeploying((current) => !current)}>
          {deploying ? "已部署" : "部署"}
        </Button>
      </CardFooter>
    </PreviewCard>
  )
}

function BarChartCard() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>流量渠道</CardTitle>
        <CardDescription>
          过去六个月的桌面端与移动端流量。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <BarChart data={trafficData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={6} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={6} />
          </BarChart>
        </ChartContainer>
        <div className="mt-4 grid grid-cols-3 divide-x divide-border text-center">
          <CardMetric label="桌面端" value="1,224" />
          <CardMetric label="移动端" value="860" />
          <CardMetric label="占比变化" value="+42%" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">查看报告</Button>
      </CardFooter>
    </PreviewCard>
  )
}

function InviteTeam() {
  const [email, setEmail] = useState("ada@example.com")

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>邀请团队</CardTitle>
        <CardDescription>协作者会继承这个主题预设。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input value={email} onChange={(event) => setEmail(event.target.value)} />
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
          <AvatarGroup>
            {["GA", "AL", "MK"].map((item) => (
              <Avatar key={item}>
                <AvatarFallback>{item}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+4</AvatarGroupCount>
          </AvatarGroup>
          <span className="text-sm text-muted-foreground">7 位活跃成员</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">发送邀请</Button>
      </CardFooter>
    </PreviewCard>
  )
}

function ActivateAgentDialog() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>AI Agent</CardTitle>
        <CardDescription>弹窗、提示状态和主题化 portal。</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Bot />
              激活 Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>激活设计 Agent？</DialogTitle>
              <DialogDescription>
                Agent 会使用导出的主题 token 规则生成 UI。
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">取消</Button>
              <Button>激活</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </PreviewCard>
  )
}

function ObservabilityCard() {
  const data = [
    { time: "00", api: 20, jobs: 16 },
    { time: "04", api: 24, jobs: 20 },
    { time: "08", api: 36, jobs: 28 },
    { time: "12", api: 32, jobs: 34 },
    { time: "16", api: 48, jobs: 36 },
    { time: "20", api: 42, jobs: 30 },
  ]

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>可观测性</CardTitle>
        <CardDescription>延迟、队列和系统脉搏。</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="api-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="var(--color-api)" stopOpacity={0.45} />
                <stop offset="95%" stopColor="var(--color-api)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="api"
              type="monotone"
              stroke="var(--color-api)"
              fill="url(#api-fill)"
            />
            <Line dataKey="jobs" stroke="var(--color-jobs)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </PreviewCard>
  )
}

function ShippingAddress() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>收货地址</CardTitle>
        <CardDescription>表单字段与选择器 portal。</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>姓名</FieldLabel>
            <Input defaultValue="林安娜" />
          </Field>
          <Field>
            <FieldLabel>地区</FieldLabel>
            <Select defaultValue="us">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">美国</SelectItem>
                <SelectItem value="eu">欧盟</SelectItem>
                <SelectItem value="apac">亚太</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
    </PreviewCard>
  )
}

function SkeletonLoading() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>加载状态</CardTitle>
        <CardDescription>骨架屏表面使用 muted token。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-28 w-full rounded-lg" />
      </CardContent>
    </PreviewCard>
  )
}

function PieChartCard() {
  const data = [
    { name: "核心", value: 42, fill: "var(--chart-1)" },
    { name: "预览", value: 28, fill: "var(--chart-2)" },
    { name: "导出", value: 18, fill: "var(--chart-3)" },
    { name: "Agent", value: 12, fill: "var(--chart-4)" },
  ]

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>主题使用</CardTitle>
        <CardDescription>不同产品区域的 token 覆盖情况。</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-44 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={44} outerRadius={72}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </PreviewCard>
  )
}

function NoTeamMembers() {
  return (
    <PreviewCard>
      <CardContent className="grid min-h-64 place-items-center pt-0 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users />
          </div>
          <div>
            <p className="font-semibold">暂无团队成员</p>
            <p className="mx-auto mt-2 max-w-52 text-sm text-muted-foreground">
              邀请协作者一起验证共享语义 token。
            </p>
          </div>
          <Button size="sm">邀请成员</Button>
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function ReportBug() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>报告问题</CardTitle>
        <CardDescription>破坏性流程里的状态 token。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea placeholder="发生了什么？" />
        <div className="rounded-lg bg-danger-bg p-3 text-sm text-danger-foreground">
          检测到某个组件状态存在 token 冲突。
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="destructive" className="w-full">
          提交报告
        </Button>
      </CardFooter>
    </PreviewCard>
  )
}

function Contributors() {
  const people = ["GA", "AL", "MK", "NO"]

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>贡献者</CardTitle>
        <CardDescription>头像组、徽标和列表节奏。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {people.map((person, index) => (
          <div key={person} className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{person}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">设计师 {index + 1}</p>
              <p className="text-xs text-muted-foreground">提交了 token 更新</p>
            </div>
            <Badge variant={index === 0 ? "default" : "secondary"}>
              {index === 0 ? "负责人" : "成员"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </PreviewCard>
  )
}

function FeedbackForm() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>反馈表单</CardTitle>
        <CardDescription>字段基础组件与可读间距。</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel>邮箱</FieldLabel>
            <Input placeholder="you@example.com" />
          </Field>
          <Field>
            <FieldLabel>消息</FieldLabel>
            <Textarea placeholder="说说哪里感觉不对..." />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full">发送反馈</Button>
      </CardFooter>
    </PreviewCard>
  )
}

function BookAppointment() {
  const days = ["周一", "周二", "周三", "周四", "周五"]
  const [day, setDay] = useState("周三")

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>预约时间</CardTitle>
        <CardDescription>分段选择与选中状态。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {days.map((item) => (
            <Button
              key={item}
              variant={day === item ? "default" : "outline"}
              size="sm"
              onClick={() => setDay(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="rounded-lg border border-border p-3 text-sm">
          <CalendarDays className="mb-2 size-4 text-muted-foreground" />
          已选择：{day}，10:30
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function SleepReport() {
  const value = 72

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>睡眠报告</CardTitle>
        <CardDescription>进度、指标和冷静语气。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={value} />
        <div className="grid grid-cols-3 gap-3">
          <CardMetric label="深睡" value="2.1h" />
          <CardMetric label="REM" value="1.4h" />
          <CardMetric label="评分" value={`${value}`} />
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function GithubProfile() {
  return (
    <PreviewCard>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Theme Lab</CardTitle>
            <CardDescription>@theme-lab</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          组件现在通过 Theme Lab token 渲染。
        </p>
        <div className="flex gap-2">
          <Badge variant="secondary">117k 星标</Badge>
          <Badge variant="outline">Radix</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <GitBranch />
          查看主页
        </Button>
      </CardFooter>
    </PreviewCard>
  )
}

function WeeklyFitnessSummary() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>周报摘要</CardTitle>
        <CardDescription>紧凑指标组合。</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-3">
        <CardMetric label="活动" value="82%" />
        <CardMetric label="专注" value="14h" />
        <CardMetric label="连续" value="6d" />
      </CardContent>
    </PreviewCard>
  )
}

function FileUpload() {
  const [uploaded, setUploaded] = useState(false)

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>文件上传</CardTitle>
        <CardDescription>输入、拖拽表面和成功状态。</CardDescription>
      </CardHeader>
      <CardContent>
        <button
          type="button"
          className="flex min-h-40 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/40 text-center text-sm transition-colors hover:bg-muted"
          onClick={() => setUploaded(true)}
        >
          <Upload className="text-muted-foreground" />
          <span className="font-medium">{uploaded ? "主题文件已附加" : "拖入主题预设"}</span>
          <span className="text-muted-foreground">JSON、CSS 或 token 导出</span>
        </button>
      </CardContent>
    </PreviewCard>
  )
}

function AnalyticsCard() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>分析</CardTitle>
        <CardDescription>折线图与 token 化强调。</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-40 w-full">
          <LineChart data={trafficData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis hide />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
            <Line dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={false} />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </PreviewCard>
  )
}

function UsageCard() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>用量</CardTitle>
        <CardDescription>配额与计费状态。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={64} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">已使用 64,120 / 100,000 点额度</span>
          <Badge variant="secondary">64%</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          管理套餐
        </Button>
      </CardFooter>
    </PreviewCard>
  )
}

function Shortcuts() {
  const [active, setActive] = useState("搜索")
  const rows = [
    ["搜索", "cmd", "K"],
    ["快捷操作", "cmd", "J"],
    ["新建文件", "cmd", "N"],
    ["保存", "cmd", "S"],
    ["切换侧栏", "cmd", "B"],
  ] as const

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>快捷键</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {rows.map(([label, keyA, keyB]) => (
          <button
            key={label}
            type="button"
            className={cn(
              "flex min-h-[var(--list-row-height)] w-full items-center gap-3 border-b border-border text-left text-sm last:border-b-0",
              active === label && "text-foreground",
              active !== label && "text-muted-foreground"
            )}
            onClick={() => setActive(label)}
          >
            <span>{label}</span>
            <span className="ml-auto flex gap-1">
              <Kbd>{keyA}</Kbd>
              <Kbd>{keyB}</Kbd>
            </span>
          </button>
        ))}
      </CardContent>
    </PreviewCard>
  )
}

function AnomalyAlert() {
  return (
    <PreviewCard>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-warning-bg p-2 text-warning-foreground">
            <Bell className="size-4" />
          </div>
          <div>
            <CardTitle>检测到异常</CardTitle>
            <CardDescription>
              转化率变化超出了预期 token 范围。
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button size="sm">查看原因</Button>
        <Button size="sm" variant="outline">
          稍后提醒
        </Button>
      </CardContent>
    </PreviewCard>
  )
}

function LiveWaveformCard() {
  const [active, setActive] = useState(true)
  const bars = useMemo(
    () => [28, 54, 38, 76, 48, 92, 64, 42, 70, 34, 58, 82, 46, 66, 52],
    []
  )

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>实时波形</CardTitle>
        <CardDescription>动效 token 预览。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-28 items-end gap-2 rounded-lg border border-border bg-muted/40 p-3">
          {bars.map((height, index) => (
            <span
              key={index}
              className={cn(
                "w-full rounded-full bg-primary transition-[background-color,height,opacity]",
                active && "animate-pulse"
              )}
              style={{
                height: `${height}%`,
                transitionDuration: "var(--duration-base)",
              }}
            />
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          variant={active ? "default" : "outline"}
          onClick={() => setActive((current) => !current)}
        >
          {active ? "监听中" : "已暂停"}
        </Button>
        <Badge variant="outline">48 kHz</Badge>
      </CardFooter>
    </PreviewCard>
  )
}

function Visitors() {
  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>访客</CardTitle>
        <CardDescription>不同表面的实时会话。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          ["落地页", 84],
          ["仪表盘", 62],
          ["Theme Lab", 46],
        ].map(([label, value]) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="font-mono">{value}%</span>
            </div>
            <Progress value={Number(value)} />
          </div>
        ))}
      </CardContent>
    </PreviewCard>
  )
}

function ContributionsActivity() {
  const cells = Array.from({ length: 35 }, (_, index) => (index * 17) % 100)

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>贡献活跃度</CardTitle>
        <CardDescription>不用原始调色板类也能表达语义强度。</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((value, index) => (
            <span
              key={index}
              className="aspect-square rounded-sm border border-border bg-primary"
              style={{ opacity: 0.16 + value / 130 }}
            />
          ))}
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function NotFound() {
  return (
    <PreviewCard>
      <CardContent className="grid min-h-64 place-items-center pt-0 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CircleHelp />
          </div>
          <div>
            <p className="text-3xl font-semibold">404</p>
            <p className="mt-2 text-sm text-muted-foreground">
              这个预览路由不可用。
            </p>
          </div>
          <Button variant="outline" size="sm">
            返回首页
          </Button>
        </div>
      </CardContent>
    </PreviewCard>
  )
}

function StatusStrip() {
  return (
    <PreviewCard>
      <CardContent className="grid gap-2 pt-0">
        {[
          ["success", "部署已完成", "bg-success-bg text-success-foreground"],
          ["warning", "需要复核", "bg-warning-bg text-warning-foreground"],
          ["info", "Agent 正在使用工具", "bg-info-bg text-info-foreground"],
          ["danger", "Token 冲突", "bg-danger-bg text-danger-foreground"],
        ].map(([tone, label, className]) => (
          <div key={tone} className={cn("rounded-lg px-3 py-2 text-sm", className)}>
            {label}
          </div>
        ))}
      </CardContent>
    </PreviewCard>
  )
}

function AdvancedSeedResponse({ seed }: { seed: ThemeSeed }) {
  const motionLevel =
    seed.motion.level === "none"
      ? "无动效"
      : seed.motion.level === "expressive"
        ? "表现型动效"
        : "轻微动效"

  return (
    <PreviewCard>
      <CardHeader>
        <CardTitle>变量联动</CardTitle>
        <CardDescription>
          字体、材质、动效和风格变量映射到组件状态。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-[var(--radius-card)] border border-border bg-surface-panel p-[var(--panel-padding)] [box-shadow:var(--elevation-card)]">
          <p className="text-xs uppercase text-muted-foreground">
            字体比例
          </p>
          <p className="mt-2 text-[length:var(--text-display)] font-[var(--font-weight-heading)] leading-none tracking-[var(--tracking-heading)]">
            Aa
          </p>
          <p className="mt-3 text-[length:var(--text-body)] font-[var(--font-weight-body)] leading-7 text-muted-foreground">
            比例 {seed.typography.scaleRatio.toFixed(2)} · 标题 {seed.typography.headingWeight}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ["card", "卡片"],
            ["popover", "浮层"],
            ["dialog", "弹窗"],
          ].map(([token, label]) => (
            <div
              key={token}
              className="rounded-[var(--radius-control)] border border-border bg-card p-3 text-center text-xs [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-standard)]"
              style={{
                boxShadow: `var(--elevation-${token})`,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="rounded-[var(--radius-card)] border border-border bg-card p-[var(--panel-padding)]">
          <div className="mb-3 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium">{motionLevel}</span>
            <Badge variant="outline">{seed.motion.durationBase}ms</Badge>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 rounded-full bg-primary transition-[width,background-color] [transition-duration:var(--duration-base)] [transition-timing-function:var(--ease-emphasized)]" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{formatVibeLabel(seed.vibe.domain)}</Badge>
          <Badge variant="secondary">{formatVibeLabel(seed.vibe.tone)}</Badge>
          <Badge variant="outline">{formatVibeLabel(seed.vibe.expression)}</Badge>
          <Badge variant="outline">{seed.typography.bodyWeight}</Badge>
          <Badge variant="outline">{seed.typography.trackingBias.toFixed(3)}em</Badge>
        </div>
      </CardContent>
    </PreviewCard>
  )
}

export function ComponentsPreview(props: ComponentsPreviewProps) {
  return (
    <div className="min-h-full">
      <div className="flex min-w-max justify-center">
        <div className="grid w-[2400px] grid-cols-7 items-start gap-[var(--section-gap)] p-[var(--section-gap)] md:w-[3000px]">
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <StyleOverview theme={props.theme} />
            <TypographySpecimen seed={props.seed} />
            <CodespacesCard />
            <Invoice />
            <AdvancedSeedResponse seed={props.seed} />
          </div>
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <IconPreviewGrid />
            <UIElements />
            <ObservabilityCard />
            <ShippingAddress />
          </div>
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <EnvironmentVariables />
            <BarChartCard />
            <InviteTeam />
            <ActivateAgentDialog />
          </div>
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <SkeletonLoading />
            <PieChartCard />
            <NoTeamMembers />
            <ReportBug />
            <Contributors />
          </div>
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <FeedbackForm />
            <BookAppointment />
            <SleepReport />
            <GithubProfile />
          </div>
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <WeeklyFitnessSummary />
            <FileUpload />
            <AnalyticsCard />
            <UsageCard />
            <Shortcuts />
          </div>
          <div className="flex flex-col gap-[var(--section-gap)] p-px">
            <AnomalyAlert />
            <LiveWaveformCard />
            <Visitors />
            <ContributionsActivity />
            <NotFound />
            <StatusStrip />
          </div>
        </div>
      </div>
    </div>
  )
}
