"use client"

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export type ThemeLabTab = "components" | "blocks" | "specs" | "docs"

type PreviewTabsProps = {
  activeTab: ThemeLabTab
  onTabChange: (tab: ThemeLabTab) => void
}

const tabs: Array<{ id: ThemeLabTab; label: string }> = [
  { id: "blocks", label: "模块" },
  { id: "components", label: "组件" },
  { id: "specs", label: "Spec" },
  { id: "docs", label: "说明" },
]

export function PreviewTabs(props: PreviewTabsProps) {
  return (
    <Tabs
      data-tour-target="preview-mode"
      value={props.activeTab}
      onValueChange={(value) => props.onTabChange(value as ThemeLabTab)}
      className="pointer-events-auto block"
    >
      <TabsList className="inline-flex h-9 w-auto gap-0.5 rounded-[var(--radius-panel)] border border-border bg-popover/90 p-0.5 text-muted-foreground backdrop-blur-xl [box-shadow:var(--elevation-popover)]">
        {tabs.map((tab) => {
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-8 min-w-14 flex-none rounded-[var(--radius-control)] px-3.5 text-sm leading-none text-muted-foreground hover:text-foreground focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
