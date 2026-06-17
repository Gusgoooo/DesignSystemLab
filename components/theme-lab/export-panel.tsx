"use client"

import { useMemo, useState } from "react"
import { MoreHorizontal } from "lucide-react"
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
import { cn } from "../../lib/utils"
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

const importModeCardStyles: Record<
  ProjectImportMode,
  { background: string; glow: string }
> = {
  "one-shot-page-polish": {
    background:
      "linear-gradient(135deg, color-mix(in oklch, var(--status-info-bg) 78%, var(--background)), color-mix(in oklch, var(--card) 92%, var(--background)) 48%, color-mix(in oklch, var(--primary) 12%, var(--background)))",
    glow:
      "linear-gradient(90deg, color-mix(in oklch, var(--status-info) 24%, transparent), color-mix(in oklch, var(--primary) 14%, transparent), color-mix(in oklch, var(--status-success) 18%, transparent))",
  },
  "persistent-project-contract": {
    background:
      "linear-gradient(135deg, color-mix(in oklch, var(--status-warning-bg) 78%, var(--background)), color-mix(in oklch, var(--card) 92%, var(--background)) 48%, color-mix(in oklch, var(--status-danger-bg) 46%, var(--background)))",
    glow:
      "linear-gradient(90deg, color-mix(in oklch, var(--status-warning) 24%, transparent), color-mix(in oklch, var(--primary) 14%, transparent), color-mix(in oklch, var(--status-danger) 16%, transparent))",
  },
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
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
          <Button
            type="button"
            className="h-10 text-sm font-medium"
            onClick={() => setDialogOpen(true)}
          >
            导入到项目
          </Button>
          <DialogContent
            className={`${props.isDark ? "dark " : ""}max-h-[min(86vh,520px)] overflow-hidden sm:max-w-xl`}
            style={getControlFloatingStyle(props.isDark)}
          >
            <DialogHeader>
              <DialogTitle>导入到项目</DialogTitle>
              <DialogDescription>
                选择方式后，复制指令到 Codex / Cursor / Claude Code 执行。
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-3 sm:grid-cols-2">
              {importModeOptions.map((option) => {
                const selected = option.id === mode
                const cardStyle = importModeCardStyles[option.id]

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    data-state={selected ? "checked" : "unchecked"}
                    className={cn(
                      "group relative min-h-[132px] overflow-hidden rounded-[var(--radius-card)] border p-4 text-left text-card-foreground ring-1 transition-all duration-300",
                      "border-border/70 ring-foreground/[0.03] hover:-translate-y-0.5 hover:border-border hover:[box-shadow:var(--elevation-card)]",
                      "data-[state=checked]:border-primary data-[state=checked]:ring-primary/40 data-[state=checked]:[box-shadow:var(--elevation-popover)]"
                    )}
                    style={{ background: cardStyle.background }}
                    onClick={() => chooseMode(option.id)}
                  >
                    <span
                      className="absolute inset-x-0 -top-10 h-24 blur-2xl"
                      style={{ background: cardStyle.glow }}
                    />
                    <span className="absolute inset-x-0 bottom-0 h-[68%] bg-gradient-to-t from-card via-card/90 to-transparent" />
                    <span className="relative flex h-full min-h-[100px] flex-col">
                      <span className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 text-sm font-semibold leading-5">
                          {option.title}
                        </span>
                        <Badge
                          variant="outline"
                          className="shrink-0 border-border/60 bg-background/55 text-foreground backdrop-blur"
                        >
                          {option.badge}
                        </Badge>
                      </span>
                      <span className="mt-3 block text-xs leading-5 text-muted-foreground">
                        {option.description}
                      </span>
                      <span className="mt-auto pt-4">
                        <span
                          className={cn(
                            "block h-1.5 rounded-full bg-muted transition-colors",
                            selected && "bg-primary"
                          )}
                        />
                      </span>
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
              className="h-10 w-10"
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
