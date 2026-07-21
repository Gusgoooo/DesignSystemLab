import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { defaultThemeSeed } from "../lib/theme/defaults"
import { deriveTheme } from "../lib/theme/derive-theme"
import { exportThemeCssFromOutput } from "../lib/theme/export-css"

const startMarker = "/* theme-lab:default-theme:start */"
const endMarker = "/* theme-lab:default-theme:end */"
const cssPath = join(process.cwd(), "app/globals.css")
const currentCss = readFileSync(cssPath, "utf8")
const startIndex = currentCss.indexOf(startMarker)
const endIndex = currentCss.indexOf(endMarker)

if (startIndex < 0 || endIndex < startIndex) {
  throw new Error("app/globals.css is missing the default theme markers")
}

const generatedTheme = exportThemeCssFromOutput(deriveTheme(defaultThemeSeed))
const nextCss = `${currentCss.slice(0, startIndex)}${startMarker}\n${generatedTheme}\n${endMarker}${currentCss.slice(endIndex + endMarker.length)}`

writeFileSync(cssPath, nextCss)
console.log("Synchronized app/globals.css with defaultThemeSeed")
