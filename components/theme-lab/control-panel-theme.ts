import type { CSSProperties } from "react"
import { defaultThemeSeed } from "../../lib/theme/defaults"
import { deriveTheme } from "../../lib/theme/derive-theme"

const baseTheme = deriveTheme(defaultThemeSeed)
const lightControlVariables = baseTheme.cssVariables
const darkControlVariables = baseTheme.darkCssVariables

export const lightControlPanelStyle = {
  ...lightControlVariables,
  "--background": "rgb(250 250 248)",
  "--foreground": "rgb(25 25 23)",
  "--card": "rgb(255 255 255)",
  "--card-foreground": "rgb(25 25 23)",
  "--popover": "rgb(255 255 255)",
  "--popover-foreground": "rgb(25 25 23)",
  "--primary": "rgb(25 25 23)",
  "--primary-foreground": "rgb(255 255 255)",
  "--secondary": "rgb(244 244 241)",
  "--secondary-foreground": "rgb(25 25 23)",
  "--muted": "rgb(244 244 241)",
  "--muted-foreground": "rgb(112 109 102)",
  "--accent": "rgb(238 238 234)",
  "--accent-foreground": "rgb(25 25 23)",
  "--border": "rgb(25 25 23 / 0.12)",
  "--input": "rgb(25 25 23 / 0.16)",
  "--ring": "rgb(25 25 23 / 0.24)",
  "--surface-panel": "rgb(247 247 244)",
  "--surface-raised": "rgb(255 255 255)",
  "--surface-overlay": "rgb(255 255 255)",
  "--content-primary": "rgb(25 25 23)",
  "--content-secondary": "rgb(91 88 82)",
  "--content-tertiary": "rgb(139 135 126)",
  "--elevation-card":
    "0 1px 2px rgb(25 25 23 / 0.04), inset 0 1px 0 rgb(255 255 255 / 0.72)",
  "--elevation-popover": "0 8px 24px rgb(25 25 23 / 0.1)",
  "--elevation-dialog": "0 14px 40px rgb(25 25 23 / 0.14)",
  background:
    "radial-gradient(circle at 25% 0%, rgb(255 255 255) 0%, rgb(250 250 248) 44%, rgb(244 244 240) 100%)",
  colorScheme: "light",
} as CSSProperties

export const darkControlPanelStyle = {
  ...darkControlVariables,
  "--background": "rgb(31 31 29)",
  "--foreground": "rgb(246 244 239)",
  "--card": "rgb(38 38 36)",
  "--card-foreground": "rgb(246 244 239)",
  "--popover": "rgb(43 43 40)",
  "--popover-foreground": "rgb(246 244 239)",
  "--primary": "rgb(244 242 238)",
  "--primary-foreground": "rgb(30 30 28)",
  "--secondary": "rgb(49 49 46)",
  "--secondary-foreground": "rgb(246 244 239)",
  "--muted": "rgb(49 49 46)",
  "--muted-foreground": "rgb(165 162 154)",
  "--accent": "rgb(58 58 54)",
  "--accent-foreground": "rgb(246 244 239)",
  "--border": "rgb(255 255 255 / 0.13)",
  "--input": "rgb(255 255 255 / 0.16)",
  "--ring": "rgb(244 242 238 / 0.38)",
  "--surface-panel": "rgb(43 43 40)",
  "--surface-raised": "rgb(49 49 46)",
  "--surface-overlay": "rgb(55 55 51)",
  "--content-primary": "rgb(246 244 239)",
  "--content-secondary": "rgb(180 176 168)",
  "--content-tertiary": "rgb(138 134 126)",
  "--elevation-card":
    "0 1px 2px rgb(0 0 0 / 0.16), inset 0 1px 0 rgb(255 255 255 / 0.04)",
  "--elevation-popover": "0 10px 28px rgb(0 0 0 / 0.22)",
  "--elevation-dialog": "0 16px 48px rgb(0 0 0 / 0.28)",
  background:
    "radial-gradient(circle at 25% 0%, rgb(47 47 44) 0%, rgb(31 31 29) 42%, rgb(27 27 25) 100%)",
  colorScheme: "dark",
} as CSSProperties

export const darkControlFloatingStyle = {
  ...darkControlPanelStyle,
  background: "rgb(43 43 40)",
  color: "rgb(246 244 239)",
} as CSSProperties

export const lightControlFloatingStyle = {
  ...lightControlPanelStyle,
  background: "rgb(255 255 255)",
  color: "rgb(25 25 23)",
} as CSSProperties

export function getControlPanelStyle(isDark: boolean): CSSProperties {
  return isDark ? darkControlPanelStyle : lightControlPanelStyle
}

export function getControlFloatingStyle(isDark: boolean): CSSProperties {
  return isDark ? darkControlFloatingStyle : lightControlFloatingStyle
}
