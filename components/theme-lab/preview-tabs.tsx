"use client"

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export type ThemeLabTab = "components" | "blocks"

type PreviewTabsProps = {
  activeTab: ThemeLabTab
  onTabChange: (tab: ThemeLabTab) => void
}

const tabs: Array<{ id: ThemeLabTab; label: string }> = [
  { id: "components", label: "组件" },
  { id: "blocks", label: "模块" },
]

export function PreviewTabs(props: PreviewTabsProps) {
  return (
    <Tabs
      data-tour-target="preview-mode"
      value={props.activeTab}
      onValueChange={(value) => props.onTabChange(value as ThemeLabTab)}
      className="pointer-events-auto"
    >
      <TabsList className="h-10 rounded-full bg-neutral-950/75 p-1 text-white/60 shadow-[0_10px_26px_rgb(0_0_0_/_0.16)] backdrop-blur-xl dark:bg-white/80 dark:text-neutral-950/55 dark:shadow-[0_10px_28px_rgb(0_0_0_/_0.28)]">
        {tabs.map((tab) => {
          return (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="h-8 rounded-full px-4 text-sm text-white/62 hover:text-white focus-visible:ring-white/55 data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow-sm dark:text-neutral-950/58 dark:hover:text-neutral-950 dark:focus-visible:ring-neutral-950/45 dark:data-[state=active]:bg-neutral-950 dark:data-[state=active]:text-white"
            >
              {tab.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
