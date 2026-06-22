"use client"

import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { ChevronDown, ChevronRight, Info, Moon, RotateCcw, Sun } from "lucide-react"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Slider } from "../ui/slider"
import { Switch } from "../ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip"
import { defaultThemeSeed } from "../../lib/theme/defaults"
import { themePresets } from "../../lib/theme/presets"
import type { HexAlphaColor, ThemeOutput, ThemeSeed } from "../../lib/theme/schema"
import { normalizeHex } from "../../lib/theme/algorithms/utils"
import { cn } from "../../lib/utils"
import { getControlFloatingStyle } from "./control-panel-theme"

type SeedControlPanelProps = {
  seed: ThemeSeed
  theme: ThemeOutput
  onSeedChange: (next: ThemeSeed) => void
  isDark: boolean
  onDarkChange: (next: boolean) => void
}

type TokenRow = {
  name: string
  value: string
}

type TokenCardProps = {
  title: string
  description: string
  summary: string
  children: ReactNode
  derived: TokenRow[]
}

type ColorSeedKey = Exclude<keyof ThemeSeed["color"], "infoMatchesPrimary">

type ColorSeedCardProps = {
  title: string
  name: string
  value: HexAlphaColor
  previewValue: string
  derived: TokenRow[]
  onChange: (next: HexAlphaColor) => void
  matchesPrimary?: boolean
  onMatchesPrimaryChange?: (next: boolean) => void
  primaryValue?: HexAlphaColor
}

type NumberSliderProps = {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (value: number) => void
}

const ControlPanelModeContext = createContext(false)

function useControlPanelIsDark(): boolean {
  return useContext(ControlPanelModeContext)
}

const densityPresetByMode: Record<
  ThemeSeed["density"]["mode"],
  Pick<ThemeSeed["density"], "controlHeight" | "densityRatio">
> = {
  compact: {
    controlHeight: 1.8,
    densityRatio: 0.78,
  },
  default: {
    controlHeight: 2.5,
    densityRatio: 1,
  },
  comfortable: {
    controlHeight: 3,
    densityRatio: 1.2,
  },
}

const optionLabels: Record<string, string> = {
  compact: "紧凑",
  default: "默认",
  comfortable: "舒展",
  flat: "平面",
  soft: "柔和",
  floating: "浮层",
  none: "无动效",
  subtle: "轻微",
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

function formatOptionLabel(value: string): string {
  return optionLabels[value] ?? value
}

const colorTokenConfig: Array<{
  key: ColorSeedKey
  title: string
  name: string
  previewToken: string
  derivedNames: string[]
}> = [
  {
    key: "primary",
    title: "品牌主色",
    name: "colorPrimary",
    previewToken: "--brand-600",
    derivedNames: [
      "--seed-color-primary",
      "--brand-50",
      "--brand-100",
      "--brand-200",
      "--brand-300",
      "--brand-400",
      "--brand-500",
      "--brand-600",
      "--brand-700",
      "--brand-800",
      "--brand-900",
      "--brand-950",
      "--primary",
      "--primary-foreground",
      "--ring",
      "--chart-1",
    ],
  },
  {
    key: "success",
    title: "成功色",
    name: "colorSuccess",
    previewToken: "--green-600",
    derivedNames: [
      "--seed-color-success",
      "--green-600",
      "--status-success",
      "--status-success-bg",
      "--status-success-fg",
    ],
  },
  {
    key: "warning",
    title: "警告色",
    name: "colorWarning",
    previewToken: "--amber-600",
    derivedNames: [
      "--seed-color-warning",
      "--amber-600",
      "--status-warning",
      "--status-warning-bg",
      "--status-warning-fg",
    ],
  },
  {
    key: "danger",
    title: "错误色",
    name: "colorError",
    previewToken: "--red-600",
    derivedNames: [
      "--seed-color-danger",
      "--red-600",
      "--status-danger",
      "--status-danger-bg",
      "--status-danger-fg",
      "--destructive",
      "--destructive-foreground",
    ],
  },
  {
    key: "info",
    title: "信息 / 链接色",
    name: "colorInfo",
    previewToken: "--blue-600",
    derivedNames: [
      "--seed-color-info",
      "--blue-600",
      "--status-info",
      "--status-info-bg",
      "--status-info-fg",
      "--chart-2",
    ],
  },
]

function seedEquals(a: ThemeSeed, b: ThemeSeed): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

function formatNumber(value: number, digits = 2): string {
  return Number(value.toFixed(digits)).toString()
}

function formatAlpha(value: number): string {
  return `${Math.round(value * 100)}%`
}

function formatColorSeed(value: HexAlphaColor): string {
  return `${normalizeHex(value.hex).toUpperCase()} / ${formatAlpha(value.alpha)}`
}

function isValidHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{6}$/.test(value.trim())
}

function tokenRowsByNames(
  tokens: Record<string, string>,
  names: readonly string[]
): TokenRow[] {
  return names.flatMap((name) =>
    tokens[name] === undefined ? [] : [{ name, value: tokens[name] }]
  )
}

function tokenRows(
  tokens: Record<string, string>,
  matcher: (name: string) => boolean
): TokenRow[] {
  return Object.entries(tokens)
    .filter(([name]) => matcher(name))
    .map(([name, value]) => ({ name, value }))
}

function TokenSwatch(props: { value: string; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={
        props.small
          ? "size-4 shrink-0 rounded-sm border border-border bg-background shadow-xs"
          : "size-5 shrink-0 rounded-md border border-border bg-background shadow-xs"
      }
      style={{ background: props.value }}
    />
  )
}

function InfoTooltip(props: { children: ReactNode; label?: string }) {
  const isDark = useControlPanelIsDark()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={props.label ?? "查看说明"}
          className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Info className="size-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className={`${isDark ? "dark " : ""}max-w-64 border border-border leading-5`}
        style={getControlFloatingStyle(isDark)}
      >
        {props.children}
      </TooltipContent>
    </Tooltip>
  )
}

function ThemeModeToggle(props: {
  isDark: boolean
  onChange: (next: boolean) => void
}) {
  const label = props.isDark ? "切换为白天预览" : "切换为夜晚预览"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={props.isDark ? "default" : "outline"}
          size="icon-sm"
          aria-label={label}
          aria-pressed={props.isDark}
          data-state={props.isDark ? "on" : "off"}
          className={cn(
            "h-7 w-7 rounded-full border shadow-none",
            props.isDark
              ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
              : "border-border bg-muted/35 text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          onClick={() => props.onChange(!props.isDark)}
        >
          {props.isDark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className={`${props.isDark ? "dark " : ""}border border-border`}
        style={getControlFloatingStyle(props.isDark)}
      >
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function ResetButton(props: { onReset: () => void }) {
  const isDark = useControlPanelIsDark()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="重置为默认"
          className="h-7 w-7 rounded-full border-border bg-muted/35 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
          onClick={props.onReset}
        >
          <RotateCcw className="size-3.5" />
          <span className="sr-only">重置为默认</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent
        side="left"
        className={`${isDark ? "dark " : ""}border border-border`}
        style={getControlFloatingStyle(isDark)}
      >
        重置为默认
      </TooltipContent>
    </Tooltip>
  )
}

function SectionHeader(props: { title: string; info?: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 px-1">
      <h3 className="truncate text-[11px] font-semibold text-muted-foreground">
        {props.title}
      </h3>
      {props.info ? <InfoTooltip>{props.info}</InfoTooltip> : null}
    </div>
  )
}

function DerivedRow({ row }: { row: TokenRow }) {
  return (
    <div className="grid min-h-8 grid-cols-[1rem_minmax(0,1fr)_minmax(0,7rem)] items-center gap-2 border-t border-border px-2 first:border-t-0">
      <TokenSwatch value={row.value} small />
      <span className="min-w-0 flex-1 truncate text-[11px]">
        {row.name.replace(/^--/, "")}
      </span>
      <span className="truncate text-right font-mono text-[10px] text-muted-foreground">
        {row.value}
      </span>
    </div>
  )
}

function DerivedTokenPanel(props: { rows: TokenRow[] }) {
  return (
    <div className="border-t border-border bg-muted/30">
      <div className="flex items-center justify-between gap-2.5 px-2.5 py-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-[var(--tracking-body)] text-muted-foreground">
          梯度变量
        </span>
        <Badge variant="outline">{props.rows.length}</Badge>
      </div>
      <div className="max-h-80 overflow-y-auto border-t border-border [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {props.rows.map((row) => (
          <DerivedRow key={row.name} row={row} />
        ))}
      </div>
    </div>
  )
}

function TokenCard(props: TokenCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <section className="space-y-1">
      <SectionHeader title={props.title} info={props.description} />
      <Card className="gap-0 overflow-hidden py-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-[2.75rem] w-full justify-between rounded-none px-2.5 py-1.5 text-left"
          aria-expanded={open}
          aria-label={`${open ? "收起" : "展开"}${props.title}`}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="min-w-0 truncate text-[11px] font-semibold">
            {props.summary}
          </span>
          <span className="ml-3 shrink-0 text-muted-foreground">
            {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </span>
        </Button>
        {open ? (
          <>
            <CardContent className="space-y-2.5 border-t border-border p-2.5">
              {props.children}
            </CardContent>
            {props.derived.length > 0 ? (
              <DerivedTokenPanel rows={props.derived} />
            ) : null}
          </>
        ) : null}
      </Card>
    </section>
  )
}

function CompactColorEditor(props: {
  value: HexAlphaColor
  onChange: (next: HexAlphaColor) => void
}) {
  const [draft, setDraft] = useState(normalizeHex(props.value.hex))

  useEffect(() => {
    setDraft(normalizeHex(props.value.hex))
  }, [props.value.hex])

  function commit(value: string) {
    if (isValidHex(value)) {
      props.onChange({
        ...props.value,
        hex: normalizeHex(value),
      })
      return
    }

    setDraft(normalizeHex(props.value.hex))
  }

  function updateDraft(value: string) {
    setDraft(value)

    if (isValidHex(value)) {
      props.onChange({
        ...props.value,
        hex: normalizeHex(value),
      })
    }
  }

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[2.25rem_1fr] gap-2">
        <Input
          aria-label="选择种子颜色"
          type="color"
          value={normalizeHex(props.value.hex)}
          className="h-8 w-9 cursor-pointer p-1"
          onChange={(event) =>
            props.onChange({
              ...props.value,
              hex: normalizeHex(event.currentTarget.value),
            })
          }
        />
        <Input
          value={draft}
          className="h-8 font-mono text-[11px]"
          spellCheck={false}
          onChange={(event) => updateDraft(event.currentTarget.value)}
          onBlur={(event) => commit(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              commit(event.currentTarget.value)
            }
          }}
        />
      </div>
      <div className="grid grid-cols-[2.25rem_1fr_3rem] items-center gap-2">
        <Label className="text-[11px] text-muted-foreground">透明度</Label>
        <Slider
          min={0.05}
          max={1}
          step={0.05}
          value={[props.value.alpha]}
          onValueChange={(value) =>
            props.onChange({
              ...props.value,
              alpha: value[0] ?? props.value.alpha,
            })
          }
        />
        <span className="text-right font-mono text-[10px] text-muted-foreground">
          {formatAlpha(props.value.alpha)}
        </span>
      </div>
    </div>
  )
}

function ColorSeedCard(props: ColorSeedCardProps) {
  const [open, setOpen] = useState(false)
  const displayValue =
    props.matchesPrimary && props.primaryValue ? props.primaryValue : props.value
  const hexValue = normalizeHex(displayValue.hex).toUpperCase()

  return (
    <section className="space-y-1">
      <SectionHeader title={props.title} />
      <Card className="gap-0 overflow-hidden py-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-[2.75rem] w-full justify-between rounded-none px-2.5 py-1.5 text-left"
          aria-expanded={open}
          aria-label={`${open ? "收起" : "展开"} ${props.name} 种子控制`}
          onClick={() => setOpen((current) => !current)}
        >
          <div className="flex min-w-0 items-center gap-2">
            <TokenSwatch value={props.previewValue} />
            <span className="truncate font-mono text-[11px] font-semibold">
              {hexValue}
            </span>
          </div>
          <span className="text-muted-foreground">
            {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </span>
        </Button>
        {open ? (
          <>
            <CardContent className="space-y-2.5 border-t border-border p-2.5">
              <div className="flex items-center justify-between gap-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold">{props.name}</p>
                  <p className="truncate font-mono text-[10px] text-muted-foreground">
                    {formatColorSeed(displayValue)}
                  </p>
                </div>
                <Badge variant="outline">{formatAlpha(displayValue.alpha)}</Badge>
              </div>
              {props.onMatchesPrimaryChange ? (
                <div className="flex items-center justify-between gap-2 rounded-[var(--radius-control)] border border-border bg-muted/35 px-2 py-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    和主题色一致
                  </Label>
                  <Switch
                    size="sm"
                    checked={props.matchesPrimary ?? false}
                    onCheckedChange={props.onMatchesPrimaryChange}
                  />
                </div>
              ) : null}
              {props.matchesPrimary ? (
                <div className="rounded-[var(--radius-control)] bg-muted/35 px-2 py-1.5 font-mono text-[10px] text-muted-foreground">
                  使用品牌主色 {formatColorSeed(props.primaryValue ?? props.value)}
                </div>
              ) : (
                <CompactColorEditor value={props.value} onChange={props.onChange} />
              )}
            </CardContent>
            <DerivedTokenPanel rows={props.derived} />
          </>
        ) : null}
      </Card>
    </section>
  )
}

function SurfaceSeedCard(props: {
  rows: Array<{
    key: "background" | "foreground" | "neutral"
    label: string
    token: string
  }>
  seed: ThemeSeed
  variables: Record<string, string>
  derived: TokenRow[]
  onChange: (key: ColorSeedKey, value: HexAlphaColor) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <section className="space-y-1">
      <SectionHeader title="表面" />
      <Card className="gap-0 overflow-hidden py-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-[2.75rem] w-full justify-between rounded-none px-2.5 py-1.5 text-left"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="grid min-w-0 flex-1 gap-1.5">
            <span className="grid grid-cols-3 gap-0.5">
              {props.rows.map((row) => (
                <span
                  key={row.key}
                  className="flex min-w-0 items-center gap-1"
                >
                  <span
                    aria-hidden="true"
                    className="size-4 shrink-0 rounded-sm border border-border bg-background shadow-xs"
                    style={{
                      background:
                        props.variables[row.token] ?? props.seed.color[row.key].hex,
                    }}
                  />
                  <span className="min-w-0 truncate font-mono text-[10px] font-semibold">
                    {normalizeHex(props.seed.color[row.key].hex).toUpperCase()}
                  </span>
                </span>
              ))}
            </span>
          </span>
          <span className="ml-3 flex shrink-0 items-center gap-2 text-muted-foreground">
            {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </span>
        </Button>
        {open ? (
          <>
            <div className="divide-y divide-border border-t border-border">
              {props.rows.map((row) => (
                <div
                  key={row.key}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(9rem,10rem)] items-center gap-2.5 p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <TokenSwatch
                      value={props.variables[row.token] ?? props.seed.color[row.key].hex}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-semibold">{row.label}</p>
                      <p className="truncate font-mono text-[10px] text-muted-foreground">
                        {formatColorSeed(props.seed.color[row.key])}
                      </p>
                    </div>
                  </div>
                  <CompactColorEditor
                    value={props.seed.color[row.key]}
                    onChange={(value) => props.onChange(row.key, value)}
                  />
                </div>
              ))}
            </div>
            <DerivedTokenPanel rows={props.derived} />
          </>
        ) : null}
      </Card>
    </section>
  )
}

function NumberSlider(props: NumberSliderProps) {
  const displayValue =
    props.unit === "%"
      ? formatAlpha(props.value)
      : `${formatNumber(props.value)}${props.unit ?? ""}`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-[11px]">
        <Label className="text-muted-foreground">{props.label}</Label>
        <span className="font-mono text-foreground">{displayValue}</span>
      </div>
      <Slider
        aria-label={props.label}
        min={props.min}
        max={props.max}
        step={props.step}
        value={[props.value]}
        onValueChange={(value) => props.onChange(value[0] ?? props.value)}
      />
    </div>
  )
}

function SeedSelect<T extends string>(props: {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
}) {
  const isDark = useControlPanelIsDark()

  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground">{props.label}</Label>
      <Select value={props.value} onValueChange={(value) => props.onChange(value as T)}>
        <SelectTrigger aria-label={props.label} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          className={isDark ? "dark" : undefined}
          style={getControlFloatingStyle(isDark)}
        >
          {props.options.map((option) => (
            <SelectItem key={option} value={option}>
              {formatOptionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function PresetSelect(props: {
  value: string
  onChange: (presetId: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const visibleCount = 4
  const options =
    props.value === "custom"
      ? [{ id: "custom", name: "自定义" }, ...themePresets]
      : themePresets
  const visibleOptions = expanded ? options : options.slice(0, visibleCount)
  const hiddenCount = Math.max(0, options.length - visibleOptions.length)

  return (
    <div className="flex flex-wrap gap-1.5">
      {visibleOptions.map((preset) => {
        const selected = preset.id === props.value

        return (
          <Button
            key={preset.id}
            type="button"
            variant={selected ? "default" : "outline"}
            size="xs"
            aria-pressed={selected}
            className={cn(
              "h-8 rounded-full px-3.5 text-xs shadow-none",
              !selected && "bg-background/70 text-muted-foreground hover:text-foreground"
            )}
            onClick={() => {
              if (preset.id !== "custom") {
                props.onChange(preset.id)
              }
            }}
          >
            {preset.name}
          </Button>
        )
      })}
      {!expanded && hiddenCount > 0 ? (
        <Button
          type="button"
          variant="outline"
          size="xs"
          aria-expanded={expanded}
          className="h-8 rounded-full bg-muted/40 px-3.5 text-xs text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
          onClick={() => setExpanded(true)}
        >
          +{hiddenCount}
        </Button>
      ) : null}
    </div>
  )
}

function AdvancedSeeds(props: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <section className="space-y-1">
      <SectionHeader
        title="高级种子"
        info="字体、材质、动效和风格元数据会影响预览和导出的 vibe 描述。"
      />
      <Card className="gap-0 overflow-hidden py-0">
        <Button
          type="button"
          variant="ghost"
          className="h-auto min-h-[2.75rem] w-full justify-between rounded-none px-2.5 py-1.5 text-left"
          aria-label={`${open ? "收起" : "展开"}高级种子`}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <span className="min-w-0 truncate text-[11px] font-semibold">
            字体 / 材质 / 动效 / 风格
          </span>
          <span className="ml-3 shrink-0 text-muted-foreground">
            {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
          </span>
        </Button>
        {open ? (
          <CardContent className="grid gap-2.5 border-t border-border p-2.5">
            {props.children}
          </CardContent>
        ) : null}
      </Card>
    </section>
  )
}

function ControlGroup(props: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-2.5">
      <h3 className="text-[11px] font-semibold uppercase tracking-[var(--tracking-body)] text-muted-foreground">
        {props.title}
      </h3>
      <div className="space-y-2">{props.children}</div>
    </div>
  )
}

export function SeedControlPanel(props: SeedControlPanelProps) {
  const { seed, theme, onSeedChange, isDark, onDarkChange } = props
  const currentVariables = isDark ? theme.darkCssVariables : theme.cssVariables
  const selectedPresetId = useMemo(
    () =>
      themePresets.find((preset) => seedEquals(preset.seed, seed))?.id ??
      "custom",
    [seed]
  )

  function updatePreset(presetId: string) {
    const preset = themePresets.find((item) => item.id === presetId)

    if (preset) {
      onSeedChange(structuredClone(preset.seed))
    }
  }

  function updateColor(key: ColorSeedKey, value: HexAlphaColor) {
    onSeedChange({
      ...seed,
      color: {
        ...seed.color,
        [key]: {
          hex: normalizeHex(value.hex),
          alpha: value.alpha,
        },
      },
    })
  }

  function updateDensityMode(mode: ThemeSeed["density"]["mode"]) {
    const preset = densityPresetByMode[mode]

    onSeedChange({
      ...seed,
      density: {
        ...seed.density,
        mode,
        controlHeight: preset.controlHeight,
        densityRatio: preset.densityRatio,
      },
    })
  }

  const surfaceDerived = useMemo(
    () =>
      tokenRows(currentVariables, (name) => {
        return (
          name.startsWith("--neutral-") ||
          name.startsWith("--surface-") ||
          name.startsWith("--content-") ||
          name.startsWith("--border-") ||
          [
            "--seed-color-background",
            "--seed-color-foreground",
            "--seed-color-neutral",
            "--background",
            "--foreground",
            "--card",
            "--card-foreground",
            "--secondary",
            "--secondary-foreground",
            "--muted",
            "--muted-foreground",
            "--accent",
            "--accent-foreground",
            "--border",
            "--input",
          ].includes(name)
        )
      }),
    [currentVariables]
  )
  const radiusDerived = useMemo(
    () => tokenRows(currentVariables, (name) => name.startsWith("--radius")),
    [currentVariables]
  )
  const densityDerived = useMemo(
    () =>
      tokenRows(currentVariables, (name) =>
        [
          "--control-height-sm",
          "--control-height-md",
          "--control-height-lg",
          "--control-padding-x",
          "--control-gap",
          "--field-gap",
          "--section-gap",
          "--panel-padding",
          "--page-padding",
          "--table-cell-padding-x",
          "--table-cell-padding-y",
          "--list-row-height",
        ].includes(name)
      ),
    [currentVariables]
  )
  return (
    <ControlPanelModeContext.Provider value={isDark}>
      <div className="space-y-2.5">
      <div className="space-y-2.5 px-0.5">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-lg font-extrabold leading-6 tracking-normal text-foreground">
              Design System Lab
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <ResetButton
              onReset={() => onSeedChange(structuredClone(defaultThemeSeed))}
            />
            <ThemeModeToggle isDark={isDark} onChange={onDarkChange} />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[11px] font-medium text-muted-foreground">
            预设
          </Label>
          <PresetSelect value={selectedPresetId} onChange={updatePreset} />
        </div>
        <div className="py-0.5">
          <Separator />
        </div>
      </div>

      {colorTokenConfig.map((config) => (
        <ColorSeedCard
          key={config.key}
          title={config.title}
          name={config.name}
          value={seed.color[config.key]}
          previewValue={currentVariables[config.previewToken] ?? seed.color[config.key].hex}
          derived={tokenRowsByNames(currentVariables, config.derivedNames)}
          onChange={(value) => updateColor(config.key, value)}
          matchesPrimary={
            config.key === "info" ? seed.color.infoMatchesPrimary : undefined
          }
          onMatchesPrimaryChange={
            config.key === "info"
              ? (infoMatchesPrimary) =>
                  onSeedChange({
                    ...seed,
                    color: {
                      ...seed.color,
                      infoMatchesPrimary,
                    },
                  })
              : undefined
          }
          primaryValue={config.key === "info" ? seed.color.primary : undefined}
        />
      ))}

      <SurfaceSeedCard
        seed={seed}
        variables={currentVariables}
        derived={surfaceDerived}
        onChange={updateColor}
        rows={[
          { key: "background", label: "colorBgBase", token: "--background" },
          { key: "foreground", label: "colorTextBase", token: "--foreground" },
          { key: "neutral", label: "colorNeutral", token: "--neutral-500" },
        ]}
      />

      <TokenCard
        title="圆角"
        summary={`${formatNumber(seed.shape.radius)}rem / 比例 ${formatNumber(seed.shape.radiusRatio)}`}
        description="圆角会影响按钮、卡片和面板的整体外观。"
        derived={radiusDerived}
      >
        <div className="space-y-3">
          <NumberSlider
            label="borderRadius"
            value={seed.shape.radius}
            min={0}
            max={1.5}
            step={0.025}
            unit="rem"
            onChange={(radius) =>
              onSeedChange({
                ...seed,
                shape: {
                  ...seed.shape,
                  radius,
                },
              })
            }
          />
          <NumberSlider
            label="radiusRatio"
            value={seed.shape.radiusRatio}
            min={0.7}
            max={1.4}
            step={0.025}
            onChange={(radiusRatio) =>
              onSeedChange({
                ...seed,
                shape: {
                  ...seed.shape,
                  radiusRatio,
                },
              })
            }
          />
        </div>
      </TokenCard>

      <TokenCard
        title="密度"
        summary={`${formatOptionLabel(seed.density.mode)} / ${formatNumber(seed.density.controlHeight)}rem / 比例 ${formatNumber(seed.density.densityRatio)}`}
        description="密度会影响按钮、输入框、列表、间距和容器留白。"
        derived={densityDerived}
      >
        <div className="space-y-3">
          <SeedSelect
            label="mode"
            value={seed.density.mode}
            options={["compact", "default", "comfortable"] as const}
            onChange={updateDensityMode}
          />
          <NumberSlider
            label="controlHeight"
            value={seed.density.controlHeight}
            min={1.6}
            max={3.4}
            step={0.05}
            unit="rem"
            onChange={(controlHeight) =>
              onSeedChange({
                ...seed,
                density: {
                  ...seed.density,
                  controlHeight,
                },
              })
            }
          />
          <NumberSlider
            label="densityRatio"
            value={seed.density.densityRatio}
            min={0.75}
            max={1.35}
            step={0.01}
            onChange={(densityRatio) =>
              onSeedChange({
                ...seed,
                density: {
                  ...seed.density,
                  densityRatio,
                },
              })
            }
          />
        </div>
      </TokenCard>

      <AdvancedSeeds>
        <ControlGroup title="字体">
          <NumberSlider
            label="scaleRatio"
            value={seed.typography.scaleRatio}
            min={1.1}
            max={1.35}
            step={0.01}
            onChange={(scaleRatio) =>
              onSeedChange({
                ...seed,
                typography: {
                  ...seed.typography,
                  scaleRatio,
                },
              })
            }
          />
          <NumberSlider
            label="headingWeight"
            value={seed.typography.headingWeight}
            min={500}
            max={800}
            step={10}
            onChange={(headingWeight) =>
              onSeedChange({
                ...seed,
                typography: {
                  ...seed.typography,
                  headingWeight,
                },
              })
            }
          />
          <NumberSlider
            label="bodyWeight"
            value={seed.typography.bodyWeight}
            min={350}
            max={600}
            step={10}
            onChange={(bodyWeight) =>
              onSeedChange({
                ...seed,
                typography: {
                  ...seed.typography,
                  bodyWeight,
                },
              })
            }
          />
          <NumberSlider
            label="trackingBias"
            value={seed.typography.trackingBias}
            min={-0.02}
            max={0.04}
            step={0.002}
            unit="em"
            onChange={(trackingBias) =>
              onSeedChange({
                ...seed,
                typography: {
                  ...seed.typography,
                  trackingBias,
                },
              })
            }
          />
        </ControlGroup>

        <ControlGroup title="材质">
          <SeedSelect
            label="elevation"
            value={seed.material.elevation}
            options={["flat", "soft", "floating"] as const}
            onChange={(elevation) =>
              onSeedChange({
                ...seed,
                material: {
                  ...seed.material,
                  elevation,
                },
              })
            }
          />
          <NumberSlider
            label="shadowAlpha"
            value={seed.material.shadowAlpha}
            min={0}
            max={0.18}
            step={0.01}
            onChange={(shadowAlpha) =>
              onSeedChange({
                ...seed,
                material: {
                  ...seed.material,
                  shadowAlpha,
                },
              })
            }
          />
        </ControlGroup>

        <ControlGroup title="动效 + 风格">
          <SeedSelect
            label="motion"
            value={seed.motion.level}
            options={["none", "subtle", "expressive"] as const}
            onChange={(level) =>
              onSeedChange({
                ...seed,
                motion: {
                  ...seed.motion,
                  level,
                },
              })
            }
          />
          <NumberSlider
            label="durationBase"
            value={seed.motion.durationBase}
            min={80}
            max={320}
            step={10}
            unit="ms"
            onChange={(durationBase) =>
              onSeedChange({
                ...seed,
                motion: {
                  ...seed.motion,
                  durationBase,
                },
              })
            }
          />
          <SeedSelect
            label="domain"
            value={seed.vibe.domain}
            options={["saas", "ai", "editorial", "finance", "consumer", "tooling"] as const}
            onChange={(domain) =>
              onSeedChange({
                ...seed,
                vibe: {
                  ...seed.vibe,
                  domain,
                },
              })
            }
          />
          <SeedSelect
            label="tone"
            value={seed.vibe.tone}
            options={["calm", "precise", "friendly", "premium", "experimental"] as const}
            onChange={(tone) =>
              onSeedChange({
                ...seed,
                vibe: {
                  ...seed.vibe,
                  tone,
                },
              })
            }
          />
        </ControlGroup>
      </AdvancedSeeds>
      </div>
    </ControlPanelModeContext.Provider>
  )
}
