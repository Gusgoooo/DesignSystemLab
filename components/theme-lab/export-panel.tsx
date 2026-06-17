"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, MoreHorizontal } from "lucide-react"
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
  description: string
  descriptionNote?: string
}

const importModeOptions: readonly ImportModeOption[] = [
  {
    id: "persistent-project-contract",
    title: "长期视觉设计系统",
    description: "推荐用于长期项目，写入主题合同、theme-lab.json 和 AGENTS.md 规则。",
  },
  {
    id: "one-shot-page-polish",
    title: "一次性优化页面",
    description: "最小改造，只优化指定页面或组件，不写入长期规则。",
    descriptionNote: "不优化其它页面样式和整体一致性",
  },
]

const defaultImportMode: ProjectImportMode = "persistent-project-contract"

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
  const [mode, setMode] = useState<ProjectImportMode>(defaultImportMode)
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  const projectImportPrompt = useMemo(
    () => {
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
    setCopiedPrompt(false)
  }

  async function copyProjectImportPrompt(): Promise<void> {
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
    <div
      data-tour-target="enterprise-prompt"
      className="space-y-2 border-t border-border/70 bg-background/15 px-2.5 py-2.5"
    >
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
            className={`${props.isDark ? "dark " : ""}max-h-[min(90vh,680px)] gap-7 overflow-y-auto rounded-[28px] p-8 sm:max-w-4xl`}
            style={getControlFloatingStyle(props.isDark)}
          >
            <DialogHeader className="gap-3 pr-8">
              <DialogTitle className="text-3xl leading-tight">
                导出 Theme Blueprint Prompt
              </DialogTitle>
              <DialogDescription className="text-sm leading-6">
                请选择应用方式
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 sm:grid-cols-2">
              {importModeOptions.map((option) => {
                const selected = option.id === mode

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={selected}
                    data-state={selected ? "checked" : "unchecked"}
                    className={cn(
                      "group relative min-h-[178px] overflow-hidden rounded-[24px] border border-border bg-card p-6 text-left text-card-foreground shadow-sm transition-[background-color,border-color,box-shadow,color,opacity,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      "hover:-translate-y-px hover:border-border hover:bg-muted/30 hover:[box-shadow:var(--elevation-card)] active:translate-y-0",
                      "data-[state=checked]:translate-y-0 data-[state=checked]:border-primary data-[state=checked]:bg-card data-[state=checked]:ring-2 data-[state=checked]:ring-primary/15 data-[state=checked]:[box-shadow:var(--elevation-card)] data-[state=checked]:hover:translate-y-0 data-[state=checked]:hover:bg-card"
                    )}
                    onClick={() => chooseMode(option.id)}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute right-5 top-5 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity",
                        selected && "opacity-100"
                      )}
                    >
                      <CheckCircle2 className="size-4" aria-hidden="true" />
                    </span>
                    <span className="relative flex h-full min-h-[130px] flex-col">
                      <span className="min-w-0 text-pretty text-lg font-semibold leading-6">
                        {option.title}
                      </span>
                      <span className="mt-4 block max-w-[20rem] break-words text-sm leading-6 text-muted-foreground">
                        <span className="block">{option.description}</span>
                        {option.descriptionNote ? (
                          <span className="block">
                            {option.descriptionNote}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-auto pt-6 text-sm font-medium leading-6 text-muted-foreground transition-colors group-data-[state=checked]:text-foreground">
                        {selected ? "已选择" : "点击选择"}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            {mode ? (
              <DialogFooter className="flex flex-col gap-3 sm:flex-col sm:items-stretch sm:justify-start">
                <p className="text-sm leading-6 text-muted-foreground">
                  复制指令到 Codex / Cursor / Claude Code 执行。
                </p>
                <Button
                  type="button"
                  className="h-11 w-full text-sm"
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
