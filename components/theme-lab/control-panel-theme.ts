import type { CSSProperties } from "react"
import { defaultThemeSeed } from "../../lib/theme/defaults"
import { deriveTheme } from "../../lib/theme/derive-theme"

// Visual System Lab 的产品外壳刻意使用纯中性灰(R=G=B,无任何色相),
// 与预览区注入的用户主题完全解耦,确保切换任意色相主题时框架都不冲突。
const baseTheme = deriveTheme(defaultThemeSeed)
const lightControlVariables = baseTheme.cssVariables
const darkControlVariables = baseTheme.darkCssVariables

export const lightControlPanelStyle = {
  ...lightControlVariables,
  "--background": "rgb(250 250 250)",
  "--foreground": "rgb(23 23 23)",
  "--card": "rgb(255 255 255)",
  "--card-foreground": "rgb(23 23 23)",
  "--popover": "rgb(255 255 255)",
  "--popover-foreground": "rgb(23 23 23)",
  "--primary": "rgb(23 23 23)",
  "--primary-foreground": "rgb(255 255 255)",
  "--secondary": "rgb(244 244 244)",
  "--secondary-foreground": "rgb(23 23 23)",
  "--muted": "rgb(244 244 244)",
  "--muted-foreground": "rgb(110 110 110)",
  "--accent": "rgb(237 237 237)",
  "--accent-foreground": "rgb(23 23 23)",
  "--border": "rgb(23 23 23 / 0.12)",
  "--input": "rgb(23 23 23 / 0.16)",
  "--ring": "rgb(23 23 23 / 0.24)",
  "--lab-panel-bg": "rgb(248 248 248)",
  "--surface-canvas": "rgb(250 250 250)",
  "--surface-panel": "rgb(247 247 247)",
  "--surface-raised": "rgb(255 255 255)",
  "--surface-overlay": "rgb(255 255 255)",
  "--content-primary": "rgb(23 23 23)",
  "--content-secondary": "rgb(90 90 90)",
  "--content-tertiary": "rgb(137 137 137)",
  "--elevation-card":
    "0 1px 2px rgb(23 23 23 / 0.04), inset 0 1px 0 rgb(255 255 255 / 0.72)",
  "--elevation-popover": "0 8px 24px rgb(23 23 23 / 0.1)",
  "--elevation-dialog": "0 14px 40px rgb(23 23 23 / 0.14)",
  background:
    "radial-gradient(circle at 25% 0%, rgb(255 255 255) 0%, rgb(250 250 250) 44%, rgb(243 243 243) 100%)",
  colorScheme: "light",
} as CSSProperties

export const darkControlPanelStyle = {
  ...darkControlVariables,
  "--background": "rgb(30 30 30)",
  "--foreground": "rgb(245 245 245)",
  "--card": "rgb(38 38 38)",
  "--card-foreground": "rgb(245 245 245)",
  "--popover": "rgb(43 43 43)",
  "--popover-foreground": "rgb(245 245 245)",
  "--primary": "rgb(243 243 243)",
  "--primary-foreground": "rgb(30 30 30)",
  "--secondary": "rgb(49 49 49)",
  "--secondary-foreground": "rgb(245 245 245)",
  "--muted": "rgb(49 49 49)",
  "--muted-foreground": "rgb(162 162 162)",
  "--accent": "rgb(58 58 58)",
  "--accent-foreground": "rgb(245 245 245)",
  "--border": "rgb(255 255 255 / 0.13)",
  "--input": "rgb(255 255 255 / 0.16)",
  "--ring": "rgb(243 243 243 / 0.38)",
  "--lab-panel-bg": "rgb(34 34 34)",
  "--surface-canvas": "rgb(30 30 30)",
  "--surface-panel": "rgb(43 43 43)",
  "--surface-raised": "rgb(49 49 49)",
  "--surface-overlay": "rgb(55 55 55)",
  "--content-primary": "rgb(245 245 245)",
  "--content-secondary": "rgb(178 178 178)",
  "--content-tertiary": "rgb(136 136 136)",
  "--elevation-card":
    "0 1px 2px rgb(0 0 0 / 0.16), inset 0 1px 0 rgb(255 255 255 / 0.04)",
  "--elevation-popover": "0 10px 28px rgb(0 0 0 / 0.22)",
  "--elevation-dialog": "0 16px 48px rgb(0 0 0 / 0.28)",
  background:
    "radial-gradient(circle at 25% 0%, rgb(46 46 46) 0%, rgb(30 30 30) 42%, rgb(26 26 26) 100%)",
  colorScheme: "dark",
} as CSSProperties

export const darkControlFloatingStyle = {
  ...darkControlPanelStyle,
  background: "rgb(43 43 43)",
  color: "rgb(245 245 245)",
} as CSSProperties

export const lightControlFloatingStyle = {
  ...lightControlPanelStyle,
  background: "rgb(255 255 255)",
  color: "rgb(23 23 23)",
} as CSSProperties

export function getControlPanelStyle(isDark: boolean): CSSProperties {
  return isDark ? darkControlPanelStyle : lightControlPanelStyle
}

export function getControlFloatingStyle(isDark: boolean): CSSProperties {
  return isDark ? darkControlFloatingStyle : lightControlFloatingStyle
}
