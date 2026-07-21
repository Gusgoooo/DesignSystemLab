import { deriveColorMap } from "./algorithms/color"
import { deriveDensityMap } from "./algorithms/density"
import { deriveElevationMap } from "./algorithms/elevation"
import { deriveMotionMap } from "./algorithms/motion"
import { deriveRadiusMap } from "./algorithms/radius"
import { deriveTypographyMap } from "./algorithms/typography"
import { mergeTokenRecords } from "./algorithms/utils"
import {
  deriveDarkSemanticTokens,
  deriveSemanticTokens,
  assertRequiredTokens,
} from "./semantic"
import {
  deriveShadcnExtensionTokens,
  deriveShadcnTokens,
} from "./shadcn-adapter"
import {
  requiredMapTokenNames,
  type ThemeOutput,
  type ThemeSeed,
} from "./schema"
import { deriveVibeDescriptor } from "./vibe"
import { deriveAntdThemeAdapter } from "./antd-adapter"

export function deriveTheme(seed: ThemeSeed): ThemeOutput {
  const mapTokens = mergeTokenRecords(
    deriveColorMap(seed),
    deriveRadiusMap(seed),
    deriveDensityMap(seed),
    deriveTypographyMap(seed),
    deriveElevationMap(seed),
    deriveMotionMap(seed)
  )
  assertRequiredTokens(mapTokens, requiredMapTokenNames, "map tokens")
  const semanticTokens = deriveSemanticTokens(seed, mapTokens)
  const darkSemanticTokens = deriveDarkSemanticTokens(seed, mapTokens)
  const shadcnTokens = deriveShadcnTokens(semanticTokens)
  const darkShadcnTokens = deriveShadcnTokens(darkSemanticTokens)
  const shadcnExtensionTokens = deriveShadcnExtensionTokens(semanticTokens)
  const darkShadcnExtensionTokens =
    deriveShadcnExtensionTokens(darkSemanticTokens)
  const antdTheme = deriveAntdThemeAdapter(
    seed,
    mapTokens,
    semanticTokens,
    darkSemanticTokens
  )
  const cssVariables = mergeTokenRecords(
    mapTokens,
    semanticTokens,
    shadcnTokens,
    shadcnExtensionTokens
  )
  const darkCssVariables = mergeTokenRecords(
    mapTokens,
    darkSemanticTokens,
    darkShadcnTokens,
    darkShadcnExtensionTokens
  )
  const vibe = deriveVibeDescriptor(seed)

  return {
    seed,
    mapTokens,
    semanticTokens,
    darkSemanticTokens,
    shadcnTokens,
    darkShadcnTokens,
    shadcnExtensionTokens,
    darkShadcnExtensionTokens,
    antdTheme,
    cssVariables,
    darkCssVariables,
    vibe,
  }
}
