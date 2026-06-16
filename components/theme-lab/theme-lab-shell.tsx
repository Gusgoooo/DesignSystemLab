"use client"

import { useEffect, useMemo, useState } from "react"
import { deriveTheme } from "../../lib/theme/derive-theme"
import { themePresets } from "../../lib/theme/presets"
import type { ThemeSeed } from "../../lib/theme/schema"
import { ExportPanel } from "./export-panel"
import { PreviewCanvas } from "./preview-canvas"
import { PreviewFrame } from "./preview-frame"
import {
  PreviewTabs,
  type ThemeLabTab,
} from "./preview-tabs"
import { SeedControlPanel } from "./seed-control-panel"
import { AestheticPreview } from "./previews/aesthetic-preview"
import { BlocksPreview } from "./previews/blocks-preview"
import { ComponentsPreview } from "./previews/components-preview"
import { TooltipProvider } from "../ui/tooltip"
import { getControlPanelStyle } from "./control-panel-theme"

const initialThemeSeed =
  themePresets.find((preset) => preset.id === "ai-workspace")?.seed ??
  themePresets[0].seed

function renderPreview(
  tab: ThemeLabTab,
  seed: ThemeSeed,
  theme: ReturnType<typeof deriveTheme>
) {
  if (tab === "blocks") {
    return <BlocksPreview />
  }

  if (tab === "aesthetic") {
    return <AestheticPreview seed={seed} theme={theme} />
  }

  return <ComponentsPreview seed={seed} theme={theme} />
}

export function ThemeLabShell() {
  const [seed, setSeed] = useState<ThemeSeed>(() =>
    structuredClone(initialThemeSeed)
  )
  const [activeTab, setActiveTab] = useState<ThemeLabTab>("components")
  const [isDark, setIsDark] = useState(false)
  const theme = useMemo(() => deriveTheme(seed), [seed])
  useEffect(() => {
    const root = document.documentElement
    const tokens = isDark ? theme.darkCssVariables : theme.cssVariables
    const previousValues = new Map<string, string>()
    const hadDarkClass = root.classList.contains("dark")

    for (const [name, value] of Object.entries(tokens)) {
      previousValues.set(name, root.style.getPropertyValue(name))
      root.style.setProperty(name, value)
    }

    root.classList.toggle("dark", isDark)

    return () => {
      for (const [name, previousValue] of previousValues) {
        if (previousValue) {
          root.style.setProperty(name, previousValue)
        } else {
          root.style.removeProperty(name)
        }
      }

      root.classList.toggle("dark", hadDarkClass)
    }
  }, [isDark, theme.cssVariables, theme.darkCssVariables])

  return (
    <TooltipProvider>
      <div
        style={getControlPanelStyle(isDark)}
        className={`${isDark ? "dark " : ""}h-dvh overflow-hidden bg-background p-3 text-foreground`}
      >
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 lg:grid-cols-[288px_minmax(0,1fr)] lg:grid-rows-1">
          <aside
            style={getControlPanelStyle(isDark)}
            className={`${isDark ? "dark " : ""}min-h-0 overflow-hidden rounded-[20px] border border-border bg-card text-xs text-card-foreground shadow-sm`}
          >
            <div className="flex h-full min-h-0 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto p-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <SeedControlPanel
                  seed={seed}
                  theme={theme}
                  onSeedChange={setSeed}
                  isDark={isDark}
                  onDarkChange={setIsDark}
                />
              </div>
              <ExportPanel seed={seed} theme={theme} isDark={isDark} />
            </div>
          </aside>

          <main
            style={getControlPanelStyle(isDark)}
            className={`${isDark ? "dark " : ""}flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[20px] border border-border bg-card text-card-foreground shadow-sm`}
          >
            <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-border border-b bg-background px-4 py-3 lg:px-5">
              <h2 className="min-w-0 truncate font-[var(--font-weight-heading)] text-base text-foreground">
                视觉系统示例
              </h2>
              <PreviewTabs activeTab={activeTab} onTabChange={setActiveTab} />
              <div aria-hidden="true" />
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-muted">
              <PreviewCanvas dragEnabled={activeTab !== "blocks"}>
                <PreviewFrame theme={theme} isDark={isDark}>
                  {renderPreview(activeTab, seed, theme)}
                </PreviewFrame>
              </PreviewCanvas>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
