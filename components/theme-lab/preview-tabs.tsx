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
    <Tabs value={props.activeTab} onValueChange={(value) => props.onTabChange(value as ThemeLabTab)}>
      <TabsList>
      {tabs.map((tab) => {
        return (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
          >
            {tab.label}
          </TabsTrigger>
        )
      })}
      </TabsList>
    </Tabs>
  )
}
