"use client"

import { useEffect, useMemo, useState } from "react"
import { deriveTheme } from "../../lib/theme/derive-theme"
import { themePresets } from "../../lib/theme/presets"
import type { ThemeSeed } from "../../lib/theme/schema"
import { ExportPanel } from "./export-panel"
import { OnboardingTour } from "./onboarding-tour"
import { PreviewCanvas } from "./preview-canvas"
import { PreviewFrame } from "./preview-frame"
import {
  PreviewTabs,
  type ThemeLabTab,
} from "./preview-tabs"
import { SeedControlPanel } from "./seed-control-panel"
import { BlocksPreview } from "./previews/blocks-preview"
import { ComponentsPreview } from "./previews/components-preview"
import { DocPreview } from "./previews/doc-preview"
import { SpecPreview } from "./previews/spec-preview"
import { TooltipProvider } from "../ui/tooltip"
import { getControlPanelStyle } from "./control-panel-theme"

const initialThemeSeed =
  themePresets.find((preset) => preset.id === "calm-ai-workspace")?.seed ??
  themePresets[0].seed

function renderPreview(
  tab: ThemeLabTab,
  seed: ThemeSeed,
  theme: ReturnType<typeof deriveTheme>
) {
  if (tab === "blocks") {
    return <BlocksPreview />
  }

  if (tab === "docs") {
    return <DocPreview />
  }

  if (tab === "specs") {
    return <SpecPreview />
  }

  return <ComponentsPreview seed={seed} theme={theme} />
}

export function ThemeLabShell() {
  const [seed, setSeed] = useState<ThemeSeed>(() =>
    structuredClone(initialThemeSeed)
  )
  const [activeTab, setActiveTab] = useState<ThemeLabTab>("blocks")
  const [isDark, setIsDark] = useState(false)
  const theme = useMemo(() => deriveTheme(seed), [seed])
  const shellStyle = useMemo(
    () => ({
      ...getControlPanelStyle(isDark),
    }),
    [isDark]
  )

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
        style={shellStyle}
        className={`${isDark ? "dark " : ""}fixed inset-0 overflow-hidden bg-white p-3 text-foreground`}
      >
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-3 lg:grid-cols-[288px_minmax(0,1fr)] lg:grid-rows-1">
          <aside
            data-tour-target="style-controls"
            className={`${isDark ? "dark " : ""}min-h-0 overflow-hidden rounded-[20px] bg-[var(--lab-panel-bg)] text-xs text-card-foreground`}
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
            data-tour-target="theme-preview"
            className={`${isDark ? "dark " : ""}relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-[20px] bg-[var(--lab-panel-bg)] text-card-foreground`}
          >
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2">
              <PreviewTabs activeTab={activeTab} onTabChange={setActiveTab} />
            </div>

            <div className="min-h-0 flex-1 overflow-hidden bg-[var(--lab-panel-bg)]">
              <PreviewCanvas dragEnabled={activeTab === "components"}>
                <PreviewFrame theme={theme} isDark={isDark}>
                  {renderPreview(activeTab, seed, theme)}
                </PreviewFrame>
              </PreviewCanvas>
            </div>
          </main>
        </div>
        <OnboardingTour restartKey={0} />
      </div>
    </TooltipProvider>
  )
}
