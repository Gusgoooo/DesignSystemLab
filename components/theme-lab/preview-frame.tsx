"use client"

import { useMemo, type CSSProperties, type ReactNode } from "react"
import type { ThemeOutput } from "../../lib/theme/schema"
import { cn } from "../../lib/utils"

type PreviewFrameProps = {
  theme: ThemeOutput
  isDark: boolean
  children: ReactNode
}

export function PreviewFrame(props: PreviewFrameProps) {
  const tokens = props.isDark
    ? props.theme.darkCssVariables
    : props.theme.cssVariables
  const style = useMemo<CSSProperties>(
    () => ({
      ...tokens,
      fontFamily: "var(--font-family-sans)",
      fontSize: "var(--text-body)",
      fontWeight: "var(--font-weight-body)",
      letterSpacing: "var(--tracking-body)",
      transitionDuration: "var(--duration-base)",
      transitionTimingFunction: "var(--ease-standard)",
    }),
    [tokens]
  )

  return (
    <div
      style={style}
      className={cn(
        "h-full min-h-full w-full min-w-0 text-foreground",
        props.isDark && "dark"
      )}
    >
      {props.children}
    </div>
  )
}
