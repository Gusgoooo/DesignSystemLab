"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Info, MoreHorizontal } from "lucide-react"
import { exportAgentsThemeRulesFromOutput } from "../../lib/theme/export-agents"
import { exportThemeAlgorithmFromOutput } from "../../lib/theme/export-algorithm"
import { exportThemeCssFromOutput } from "../../lib/theme/export-css"
import {
  exportPresetJsonFromOutput,
  exportThemeLabManifestJsonFromOutput,
  exportVibeJsonFromOutput,
} from "../../lib/theme/export-json"
import {
  compileProjectImportPrompt,
  type ProjectImportMode,
} from "../../lib/theme/export-prompt"
import type { ThemeOutput, ThemeSeed } from "../../lib/theme/schema"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../ui/tooltip"
import { getControlFloatingStyle } from "./control-panel-theme"

type ExportPanelProps = {
  seed: ThemeSeed
  theme: ThemeOutput
  isDark: boolean
}

const exportButtons = [
  { id: "css", label: "复制 global CSS block" },
  { id: "manifest", label: "复制 theme-lab.json" },
  { id: "rules", label: "复制 AGENTS 区块" },
  { id: "preset", label: "复制完整 theme.preset.json" },
  { id: "vibe", label: "复制完整 vibe.json" },
  { id: "algorithm", label: "复制完整 theme.algorithm.ts" },
] as const

type ExportButtonId = (typeof exportButtons)[number]["id"]

type ImportModeOption = {
  id: ProjectImportMode
  title: string
  badge: string
  description: string
}

const importModeOptions: ImportModeOption[] = [
  {
    id: "one-shot-page-polish",
    title: "一次性优化页面",
    badge: "最小改造",
    description: "只优化指定页面或组件，不写入长期规则。",
  },
  {
    id: "persistent-project-contract",
    title: "长期项目契约",
    badge: "推荐",
    description: "写入主题合同、theme-lab.json 和 AGENTS.md 规则。",
  },
]

const domainLabels: Record<ThemeSeed["vibe"]["domain"], string> = {
  saas: "SaaS",
  ai: "AI",
  editorial: "内容",
  finance: "金融",
  consumer: "消费",
  tooling: "工具",
}

function InfoTooltip(props: { children: ReactNode; isDark: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label="查看导出说明"
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Info className="size-3" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        className={`${props.isDark ? "dark " : ""}max-w-64 border border-border leading-5`}
        style={getControlFloatingStyle(props.isDark)}
      >
        {props.children}
      </TooltipContent>
    </Tooltip>
  )
}

async function copyTextToClipboard(value: string): Promise<boolean> {
  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API 不可用")
    }

    await navigator.clipboard.writeText(value)
    return true
  } catch {
    const textArea = document.createElement("textarea")

    textArea.value = value
    textArea.setAttribute("readonly", "")
    textArea.style.position = "fixed"
    textArea.style.top = "-9999px"
    textArea.style.left = "-9999px"

    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand("copy")
      return true
    } finally {
      document.body.removeChild(textArea)
    }
  }
}

export function ExportPanel(props: ExportPanelProps) {
  const [copiedId, setCopiedId] = useState<ExportButtonId | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState<ProjectImportMode | null>(null)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const selectedMode = importModeOptions.find((item) => item.id === mode)
  const projectImportPrompt = useMemo(
    () => {
      if (!mode) {
        return ""
      }

      return compileProjectImportPrompt({
        mode,
        task:
          mode === "one-shot-page-polish"
            ? "refactor-selected-scope"
            : "install-theme-contract",
        theme: props.theme,
      })
    },
    [mode, props.theme]
  )

  function handleDialogOpenChange(nextOpen: boolean): void {
    setDialogOpen(nextOpen)

    if (!nextOpen) {
      setCopiedPrompt(false)
    }
  }

  function chooseMode(nextMode: ProjectImportMode): void {
    setMode(nextMode)
    setHasGenerated(true)
    setCopiedPrompt(false)
  }

  async function copyProjectImportPrompt(): Promise<void> {
    if (!mode || !hasGenerated) {
      return
    }

    try {
      const didCopy = await copyTextToClipboard(projectImportPrompt)

      if (didCopy) {
        setCopiedPrompt(true)
        window.setTimeout(() => setCopiedPrompt(false), 1200)
      }
    } catch (error) {
      console.warn("Theme project import copy failed", error)
    }
  }

  function getExportValue(id: ExportButtonId): string {
    if (id === "css") {
      return exportThemeCssFromOutput(props.theme)
    }

    if (id === "preset") {
      return exportPresetJsonFromOutput(props.theme)
    }

    if (id === "manifest") {
      return exportThemeLabManifestJsonFromOutput(props.theme)
    }

    if (id === "vibe") {
      return exportVibeJsonFromOutput(props.theme)
    }

    if (id === "rules") {
      return exportAgentsThemeRulesFromOutput(props.theme)
    }

    return exportThemeAlgorithmFromOutput(props.theme)
  }

  async function copyExport(id: ExportButtonId): Promise<void> {
    const value = getExportValue(id)

    try {
      const didCopy = await copyTextToClipboard(value)

      if (didCopy) {
        setCopiedId(id)
        window.setTimeout(() => setCopiedId(null), 1200)
      }
    } catch (error) {
      console.warn("Theme export copy failed", error)
    }
  }

  return (
    <div className="space-y-2 border-t border-border/70 bg-background/15 px-2.5 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] leading-4 text-muted-foreground">
        <span>
          确定样式后，将视觉系统指令复制给您的 AI 编码工具。
        </span>
        <InfoTooltip isDark={props.isDark}>
          Theme Lab 不会直接访问或修改你的本地项目。请选择导入策略，然后复制生成的
          AI 指令到 Codex / Cursor / Claude Code 等 AI Coding 工具中执行。
          当前场景为 {domainLabels[props.seed.vibe.domain]}。
        </InfoTooltip>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <Button
            type="button"
            size="sm"
            className="h-8 text-[11px]"
            onClick={() => setDialogOpen(true)}
          >
            导入到项目
          </Button>
          <DialogContent
            className={`${props.isDark ? "dark " : ""}max-h-[min(86vh,520px)] overflow-hidden sm:max-w-md`}
            style={getControlFloatingStyle(props.isDark)}
          >
            <DialogHeader>
              <DialogTitle>导入到项目</DialogTitle>
              <DialogDescription>
                选择方式后，复制指令到 Codex / Cursor / Claude Code 执行。
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-2">
              {importModeOptions.map((option) => {
                const selected = option.id === mode

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    data-state={selected ? "checked" : "unchecked"}
                    className="rounded-[var(--radius-card)] border border-border bg-card p-3 text-left text-card-foreground transition-colors hover:bg-accent hover:text-accent-foreground data-[state=checked]:border-primary data-[state=checked]:bg-primary/5"
                    onClick={() => chooseMode(option.id)}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold">
                        {option.title}
                      </span>
                      <Badge variant="outline">{option.badge}</Badge>
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </span>
                  </button>
                )
              })}
            </div>

            {hasGenerated && selectedMode ? (
              <DialogFooter>
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => void copyProjectImportPrompt()}
                >
                  {copiedPrompt ? "已复制" : "复制导入指令"}
                </Button>
              </DialogFooter>
            ) : null}
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              className="h-8 w-8"
              aria-label="打开导出菜单"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className={props.isDark ? "dark" : undefined}
            style={getControlFloatingStyle(props.isDark)}
          >
            <DropdownMenuLabel>其它导出格式</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {exportButtons.map((button) => (
              <DropdownMenuItem
                key={button.id}
                onSelect={() => void copyExport(button.id)}
              >
                {copiedId === button.id ? "已复制" : button.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
