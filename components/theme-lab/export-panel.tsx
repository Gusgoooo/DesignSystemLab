"use client"

import { useState } from "react"
import { Check, Copy, MoreHorizontal, X } from "lucide-react"
import { exportAgentsThemeRulesFromOutput } from "../../lib/theme/export-agents"
import { exportThemeAlgorithmFromOutput } from "../../lib/theme/export-algorithm"
import {
  exportAntdTailwindCssFromOutput,
  exportAntdThemeTsFromOutput,
} from "../../lib/theme/export-antd"
import {
  exportCoreThemeCssFromOutput,
  exportThemeCssFromOutput,
} from "../../lib/theme/export-css"
import {
  exportPresetJsonFromOutput,
  exportThemeLabManifestJsonFromOutput,
  exportVibeJsonFromOutput,
} from "../../lib/theme/export-json"
import {
  compileProjectImportPrompt,
  type ProjectComponentSystem,
} from "../../lib/theme/export-prompt"
import type { ThemeOutput } from "../../lib/theme/schema"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogClose,
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
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { getControlFloatingStyle } from "./control-panel-theme"

type ExportPanelProps = {
  theme: ThemeOutput
  isDark: boolean
}

const exportButtons = [
  { id: "css", label: "复制 global CSS block" },
  { id: "core-css", label: "复制 Core Token CSS" },
  { id: "manifest", label: "复制 theme-lab.json" },
  { id: "rules", label: "复制 AI 指令区块" },
  { id: "preset", label: "复制完整 theme.preset.json" },
  { id: "vibe", label: "复制完整 vibe.json" },
  { id: "algorithm", label: "复制完整 theme.algorithm.ts" },
  { id: "antd", label: "复制 Ant Design theme.ts" },
  { id: "antd-tailwind", label: "复制 Ant Tailwind bridge.css（可选）" },
] as const

type ExportButtonId = (typeof exportButtons)[number]["id"]

type SelectionOption<T extends string> = {
  value: T
  label: string
}

const componentSystemOptions: ReadonlyArray<
  SelectionOption<ProjectComponentSystem>
> = [
  {
    value: "shadcn",
    label: "shadcn",
  },
  {
    value: "antd",
    label: "Ant Design",
  },
]

function SelectionGroup<T extends string>(props: {
  legend: string
  idPrefix: string
  value: T
  options: ReadonlyArray<SelectionOption<T>>
  onChange: (value: T) => void
}) {
  return (
    <fieldset className="space-y-2.5">
      <legend className="text-sm font-semibold text-foreground">
        {props.legend}
      </legend>
      <RadioGroup
        value={props.value}
        className="grid grid-cols-2 gap-2"
        onValueChange={(value) => props.onChange(value as T)}
      >
        {props.options.map((option) => {
          const id = `${props.idPrefix}-${option.value}`
          const selected = option.value === props.value

          return (
            <div
              key={option.value}
              className={cn(
                "flex min-w-0 items-start gap-3 rounded-[var(--radius-card)] border border-border bg-card p-3 text-card-foreground transition-colors hover:bg-muted/60 focus-within:ring-2 focus-within:ring-ring",
                selected && "border-ring bg-accent text-accent-foreground"
              )}
            >
              <RadioGroupItem
                id={id}
                value={option.value}
                className="mt-0.5"
              />
              <Label
                htmlFor={id}
                className="min-w-0 flex-1 cursor-pointer flex-col items-start gap-0"
              >
                <span className="block text-sm font-medium leading-5">
                  {option.label}
                </span>
              </Label>
            </div>
          )
        })}
      </RadioGroup>
    </fieldset>
  )
}

async function copyTextToClipboard(value: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(value),
        new Promise<never>((_, reject) => {
          window.setTimeout(
            () => reject(new Error("Clipboard API timed out")),
            600
          )
        }),
      ])
      return true
    } catch {
      // Fall through for embedded browsers with a stalled or denied API.
    }
  }

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
    return document.execCommand("copy")
  } catch {
    return false
  } finally {
    document.body.removeChild(textArea)
  }
}

export function ExportPanel(props: ExportPanelProps) {
  const [copiedId, setCopiedId] = useState<ExportButtonId | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [promptCopyFailed, setPromptCopyFailed] = useState(false)
  const [componentSystem, setComponentSystem] =
    useState<ProjectComponentSystem>("shadcn")

  function handleDialogOpenChange(nextOpen: boolean): void {
    setDialogOpen(nextOpen)

    if (!nextOpen) {
      setCopiedPrompt(false)
      setPromptCopyFailed(false)
    }
  }

  async function copyProjectImportPrompt(): Promise<void> {
    try {
      const projectImportPrompt = compileProjectImportPrompt({
        mode: "persistent-project-contract",
        componentSystem,
        theme: props.theme,
      })
      const didCopy = await copyTextToClipboard(projectImportPrompt)

      if (didCopy) {
        setCopiedPrompt(true)
        setPromptCopyFailed(false)
        window.setTimeout(() => setCopiedPrompt(false), 1200)
      } else {
        setPromptCopyFailed(true)
      }
    } catch (error) {
      setPromptCopyFailed(true)
      console.warn("Theme project import copy failed", error)
    }
  }

  function getExportValue(id: ExportButtonId): string {
    if (id === "css") {
      return exportThemeCssFromOutput(props.theme)
    }

    if (id === "core-css") {
      return exportCoreThemeCssFromOutput(props.theme)
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
      return exportAgentsThemeRulesFromOutput(props.theme, componentSystem)
    }

    if (id === "antd") {
      return exportAntdThemeTsFromOutput(props.theme)
    }

    if (id === "antd-tailwind") {
      return exportAntdTailwindCssFromOutput(props.theme)
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
            应用到项目
          </Button>
          <DialogContent
            className={`${props.isDark ? "dark " : ""}grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-[var(--radius-panel)] border-border bg-popover p-0 text-popover-foreground [box-shadow:var(--elevation-popover)] sm:max-w-lg`}
            showCloseButton={false}
          >
            <DialogHeader className="gap-2 border-b border-border bg-popover px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <DialogTitle className="min-w-0 text-xl leading-7 tracking-normal">
                  接入 Token
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    aria-label="关闭应用对话框"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </DialogClose>
              </div>
              <DialogDescription className="leading-6">
                选择组件体系并复制接入指令。
              </DialogDescription>
            </DialogHeader>

            <div className="px-5 py-5 sm:px-6">
              <SelectionGroup
                legend="组件体系"
                idPrefix="component-system"
                value={componentSystem}
                options={componentSystemOptions}
                onChange={setComponentSystem}
              />
            </div>

            <DialogFooter className="border-t border-border bg-popover px-5 py-3 sm:px-6 sm:py-4">
              <Button
                type="button"
                className="h-[var(--control-height-md)] w-full shrink-0 px-5 sm:w-auto"
                onClick={() => void copyProjectImportPrompt()}
              >
                {copiedPrompt ? (
                  <>
                    <Check className="size-4" aria-hidden="true" />
                    已复制接入指令
                  </>
                ) : promptCopyFailed ? (
                  <>
                    <Copy className="size-4" aria-hidden="true" />
                    复制失败，重试
                  </>
                ) : (
                  <>
                    <Copy className="size-4" aria-hidden="true" />
                    复制接入指令
                  </>
                )}
              </Button>
            </DialogFooter>
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
